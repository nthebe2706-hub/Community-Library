import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle.jsx";
import { getStored, saveStored } from "../utils/storage.js";

export default function Transactions() {
  const [books, setBooks] = useState(() => getStored("books", []));
  const [transactions, setTransactions] = useState(() => getStored("transactions", []));
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("add");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");

  useEffect(() => saveStored("books", books), [books]);
  useEffect(() => saveStored("transactions", transactions), [transactions]);

  function submitTransaction(event) {
    event.preventDefault();
    const qty = Number(quantity);
    if (!bookId) { setMessage("Please select a book."); return; }
    if (!Number.isInteger(qty) || qty < 1) { setMessage("Quantity must be a whole number greater than zero."); return; }
    const book = books.find(item => String(item.id) === bookId);
    if (!book) { setMessage("That book could not be found."); return; }
    if (type === "borrow" && Number(book.quantity) < qty) { setMessage("Not enough copies are available to borrow."); return; }
    setBooks(current => current.map(item => item.id === book.id ? { ...item, quantity: Number(item.quantity) + (type === "add" ? qty : -qty) } : item));
    setTransactions(current => [{ id: `${Date.now()}-${Math.random()}`, bookId: book.id, book: book.title, type, quantity: qty, date: new Date().toLocaleString() }, ...current]);
    setMessage(type === "add" ? "Stock added and recorded." : "Borrowing recorded and stock deducted.");
    setBookId("");
    setQuantity("1");
  }

  return <div className="page">
    <PageTitle eyebrow="STOCK CONTROL" title="Transactions" description="Records of new stock arrived,and books borrowed.Each transaction is saved!!" />
    <div className="content-grid transaction-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>Record a transaction</h3><p>Stock in or borrow a copy</p></div><span className="panel-number">02</span></div>
        {books.length === 0 ? <div className="empty-state compact"><h3>Add a book first</h3><p>You need a book in the catalogue before recording stock.</p></div> : <form className="form-stack" onSubmit={submitTransaction}>
          <label>Select book<select value={bookId} onChange={e => setBookId(e.target.value)} required><option value="">Choose a book</option>{books.map(book => <option key={book.id} value={String(book.id)}>{book.title} — {book.quantity} in stock</option>)}</select></label>
          <label>Transaction type<select value={type} onChange={e => setType(e.target.value)}><option value="add">Add stock (new arrivals)</option><option value="borrow">Borrow book (deduct stock)</option></select></label>
          <label>Quantity<input type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} required /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <button className="button button-primary" type="submit">Save transaction</button>
        </form>}
      </section>
      <section className="panel catalogue-panel">
        <div className="panel-heading"><div><h3>Current stock</h3><p>Live quantities for every title</p></div></div>
        <div className="stock-list">{books.length === 0 ? <p className="muted">No books in the catalogue.</p> : books.map(book => <div className="stock-item" key={book.id}><div><b>{book.title}</b><small>{book.author}</small></div><span className={`status ${Number(book.quantity) < 2 ? "status-low" : "status-good"}`}>{book.quantity} copies</span></div>)}</div>
      </section>
    </div>
    <section className="panel history-panel">
      <div className="panel-heading"><div><h3>Transaction history</h3><p>{transactions.length} recorded transaction{transactions.length === 1 ? "" : "s"}</p></div></div>
      {transactions.length === 0 ? <div className="empty-state compact"><div className="empty-icon">↔</div><h3>No transactions recorded</h3><p>Stock movements will appear here after you save them.</p></div> :
        <div className="table-wrap"><table><thead><tr><th>Book</th><th>Action</th><th>Quantity</th><th>Date and time</th></tr></thead><tbody>{transactions.map(item => <tr key={item.id}><td className="cell-strong">{item.book}</td><td><span className={`status ${item.type === "add" ? "status-good" : "status-blue"}`}>{item.type === "add" ? "Stock added" : "Borrowed"}</span></td><td>{item.quantity}</td><td>{item.date}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}