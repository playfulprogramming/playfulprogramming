import { redirect } from 'next/navigation'
import { getAllPosts, likePost } from '../services/posts.js';
import { formatDate } from '../utils/dates.js';
import styles from './page.module.css';

// Server action for liking posts
async function handleLikePost(formData) {
  'use server';

  const postId = formData.get('postId');
  const userId = formData.get('userId') || 'anonymous-user'; // Simple user simulation

    await likePost(postId, userId);
    // Reload the page to reflect changes
    redirect("/")
}

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>
          React Social Feed
        </h1>
      </header>

      <main>
        <ul className={styles.postsContainer}>
          {posts.map((post) => (
            <li key={post.id}>
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
                  <form action={handleLikePost} className={styles.likeForm}>
                    <input type="hidden" name="postId" value={post.id} />
                    <input type="hidden" name="userId" value="anonymous-user" />
                    <button type="submit" className={styles.likeButton} aria-label={`${post.likes} likes`} aria-description='Like this post'>
                      <span className={styles.likeIcon} aria-hidden="true">❤️</span>
                      <span className={styles.likeCount}>{post.likes}</span>
                    </button>
                  </form>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
