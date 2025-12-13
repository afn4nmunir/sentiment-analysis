import React from "react";
import "./SentimentDashboard.css";

export default function SentimentDashboard() {
    return (
        <div className="dashboard-container" style={styles.container}>

            {/* Header */}
            <h2 style={styles.header}>Sentiment Dashboard</h2>

            {/* Grid - switches to column on mobile */}
            <div className={"dashboard-grid"}>

                {/* Donut Chart Card */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Overall Sentiment</h3>
                    <div style={styles.chartContainer}>
                        {/* Placeholder Donut SVG */}
                        <svg width="180" height="180" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="80" fill="#eee" />
                            <path d="M100 20 A80 80 0 0 1 176 100 L140 100 A40 40 0 0 0 100 60 Z" fill="#2ECC71" />
                            <path d="M176 100 A80 80 0 0 1 120 176 L100 140 A40 40 0 0 0 140 100 Z" fill="#F1C40F" />
                            <path d="M120 176 A80 80 0 0 1 24 100 L60 100 A40 40 0 0 0 100 140 Z" fill="#E74C3C" />
                            <circle cx="100" cy="100" r="40" fill="#fff" />
                        </svg>
                    </div>

                    <ul style={styles.legend}>
                        <li>🟩 Positive — 60%</li>
                        <li>🟨 Neutral — 25%</li>
                        <li>🟥 Negative — 15%</li>
                    </ul>
                </div>

                {/* Trend Chart Card */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Sentiment Trend</h3>
                    <div style={styles.chartContainer}>

                        {/* Placeholder stacked bar chart */}
                        <svg width="100%" height="180">
                            <rect x="10" y="20" width="120" height="20" fill="#2ECC71" />
                            <rect x="130" y="20" width="50" height="20" fill="#F1C40F" />
                            <rect x="180" y="20" width="30" height="20" fill="#E74C3C" />

                            <rect x="10" y="60" width="150" height="20" fill="#2ECC71" />
                            <rect x="160" y="60" width="40" height="20" fill="#F1C40F" />
                            <rect x="200" y="60" width="50" height="20" fill="#E74C3C" />

                            <rect x="10" y="100" width="90" height="20" fill="#2ECC71" />
                            <rect x="100" y="100" width="40" height="20" fill="#F1C40F" />
                            <rect x="140" y="100" width="30" height="20" fill="#E74C3C" />
                        </svg>

                    </div>
                </div>
            </div>

            {/* Topics Section */}
            <div style={styles.cardFull}>
                <h3 style={styles.cardTitle}>Top Topics</h3>

                <div style={styles.topicRow}>
                    <span>Delivery Issues</span>
                    <span>45%</span>
                </div>
                <div style={styles.topicBar(45)} />

                <div style={styles.topicRow}>
                    <span>Pricing</span>
                    <span>22%</span>
                </div>
                <div style={styles.topicBar(22)} />

                <div style={styles.topicRow}>
                    <span>Customer Service</span>
                    <span>18%</span>
                </div>
                <div style={styles.topicBar(18)} />

            </div>

        </div>
    );
}

/* Inline responsive styles */
const styles = {
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif"
    },
    header: {
        marginBottom: "20px",
        fontSize: "24px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "20px",

        /* Mobile responsive */
        '@media (max-width: 768px)': {
            gridTemplateColumns: "1fr"
        }
    },
    card: {
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    },
    cardFull: {
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginTop: "10px"
    },
    cardTitle: {
        marginBottom: "12px",
        fontSize: "18px"
    },
    chartContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "12px"
    },
    legend: {
        listStyle: "none",
        padding: 0,
        marginTop: "10px",
        fontSize: "14px",
        lineHeight: "1.6"
    },
    topicRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        marginTop: "12px"
    },
    topicBar: (percent) => ({
        height: "8px",
        width: percent + "%",
        background: "#2ECC71",
        borderRadius: "4px",
        marginBottom: "8px"
    })
};
