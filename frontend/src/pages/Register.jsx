// frontend/src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post('/api/auth/register', formData);
    alert("Registration Successful!");
  };

  return (
    <form onSubmit={handleRegister} className="p-4">
      <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
};
export default Register;