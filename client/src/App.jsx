import React, { useEffect, useState } from 'react';
import api from './lib/api';
import { Link } from 'react-router-dom';

export default function App(){
  const [profiles, setProfiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const logout = () => { localStorage.removeItem('token'); window.location.href = '/login'; };
  const SAMPLE_PROFILES = [
    { _id: 'ex1', name: 'Aarav Sharma', graduationYear: 2020, department: 'Computer Science', currentCompany: 'TechNova', skills: ['React','Node.js','MongoDB'] },
    { _id: 'ex2', name: 'Priya Verma', graduationYear: 2019, department: 'Electronics', currentCompany: 'CircuLab', skills: ['Embedded','C++','IoT'] },
    { _id: 'ex3', name: 'Rahul Mehta', graduationYear: 2018, department: 'Mechanical', currentCompany: 'AutoWorks', skills: ['CAD','Manufacturing','Lean'] },
  ];
  const SAMPLE_RECORDS = [
    { _id: 'r1', title: 'Welcome Note', note: 'This is a demo record for your screenshot.' },
    { _id: 'r2', title: 'Alumni Meetup', note: 'Friday 6 PM at Auditorium' },
    { _id: 'r3', title: 'Job Posting', note: 'Junior Developer at TechNova' },
  ];
  useEffect(()=>{
    api.get('/api/profiles')
      .then(res=> setProfiles(res.data))
      .catch(()=>{})
    api.get('/api/records')
      .then(res=> setRecords(res.data))
      .catch(()=>{})
  },[]);
  const addRecord = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post('/api/records', { title, note });
      setRecords(prev => [res.data, ...prev]);
      setTitle("");
      setNote("");
    } catch (err) { console.error(err); }
  };
  const deleteRecord = async (id) => {
    try {
      await api.delete(`/api/records/${id}`);
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (err) { console.error(err); }
  };
  const profilesToShow = profiles && profiles.length ? profiles : SAMPLE_PROFILES;
  const recordsToShow = records && records.length ? records : SAMPLE_RECORDS;
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <h1>Alumni Directory</h1>
          <span className="subtitle">Connect • Mentor • Grow</span>
        </div>
        <nav className="nav">
          <Link to='/home'>Home</Link>
          <Link to='/register' className='btn-link'>Register</Link>
          <Link to='/login' className='btn-link'>Login</Link>
          <Link to='/dev-mailbox' className='btn-link'>Dev Mailbox</Link>
        </nav>
      </header>

      <div>
        <div className="section-title">Community Profiles</div>
        <div className="cards">
          {profilesToShow.map(p => (
            <div key={p._id} className="card">
              <h3>{p.name} {p.graduationYear ? `(${p.graduationYear})` : null}</h3>
              <div className="meta">{p.department || '—'} {p.currentCompany ? ` • ${p.currentCompany}` : ''}</div>
              <div className="skills">
                <span className="muted">Skills:</span> {p.skills && p.skills.length ? p.skills.join(', ') : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title">Records CRUD Demo</div>
        <form className="card form" onSubmit={addRecord}>
          <div className="row">
            <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <input className="input" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="button" type="submit">Add</button>
          </div>
        </form>
        <div className="cards">
          {recordsToShow.map(r => (
            <div key={r._id} className="card">
              <h3>{r.title}</h3>
              <div className="meta">{r.note || '—'}</div>
              <button className="button danger" onClick={()=>deleteRecord(r._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
