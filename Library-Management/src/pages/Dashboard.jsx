import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle.jsx";
import LibraryStat from "../components/LibraryStat.jsx";
import { getStored } from "../utils/storage.js";

export default function Dashboard() {
  const [books, setBooks] = useState(() => getStored("books", []));
  const [users, setUsers] = useState(() => getStored("users", []));
  useEffect(() => {
    const refresh = () => {
      setBooks(getStored("books", []));
      setUsers(getStored("users", []));
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const copies = books.reduce((sum, book) => sum + Number(book.quantity || 0), 0);
  const lowStock = books.filter(book => Number(book.quantity) < 2);
  return (
    <div className="page">
      <PageTitle eyebrow="OUTLINE" title="Dashboard" description="Here is the current status of your library." action={<Link className="button button-primary" to="/books">＋ Add a book</Link>} />
      <div className="stats-grid">
        <LibraryStat label="Book titles" value={books.length} note="Different titles in your catalogue" tone="blue" />
        <LibraryStat label="Available copies" value={copies} note="Total copies currently in stock" tone="green" />
        <LibraryStat label="Low-stock titles" value={lowStock.length} note="Fewer than 2 copies remaining" tone="orange" />
        <LibraryStat label="Registered users" value={users.length} note="Library members and staff" tone="purple" />
      </div>
      <section className="panel">
        <div className="panel-heading"><div><h3>Book availability</h3><p>Stock overview for the collection</p></div><Link to="/books" className="text-link">Manage books →</Link></div>
        {books.length === 0 ? <div className="empty-state"><div className="empty-icon">▤</div><h3>Your catalogue is ready</h3><p>Add your first book to start tracking availability.</p><Link className="button button-primary" to="/books">Add first book</Link></div> :
          <div className="table-wrap"><table><thead><tr><th>Book title</th><th>Author</th><th>Genre</th><th>Copies</th><th>Status</th></tr></thead><tbody>
            {books.map(book => <tr key={book.id}><td className="cell-strong">{book.title}</td><td>{book.author}</td><td>{book.genre}</td><td>{book.quantity}</td><td><span className={`status ${Number(book.quantity) < 2 ? "status-low" : "status-good"}`}>{Number(book.quantity) < 2 ? "Low stock" : "Available"}</span></td></tr>)}
          </tbody></table></div>}
      </section>
      <div className="tip-box"><span className="tip-icon">i</span><div><b>Stock reminder</b><p>Books with fewer than 2 copies are marked as low stock so you can plan replenishment.</p></div></div>
    </div>
  );
}