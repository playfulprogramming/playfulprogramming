import { getAllPosts } from '../services/posts.js';
import Post from './Post.jsx';
import styles from './page.module.css';

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
            <Post key={post.id} post={post} />
          ))}
        </ul>
      </main>
    </div>
  );
}
