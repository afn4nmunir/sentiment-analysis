# ADR 0001: Tech Stack Decision

# Date: 2025-10-29
# Status: Accepted
# Context: We needed a full-stack solution for building a sentiment analysis dashboard that supports Data Crawling, AI Processing, and Data Visualisation

# Decision
We will be using:
- **Frontend**: React + Vite
- **Backend / AI**: OpenAI API (Provided by school)
- **Data Pipeline / Crawling**: AWS SageMaker / Python Language
- **Database**: AWS Aurora

# Rationale
- Frontend team is familiar with React
- SageMaker has been previously used by BDA team + Supervisor reccomended
- OpenAI is very flexible/reliable
- Aurora offers scalability and easy integration with AWS Services (SageMaker)

# Cons
- BDA Team is not familiar with AWS AUrora and needs to learn Aurora Setup and software
- ITO Team will also need to familiarise with Scraping and Backend tech to learn from real signals w/o using placeholder data