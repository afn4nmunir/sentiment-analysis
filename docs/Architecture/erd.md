posts
---------
post_id (VARCHAR) (PK)
subreddit (VARCHAR) (100)
title (TEXT) 
body (TEXT)
score (INT)
created_utc (TIMESTAMP) 
crawled_at (TIMESTAMP)

sentiments
--------------
id (VARCHAR) (PK)
post_id (VARCHAR) (FK → posts.post_id)
label (VARCHAR)
score (INT)
processed_at (TIMESTAMP)

topics
-----------
id (VARCHAR) (PK)
post_id (VARCHAR) (FK → posts.post_id)
topic (VARCHAR)
confidence (VARCHAR)
