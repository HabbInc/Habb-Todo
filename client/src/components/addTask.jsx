
import { useState } from 'react';

const AddTask = () => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the task to the server
    fetch('/api/add-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Task added:', data);
        // Clear the input field
        setTask('');
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <div>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={Title}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
        />
        <input
          type="text"
          value={Description}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter Description (optional)"
        />
        
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTask;
