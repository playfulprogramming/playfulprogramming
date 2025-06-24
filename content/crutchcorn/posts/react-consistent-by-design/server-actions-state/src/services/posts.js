'use server';

import "server-only";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON data file
const POSTS_FILE_PATH = path.join(__dirname, '..', 'data', 'posts.json');

/**
 * Read posts from the JSON file
 */
async function readPostsFromFile() {
    const data = await fs.readFile(POSTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
}

/**
 * Write posts to the JSON file
 */
async function writePostsToFile(data) {
    await fs.writeFile(POSTS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Get all posts
 */
export async function getAllPosts() {
  const data = await readPostsFromFile();
  return data.posts || [];
}

/**
 * Like a post - toggle like status for a user
 */
export async function likePost(postId, userId) {
  const data = await readPostsFromFile();
  const postIndex = data.posts.findIndex(post => post.id === postId);
  
  const post = data.posts[postIndex];
  const userHasLiked = post.likedBy.includes(userId);

  if (userHasLiked) {
    // Unlike the post
    post.likedBy = post.likedBy.filter(id => id !== userId);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    // Like the post
    post.likedBy.push(userId);
    post.likes += 1;
  }

  await writePostsToFile(data);
  
  return {
    postId,
    liked: !userHasLiked,
    totalLikes: post.likes
  };
}

// Server action for liking posts
export async function handleLikePost(_prevState, formData) {

  const postId = formData.get('postId');
  const userId = formData.get('userId') || 'anonymous-user';

  return await likePost(postId, userId);
}