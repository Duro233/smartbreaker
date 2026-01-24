import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> |{' '}
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
