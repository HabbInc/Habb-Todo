import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import App from './App.jsx';
import TaskList from './components/taskList.jsx';
import AddTask from './components/addTask.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',  
    },
    secondary: {
      main: '#d81b60',  
    },
    background: {
      default: '#252424ff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/view-tasks',
    element: <TaskList />,
  },
  {
    path: '/add-task',
    element: <AddTask />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
