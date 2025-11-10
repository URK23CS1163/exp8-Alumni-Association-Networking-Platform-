import React, { useState } from 'react';
import api from '../lib/api';

export default function Reset(){
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const strong = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!strong.test(password)){
      alert('Password must be 8+ characters and include letters and numbers');
      return;
    }
    if (password !== confirm){
      alert('Passwords do not match');
      return;
    }
    try{
      await api.post('/api/auth/reset', { token, password });
      alert('Password reset successful. Please login.');
      window.location.href = '/login';
    }catch(err){
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card" style={{minWidth:320}}>
        <h2 className="margin-0">Reset password</h2>
        <input className="input" placeholder="Reset token" value={token} onChange={e=>setToken(e.target.value)} required/>
        <input className="input" type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <input className="input" type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/>
        <button className="button" type="submit">Reset</button>
      </form>
    </div>
  );
}
