import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Avatar, Grid, Typography, Button, Box, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

function SearchBar({ onSearch, onSelect, allBooks, readingList = [] }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (inputValue.length > 2) {
      const filteredOptions = allBooks?.filter((book) => 
        book && book.title.toLowerCase().includes(inputValue.toLowerCase())
      ) || [];
      setOptions(filteredOptions);
    } else {
      setOptions([]);
    }
  }, [inputValue, allBooks]);

  return (
    <Autocomplete
      id="search-bar"
      options={options}
      getOptionLabel={(option) => option?.title || ''}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={(event, newValue) => {
        if (newValue) {
          onSelect(newValue);
        }
        setInputValue('');
        setOptions([]);
      }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Search by Book Title" 
          variant="outlined" 
          sx={{ borderRadius: 7 }} 
        />
      )}
      renderOption={(props, option) => {
        const isBookInReadingList = readingList.some((item) => item.title === option.title);

        return (
          <Tooltip 
            title={isBookInReadingList ? "Already in Reading List" : "Add to Reading List"} 
            arrow 
            placement="right"
          >
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              {option && (
                <Grid container alignItems="center" justifyContent="space-between"> 
                  {option.coverPhotoURL && (
                    <Grid item>
                      <Avatar alt={option.title} src={`../${option.coverPhotoURL}`} />
                    </Grid>
                  )}
                  <Grid item xs>
                    <Typography variant="body1">{option.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      by: {option.author}
                    </Typography>
                  </Grid>
                  {!isBookInReadingList && (
                    <Grid item>
                      <Button size="small" variant="outlined" color="primary" onClick={() => onSelect(option)}>
                        <AddIcon />
                      </Button>
                    </Grid>
                  )}
                  {isBookInReadingList && ( 
                    <Grid item> 
                      <CheckIcon color="success" />
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Tooltip>
        );
      }}
      fullWidth
    />
  );
}


export default SearchBar;
