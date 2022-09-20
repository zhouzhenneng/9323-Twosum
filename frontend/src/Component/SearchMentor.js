import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function SearchMentor({mentor, setMentor}) {
  const inputUpdate = (e) => {
    setMentor(e.target.value)
    console.log(e.target.value);
  }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25vw', maxWidth: 400 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Mentor" variant="outlined" onChange={inputUpdate} placeholder="first name last name" value={mentor}/>
    </Box>
  );
}
