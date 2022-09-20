import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Page({ numberOfPages, changePage }) {
  const handleChange = (e, value) => {
    changePage(value)
  };
  return (
      
    <Stack spacing={2}>
      <Pagination 
        count={numberOfPages}
        onChange={handleChange}
      />
    </Stack>
  )
}
