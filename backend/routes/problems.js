
const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/auth')

const router = express.Router()

// Get all problems
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.description,
        p.difficulty,
        p.constraints,
        COALESCE(
          json_agg(
            json_build_object(
              'example_number', pe.example_number,
              'input', pe.input,
              'expected_output', pe.expected_output,
              'explanation', pe.explanation
            )
            ORDER BY pe.example_number
          ) FILTER (WHERE pe.id IS NOT NULL),
          '[]'
        ) AS examples
      FROM problems p
      LEFT JOIN problem_examples pe ON pe.problem_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch problems'
    })
  }
})

// Get one problem by slug
router.get('/:slug', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.description,
        p.difficulty,
        p.constraints,
        COALESCE(
          json_agg(
            json_build_object(
              'example_number', pe.example_number,
              'input', pe.input,
              'expected_output', pe.expected_output,
              'explanation', pe.explanation
            )
            ORDER BY pe.example_number
          ) FILTER (WHERE pe.id IS NOT NULL),
          '[]'
        ) AS examples
      FROM problems p
      LEFT JOIN problem_examples pe ON pe.problem_id = p.id
      WHERE p.slug = $1
      GROUP BY p.id
    `, [req.params.slug])

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Problem not found'
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch problem'
    })
  }
})

module.exports = router
