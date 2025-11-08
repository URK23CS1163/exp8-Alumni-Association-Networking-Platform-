import React, { useState } from 'react';
import axios from 'axios';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const submit = async e => {
    e.preventDefault();
    try{
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registered — now login');
      window.location.href = '/login';
    } catch (err){ alert(err.response?.data?.message || 'Error'); }
  };
  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card">
        <h2 className="margin-0">Register</h2>
        <input className="input" placeholder='Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className="input" placeholder='Email' type='email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="input" placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <button className="button" type='submit'>Register</button>
      </form>
    </div>
  );
}
