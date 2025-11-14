import Topbar from "../components/Topbar";

export default function Dashboard() {
    return (
        <div style={{ width: "100%" }}>
            <Topbar />
            <div className="page-content">
                <h2>Analytics Overview</h2>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
                        <h3>Total Posts</h3>
                        <p>Loading...</p>
                    </div>

                    <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
                        <h3>Sentiment Score</h3>
                        <p>Coming Soon</p>
                    </div>

                    <div style={{ background: "white", padding: 20, borderRadius: 8 }}>
                        <h3>Trending Topics</h3>
                        <p>Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}