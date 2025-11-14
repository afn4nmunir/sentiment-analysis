import praw
import json
import datetime
import os

## setx REDDIT_CLIENT_ID "NGN02WHJGpwe-BrK2_y32Q" setx REDDIT_CLIENT_SECRET "h6hNZGuJxoPic05y6-F8YEcp6pZFvQ"
def load_reddit_client():
    return praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent="TPProjectCrawler/1.0"
    )

def fetch_posts(subreddit_name, limit=50):
    reddit = load_reddit_client()
    subreddit = reddit.subreddit(subreddit_name)

    posts = []
    for post in subreddit.new(limit=limit):
        posts.append({
            "id": post.id,
            "title": post.title,
            "text": post.selftext,
            "score": post.score,
            "created_utc": post.created_utc,
            "subreddit": subreddit_name
        })
    return posts

def save_to_json(data, filename="reddit_output.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"✅ Saved output to {filename}")

if __name__ == "__main__":
    posts = fetch_posts("TemasekPoly", limit=30)
    print(posts)
    save_to_json(posts)
