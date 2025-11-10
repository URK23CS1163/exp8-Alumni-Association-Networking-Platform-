import React, { useState } from 'react';
import api from '../lib/api';

export default function Forgot(){
  const [email, setEmail] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post('/api/auth/forgot', { email });
      alert((res.data && res.data.resetToken)
        ? 'Use this reset token: ' + res.data.resetToken
        : (res.data?.message || 'If the email exists, a reset link was sent'));
    }catch(err){
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div className="container page-center">
      <form onSubmit={submit} className="card stack auth-card" style={{minWidth:320}}>
        <h2 className="margin-0">Forgot password</h2>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <button className="button" type="submit">Send reset</button>
      </form>
    </div>
  );
}
