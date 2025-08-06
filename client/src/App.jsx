import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Fade,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ListAltIcon from '@mui/icons-material/ListAlt';

function App() {
  return (
    <Fade in timeout={1000}>
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            background: '#ffffffcc',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            HABB TODO APP
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Organize your day, one task at a time.
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 5 }}>
            <Link to="/add-task" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddTaskIcon />}
                sx={{ px: 4, borderRadius: 3 }}
              >
                Add Task
              </Button>
            </Link>
            <Link to="/view-tasks" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ListAltIcon />}
                sx={{ px: 4, borderRadius: 3 }}
              >
                View Tasks
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </Fade>
  );
}

export default App;
