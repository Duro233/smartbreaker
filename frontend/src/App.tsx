import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {createTheme, MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage'

// Defines global styles for use in Mantine components
const theme = createTheme({

  })

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'color-scheme',
});

export default function App() {
  return (
    <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager} defaultColorScheme='auto'>
      <BrowserRouter>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
