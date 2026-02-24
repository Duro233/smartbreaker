import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {createTheme, MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css'

import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import PostLoginNavigation from './components/home-comp/navigation/post-login-navigation';

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
            <PostLoginNavigation>
              <Routes>
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/contact' element={<ContactPage />} />
                <Route path='/settings' element={<SettingsPage />} />
              </Routes>
            </PostLoginNavigation>
          } />
          
          <Route path="*" element={<Login />} />
          {/*<Route path="/*" element={<AppLayout />} /> idk what this is but it is getting temp removed because it is causing issues*/}
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
