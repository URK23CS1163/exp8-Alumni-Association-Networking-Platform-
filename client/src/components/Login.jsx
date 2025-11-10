import React, { useState } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ identifier: '', password: '' });
  const submit = async e => {
    e.preventDefault();
    try{
      if (!form.identifier.trim() || !form.password) {
        alert('Please enter username/email and password');
        return;
      }
      const res = await api.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Logged in');
      window.location.href = '/home';
    } catch (err){ alert(err.response?.data?.message || 'Error'); }
  };
  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card">
        <h2 className="margin-0">Login</h2>
        <input className="input" placeholder='Username or Email' value={form.identifier} onChange={e=>setForm({...form,identifier:e.target.value})} required/>
        <input className="input" placeholder='Password' type='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <button className="button" type='submit'>Login</button>
        <div className="muted" style={{textAlign:'center'}}>
          No account? <Link to="/register">Sign up</Link>
        </div>
        <div className="muted" style={{textAlign:'center'}}>
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}

