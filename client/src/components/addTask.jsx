import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (title.trim() === '') {
      setErrorMsg('Task title is required');
      return;
    }

    // Send task to server
    fetch('http://localhost:3000/api/addtask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Task added:', data);
        setTitle('');
        setDescription('');
        setErrorMsg('');
        setSuccessOpen(true);
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        setErrorMsg('Something went wrong. Please try again.');
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 15, mb: 6 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add a New Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              error={!!errorMsg && title.trim() === ''}
              helperText={title.trim() === '' && errorMsg ? errorMsg : ''}
            />

            <TextField
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddTaskIcon />}
              sx={{ borderRadius: 2 }}
            >
              Add Task
            </Button>
          </Stack>
        </form>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          Task added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddTask;
