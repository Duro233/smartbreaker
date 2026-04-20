import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {createTheme, MantineProvider, localStorageColorSchemeManager } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';



import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
//import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import LogsPage from './pages/LogsPage';
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
          <Route path='/home' element={<HomePage />} />

          {/*routes with navbar*/}
          <Route path="/*" element={
            <PostLoginNavigation>
            <Routes>
                { /*<Route path='/home' element={<HomePage />} /> */}
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='/contact' element={<ContactPage />} />
              { /*<Route path='/settings' element={<SettingsPage />} /> */ }
                <Route path='/about' element={<AboutPage />} />
                <Route path='/logs' element={<LogsPage />} />
              </Routes>
            </PostLoginNavigation>
          } />
          
          <Route path="/*" element={<HomePage />} />
          {/*<Route path="/*" element={<AppLayout />} /> idk what this is but it is getting temp removed because it is causing issues*/}
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
