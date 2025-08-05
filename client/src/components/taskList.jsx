import { useEffect, useState } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the server
    fetch('http://localhost:3000/api/alltasks', {   
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => response.json())
        .then(data => {
            setTasks(data);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
       });
  }, []);


  return (
    <div>
      <h1>Task List</h1>
      <p>Here you can view all your tasks.</p>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>{task.task}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
