import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box, Modal, Grid, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close'; 

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
    '& .MuiTypography-root': { color: theme.palette.primary.main },
  },
}));

const RemoveFromReadingListButton = styled(Button)({
  backgroundColor: '#F76434',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#F76434', 
  },
});

const AddToReadingListButton = styled(Button)({
  backgroundColor: '#28B8B8', 
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#28B8B8',
  },
});

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', 
  maxWidth: 600, 
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
}));

function BookCard({ book, onAddToReadingList, onRemoveFromReadingList, readingList = [] }) {
  const coverPhotoURL = book.coverPhotoURL ? `../${book.coverPhotoURL}` : '';
  const [openModal, setOpenModal] = useState(false);
  const [isBookInReadingList, setIsBookInReadingList] = useState(readingList.some((item) => item.title === book.title));

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    setIsBookInReadingList(readingList.some((item) => item.title === book.title));
  }, [readingList, book.title]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <StyledCard onClick={handleOpenModal}>
        {coverPhotoURL && (
          <CardMedia component="img" height="180" image={coverPhotoURL} alt={book.title} />
        )}
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" color="#335C6E" sx={{ fontSize: 16, fontWeight: "bold" }}>
            {book.title}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            by: {book.author}
          </Typography>
          <Chip label={`Level ${book.readingLevel}`} size="small" sx={{ backgroundColor: '#FABD33', mb: 1 }} /> 
        </CardContent>
      </StyledCard>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="book-details-modal" aria-describedby="book-details">
        <ModalContent>
          <Grid container direction="column" alignItems="center" > 
            <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <CardMedia component="img" image={`../${book.coverPhotoURL}`} alt={book.title} sx={{ width: '100%', maxWidth: 250, height: 350, mt: isMobile ? 2 : 5 }}/>
            <Typography variant="h5" component="div" align="center" gutterBottom sx={{ mt: 2 }}>{book.title}</Typography>
            <Typography variant="body1" component="div" align="center" color="primary" gutterBottom sx={{ mt: 1 }}>
              <Chip label={`Level ${book.readingLevel}`} size="small" sx={{ backgroundColor: '#FABD33', mb: 1 }} /> 
            </Typography>
            {isBookInReadingList ? (
              <RemoveFromReadingListButton onClick={() => onRemoveFromReadingList(book)} startIcon={<RemoveIcon />} sx={{ mt: 2 }}>
                Remove from Reading List
              </RemoveFromReadingListButton>
            ) : (
              <AddToReadingListButton onClick={() => onAddToReadingList(book)} sx={{ mt: 2 }}>
                Add to Reading List
              </AddToReadingListButton>
            )}
            <Typography variant="body1" component="div" align="center" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              By: {book.author}
            </Typography>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BookCard;