import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Box,
  Fade,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    axios.post('http://localhost:5000/api/addtask', { title })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Failed to add task:', err);
        setError('Failed to add task. Please try again.');
      });
  };

  return (
    <Fade in timeout={1000}>
      <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 4,
            background: '#ffffffcc',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button startIcon={<ArrowBackIcon />}>Back to Tasks</Button>
            </Link>
          </Box>

          <Typography variant="h4" align="center" gutterBottom>
            🚀 Add a New Task
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            What do you need to get done?
          </Typography>

          <form onSubmit={onAddTask}>
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AddIcon />}
            >
              Add Task
            </Button>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
};

export default AddTask;