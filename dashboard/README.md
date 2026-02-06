# InSight (formerly Feelytics)

**InSight** is a React-based business intelligence dashboard designed to extract, analyze, and visualize sentiment data from social media platforms (Reddit) for brand monitoring.

It transforms raw unstructured text into actionable insights, helping businesses like **Adidas** and **Nike** understand customer sentiment, emotional trends, and topic distribution in real-time.

![alt text](image.png)

## 🚀 Key Features

### 📊 Active Intelligence Dashboard
* **Real-time Feed:** Displays crawled Reddit posts with auto-tagged categories, sentiment (Positive/Negative), and specific emotions (e.g., Stress, Happy, Confusion).
* **Smart Filtering:** Filter insights by specific data source (e.g., filtering only "Adidas" posts).
* **Business-Focus Mode:** Includes a configuration to "soft filter" out non-relevant data sources (e.g., Polytechnic data) to focus purely on business propositions.

### 📈 Interactive Analytics
* **Topic Distribution:** Visualize what users are talking about (Academic, Products, Complaints) via toggleable Bar and Pie charts.
* **Emotional Landscape:** A sophisticated breakdown of specific emotions over time. Includes a **Trend View** to spot spikes in specific feelings (e.g., a spike in "Frustration" after a product launch).
* **Sentiment Volume:** A high-level view of the overall Positive vs. Negative ratio.

### 🔍 Deep Dive Modals
* **Post Inspector:** Click any card to read the full Reddit post content in a focused overlay.
* **Expanded Analytics:** Click any chart panel to open a large-scale, interactive version using **Recharts**:
    * **Trend Analysis:** Time-series line charts with tooltips and legends.
    * **Sentiment Breakdown:** A stacked bar chart visualizing the positive vs. negative impact of individual posts.

## 🛠️ Tech Stack

* **Framework:** React 18 + Vite
* **Styling:** Standard CSS (Custom implementation, no external UI frameworks).
* **Visualization:** * Custom SVG Components (Mini Charts).
    * [Recharts](https://recharts.org/) (Complex Modal Charts).
* **Routing:** React Router DOM.
* **State Management:** React Context API (Auth).

## ⚡ Getting Started

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/insight-dashboard.git](https://github.com/your-username/insight-dashboard.git)
    cd insight-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your API key:
    ```env
    VITE_API_KEY=your_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## ⚙️ Configuration

### Data Source Filtering
To adapt the dashboard for specific client pitches, you can configure which data sources appear in the sidebar.

Open `src/Dashboard.jsx` and modify the `IGNORED_SOURCES` array:

```javascript
const IGNORED_SOURCES = [
  "TemasekPoly",
  "SingaporePoly", 
  // Add any other sources you want to hide from the UI
];