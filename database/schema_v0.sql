CREATE TABLE posts (
    post_id VARCHAR(30) PRIMARY KEY,
    subreddit VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    score INT,
    created_utc TIMESTAMP NULL,
    crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sentiments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(30) NOT NULL,
    label VARCHAR(20) NOT NULL,
    score FLOAT NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) 
        REFERENCES posts(post_id)
        ON DELETE CASCADE
);

CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id VARCHAR(30),
    topic VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    FOREIGN KEY (post_id) 
    REFERENCES posts(post_id)
    ON DELETE CASCADE
);
