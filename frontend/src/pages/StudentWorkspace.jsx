import ProblemDescription from '../components/ProblemDescription'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import './StudentWorkspace.css'

function StudentWorkspace({ problemSlug }) {
  return (
    <div className="workspace">
      <div className="workspace-left">
        <ProblemDescription problemSlug={problemSlug} />
      </div>

      <div className="workspace-right">
        <CodeEditor />
        <OutputPanel />
      </div>
    </div>
  )
}

export default StudentWorkspace
