---
{
  title: "Week 10 - Tier 2 Homework",
  published: "2026-03-11T21:00:00.000Z",
  order: 13,
  noindex: true
}
---

# Getting started with Node and npm

This homework **builds on your JavaScript knowledge** from earlier weeks, but instead of running code in the browser, you’ll run JavaScript directly on your computer using **Node.js** and **npm**.

Node is a way to run **JavaScript outside of the browser**. It lets you use JS to:

- Build servers and APIs
- Write command‑line tools and scripts
- Work with files, databases, and more

By the end, you’ll have:

- Confirmed whether Node.js and npm are already installed
- Installed Node.js (if needed)
- Created a small Node project folder
- Initialized `package.json` with npm
- Written a simple `index.js` file
- Run a **“Hello, world!”** program with Node

---

## 1. Check if you already have Node and npm

First, open a terminal and run:

```bash
node -v
npm -v
```

- If you see **two version numbers** (for example, `v22.3.0` and `10.8.1`), you already have Node and npm installed.  
  → **You can skip directly to step 3**.
- If you see an error like “command not found,” then you still need to install Node — continue to step 2.

---

## 2. Install Node.js (which includes npm)

- Open your browser and go to: `https://nodejs.org/`
- Download the **LTS (Recommended)** version for your operating system.
- Run the installer and accept the default options.

When the installer finishes, open a terminal and run the same commands again:

```bash
node -v
npm -v
```

If everything worked, you should now see two version numbers printed.  
If you still see errors, double‑check that the installer finished and try closing/re‑opening your terminal.

---

## 3. Create a new folder for your Node project

Pick a place on your computer where you keep code (for example, a `projects` folder), then in your terminal run:

```bash
mkdir node-hello-world
cd node-hello-world
```

You should now be **inside** the `node-hello-world` folder.  
Here, `mkdir` means "make directory" (create a new folder), and `cd` means **"change directory"** — it moves your terminal into that folder so the commands you run affect `node-hello-world`.

You can confirm with:

```bash
pwd   # shows your current folder
ls    # (should be empty for now)
```

---

## 4. Initialize `package.json` with npm

Inside `node-hello-world`, run:

```bash
npm init -y
```

This command:

- Creates a `package.json` file
- Saves basic information about your project (name, version, etc.)
- Gives npm a place to track any dependencies you install later

If you run:

```bash
ls
```

You should now see a `package.json` file in the folder.

Open `package.json` in your editor and take a quick look.  
You do **not** need to change anything yet — this is just to see what npm created for you.

---

## 5. Create a simple Node script

Now we’ll write a tiny JavaScript program that prints text to the terminal.

First, **open the `node-hello-world` folder in your code editor** (for example, VS Code).  
In your editor’s file explorer:

- Make sure you see the `package.json` file you just created.
- Create a **new file** in this folder named `index.js`.

Put this code into `index.js`:

```js
console.log("What up, world!");
```

This is just regular JavaScript — the difference is that **Node** will run it instead of the browser.

---

## 6. Run your script with Node

Back in your terminal (make sure you’re still inside `node-hello-world`), run:

```bash
node index.js
```

You should see:

```text
What up, world!
```

If you see that message, you’ve successfully run JavaScript with Node.

If you get an error like “Cannot find module” or “ENOENT: no such file or directory,” double‑check:

- That you are in the `node-hello-world` folder
- That the file is really named `index.js` (not `index.js.txt`)

---

## 7. What to turn in

For this homework, you should be able to show:

- Your `package.json` file (created by `npm init -y`)
- Your `index.js` file that logs `"What up, world!"` (or another custom message)
- A screenshot or recording of your terminal showing:
  - `node -v` and `npm -v`
  - Running `node index.js` and printing your message

---

## 8. Ideas to try next

Once you have `"What up, world!"` working, challenge yourself to extend your Node program in any way you’d like.

You don’t need to submit these extra experiments, but exploring your own ideas is the best way to get comfortable with running JavaScript in Node.
