// src/utils/loadCsv.js
// using a standard regex pattern for CSVs to handle Excel quirks
export async function loadResultsCsv() {
  try {
    const response = await fetch("/results.csv");
    const text = await response.text();

    // Standard CSV regex parser that handles "quoted, values" and newlines
    const pattern = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    // Note: A simple regex is risky for complex multi-line, so we will use a simpler split 
    // IF the complex parser failed. But let's try a robust line-reader first.
    
    // 1. Split into lines, handling the fact that some newlines are INSIDE quotes
    const rawLines = text.match(/(".*?"|[^"\n]+)+/g);
    if (!rawLines || rawLines.length < 2) return [];

    // 2. Extract Headers
    const headers = rawLines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    // 3. Process Rows
    const results = rawLines.slice(1).map(line => {
      // Split by comma, but ignore commas inside quotes
      const regex = /(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g;
      const values = [];
      let match;
      while (match = regex.exec(line)) {
        let val = match[1] || '';
        // Remove surrounding quotes and unescape double quotes
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
        }
        values.push(val);
      }
      
      // Map to headers
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i+1] || ""); // +1 because regex captures separator
      return obj;
    }).filter(r => r.Subreddit); // Filter empty rows

    console.log("Parsed Rows:", results.length);
    return results;

  } catch (err) {
    console.error("CSV Load Error:", err);
    return [];
  }
}