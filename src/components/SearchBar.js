import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
      inputProps={{ 'aria-label': 'Search movies' }}
    />
  );
}
