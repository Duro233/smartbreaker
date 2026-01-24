import { useState } from 'react';
import { loginUser } from '../api/auth';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
