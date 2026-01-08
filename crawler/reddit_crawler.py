import praw
import json
import datetime
import os
from dotenv import load_dotenv
import boto3
load_dotenv()

#---------------------
# 1. Reddit Crawler
#---------------------
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

#-------------------
# 2. Upload to S3
#-------------------
def upload_to_s3(data, subreddit_name):
    s3 = boto3.client(
        's3',
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
        region_name="ap-southeast-1"
    )

    today = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%d")
    filename = f"reddit_{subreddit_name}_{today}.json"

    bucket = "mp-ito-ingestion-ammar"
    key = f"raw/reddit/{today}/{filename}"

    s3.put_object(
        Bucket=bucket, 
        Key=key, 
        Body=json.dumps(data, indent=4),
        ContentType="application/json"
    )

    print(f"✅ Uploaded to s3://{bucket}/{key}")

#---------------------
# 3. Run everything
#---------------------
if __name__ == "__main__":
    subreddit = "TemasekPoly"
    posts = fetch_posts(subreddit, limit=30)
    upload_to_s3(posts, subreddit)
