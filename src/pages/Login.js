import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useMovies } from '../context/MovieContext';

// NOTE: the brief only asks for a login *interface*, so this is a mock login
// (no backend). Any non-empty username + password (min 4 chars) is accepted.
export default function Login() {
  const { dispatch } = useMovies();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 4) {
      setError('Enter a username and a password of at least 4 characters.');
      return;
    }
    dispatch({ type: 'LOGIN', user: { username: username.trim() } });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper component="form" onSubmit={submit} sx={{ p: 4, width: '100%', maxWidth: 380, display: 'grid', gap: 2 }}>
        <Typography variant="h5">Movie Explorer</Typography>
        <Typography color="text.secondary">Sign in to browse trending films.</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" size="large">Sign in</Button>
      </Paper>
    </Box>
  );
}
