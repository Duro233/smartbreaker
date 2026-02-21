import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {createTheme, MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import SettingPage from './pages/SettingsPage';
import { NavbarSimple} from './components/NavbarSimple';

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
          {/*routes without navbar*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*routes with navbar*/}
          <Route path="/*" element={
            <div style={{ display: 'flex' }}>
              <NavbarSimple />
              <main style={{ flex: 1, marginLeft: '300px', padding: '2rem' }}>
                <Routes>
                  <Route path='/home' element={<Home />} />
                  <Route path='/dashboard' element={<DashboardPage />} />
                  <Route path='/contact' element={<ContactPage />} />
                  <Route path='/settings' element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          } />
          
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
