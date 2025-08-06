import { useEffect, useState } from 'react';
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
} from '@mui/material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/alltasks')
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

  // Toggle task completion status
  const onToggleComplete = (taskId, currentStatus) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !currentStatus } : task
    );
    setTasks(updatedTasks);

    // Optionally update in DB
    fetch(`http://localhost:3000/api/update-task-status/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus }),
    }).catch((err) => console.error('Failed to update task status:', err));
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
          Toggle task status using the switch
        </Typography>

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
                      <>
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
                        <button
                          onClick={() => onToggleComplete(task._id, task.completed)}
                          style={{ marginLeft: '10px' }}
                        >
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                      </>
                    }
                  >
                    <ListItemText
                      primary={task.title}
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
