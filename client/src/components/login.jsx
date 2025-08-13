import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.msg || 'Login failed');
    }
  };
  const googleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };

  // If redirected back from Google with ?token=..., store it and go home
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      localStorage.setItem('token', t);
      // Clean query string
      window.history.replaceState(null, '', window.location.pathname);
      window.location.href = '/';
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to TODO App - HABB
        </Typography>

        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </Box>

         <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={googleLogin}
            sx={{
              backgroundColor: "#DB4437",
              "&:hover": {
                backgroundColor: "#C33D2E",
                
              },
              marginTop: 2,
              width: "100%",
              margin: "16px 0",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",

              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              padding: "8px 16px",
              borderRadius: "8px"
            }}
          >
            Login with Google
          </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <a href="/signup">Register</a>
        </Typography>
      </Paper>
     
    </Container>
  );
};

export default Login;