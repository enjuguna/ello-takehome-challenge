import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Grid, CircularProgress, Typography, Pagination, Button, ButtonGroup, Box, AppBar, Toolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import ReadingList from './components/ReadingList';
import { BOOKS_QUERY } from './graphql/queries';

const BOOKS_PER_PAGE = 15;

const readingLevelFilters = {
  'All Levels': [],
  'A-C': ['A', 'B', 'C'],
  'D-F': ['D', 'E', 'F'],
  'G-I': ['G', 'H', 'I'],
  'J-L': ['J', 'K', 'L'],
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [readingList, setReadingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All Levels');
  const { loading, error, data } = useQuery(BOOKS_QUERY);
  const booksSectionRef = useRef(null);

  const handleAddToReadingList = (book) => !readingList.some((item) => item.title === book.title) && setReadingList([...readingList, book]);
  const handleRemoveFromReadingList = (bookToRemove) => setReadingList(readingList.filter((book) => book.title !== bookToRemove.title));
  const handleFilterChange = (filter) => setSelectedFilter(filter);

  const filteredBooks = data?.books?.filter((book) => {
    if (searchTerm) return book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const levelsForFilter = readingLevelFilters[selectedFilter];
    return levelsForFilter.length === 0 || levelsForFilter.includes(book.readingLevel);
  }) || [];

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = currentPage * BOOKS_PER_PAGE;
  const booksToDisplay = (currentPage === 1) ? filteredBooks.slice(startIndex, endIndex) : filteredBooks.slice(1).slice(startIndex, endIndex); 
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    if (booksSectionRef.current) booksSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (readingList.length > 0 && booksSectionRef.current) {
      booksSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [readingList]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <div>
      <AppBar position="static"> 
      </AppBar>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Ello Books</Typography>
        <SearchBar onSearch={setSearchTerm} onSelect={handleAddToReadingList} allBooks={data?.books || []} readingList={readingList} />

        <Box sx={{ my: 4 }}>
          <ReadingList readingList={readingList} onRemoveFromReadingList={handleRemoveFromReadingList} />
        </Box>

        <ButtonGroup variant="outlined" aria-label="reading level filter" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          {Object.keys(readingLevelFilters).map((filter) => (
            <Button key={filter} onClick={() => handleFilterChange(filter)} variant={selectedFilter === filter ? 'contained' : 'outlined'}>
              {filter}
            </Button>
          ))}
        </ButtonGroup>

        <Grid container spacing={2} alignItems="center" ref={booksSectionRef} sx={{ mt: 2 }}> 
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>All Books</Typography>
            {totalPages > 1 && (<Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Page {currentPage} of {totalPages}</Typography>)}
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          {booksToDisplay.length > 0 ? (
            booksToDisplay.map((book) => (
              <Grid item xs={12} sm={6} md={2.4} key={book.title}> 
                <BookCard book={book} onAddToReadingList={handleAddToReadingList} onRemoveFromReadingList={handleRemoveFromReadingList} readingList={readingList}/> 
              </Grid>
            ))
          ) : (
            <Typography variant="body1">
              {searchTerm ? "No books found." : "Start typing to search for books."} 
            </Typography> 
          )}
        </Grid>

        {totalPages > 1 && (
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Copyright &copy; 2024 Ello
        </Typography>
      </Box>

      </Container>
    </div> 
  );
}
export default App;