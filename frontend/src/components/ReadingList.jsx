import React, { useState } from 'react';
import { Grid, Typography, Paper, Pagination } from '@mui/material';
import BookCard from './BookCard';

const BOOKS_PER_PAGE = 4; 

function ReadingList({ readingList, onRemoveFromReadingList }) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const booksToDisplay = readingList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(readingList.length / BOOKS_PER_PAGE);

  const handlePageChange = (event, newPage) => { 
    setCurrentPage(newPage);
  };


  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#FFE6DC', borderRadius: 3 }}>
      <Grid container spacing={2}>
        {booksToDisplay.length > 0 ? (
          booksToDisplay.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.title} sx={{ width: '80%' }}>
              <BookCard 
                book={book} 
                onRemoveFromReadingList={onRemoveFromReadingList}
                readingList={readingList}
                isBookInReadingList
              /> 
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No books in reading list.</Typography>
          </Grid>
        )}
      </Grid>

      {totalPages > 1 && ( 
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} />
      )}
    </Paper>
  );
}

export default ReadingList;
