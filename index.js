import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5050;
const startPage = "index.html";

/* ================================
   FIX __dirname for ES modules
   ================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================================
   MIDDLEWARE
   ================================ */
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

/* ================================
   TEMP USER
   ================================ */
const USER = {
    email: "test@example.com",
    password: "123456"
};

/* ================================
   LOGIN ROUTE
   ================================ */
app.post("/login", (req, res) => {
    console.log("LOGIN HIT", req.body);

    const { email, password } = req.body;

    if (email === USER.email && password === USER.password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

/* ================================
   HOME PAGE
   ================================ */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", startPage));
});

/* ================================
   START SERVER
   ================================ */
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export { app, server };
