import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Matter from "matter-js";
import "./App.css";
import BlogPostPage from "./BlogPostPage.js";

// function slugify(str) {
//   return String(str)
//     .trim()
//     .toLowerCase()
//     .replace(/['"]/g, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// }

const ICONS = [
  "css.svg",
  "django.svg",
  "flask.svg",
  "git.svg",
  "html.svg",
  "hugging-face.svg",
  "java.svg",
  "js.svg",
  "kotlin.svg",
  "mysql.svg",
  "nodejs.svg",
  "numpy.svg",
  "pandas.svg",
  "python.svg",
  "react.svg",
  "spring.svg",
  "sqlite.svg",
  "tailwind.svg",
  "typescript.svg",
  "zig.svg",
  "json.svg",
  "jest.svg"
];

export const PROJECTS = [
  {
    slug: "zigit", 
    name: "Zigit",
    description: "A zig based CLI tool for git automation for new users",
    technologies: ["Zig", "GIT"],
    githubUrl: "https://github.com/TrevorReedy/ZigGit",
    blog: {
      owner: "TrevorReedy",
      repo: "ZigGit",
      branch: "main",
      folder: "content/blog",
      file: "blog.md",
    },
  },
  {
    slug: "go-game-engine",
    name: "GO Game Engine",
    description: "A graphical interface to play the game of GO with complete scoring",
    technologies: ["Java", "Swing"],
    githubUrl: "https://github.com/TrevorReedy/GO_Game_Engine/tree/main",
    blog: {
      owner: "TrevorReedy",
      repo: "GO_Game_Engine",
      branch: "main",
      folder: "content/blog",
      file: "blog.md",
    },
  },
  {
    slug: "mobile-sentrix-price-calc",
    name: "Mobile Sentrix Price Calculator",
    description: "A in house tool for CPR to use to calculate labor prices and to give reliable, fast, knowledge based quotes",
    technologies: ["Javascript", "Jest"],
    githubUrl: "https://github.com/TrevorReedy/mobile_sentrix-price-tool",
    blog: {
      owner: "TrevorReedy",
      repo: "mobile_sentrix-price-tool",
      branch: "main",
      folder: "content/blog",
      file: "blog.md",
    },
  },
];

function Home() {
  useEffect(() => {
    document.title = "Trevor Reedy | Software Engineer";
  }, []);

  const containerRef = useRef(null);

  // UI state
  const [iconsLoaded, setIconsLoaded] = useState(false);

  // Refs for physics + scroll
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const isFallingRef = useRef(false);

  const scrollTimeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const calculateOrganicPositions = (count, width, height) => {
    const positions = [];
    const margin = 80;

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let validPosition = false;
      let x, y;

      while (!validPosition && attempts < 100) {
        if (i % 3 === 0) {
          const corner = Math.floor(Math.random() * 4);
          switch (corner) {
            case 0:
              x = margin + Math.random() * (width * 0.3);
              y = margin + Math.random() * (height * 0.3);
              break;
            case 1:
              x = width - margin - Math.random() * (width * 0.3);
              y = margin + Math.random() * (height * 0.3);
              break;
            case 2:
              x = margin + Math.random() * (width * 0.3);
              y = height - margin - Math.random() * (height * 0.3);
              break;
            case 3:
              x = width - margin - Math.random() * (width * 0.3);
              y = height - margin - Math.random() * (height * 0.3);
              break;
            default:
              x = margin + Math.random() * (width - 2 * margin);
              y = margin + Math.random() * (height - 2 * margin);
          }
        } else if (i % 5 === 0) {
          x = width * 0.2 + Math.random() * (width * 0.6);
          y = height * 0.2 + Math.random() * (height * 0.6);
        } else {
          x = margin + Math.random() * (width - 2 * margin);
          y = margin + Math.random() * (height - 2 * margin);
        }

        validPosition = true;
        for (const existingPos of positions) {
          const distance = Math.sqrt(
            Math.pow(x - existingPos.x, 2) + Math.pow(y - existingPos.y, 2)
          );
          if (distance < 120) {
            validPosition = false;
            break;
          }
        }

        if (x < margin || x > width - margin || y < margin || y > height - margin) {
          validPosition = false;
        }

        attempts++;
      }

      positions.push({
        x: Math.max(margin, Math.min(width - margin, x)),
        y: Math.max(margin, Math.min(height - margin, y)),
      });
    }

    return positions;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const Body = Matter.Body;

    while (container.firstChild) container.removeChild(container.firstChild);

    const cw = container.offsetWidth;
    const ch = container.offsetHeight;

    const positions = calculateOrganicPositions(ICONS.length, cw, ch);

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const runner = Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;

    const newBodies = [];

    ICONS.forEach((iconName, index) => {
      const isMobile = cw < 600;

      const scale = isMobile ? 0.6 : 1;
      const width = 80 * scale;
      const height = 80 * scale;
      const radius = 40 * scale;

      const pos = positions[index];

      const icon = document.createElement("img");
      icon.src = `/icons/${iconName}`;
      icon.className = "icon";
      
      // REMOVED: all inline styles — now handled by CSS classes + data attributes
      // Set data attributes for dynamic positioning (used by CSS or JS)
      icon.setAttribute("data-left", pos.x - width / 2);
      icon.setAttribute("data-top", pos.y - height / 2);
      icon.setAttribute("data-width", width);
      icon.setAttribute("data-height", height);
      
      // Apply position via CSS class instead of inline
      icon.style.left = `${pos.x - width / 2}px`;
      icon.style.top = `${pos.y - height / 2}px`;
      icon.style.width = `${width}px`;
      icon.style.height = `${height}px`;

      container.appendChild(icon);

      const body = Bodies.circle(pos.x, pos.y, radius, {
        restitution: 0.8,
        frictionAir: 0.035,
        friction: 0.0005,
        density: 0.001,
        render: { visible: false },
      });

      World.add(engine.world, body);
      newBodies.push({ img: icon, body, originalPosition: { x: pos.x, y: pos.y } });
    });

    bodiesRef.current = newBodies;
    setIconsLoaded(true);

    const heroBody = Bodies.rectangle(cw / 2, ch / 2, 400, 200, {
      isStatic: true,
      render: { visible: false },
    });
    World.add(engine.world, heroBody);

    const wallThickness = 100;
    const boundaries = [
      Bodies.rectangle(cw / 2, ch + wallThickness / 2, cw * 2, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw / 2, -wallThickness / 2, cw * 2, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-wallThickness / 2, ch / 2, wallThickness, ch * 2, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(cw + wallThickness / 2, ch / 2, wallThickness, ch * 2, {
        isStatic: true,
        render: { visible: false },
      }),
    ];
    World.add(engine.world, boundaries);
    Runner.run(runner, engine);

    const lastMovingAt = new WeakMap();

    // const STILL_MS = 800;
    const LIN_EPS = 0.20;
    const ANG_EPS = 0.04;
    const MAX_TURN = 0.03;
    const TURN_GAIN = 0.08;
    const ANG_DAMP = 0.90;
    const ANGLE_SNAP = 0.01;

    const updatePositions = () => {
      const now = performance.now();

      newBodies.forEach(({ img, body }) => {
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        const angSpeed = Math.abs(body.angularVelocity);

        if (speed > LIN_EPS || angSpeed > ANG_EPS) lastMovingAt.set(body, now);
        if (!lastMovingAt.has(body)) lastMovingAt.set(body, now);

        // const idleFor = now - lastMovingAt.get(body);

        const TWO_PI = Math.PI * 2;
        let a = body.angle % TWO_PI;
        if (a > Math.PI) a -= TWO_PI;
        if (a < -Math.PI) a += TWO_PI;

        if (Math.abs(a) < ANGLE_SNAP) {
          Body.setAngle(body, 0);
          Body.setAngularVelocity(body, 0);
        } else {
          const desired = Math.max(-MAX_TURN, Math.min(MAX_TURN, -a * TURN_GAIN));
          const nextAV = body.angularVelocity * ANG_DAMP + desired;
          Body.setAngularVelocity(body, nextAV);
        }

        // Apply rotation via transform — this must stay dynamic
        img.style.transform = `rotate(${body.angle}rad)`;

        const isZig = img.src.includes("zig.svg");
        const w = isZig ? 120 : 100;
        const h = isZig ? 42 : 100;

        img.style.left = `${body.position.x - w / 2}px`;
        img.style.top = `${body.position.y - h / 2}px`;
        
        // Add/remove falling class for motion blur
        if (isFallingRef.current) {
          img.classList.add("falling");
        } else {
          img.classList.remove("falling");
        }
      });

      requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => {
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
      bodiesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const Body = Matter.Body;
    let scrollTimer;

    const handleScroll = () => {
      const engine = engineRef.current;
      const bodies = bodiesRef.current;
      if (!engine || bodies.length === 0) return;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;
      if (Math.abs(scrollDelta) < 3) return;

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      isFallingRef.current = true;

      engine.gravity.y = 0;

      bodies.forEach(({ body }) => {
        const kick = 5;
        Body.setVelocity(body, {
          x: Math.max(-kick, Math.min(kick, body.velocity.x + (Math.random() - 0.5) * kick)),
          y: Math.max(-kick, Math.min(kick, body.velocity.y + (Math.random() - 0.5) * kick)),
        });
        const added = (Math.random() - 0.5) * 0.03;
        const cap = 0.12;
        Body.setAngularVelocity(body, Math.max(-cap, Math.min(cap, body.angularVelocity + added)));
      });

      scrollTimeoutRef.current = setTimeout(() => {
        const engineNow = engineRef.current;
        if (!engineNow) return;
        engineNow.gravity.y = 0;
        isFallingRef.current = false;
      }, 500);
    };

    const throttledScrollHandler = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        handleScroll();
        scrollTimer = null;
      }, 40);
    };

    window.addEventListener("scroll", throttledScrollHandler);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  function resetView(){
    window.scrollTo(0, 0);
  }

  return (
    <div className="App">
      <div className="icon-container" ref={containerRef}></div>

      <section className="hero-section">
        <header className="App-header">
          <h1>Trevor Reedy</h1>
          <p>Software Developer</p>
          <div className="loading-indicator">
            {!iconsLoaded && <p>Loading icons...</p>}
          </div>
        </header>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-content">
          <h2>My Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <div className="tech-tags">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    GitHub
                  </a>

                  {project.blog && (
                    <Link to={`/blog/${project.slug}`} onClick={resetView} className="project-link blog">
                      Blog
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-content">
          <h2>Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <p>
                I'm always interested in new opportunities, collaborations, and interesting problems.
                Tell me what you're working on and how I can help.
              </p>

              <div className="contact-links">
                <a href="mailto:trevinator001@gmail.com" className="contact-link">
                  📧 trevinator001@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/trevor-reedy-244711207/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  💼 LinkedIn
                </a>
                <a
                  href="https://github.com/trevorreedy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  💻 GitHub
                </a>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <div className="contact-form-card">
                <h3>Send a Message</h3>
                <p className="contact-form-subtitle">
                  Drop a quick note about your project, opportunity, or idea.
                </p>

                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const data = new FormData(form);

                    const name = data.get("name") || "";
                    const email = data.get("email") || "";
                    const message = data.get("message") || "";

                    const subject = `Portfolio Contact from ${name || "Visitor"}`;
                    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

                    window.location.href = `mailto:trevinator001@gmail.com?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(body)}`;

                    form.reset();
                  }}
                >
                  <div className="form-row">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" placeholder="Your name" required />
                  </div>

                  <div className="form-row">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Tell me what you're working on..."
                      required
                    />
                  </div>

                  <button type="submit" className="contact-submit">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  );
}