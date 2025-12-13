import React, { useState } from "react";
import "./ResponsiveLayout.css";

export default function ResponsiveLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="responsive-layout">

            {/* Topbar (desktop visible, mobile shows hamburger) */}
            <header className="topbar">
                <div className="logo">My Dashboard</div>

                {/* Desktop nav */}
                <nav className="top-nav">
                    <a href="#">Home</a>
                    <a href="#">Reports</a>
                    <a href="#">Settings</a>
                </nav>

                {/* Mobile hamburger */}
                <button className="hamburger" onClick={() => setOpen(!open)}>
                    ☰
                </button>
            </header>

            {/* Sidebar (mobile only) */}
            <aside className={`sidebar ${open ? "open" : ""}`}>
                <a onClick={() => setOpen(false)} href="#">Home</a>
                <a onClick={() => setOpen(false)} href="#">Reports</a>
                <a onClick={() => setOpen(false)} href="#">Settings</a>
            </aside>

            {/* Main content */}
            <main className="content">
                {children}
            </main>
        </div>
    );
}
