import React, { useState } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', confirmPassword: '' });
  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.username.trim() || !form.password) {
      alert('Please fill all required fields');
      return;
    }
    const strong = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!strong.test(form.password)) {
      alert('Password must be 8+ characters and include letters and numbers');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try{
      const res = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
      });
      if (res.data?.verifyToken) {
        alert('Registered. Save this verify token: ' + res.data.verifyToken);
      } else {
        alert('Registered — now login');
      }
      window.location.href = '/login';
    } catch (err){ alert(err.response?.data?.message || 'Error'); }
  };
  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card">
        <h2 className="margin-0">Register</h2>
        <input className="input" placeholder='Full Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className="input" placeholder='Email' type='email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="input" placeholder='Username' value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/>
        <input className="input" placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <input className="input" placeholder='Confirm Password' type='password' value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required/>
        <button className="button" type='submit'>Register</button>
        <div className="muted" style={{textAlign:'center'}}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

