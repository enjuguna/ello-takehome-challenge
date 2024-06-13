import React from 'react';
import { Grid } from '@mui/material';
import BookCard from './BookCard';

function SearchResultsList({ searchResults, onAddToReadingList }) {
  return (
    <Grid container spacing={2}>
      {searchResults.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.title}> 
          <BookCard book={book} onAddToReadingList={onAddToReadingList} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SearchResultsList;
