import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './HomePage.css'

export default function CareerSelect({career, setCareer}) {
  const handleChange = (event) => {
    console.log(event.target.value);
    setCareer(event.target.value);
  };

  return (
    <Box sx={{ width: "25%", maxWidth: 400}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={career}
          label="Career"
          onChange={handleChange}
        >
          <MenuItem value="computer science">Computer science</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="engineer">Engineering</MenuItem>
          <MenuItem value="science">Science</MenuItem>
          <MenuItem value="medicine">Medicine</MenuItem>
          <MenuItem value="law">Law</MenuItem>
          <MenuItem value="arts">Arts</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
