import React from 'react'
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Transactions from "./pages/Transactions.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import { getStored } from "./utils/storage.js";
import "./App.css";

function Navbar() {
  const activeClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";
  return (
    <header className="topbar">
      <div className="brand">
        <div><strong>Community Library</strong><span>Management System</span></div>
      </div>
      <nav className="navigation">
        <NavLink end to="/" className={activeClass}>Dashboard</NavLink>
        <NavLink to="/books" className={activeClass}>Books</NavLink>
        <NavLink to="/transactions" className={activeClass}>Transactions</NavLink>
        <NavLink to="/users" className={activeClass}>Users</NavLink>
        <NavLink to="/login" className={activeClass}>Login</NavLink>
      </nav>
    </header>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(() => getStored("currentUser", null));
  function handleLogin(user) {
    localStorage.setItem("currentUser", JSON.stringify({ id: user.id, name: user.name, membershipId: user.membershipId, role: user.role }));
    setCurrentUser({ id: user.id, name: user.name, membershipId: user.membershipId, role: user.role });
  }
  function handleLogout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  }
  return (
    <div className="app-shell">
      <Navbar />
      <div className="welcome-strip">
        <div><span className="eyebrow">COMMUNITY LIBRARY</span><p>your entire library , simplified</p></div>
        <div className="session">
          {currentUser ? <><span>Signed in as <b>{currentUser.name}</b></span><button className="button button-light button-small" onClick={handleLogout}>Log out</button></> : <span className="muted">basebetsi</span>}
        </div>
      </div>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/users" element={<Users currentUser={currentUser} onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} currentUser={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">Community Library Management System</footer>
    </div>
  );
}