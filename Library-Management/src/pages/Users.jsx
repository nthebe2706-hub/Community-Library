import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle.jsx";
import { Link } from "react-router-dom";
import { getStored, saveStored } from "../utils/storage.js";

const emptyUser = { name: "", membershipId: "", password: "", role: "Member" };

export default function Users({ currentUser, onLogin }) {
  const [users, setUsers] = useState(() => getStored("users", []));
  const isFirstSetup = users.length === 0;
  const isAdmin = currentUser?.role === "Admin";
  const [form, setForm] = useState(() => ({ ...emptyUser, role: getStored("users", []).length === 0 ? "Admin" : "Member" }));
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => saveStored("users", users), [users]);

  function changeField(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function submitUser(event) {
    event.preventDefault();
    if (!isFirstSetup && !isAdmin) { setMessage("Only an administrator can manage user accounts."); return; }
    const duplicate = users.some(user => user.membershipId.trim().toLowerCase() === form.membershipId.trim().toLowerCase() && user.id !== editingId);
    if (duplicate) { setMessage("That membership ID is already registered."); return; }
    if (editingId !== null) {
      setUsers(current => current.map(user => user.id === editingId ? { ...user, ...form, name: form.name.trim(), membershipId: form.membershipId.trim() } : user));
      setMessage("User details updated.");
    } else {
      const newUser = { id: `${Date.now()}-${Math.random()}`, ...form, name: form.name.trim(), membershipId: form.membershipId.trim() };
      setUsers(current => [...current, newUser]);
      setMessage(isFirstSetup ? "Administrator account created. You are now signed in." : "User registered successfully.");
      if (isFirstSetup) onLogin?.(newUser);
    }
    setForm(emptyUser);
    setEditingId(null);
  }
  function editUser(user) {
    setEditingId(user.id);
    setForm({ name: user.name, membershipId: user.membershipId, password: user.password, role: user.role });
    setMessage("");
  }
  function deleteUser(id) {
    const user = users.find(item => item.id === id);
    if (window.confirm(`Delete user "${user?.name}"?`)) {
      setUsers(current => current.filter(item => item.id !== id));
      if (editingId === id) { setEditingId(null); setForm(emptyUser); }
      setMessage("User deleted.");
    }
  }

  if (!isFirstSetup && !isAdmin) {
    return <div className="page"><PageTitle eyebrow="RESTRICTED AREA" title="User management" description="This page is available to administrators only." /><section className="panel access-denied"><h3>Administrator access required</h3><p>{currentUser ? "Your account does not have the Admin role." : "Please sign in with an administrator account to manage users."}</p><Link className="button button-primary" to="/login">Go to login</Link></section></div>;
  }

  return <div className="page">
    <PageTitle eyebrow="MEMBERS & STAFF" title="User management" description={isFirstSetup ? "Create the first administrator account to set up your library." : "Manage member profiles and access roles."} />
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>{editingId !== null ? "Update user" : "Register a user"}</h3><p>Membership details and access role</p></div><span className="panel-number">03</span></div>
        <form className="form-stack" onSubmit={submitUser}>
          <label>Full name<input name="name" value={form.name} onChange={changeField} placeholder="Enter full name" required /></label>
          <label>Membership ID<input name="membershipId" value={form.membershipId} onChange={changeField} placeholder="e.g.901020666" required /></label>
          <label>Password<input name="password" type="password" value={form.password} onChange={changeField} placeholder="Create a password" minLength="4" required /></label>
          <label>Role<select name="role" value={isFirstSetup ? "Admin" : form.role} onChange={changeField} disabled={isFirstSetup || editingId === currentUser?.id}><option>Member</option><option>Librarian</option><option>Admin</option></select>{isFirstSetup && <small className="sub-cell">The first account is assigned the Admin role.</small>}{editingId === currentUser?.id && <small className="sub-cell">You cannot change your own administrator role.</small>}</label>
          {message && <p className="form-message" role="status">{message}</p>}
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId !== null ? "Save changes" : "Add user"}</button>{editingId !== null && <button className="button button-light" type="button" onClick={() => { setEditingId(null); setForm(emptyUser); }}>Cancel</button>}</div>
        </form>
      </section>
      <section className="panel catalogue-panel">
        <div className="panel-heading"><div><h3>Registered users</h3><p>{users.length} account{users.length === 1 ? "" : "s"}</p></div></div>
        {users.length === 0 ? <div className="empty-state compact"><div className="empty-icon">♙</div><h3>No users yet</h3><p>Add a member or staff account to get started.</p></div> :
          <div className="table-wrap"><table><thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td className="cell-strong">{user.name}</td><td>{user.membershipId}</td><td><span className="status status-blue">{user.role}</span></td><td><div className="row-actions"><button className="button button-light button-small" onClick={() => editUser(user)}>Update</button><button className="button button-danger button-small" onClick={() => deleteUser(user.id)} disabled={user.id === currentUser?.id}>Delete</button></div></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  </div>;
}
