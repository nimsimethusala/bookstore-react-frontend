import { useEffect, useState } from "react";
import gateway from "../api";

const CATEGORIES = ["book-cover", "invoice", "attachment", "other"];
const REF_TYPES  = ["BOOK", "ORDER"];

function Msg({ msg }) {
    if (!msg) return null;
    return <p className={`message ${msg.startsWith("❌") ? "err" : "ok"}`}>{msg}</p>;
}

export default function FilesSection() {
    const [files, setFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("book-cover");
    const [referenceId, setReferenceId] = useState("");
    const [referenceType, setReferenceType] = useState("BOOK");
    const [msg, setMsg] = useState("");
    const [uploading, setUploading] = useState(false);

    const [filterCat, setFilterCat] = useState("");
    const [filterRefId, setFilterRefId] = useState("");
    const [filterRefType, setFilterRefType] = useState("BOOK");

    const load = async () => {
        try {
            const res = await gateway.get("/api/v1/files");
            setFiles(res.data.data || []);
        } catch {
            setMsg("❌ Failed to load files.");
        }
    };

    useEffect(() => { load(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) { setMsg("❌ Please select a file."); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("description", description);
            fd.append("category", category);
            if (referenceId) fd.append("referenceId", referenceId);
            fd.append("referenceType", referenceType);

            await gateway.post("/api/v1/files/upload", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMsg("✅ File uploaded to Cloud Storage successfully.");
            setFile(null);
            setDescription("");
            document.getElementById("file-input").value = "";
            await load();
        } catch (err) {
            setMsg("❌ " + (err?.response?.data?.message || "Upload failed."));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this file from Cloud Storage?")) return;
        try {
            await gateway.delete(`/api/v1/files/${id}`);
            setMsg("✅ File deleted from Cloud Storage.");
            await load();
        } catch {
            setMsg("❌ Failed to delete file.");
        }
    };

    const handleFilterCat = async () => {
        if (!filterCat) { await load(); return; }
        try {
            const res = await gateway.get(`/api/v1/files/category/${filterCat}`);
            setFiles(res.data.data || []);
        } catch { setMsg("❌ Filter failed."); }
    };

    const handleFilterRef = async () => {
        if (!filterRefId) { await load(); return; }
        try {
            const res = await gateway.get(`/api/v1/files/reference?referenceId=${filterRefId}&referenceType=${filterRefType}`);
            setFiles(res.data.data || []);
        } catch { setMsg("❌ Filter failed."); }
    };

    const formatSize = (bytes) => {
        if (!bytes) return "—";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const isImage = (type) => type && type.startsWith("image/");

    return (
        <>
            {/* ── UPLOAD FORM ── */}
            <div className="section-card">
                <h2>☁️ Upload File to Cloud Storage</h2>
                <form className="form-grid" onSubmit={handleUpload}>
                    <div className="form-row">
                        <div className="field"><label>File *</label>
                            <input id="file-input" type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
                        </div>
                        <div className="field"><label>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="field"><label>Reference Type</label>
                            <select value={referenceType} onChange={e => setReferenceType(e.target.value)}>
                                {REF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="field"><label>Reference ID (Book ID / Order ID)</label>
                            <input placeholder="e.g. 1" value={referenceId} onChange={e => setReferenceId(e.target.value)} />
                        </div>
                    </div>
                    <div className="field"><label>Description</label>
                        <input placeholder="e.g. Book cover image for Clean Code" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="button-row">
                        <button type="submit" disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload to GCS"}
                        </button>
                    </div>
                </form>
                <Msg msg={msg} />
            </div>

            {/* ── FILTER + LIST ── */}
            <div className="section-card">
                <h2>📂 Uploaded Files ({files.length})</h2>

                {/* Filter by category */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Filter by category:</span>
                    <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: "8px 10px", fontSize: 14 }}>
                        <option value="">All</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button style={{ padding: "8px 14px", fontSize: 14 }} onClick={handleFilterCat}>Apply</button>
                </div>

                {/* Filter by reference */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Filter by reference:</span>
                    <select value={filterRefType} onChange={e => setFilterRefType(e.target.value)} style={{ padding: "8px 10px", fontSize: 14 }}>
                        {REF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input placeholder="Reference ID" value={filterRefId} onChange={e => setFilterRefId(e.target.value)}
                        style={{ width: 120, padding: "8px 10px", fontSize: 14 }} />
                    <button style={{ padding: "8px 14px", fontSize: 14 }} onClick={handleFilterRef}>Apply</button>
                    <button className="secondary" style={{ padding: "8px 14px", fontSize: 14 }} onClick={() => { setFilterCat(""); setFilterRefId(""); load(); }}>Reset</button>
                </div>

                {files.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>No files found.</p>
                ) : (
                    <div className="list-container">
                        {files.map(f => (
                            <div className="list-item" key={f.id}>
                                <h3>{f.originalFileName}</h3>
                                <p>
                                    <strong>Category:</strong> {f.category || "—"} &nbsp;|&nbsp;
                                    <strong>Size:</strong> {formatSize(f.fileSize)} &nbsp;|&nbsp;
                                    <strong>Type:</strong> {f.contentType}
                                </p>
                                <p>
                                    <strong>Reference:</strong> {f.referenceType} #{f.referenceId || "—"} &nbsp;|&nbsp;
                                    <strong>Uploaded:</strong> {f.uploadedAt ? new Date(f.uploadedAt).toLocaleString() : "—"}
                                </p>
                                {f.description && <p style={{ color: "#6b7280", fontStyle: "italic" }}>{f.description}</p>}

                                {/* Image preview */}
                                {isImage(f.contentType) && f.publicUrl && (
                                    <div className="file-preview">
                                        <img src={f.publicUrl} alt={f.originalFileName} />
                                    </div>
                                )}

                                <div className="button-row" style={{ marginTop: 10 }}>
                                    {f.publicUrl && (
                                        <a href={f.publicUrl} target="_blank" rel="noreferrer">
                                            <button style={{ padding: "6px 14px", fontSize: 14 }}>Open File ↗</button>
                                        </a>
                                    )}
                                    <button className="danger" style={{ padding: "6px 14px", fontSize: 14 }} onClick={() => handleDelete(f.id)}>
                                        Delete from GCS
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
