import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/alltasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks.');
        setLoading(false);
      });
  }, []);


  const onToggleComplete = (taskId, currentStatus) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !currentStatus } : task
    );
    setTasks(updatedTasks);

    fetch(`http://localhost:5000/api/updatetask/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => {
      console.error('Failed to update task status:', err);
      setTasks(tasks);
    });
  };

  const onDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task._id !== taskId);
    setTasks(updatedTasks);

    fetch(`http://localhost:5000/api/deletetask/${taskId}`, {
      method: 'DELETE',
    }).catch((err) => {
      console.error('Failed to delete task:', err);
      setTasks(tasks);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
      <Paper
        elevation={8}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: 'center',
          background: '#d8d8d8ff',
        }}
      >
        <Typography variant="h4" gutterBottom>
          📝 Your Tasks
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Toggle task status and delete tasks
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
          <Link to="/add-task" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddTaskIcon />}>
              Add Task
            </Button>
          </Link>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : tasks.length === 0 ? (
          <Typography sx={{ mt: 2 }}>No tasks found.</Typography>
        ) : (
          <Paper elevation={4} sx={{ p: 3, mt: 4 }}>
            <List>
              {tasks.map((task, index) => (
                <Box key={task._id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              color="success"
                              checked={task.completed}
                              onChange={() => onToggleComplete(task._id, task.completed)}
                            />
                          }
                          label={task.completed ? 'Completed' : 'Pending'}
                        />
                        <IconButton
                          color="error"
                          onClick={() => onDeleteTask(task._id)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={task.description}
                    />
                  </ListItem>
                  {index !== tasks.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default TaskList;