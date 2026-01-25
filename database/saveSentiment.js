import "dotenv/config";
import fs from "fs/promises";

const API_URL = `${process.env.AWS_SENTIMENT_URL}?limit=50`;
const API_TOKEN = process.env.API_TOKEN;
const DB_FILE = "sentiment_db.json";

async function saveToJsonDB() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                "x-api-token": API_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Save to JSON file (pretty formatted)
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));

        console.log("Data saved to sentiment_db.json");
    } catch (error) {
        console.error("Error saving data:", error.message);
    }
}

saveToJsonDB();
