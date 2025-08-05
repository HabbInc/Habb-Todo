import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <h1>Welcome to HABB TODO APP</h1>
      <h2>Start by adding your first task!</h2>

      <Link to="/add-task">
        <button className='origin-left'>Add Task</button>
      </Link>
      <Link to="/view-tasks">
        <button>View Tasks</button>
      </Link>
    </>
  );
}

export default App

