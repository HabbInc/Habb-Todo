import { useState } from 'react';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (title.trim() === '') {
      alert('Title is required');
      return;
    }

    // Send task to the server
    fetch('http://localhost:3000/api/addtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Task added:', data);
        // Clear input fields
        setTitle('');
        setDescription('');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  return (
    <div>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your task"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTask;
