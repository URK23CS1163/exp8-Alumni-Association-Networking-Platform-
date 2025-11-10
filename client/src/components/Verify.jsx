import React, { useState } from 'react';
import api from '../lib/api';

export default function Verify(){
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.get('/api/auth/verify', { params: { token } });
      setStatus(res.data?.message || 'Verified');
      alert('Email verified. You can login now.');
      window.location.href = '/login';
    }catch(err){
      const msg = err.response?.data?.message || 'Error verifying';
      setStatus(msg);
      alert(msg);
    }
  };

  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card" style={{minWidth:320}}>
        <h2 className="margin-0">Verify email</h2>
        <input className="input" placeholder="Verification token" value={token} onChange={e=>setToken(e.target.value)} required/>
        <button className="button" type="submit">Verify</button>
        {status ? <div className="muted" style={{textAlign:'center'}}>{status}</div> : null}
      </form>
    </div>
  );
}
