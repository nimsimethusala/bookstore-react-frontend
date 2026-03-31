import { useState } from "react";
import BooksSection from "./components/BooksSection";
import OrdersSection from "./components/OrdersSection";
import FilesSection from "./components/FilesSection";

export default function App() {
    const [activeTab, setActiveTab] = useState("books");

    const tabs = [
        { key: "books",  label: "📖 Books"  },
        { key: "orders", label: "🛒 Orders" },
        { key: "files",  label: "📁 Files"  },
    ];

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>📚 Online Bookstore Platform</h1>
                <p>Frontend connected through API Gateway · ITS 2130 Enterprise Cloud Architecture · IJSE</p>
            </header>

            <nav className="nav-bar">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        className={activeTab === t.key ? "active" : ""}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <main className="content-area">
                {activeTab === "books"  && <BooksSection />}
                {activeTab === "orders" && <OrdersSection />}
                {activeTab === "files"  && <FilesSection />}
            </main>
        </div>
    );
}
