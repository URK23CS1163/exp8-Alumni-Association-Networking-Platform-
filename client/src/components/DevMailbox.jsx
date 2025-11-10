import React, { useState } from 'react';
import api from '../lib/api';

export default function DevMailbox(){
  const [email, setEmail] = useState('');
  const [links, setLinks] = useState(null);
  const [error, setError] = useState('');

  const fetchLinks = async (e) => {
    e.preventDefault();
    setError(''); setLinks(null);
    try{
      const res = await api.get('/api/auth/dev-links', { params: { email } });
      setLinks(res.data);
    }catch(err){
      setError(err.response?.data?.message || 'Error');
    }
  };

  const open = (url) => { if (url) window.location.href = url; };

  return (
    <div className="container page-center">
      <form onSubmit={fetchLinks} className="card stack auth-card" style={{minWidth: 380}}>
        <h2 className="margin-0">Dev Mailbox</h2>
        <p className="muted">Enter an email to view its verification/reset links (local dev only).</p>
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <button className="button" type="submit">Fetch links</button>
        {error ? <div className="muted" style={{color:'#f66', textAlign:'center'}}>{error}</div> : null}
        {links && (
          <div className="stack" style={{marginTop:12}}>
            <div className="muted">Email: {links.email}</div>
            <div>
              <button className="button" disabled={!links.verifyLink} onClick={(e)=>{e.preventDefault();open(links.verifyLink);}}>Open verify link</button>
            </div>
            <div>
              <button className="button" disabled={!links.resetLink} onClick={(e)=>{e.preventDefault();open(links.resetLink);}}>Open reset link</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
