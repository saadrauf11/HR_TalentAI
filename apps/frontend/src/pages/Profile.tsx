
import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Box } from '@mui/material';

const Profile: React.FC = () => {
  // Mocked user info
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    alert('Profile saved! (mock)');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Paper elevation={2} sx={{ p: 3, maxWidth: 400 }}>
        <form onSubmit={handleSave}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Save
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
