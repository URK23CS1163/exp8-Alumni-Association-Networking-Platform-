import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLanding(){
  return (
    <div className="container page-center">
      <div className="card stack auth-card" style={{minWidth: 320}}>
        <h2 className="margin-0">Welcome</h2>
        <p className="muted">Sign in or create a new account to continue.</p>
        <Link to="/login" className="button" style={{textAlign:'center'}}>Login</Link>
        <Link to="/register" className="button" style={{textAlign:'center'}}>Sign Up</Link>
      </div>
    </div>
  );
}
