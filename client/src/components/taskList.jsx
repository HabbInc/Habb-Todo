import { useEffect, useState } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/alltasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks.');
      });
  }, []);

  // Separate tasks based on completion
  const completedTasks = tasks.filter(task => task.completed === true);
  const pendingTasks = tasks.filter(task => task.completed === false);

  return (
    <div>
      <h1>Task List</h1>
      <p>Here you can view all your tasks.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.length > 0 ? (
        <>
          {pendingTasks.length > 0 && (
            <>
              <h3>Pending Tasks</h3>
              <ul>
                {pendingTasks.map((task) => (
                  <li key={task._id}>
                    {task.title} : {task.description}
                  </li>
                ))}
              </ul>
            </>
          )}

          {completedTasks.length > 0 && (
            <>
              <h3>Completed Tasks</h3>
              <ul>
                {completedTasks.map((task) => (
                  <li key={task._id}>
                    {task.title} : {task.description}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TaskList;
