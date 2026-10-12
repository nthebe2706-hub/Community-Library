import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle.jsx";
import { getStored, saveStored } from "../utils/storage.js";

const blankForm = { title: "", author: "", genre: "", isbn: "", quantity: "1" };

export default function Books() {
  const [books, setBooks] = useState(() => getStored("books", []));
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => saveStored("books", books), [books]);

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  function submitBook(event) {
    event.preventDefault();
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      setMessage("Quantity must be a whole number, zero or greater.");
      return;
    }
    const duplicate = books.some(book => book.isbn.trim().toLowerCase() === form.isbn.trim().toLowerCase() && book.id !== editingId);
    if (duplicate) {
      setMessage("A book with this ISBN already exists.");
      return;
    }
    const cleanBook = { ...form, title: form.title.trim(), author: form.author.trim(), genre: form.genre.trim(), isbn: form.isbn.trim(), quantity };
    if (editingId !== null) {
      setBooks(current => current.map(book => book.id === editingId ? { ...book, ...cleanBook } : book));
      setMessage("Book details updated.");
    } else {
      setBooks(current => [...current, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, ...cleanBook }]);
      setMessage("Book added to the catalogue.");
    }
    setForm(blankForm);
    setEditingId(null);
  }
  function startEdit(book) {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, genre: book.genre, isbn: book.isbn, quantity: String(book.quantity) });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function removeBook(id) {
    const book = books.find(item => item.id === id);
    if (window.confirm(`Delete "${book?.title}" from the catalogue?`)) {
      setBooks(current => current.filter(item => item.id !== id));
      if (editingId === id) cancelEdit();
      setMessage("Book deleted.");
    }
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(blankForm);
  }

  return <div className="page">
    <PageTitle eyebrow="COLLECTION" title="Book management" description="Add titles, update book details and manage the quantity in stock." />
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>{editingId !== null ? "Update book" : "Add a new book"}</h3><p>Enter the details below</p></div><span className="panel-number">01</span></div>
        <form onSubmit={submitBook} className="form-stack">
          <label>Book title<input name="title" value={form.title} onChange={changeField} placeholder="e.g. name of book" required /></label>
          <label>Author<input name="author" value={form.author} onChange={changeField} placeholder="Author's full name" required /></label>
          <div className="form-row"><label>Genre<input name="genre" value={form.genre} onChange={changeField} placeholder="e.g. Fiction" required /></label><label>Initial quantity<input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={changeField} required /></label></div>
          <label>ISBN<input name="isbn" value={form.isbn} onChange={changeField} placeholder="Enter a unique ISBN" required /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId !== null ? "Save changes" : "Add book"}</button>{editingId !== null && <button className="button button-light" type="button" onClick={cancelEdit}>Cancel</button>}</div>
        </form>
      </section>
      <section className="panel catalogue-panel">
        <div className="panel-heading"><div><h3>Catalogue</h3><p>{books.length} book title{books.length === 1 ? "" : "s"} saved</p></div></div>
        {books.length === 0 ? <div className="empty-state compact"><div className="empty-icon">▤</div><h3>No books yet</h3><p>Your added books will appear here.</p></div> :
          <div className="table-wrap"><table><thead><tr><th>Book</th><th>Genre / ISBN</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
            {books.map(book => <tr key={book.id}><td><div className="cell-strong">{book.title}</div><small className="sub-cell">{book.author}</small></td><td>{book.genre}<small className="sub-cell">{book.isbn}</small></td><td><span className={`status ${Number(book.quantity) < 2 ? "status-low" : "status-good"}`}>{book.quantity} copies</span></td><td><div className="row-actions"><button className="button button-light button-small" onClick={() => startEdit(book)}>Update</button><button className="button button-danger button-small" onClick={() => removeBook(book.id)}>Delete</button></div></td></tr>)}
          </tbody></table></div>}
      </section>
    </div>
  </div>;
}