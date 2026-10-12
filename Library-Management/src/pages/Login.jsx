import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { getStored } from "../utils/storage.js";

export default function Login({ onLogin, currentUser }) {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const users = getStored("users", []);
  function submit(event) {
    event.preventDefault();
    const user = users.find(item => item.membershipId.toLowerCase() === membershipId.trim().toLowerCase() && item.password === password);
    if (!user) { setMessage("Membership ID or password is incorrect. Create a user account first if this is your first visit."); return; }
    onLogin(user);
    setMessage(`Welcome, ${user.name}. You are signed in as ${user.role}.`);
  }
  return <div className="login-layout">
    <section className="login-intro"><span className="eyebrow">MEMBER ACCESS</span><h2>Welcome back</h2><p>Sign in to manage your community library.</p><div className="login-feature"><span className="feature-check" aria-hidden="true">✓</span><div><b>Easy book management</b><small>View books and track available copies</small></div></div><div className="login-feature"><span className="feature-check" aria-hidden="true">✓</span><div><b>Member records</b><small>Keep member and transaction details organised</small></div></div><div className="login-feature"><span className="feature-check" aria-hidden="true">✓</span><div><b>Saved library data</b><small>Your records stay in this browser</small></div></div></section>
    <section className="panel login-panel"><div className="panel-heading"><div><h3>Sign in</h3><p>Enter your membership ID and password.</p></div></div>
      {currentUser && <p className="success-message">Currently signed in as {currentUser.name} ({currentUser.role}).</p>}
      <form className="form-stack" onSubmit={submit}><label>Membership ID<input value={membershipId} onChange={e => setMembershipId(e.target.value)} placeholder="e.g. 901020666" required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required /></label>{message && <p className={message.startsWith("Welcome") ? "success-message" : "form-message"} role="status">{message}</p>}<button className="button button-primary button-wide" type="submit">Sign in</button></form>
      <p className="login-help">{users.length === 0 ? <>First time here? <Link to="/users">Create the administrator account</Link>.</> : currentUser?.role === "Admin" ? <>Need to manage accounts? <Link to="/users">Open user management</Link>.</> : "Ask your library administrator to create your account."}</p>
    </section>
  </div>;
}