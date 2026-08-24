# trevorreedy.com

My personal portfolio and dev blog — the site I point people to when they ask what I build.

**Live:** [trevorreedy.com](https://www.trevorreedy.com/)

---

## About

A single-page React app that collects my projects, a short about-me, and my dev
blog in one place. Built to be fast, responsive, and easy to update — adding a
project or a post is a data change, not a layout rewrite.

## Features

- **Project showcase** — each project with its stack, a summary, and links to source and live demos
- **Dev blog** — write-ups on what I've been building and what broke along the way
- **Technical skills** — grouped by languages, frameworks, tools, and AI tooling
- **Responsive layout** — built mobile-first, works from phone to desktop
- **Interactive touches** — small easter eggs for anyone who pokes around

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React (Create React App) |
| Styling | Custom CSS |
| Hosting | Vercel |
| Domain | trevorreedy.com |

## Running Locally

```bash
git clone https://github.com/TrevorReedy/trevorreedy-portfollio.git
cd trevorreedy-portfollio
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000) with hot reload.

To build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── App.js            Main layout, routing, project data
├── AboutMe.js        Bio and skills sections
├── BlogPostPage.js   Blog post rendering
└── App.css           Global styles
public/
├── icons/            Tech stack icons
└── index.html
```

## Contact

- **Portfolio** — [trevorreedy.com](https://www.trevorreedy.com/)
- **LinkedIn** — [trevor-reedy](https://www.linkedin.com/in/trevor-reedy-244711207/)
- **Email** — trevinator001@gmail.com

## License

MIT
