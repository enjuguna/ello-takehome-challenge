import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', 
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#5ACCCC', 
      light: '#CFFAFA',
      dark: '#28B8B8',
    },
    secondary: {
      main: '#335C6E', 
    },
    warning: {
      main: '#FABD33',
      dark: '#FAAD00',
    },
    error: {
      main: '#F76434', 
      light: '#FFE6DC',
    },
    info: {
      main: '#4AA088', 
    },
    background: {
      default: '#CFFAFA', 
    }
  },
  typography: {
    fontFamily: 'Mulish, sans-serif',
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
