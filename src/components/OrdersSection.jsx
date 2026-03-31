import { useEffect, useState } from "react";
import gateway from "../api";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const EMPTY_FORM = {
    customerName: "", customerEmail: "", customerPhone: "", shippingAddress: "", notes: ""
};

const EMPTY_ITEM = { bookId: "", bookTitle: "", bookAuthor: "", isbn: "", quantity: "1", unitPrice: "" };

function Msg({ msg }) {
    if (!msg) return null;
    return <p className={`message ${msg.startsWith("❌") ? "err" : "ok"}`}>{msg}</p>;
}

function StatusBadge({ status }) {
    return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function OrdersSection() {
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
    const [msg, setMsg] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const load = async () => {
        try {
            const res = await gateway.get("/api/v1/orders");
            setOrders(res.data.data || []);
        } catch {
            setMsg("❌ Failed to load orders.");
        }
    };

    useEffect(() => { load(); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const setItem = (idx, k, v) => setItems(arr => arr.map((it, i) => i === idx ? { ...it, [k]: v } : it));
    const addItem = () => setItems(arr => [...arr, { ...EMPTY_ITEM }]);
    const removeItem = (idx) => setItems(arr => arr.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            items: items.map(it => ({
                bookId: Number(it.bookId),
                bookTitle: it.bookTitle,
                bookAuthor: it.bookAuthor,
                isbn: it.isbn,
                quantity: Number(it.quantity),
                unitPrice: Number(it.unitPrice),
            }))
        };
        try {
            await gateway.post("/api/v1/orders", payload);
            setMsg("✅ Order placed successfully.");
            setForm(EMPTY_FORM);
            setItems([{ ...EMPTY_ITEM }]);
            await load();
        } catch (err) {
            setMsg("❌ " + (err?.response?.data?.message || "Failed to create order."));
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await gateway.patch(`/api/v1/orders/${id}/status?status=${status}`);
            setMsg(`✅ Order status updated to ${status}.`);
            await load();
        } catch {
            setMsg("❌ Failed to update status.");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await gateway.patch(`/api/v1/orders/${id}/cancel`);
            setMsg("✅ Order cancelled.");
            await load();
        } catch (err) {
            setMsg("❌ " + (err?.response?.data?.message || "Cannot cancel this order."));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this order permanently?")) return;
        try {
            await gateway.delete(`/api/v1/orders/${id}`);
            setMsg("✅ Order deleted.");
            await load();
        } catch {
            setMsg("❌ Failed to delete order.");
        }
    };

    const handleFilterEmail = async () => {
        if (!filterEmail.trim()) { await load(); return; }
        try {
            const res = await gateway.get(`/api/v1/orders/customer?email=${encodeURIComponent(filterEmail)}`);
            setOrders(res.data.data || []);
        } catch { setMsg("❌ Filter failed."); }
    };

    const handleFilterStatus = async (s) => {
        setFilterStatus(s);
        if (!s) { await load(); return; }
        try {
            const res = await gateway.get(`/api/v1/orders/status/${s}`);
            setOrders(res.data.data || []);
        } catch { setMsg("❌ Filter failed."); }
    };

    return (
        <>
            {/* ── CREATE ORDER FORM ── */}
            <div className="section-card">
                <h2>➕ Place New Order</h2>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <h3>Customer Details</h3>
                    <div className="form-row">
                        <div className="field"><label>Customer Name *</label>
                            <input placeholder="Kasun Perera" value={form.customerName} onChange={e => set("customerName", e.target.value)} required />
                        </div>
                        <div className="field"><label>Email *</label>
                            <input type="email" placeholder="kasun@example.com" value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="field"><label>Phone</label>
                            <input placeholder="+94771234567" value={form.customerPhone} onChange={e => set("customerPhone", e.target.value)} />
                        </div>
                    </div>
                    <div className="field"><label>Shipping Address *</label>
                        <textarea placeholder="123 Galle Road, Colombo 03, Sri Lanka" value={form.shippingAddress} onChange={e => set("shippingAddress", e.target.value)} required />
                    </div>
                    <div className="field"><label>Notes</label>
                        <input placeholder="Special instructions..." value={form.notes} onChange={e => set("notes", e.target.value)} />
                    </div>

                    <h3>Order Items</h3>
                    {items.map((item, idx) => (
                        <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#f9fafb" }}>
                            <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: 13, color: "#374151" }}>Item {idx + 1}</p>
                            <div className="form-row">
                                <div className="field"><label>Book ID *</label>
                                    <input type="number" placeholder="1" value={item.bookId} onChange={e => setItem(idx, "bookId", e.target.value)} required />
                                </div>
                                <div className="field"><label>Book Title</label>
                                    <input placeholder="Clean Code" value={item.bookTitle} onChange={e => setItem(idx, "bookTitle", e.target.value)} />
                                </div>
                            </div>
                            <div className="form-row three">
                                <div className="field"><label>Quantity *</label>
                                    <input type="number" min="1" value={item.quantity} onChange={e => setItem(idx, "quantity", e.target.value)} required />
                                </div>
                                <div className="field"><label>Unit Price (LKR) *</label>
                                    <input type="number" step="0.01" placeholder="2500.00" value={item.unitPrice} onChange={e => setItem(idx, "unitPrice", e.target.value)} required />
                                </div>
                                <div className="field"><label>ISBN</label>
                                    <input placeholder="978-..." value={item.isbn} onChange={e => setItem(idx, "isbn", e.target.value)} />
                                </div>
                            </div>
                            {items.length > 1 && (
                                <button type="button" className="danger remove-btn" onClick={() => removeItem(idx)}>Remove Item</button>
                            )}
                        </div>
                    ))}

                    <div className="button-row">
                        <button type="button" className="add-item-btn" onClick={addItem}>+ Add Another Item</button>
                    </div>

                    <div className="button-row">
                        <button type="submit">Place Order</button>
                    </div>
                </form>
                <Msg msg={msg} />
            </div>

            {/* ── FILTER + LIST ── */}
            <div className="section-card">
                <h2>📋 Orders ({orders.length})</h2>

                <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <input style={{ flex: 1, minWidth: 200 }} placeholder="Filter by customer email..." value={filterEmail}
                        onChange={e => setFilterEmail(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleFilterEmail()} />
                    <button onClick={handleFilterEmail}>Filter</button>
                    <select value={filterStatus} onChange={e => handleFilterStatus(e.target.value)} style={{ padding: "10px 12px" }}>
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="secondary" onClick={() => { setFilterEmail(""); setFilterStatus(""); load(); }}>Reset</button>
                </div>

                {orders.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>No orders found.</p>
                ) : (
                    <div className="list-container">
                        {orders.map(o => (
                            <div className="list-item" key={o.id}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <h3 style={{ margin: 0 }}>Order #{o.id?.substring(0, 8)}...</h3>
                                    <StatusBadge status={o.status} />
                                </div>
                                <p><strong>Customer:</strong> {o.customerName} ({o.customerEmail})</p>
                                <p><strong>Phone:</strong> {o.customerPhone || "—"} &nbsp;|&nbsp; <strong>Address:</strong> {o.shippingAddress}</p>
                                <p><strong>Total:</strong> LKR {o.totalAmount} &nbsp;|&nbsp; <strong>Placed:</strong> {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</p>
                                {o.notes && <p><strong>Notes:</strong> {o.notes}</p>}

                                {/* Items table */}
                                {o.items?.length > 0 && (
                                    <table className="order-items-table">
                                        <thead>
                                            <tr><th>Book</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
                                        </thead>
                                        <tbody>
                                            {o.items.map((it, i) => (
                                                <tr key={i}>
                                                    <td>{it.bookTitle || `Book #${it.bookId}`}</td>
                                                    <td>{it.quantity}</td>
                                                    <td>LKR {it.unitPrice}</td>
                                                    <td>LKR {it.subtotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* Status update */}
                                <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                                    <select style={{ padding: "6px 10px", fontSize: 14 }}
                                        defaultValue=""
                                        onChange={e => e.target.value && handleUpdateStatus(o.id, e.target.value)}>
                                        <option value="" disabled>Change status...</option>
                                        {STATUSES.filter(s => s !== o.status).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {o.status !== "CANCELLED" && o.status !== "SHIPPED" && o.status !== "DELIVERED" && (
                                        <button className="warning" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => handleCancel(o.id)}>Cancel Order</button>
                                    )}
                                    <button className="danger" style={{ padding: "6px 12px", fontSize: 14 }} onClick={() => handleDelete(o.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
