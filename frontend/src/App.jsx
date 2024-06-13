import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Grid, CircularProgress, Typography, Pagination, Button, ButtonGroup, Box, AppBar} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import ReadingList from './components/ReadingList';
import { BOOKS_QUERY } from './graphql/queries';
import logo from './logo.svg';

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

  const handleAddToReadingList = (book) => {
    if (!readingList.some((item) => item.title === book.title)) {
      setReadingList([...readingList, book]);
      toast.success(`Added "${book.title}" to Reading List`); 
    }
  };

  const handleRemoveFromReadingList = (bookToRemove) => {
    setReadingList(readingList.filter((book) => book.title !== bookToRemove.title));
    toast.error(`Removed "${bookToRemove.title}" from Reading List`);
  };

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

  function getCurrentYear() {
    const now = new Date();
    return now.getFullYear();
  }
  const currentYear = getCurrentYear();

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <AppBar position="static"> 
      </AppBar>
      <Container maxWidth="md">
      <img 
            src={logo} 
            alt="Ello Books Logo" 
            style={{ 
              height: 60, 
              display: 'block', 
              margin: '0 auto', 
            }}  
          />
        <Typography variant="h5" align="left" color="#F76434" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Book Library</Typography>
        <SearchBar onSearch={setSearchTerm} onSelect={handleAddToReadingList} allBooks={data?.books || []} readingList={readingList} />
            

        <Typography variant="h5" align="left" color="#F76434" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>Reading List</Typography>
        <Box sx={{ my: 1 }}>
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
            <Typography variant="h5" color="#F76434" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>All Books</Typography>
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
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            '& .MuiPaginationItem-page.Mui-selected': { 
              backgroundColor: '#4AA088', 
              color: 'white'             
            },
          }}
        />
      )}
         <Box sx={{ bgcolor: '#CFFAFA', py: 2, mt: 4, textAlign: 'center' }}> 
        <Typography variant="body2" color="textSecondary">
          
          Copyright &copy; {currentYear}. Ello Book Library.
        </Typography>
      </Box>

      </Container>
    </div>
     
  );
}
export default App;