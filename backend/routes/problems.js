
const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/auth')

const router = express.Router()

// Only teachers and admins can manage problems.
const authorizeTeacher = (req, res, next) => {
  const role = req.user?.role

  if (role !== 'teacher' && role !== 'admin') {
    return res.status(403).json({
      message: 'Only teachers and admins can manage problems'
    })
  }

  next()
}

// Convert text into a URL-friendly slug.
const makeSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Generate a unique slug.
const getUniqueSlug = async (client, title, excludeId = null) => {
  const baseSlug = makeSlug(title)
  let slug = baseSlug
  let count = 1

  while (true) {
    const result = await client.query(
      `SELECT id FROM problems
       WHERE slug = $1
       AND ($2::uuid IS NULL OR id <> $2)`,
      [slug, excludeId]
    )

    if (result.rows.length === 0) {
      return slug
    }

    count++
    slug = `${baseSlug}-${count}`
  }
}

// Save tags and connect them to a problem.
const saveTags = async (client, problemId, tags) => {
  await client.query(
    'DELETE FROM problem_tags WHERE problem_id = $1',
    [problemId]
  )

  const uniqueTags = [
    ...new Set(
      (Array.isArray(tags) ? tags : [])
        .map((tag) => String(tag).trim())
        .filter(Boolean)
    )
  ]

  for (const name of uniqueTags) {
    const tagSlug = makeSlug(name)

    let tagResult = await client.query(
      `SELECT id FROM tags
       WHERE LOWER(name) = LOWER($1)
       LIMIT 1`,
      [name]
    )

    let tagId

    if (tagResult.rows.length > 0) {
      tagId = tagResult.rows[0].id
    } else {
      const newTag = await client.query(
        `INSERT INTO tags (id, name, slug)
         VALUES (gen_random_uuid(), $1, $2)
         RETURNING id`,
        [name, tagSlug]
      )

      tagId = newTag.rows[0].id
    }

    await client.query(
      `INSERT INTO problem_tags (problem_id, tag_id)
       VALUES ($1, $2)`,
      [problemId, tagId]
    )
  }
}

// Save the example input and output.
const saveExamples = async (client, problemId, body) => {
  await client.query(
    'DELETE FROM problem_examples WHERE problem_id = $1',
    [problemId]
  )

  if (
    body.exampleInput?.trim() ||
    body.exampleOutput?.trim()
  ) {
    await client.query(
      `INSERT INTO problem_examples
       (id, problem_id, example_number, input, expected_output, explanation)
       VALUES (gen_random_uuid(), $1, 1, $2, $3, $4)`,
      [
        problemId,
        body.exampleInput || '',
        body.exampleOutput || '',
        body.exampleExplanation || null
      ]
    )
  }
}

// Save test cases.
const saveTestCases = async (client, problemId, testCases) => {
  await client.query(
    'DELETE FROM test_cases WHERE problem_id = $1',
    [problemId]
  )

  const validTestCases = Array.isArray(testCases)
    ? testCases.filter(
        (testCase) =>
          testCase.input?.trim() &&
          testCase.expectedOutput?.trim()
      )
    : []

  for (const testCase of validTestCases) {
    await client.query(
      `INSERT INTO test_cases
       (id, problem_id, input, expected_output, is_hidden)
       VALUES (gen_random_uuid(), $1, $2, $3, TRUE)`,
      [
        problemId,
        testCase.input,
        testCase.expectedOutput
      ]
    )
  }
}

// Common query for problem data.
const problemSelect = `
  SELECT
    p.id,
    p.title,
    p.slug,
    p.description,
    p.difficulty,
    p.constraints,
    p.status,
    p.input_format AS "inputFormat",
    p.output_format AS "outputFormat",
    p.created_at AS "createdAt",

    COALESCE(
      (
        SELECT json_agg(t.name ORDER BY t.name)
        FROM problem_tags pt
        JOIN tags t ON t.id = pt.tag_id
        WHERE pt.problem_id = p.id
      ),
      '[]'
    ) AS tags,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'example_number', pe.example_number,
            'input', pe.input,
            'expected_output', pe.expected_output,
            'explanation', pe.explanation
          )
          ORDER BY pe.example_number
        )
        FROM problem_examples pe
        WHERE pe.problem_id = p.id
      ),
      '[]'
    ) AS examples,

    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', tc.id,
            'input', tc.input,
            'expectedOutput', tc.expected_output,
            'isHidden', tc.is_hidden
          )
          ORDER BY tc.created_at
        )
        FROM test_cases tc
        WHERE tc.problem_id = p.id
      ),
      '[]'
    ) AS "testCases"

  FROM problems p
`

// Teacher/admin: Get all problems, including drafts and test cases.
router.get(
  '/manage/all',
  authenticateToken,
  authorizeTeacher,
  async (req, res) => {
    try {
      const result = await pool.query(
        `${problemSelect} ORDER BY p.created_at DESC`
      )

      res.json(result.rows)
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Failed to fetch managed problems'
      })
    }
  }
)

// Student: Get published problems only.
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `${problemSelect}
       WHERE LOWER(p.status) = 'published'
       ORDER BY p.created_at DESC`
    )

    // Never send hidden test cases to students.
    const problems = result.rows.map((problem) => ({
      ...problem,
      testCases: []
    }))

    res.json(problems)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch problems'
    })
  }
})

// Create a problem.
router.post(
  '/',
  authenticateToken,
  authorizeTeacher,
  async (req, res) => {
    const client = await pool.connect()

    try {
      const {
        title,
        description,
        difficulty,
        constraints,
        inputFormat,
        outputFormat,
        tags,
        exampleInput,
        exampleOutput,
        testCases,
        status
      } = req.body

      if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
          message: 'Title and description are required'
        })
      }

      const problemStatus =
        String(status || 'Draft').toLowerCase() === 'published'
          ? 'published'
          : 'draft'

      await client.query('BEGIN')

      const slug = await getUniqueSlug(client, title)

      const problemResult = await client.query(
        `INSERT INTO problems
         (
           id,
           title,
           slug,
           description,
           difficulty,
           constraints,
           created_by,
           status,
           input_format,
           output_format
         )
         VALUES
         (
           gen_random_uuid(),
           $1, $2, $3, $4, $5, $6, $7, $8, $9
         )
         RETURNING id`,
        [
          title.trim(),
          slug,
          description,
          difficulty || 'Easy',
          constraints || null,
          req.user.id,
          problemStatus,
          inputFormat || null,
          outputFormat || null
        ]
      )

      const problemId = problemResult.rows[0].id

      await saveTags(client, problemId, tags)
      await saveExamples(client, problemId, req.body)
      await saveTestCases(client, problemId, testCases)

      await client.query('COMMIT')

      res.status(201).json({
        message: 'Problem created successfully',
        id: problemId,
        slug
      })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(error)

      res.status(500).json({
        message: 'Failed to create problem'
      })
    } finally {
      client.release()
    }
  }
)

// Update an existing problem.
router.put(
  '/:id',
  authenticateToken,
  authorizeTeacher,
  async (req, res) => {
    const client = await pool.connect()

    try {
      const {
        title,
        description,
        difficulty,
        constraints,
        inputFormat,
        outputFormat,
        tags,
        testCases,
        status
      } = req.body

      if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
          message: 'Title and description are required'
        })
      }

      await client.query('BEGIN')

      const existing = await client.query(
        'SELECT id FROM problems WHERE id = $1',
        [req.params.id]
      )

      if (existing.rows.length === 0) {
        await client.query('ROLLBACK')

        return res.status(404).json({
          message: 'Problem not found'
        })
      }

      const slug = await getUniqueSlug(
        client,
        title,
        req.params.id
      )

      await client.query(
        `UPDATE problems
         SET
           title = $1,
           slug = $2,
           description = $3,
           difficulty = $4,
           constraints = $5,
           input_format = $6,
           output_format = $7,
           status = $8
         WHERE id = $9`,
        [
          title.trim(),
          slug,
          description,
          difficulty || 'Easy',
          constraints || null,
          inputFormat || null,
          outputFormat || null,
          String(status || 'Draft').toLowerCase(),
          req.params.id
        ]
      )

      await saveTags(client, req.params.id, tags)
      await saveExamples(client, req.params.id, req.body)
      await saveTestCases(client, req.params.id, testCases)

      await client.query('COMMIT')

      res.json({
        message: 'Problem updated successfully'
      })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(error)

      res.status(500).json({
        message: 'Failed to update problem'
      })
    } finally {
      client.release()
    }
  }
)

// Publish or unpublish a problem.
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeTeacher,
  async (req, res) => {
    try {
      const status =
        String(req.body.status || '').toLowerCase()

      if (!['draft', 'published'].includes(status)) {
        return res.status(400).json({
          message: 'Status must be Draft or Published'
        })
      }

      const result = await pool.query(
        `UPDATE problems
         SET status = $1
         WHERE id = $2
         RETURNING id, status`,
        [status, req.params.id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Problem not found'
        })
      }

      res.json({
        message: 'Problem status updated',
        problem: result.rows[0]
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Failed to update problem status'
      })
    }
  }
)

// Delete a problem.
router.delete(
  '/:id',
  authenticateToken,
  authorizeTeacher,
  async (req, res) => {
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const existing = await client.query(
        'SELECT id FROM problems WHERE id = $1',
        [req.params.id]
      )

      if (existing.rows.length === 0) {
        await client.query('ROLLBACK')

        return res.status(404).json({
          message: 'Problem not found'
        })
      }

      await client.query(
        'DELETE FROM problem_tags WHERE problem_id = $1',
        [req.params.id]
      )

      await client.query(
        'DELETE FROM problem_examples WHERE problem_id = $1',
        [req.params.id]
      )

      await client.query(
        'DELETE FROM test_cases WHERE problem_id = $1',
        [req.params.id]
      )

      await client.query(
        'DELETE FROM problems WHERE id = $1',
        [req.params.id]
      )

      await client.query('COMMIT')

      res.json({
        message: 'Problem deleted successfully'
      })
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(error)

      res.status(500).json({
        message: 'Failed to delete problem. It may have related submissions or progress records.'
      })
    } finally {
      client.release()
    }
  }
)

// Get one published problem by slug.
router.get('/:slug', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `${problemSelect}
       WHERE p.slug = $1
       AND LOWER(p.status) = 'published'`,
      [req.params.slug]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Problem not found'
      })
    }

    // Do not expose hidden test cases.
    const problem = {
      ...result.rows[0],
      testCases: []
    }

    res.json(problem)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch problem'
    })
  }
})

module.exports = router
