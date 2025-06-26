'use client';

import { useActionState } from 'react';
import { handleLikePost } from '../services/posts.js';
import { formatDate } from '../utils/dates.js';
import styles from './page.module.css';

const userId = 'anonymous-user'; // Simulated user ID for likes

export default function Post({ post }) {
  const [state, action, isPending] = useActionState(handleLikePost, {
    postId: post.id,
    liked: !post.likedBy.includes(userId),
    totalLikes: post.likes
  });

  return (
    <li>
      <article className={styles.postCard}>
        {/* User Info */}
        <header className={styles.userInfo}>
          <div>
            <div className={styles.authorName}>
              {post.author}
            </div>
            <div className={styles.userDetails}>
              {post.username} • <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className={styles.postContent}>
          {post.content}
        </div>

        {/* Like Button */}
        <footer>
          <form action={action} className={styles.likeForm}>
            <input type="hidden" name="postId" value={post.id} />
            <input type="hidden" name="userId" value={userId} />
            <button 
              type="submit" 
              className={styles.likeButton} 
              disabled={isPending}
              aria-label={`${state.totalLikes} likes`} 
              aria-description='Like this post'
            >
              <span className={styles.likeIcon} aria-hidden="true">❤️</span>
              <span className={styles.likeCount}>{state.totalLikes}</span>
            </button>
          </form>
        </footer>
      </article>
    </li>
  );
}
