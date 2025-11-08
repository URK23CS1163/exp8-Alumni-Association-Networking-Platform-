import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' });
  const submit = async e => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Logged in');
      window.location.href = '/';
    } catch (err){ alert(err.response?.data?.message || 'Error'); }
  };
  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card">
        <h2 className="margin-0">Login</h2>
        <input className="input" placeholder='Email' type='email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="input" placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <button className="button" type='submit'>Login</button>
      </form>
    </div>
  );
}
