import { useMemo } from "react";
import "./App.css";
import { NavLink, useParams } from "react-router";
import { posts } from "./posts";

export function HomePage() {
  return <>
    <h1>Home Page</h1>
    <p>Welcome to my blog!</p>
    <p>Here is <NavLink to="/about">some info about the site</NavLink>.</p>
    <ul>
      {posts.map(post => (
        <li><NavLink to={"/blog/" + post.id}>{post.title}</NavLink></li>
      ))}
    </ul>
  </>;
}

export function AboutPage() {
  return <>
    <h1>About Page</h1>
    <p><NavLink to="/">Return Home</NavLink></p>
    <p>This website is a website is a website is a website is a website.</p>
    <p>Have a good day.</p>
  </>;
}

export function BlogPage() {
  const { id } = useParams();

  const post = useMemo(() => {
    for (const post of posts) {
      if (post.id === id) return post;
    }
  }, [id]);

  if (post) {
    return <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><NavLink to="/">Return Home</NavLink></p>
    </>;
  } else {
    return <p>I couldn't find any post with the id '{id}'.</p>;
  }
}
