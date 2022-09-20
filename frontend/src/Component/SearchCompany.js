import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function SearchCompany({company, setCompany}) {
  
  const inputUpdate = (e) => {
    setCompany(e.target.value)
    console.log(e.target.value);
  }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: "25vw", maxWidth: 400 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Company" variant="outlined" onChange={inputUpdate} value={company}/>
    </Box>
  );
}
