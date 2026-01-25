// src/utils/loadCsv.js
export async function loadResultsCsv() {
  try {
    const response = await fetch("/results.csv");
    const text = await response.text();

    const pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    
    const rawLines = text.match(/(".*?"|[^"\n]+)+/g);
    if (!rawLines || rawLines.length < 2) return [];

    const headers = rawLines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    const results = rawLines.slice(1).map(line => {
      const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
      const values = [];
      let match;
      while (match = regex.exec(line)) {
        let val = match[1] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
        }
        values.push(val);
      }
      
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i+1] || "");
      return obj;
    }).filter(r => r.Subreddit);

    console.log("Parsed Rows:", results.length);
    return results;

  } catch (err) {
    console.error("CSV Load Error:", err);
    return [];
  }
}