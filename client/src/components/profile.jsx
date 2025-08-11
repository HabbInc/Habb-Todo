import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function ProfileEdit() {
  const [username, setUsername] = useState("Thuve");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Get token from localStorage and decode user id (JWT payload has user.id)
  const token = localStorage.getItem('token') || '';
  const userId = useMemo(() => {
    try {
      const [, payload] = token.split('.');
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload));
      return decoded?.user?.id || null;
    } catch {
      return null;
    }
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Load current profile to prefill username and avatar
  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return; // ignore silently
        const data = await res.json();
        if (data?.fullName) setUsername(data.fullName);
        if (data?.image) setPreview(data.image);
      } catch {}
    })();
  }, [userId, token]);

  // Helper: read file as base64 data URL
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSave = async () => {
  if (!username || !newPassword || !currentPassword || !confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }

  if (newPassword !== confirmPassword) {
      alert("Passwords do not match!"); 
        return;
    }

    if (!userId) {
      alert('Missing or invalid login token. Please log in again.');
      return;
    }

    try {
      // 1) Update profile details (fullName)
      const imageBase64 = image ? await fileToBase64(image) : undefined;
      const profileRes = await fetch(`http://localhost:5000/api/auth/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: username, image: imageBase64 }),
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData?.msg || 'Failed to update profile');
      }

      // 2) Change password
      const pwRes = await fetch(`http://localhost:5000/api/auth/resetpassword/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const pwData = await pwRes.json();
      if (!pwRes.ok) {
        throw new Error(pwData?.msg || 'Failed to change password');
      }

      alert('Profile and password updated successfully');
      // Optionally clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Edit Profile
      </Typography>

      <Avatar
        src={preview}
        alt="Profile preview"
        sx={{ width: 100, height: 100 }}
      />
      <Button variant="outlined" component="label">
        Change Picture
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button>

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Current Password"
        type="password"
    value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      
        <TextField
            fullWidth
            label="New Password"
            type="password"
      value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
        />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
    value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </Paper>
  );
}
