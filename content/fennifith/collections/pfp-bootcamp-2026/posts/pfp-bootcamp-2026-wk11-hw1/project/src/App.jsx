import "./App.css";
import { NavLink } from "react-router";

export function HomePage() {
  return <>
    <h1>Home Page</h1>
    <p>Welcome to my blog!</p>
    <p>Here is <NavLink to="/about">some info about the site</NavLink>.</p>
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
