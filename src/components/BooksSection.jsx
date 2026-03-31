import { useEffect, useState } from "react";
import gateway from "../api";

const EMPTY = {
    title: "", author: "", isbn: "", description: "",
    price: "", stockQuantity: "", category: "", publisher: "", publishedYear: ""
};

const CATEGORIES = ["Software Engineering", "Science Fiction", "History", "Business", "Self Help", "Science", "Fiction", "Other"];

function Msg({ msg }) {
    if (!msg) return null;
    const isErr = msg.startsWith("❌");
    return <p className={`message ${isErr ? "err" : "ok"}`}>{msg}</p>;
}

export default function BooksSection() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [msg, setMsg] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [stockInput, setStockInput] = useState({});

    const load = async () => {
        try {
            const res = await gateway.get("/api/v1/books");
            setBooks(res.data.data || []);
        } catch {
            setMsg("❌ Failed to load books.");
        }
    };

    useEffect(() => { load(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
            publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
        };
        try {
            if (editingId) {
                await gateway.put(`/api/v1/books/${editingId}`, payload);
                setMsg("✅ Book updated successfully.");
            } else {
                await gateway.post("/api/v1/books", payload);
                setMsg("✅ Book created successfully.");
            }
            setForm(EMPTY);
            setEditingId(null);
            setSearchResults(null);
            await load();
        } catch (err) {
            setMsg("❌ " + (err?.response?.data?.message || "Failed to save book."));
        }
    };

    const handleEdit = (b) => {
        setForm({
            title: b.title || "", author: b.author || "", isbn: b.isbn || "",
            description: b.description || "", price: b.price || "",
            stockQuantity: b.stockQuantity || "", category: b.category || "",
            publisher: b.publisher || "", publishedYear: b.publishedYear || ""
        });
        setEditingId(b.id);
        setMsg("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            await gateway.delete(`/api/v1/books/${id}`);
            setMsg("✅ Book deleted.");
            setSearchResults(null);
            await load();
        } catch (err) {
            setMsg("❌ " + (err?.response?.data?.message || "Failed to delete book."));
        }
    };

    const handleSearch = async () => {
        if (!search.trim()) { setSearchResults(null); return; }
        try {
            const res = await gateway.get(`/api/v1/books/search?keyword=${encodeURIComponent(search)}`);
            setSearchResults(res.data.data || []);
        } catch {
            setMsg("❌ Search failed.");
        }
    };

    const handleUpdateStock = async (id) => {
        const qty = stockInput[id];
        if (qty === undefined || qty === "") return;
        try {
            await gateway.patch(`/api/v1/books/${id}/stock?quantity=${Number(qty)}`);
            setMsg("✅ Stock updated.");
            setStockInput(s => ({ ...s, [id]: "" }));
            await load();
        } catch {
            setMsg("❌ Failed to update stock.");
        }
    };

    const displayedBooks = searchResults !== null ? searchResults : books;

    return (
        <>
            {/* ── FORM ── */}
            <div className="section-card">
                <h2>{editingId ? "✏️ Edit Book" : "➕ Add New Book"}</h2>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="field"><label>Title *</label>
                            <input placeholder="e.g. Clean Code" value={form.title} onChange={e => set("title", e.target.value)} required />
                        </div>
                        <div className="field"><label>Author *</label>
                            <input placeholder="e.g. Robert C. Martin" value={form.author} onChange={e => set("author", e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="field"><label>ISBN</label>
                            <input placeholder="e.g. 978-0132350884" value={form.isbn} onChange={e => set("isbn", e.target.value)} />
                        </div>
                        <div className="field"><label>Category</label>
                            <select value={form.category} onChange={e => set("category", e.target.value)}>
                                <option value="">-- Select category --</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-row three">
                        <div className="field"><label>Price (LKR) *</label>
                            <input type="number" step="0.01" placeholder="2500.00" value={form.price} onChange={e => set("price", e.target.value)} required />
                        </div>
                        <div className="field"><label>Stock Quantity *</label>
                            <input type="number" placeholder="50" value={form.stockQuantity} onChange={e => set("stockQuantity", e.target.value)} required />
                        </div>
                        <div className="field"><label>Published Year</label>
                            <input type="number" placeholder="2008" value={form.publishedYear} onChange={e => set("publishedYear", e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="field"><label>Publisher</label>
                            <input placeholder="e.g. Prentice Hall" value={form.publisher} onChange={e => set("publisher", e.target.value)} />
                        </div>
                    </div>
                    <div className="field"><label>Description</label>
                        <textarea placeholder="Book description..." value={form.description} onChange={e => set("description", e.target.value)} />
                    </div>
                    <div className="button-row">
                        <button type="submit">{editingId ? "Update Book" : "Create Book"}</button>
                        {editingId && (
                            <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(EMPTY); setMsg(""); }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
                <Msg msg={msg} />
            </div>

            {/* ── SEARCH + LIST ── */}
            <div className="section-card">
                <h2>📋 Book List {searchResults !== null ? `— Search: "${search}"` : `(${books.length} total)`}</h2>

                <div className="search-bar">
                    <input placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()} />
                    <button onClick={handleSearch}>Search</button>
                    {searchResults !== null && (
                        <button className="secondary" onClick={() => { setSearchResults(null); setSearch(""); }}>Clear</button>
                    )}
                </div>

                {displayedBooks.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>No books found.</p>
                ) : (
                    <div className="list-container">
                        {displayedBooks.map(b => (
                            <div className="list-item" key={b.id}>
                                <h3>{b.title}</h3>
                                <p><strong>Author:</strong> {b.author} &nbsp;|&nbsp; <strong>ISBN:</strong> {b.isbn || "—"} &nbsp;|&nbsp; <strong>Category:</strong> {b.category || "—"}</p>
                                <p><strong>Price:</strong> LKR {b.price} &nbsp;|&nbsp; <strong>Stock:</strong> {b.stockQuantity} &nbsp;|&nbsp; <strong>Publisher:</strong> {b.publisher || "—"} &nbsp;|&nbsp; <strong>Year:</strong> {b.publishedYear || "—"}</p>
                                {b.description && <p style={{ fontStyle: "italic", color: "#6b7280" }}>{b.description}</p>}

                                {/* Stock update inline */}
                                <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                                    <input
                                        type="number" placeholder="New stock qty"
                                        style={{ width: 150, padding: "6px 10px", fontSize: 14 }}
                                        value={stockInput[b.id] || ""}
                                        onChange={e => setStockInput(s => ({ ...s, [b.id]: e.target.value }))}
                                    />
                                    <button className="warning" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => handleUpdateStock(b.id)}>Update Stock</button>
                                </div>

                                <div className="button-row" style={{ marginTop: 10 }}>
                                    <button style={{ padding: "6px 14px", fontSize: 14 }} onClick={() => handleEdit(b)}>Edit</button>
                                    <button className="danger" style={{ padding: "6px 14px", fontSize: 14 }} onClick={() => handleDelete(b.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
