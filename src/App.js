import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './App.css';

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
];

const GITHUB_PROJECTS = [
  {
    name: "Zigit",
    description: "A zig based CLI tool for git automation for new users",
    technologies: ["Zig", "GIT"],
    githubUrl: "https://github.com/TrevorReedy/ZigGit",
    liveUrl: "https://project-one.vercel.app"
  },
  {
    name: "GO Board Game",
    description: "A graphical interface to play the game of GO with complete scoring",
    technologies: ["Java", "Swing"],
    githubUrl: "https://github.com/TrevorReedy/GO_Board_Game_Java",
    liveUrl: "https://project-two.netlify.app"
  }
];

function App() {
  const containerRef = useRef(null);

  // UI state
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [isFalling, setIsFalling] = useState(false);

  // Refs for physics + scroll
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const isFallingRef = useRef(false);

  const scrollTimeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);

  // Calculate more spread out, organic positions
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
          }
        } else if (i % 5 === 0) {
          x = width * 0.2 + Math.random() * (width * 0.6);
          y = height * 0.2 + Math.random() * (height * 0.6);
        } else {
          x = margin + Math.random() * (width - 2 * margin);
          y = margin + Math.random() * (height - 2 * margin);
        }

        // Check if this position is too close to existing positions
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

        // Also ensure it's within bounds
        if (x < margin || x > width - margin || y < margin || y > height - margin) {
          validPosition = false;
        }

        attempts++;
      }

      positions.push({
        x: Math.max(margin, Math.min(width - margin, x)),
        y: Math.max(margin, Math.min(height - margin, y))
      });
    }

    return positions;
  };

  // Set up Matter.js + icons
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;

    // Clear any existing icons
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const cw = container.offsetWidth;
    const ch = container.offsetHeight;

    const positions = calculateOrganicPositions(ICONS.length, cw, ch);

    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });
    const runner = Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;

    const newBodies = [];

    ICONS.forEach((iconName, index) => {
      const isMobile = cw < 600;


// scale down on small screens
const scale = isMobile ? 0.6 : 1;

const width = 80 * scale;
const height = 80 * scale;
const radius = 40 * scale;

      const pos = positions[index];

      // DOM icon
      const icon = document.createElement('img');
      icon.src = `/icons/${iconName}`;
      icon.className = 'icon';
      icon.style.width = `${width}px`;
      icon.style.height = `${height}px`;
      icon.style.left = `${pos.x - width / 2}px`;
      icon.style.top = `${pos.y - height / 2}px`;
      icon.style.opacity = '1';
      icon.style.position = 'absolute';

      container.appendChild(icon);

      // Physics body
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

    // Add hero section protection - simple centered rectangle
    const heroBody = Bodies.rectangle(
      cw / 2,  // center X
      ch / 2,  // center Y
      400,     // width
      200,     // height
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    World.add(engine.world, heroBody);

    // Regular boundary walls
    const wallThickness = 100;
    const boundaries = [
      Bodies.rectangle(cw / 2, ch + wallThickness / 2, cw * 2, wallThickness, { 
        isStatic: true,
        render: { visible: false }
      }),
      Bodies.rectangle(cw / 2, -wallThickness / 2, cw * 2, wallThickness, { 
        isStatic: true,
        render: { visible: false }
      }),
      Bodies.rectangle(-wallThickness / 2, ch / 2, wallThickness, ch * 2, { 
        isStatic: true,
        render: { visible: false }
      }),
      Bodies.rectangle(cw + wallThickness / 2, ch / 2, wallThickness, ch * 2, { 
        isStatic: true,
        render: { visible: false }
      }),
    ];
    
    World.add(engine.world, boundaries);

    Runner.run(runner, engine);

    // Animation loop
    const updatePositions = () => {
      newBodies.forEach(({ img, body }) => {
        if (!img || !body) return;

        const isZig = img.src.includes('zig.svg');
        const width = isZig ? 120 : 100;
        const height = isZig ? 42 : 100;

        img.style.left = `${body.position.x - width / 2}px`;
        img.style.top = `${body.position.y - height / 2}px`;
        img.style.transform = `rotate(${body.angle}rad)`;

        if (isFallingRef.current) {
          const velocity = Math.sqrt(
            body.velocity.x ** 2 + body.velocity.y ** 2
          );
          const blurAmount = Math.min(velocity * 0.5 * 0.3, 10);
          img.style.filter = `blur(${blurAmount}px) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`;
        } else {
          img.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
        }
      });

      requestAnimationFrame(updatePositions);
    };

    updatePositions();

    // Cleanup
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
        const containerEl = containerRef.current;
        while (containerEl.firstChild) {
          containerEl.removeChild(containerEl.firstChild);
        }
      }

      bodiesRef.current = [];
    };
  }, []);

  // Scroll handler
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

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      isFallingRef.current = true;
      setIsFalling(true);

      engine.gravity.y = 0;

      bodies.forEach(({ body }) => {
        Body.setVelocity(body, {
          x: body.velocity.x + (Math.random() - 0.5) * 18,
          y: body.velocity.y + (Math.random() - 0.5) * 18,
        });
        Body.setAngularVelocity(
          body,
          body.angularVelocity + (Math.random() - 0.5) * 0.30
        );
      });

      scrollTimeoutRef.current = setTimeout(() => {
        const engineNow = engineRef.current;
        if (!engineNow) return;

        engineNow.gravity.y = 0;
        isFallingRef.current = false;
        setIsFalling(false);
      }, 500);
    };

    const throttledScrollHandler = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        handleScroll();
        scrollTimer = null;
      }, 40);
    };

    window.addEventListener('scroll', throttledScrollHandler);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <div className="App">
      {/* Icons created dynamically into this container */}
      <div className="icon-container" ref={containerRef}></div>

      {/* Hero Section */}
      <section className="hero-section">
        <header className="App-header">
          <h1>Trevor Reedy</h1>
          <p>Software Developer</p>
          <div style={{ marginTop: '2rem', fontSize: '1.1rem', opacity: 0.8 }}>
            {!iconsLoaded && <p>Loading icons...</p>}
          </div>
        </header>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-content">
          <h2>My Projects</h2>
          <div className="projects-grid">
            {GITHUB_PROJECTS.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
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
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link live-demo"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
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

                    const name = data.get('name') || '';
                    const email = data.get('email') || '';
                    const message = data.get('message') || '';

                    const subject = `Portfolio Contact from ${name || 'Visitor'}`;
                    const body =
                      `Name: ${name}\n` +
                      `Email: ${email}\n\n` +
                      `Message:\n${message}`;

                    window.location.href = `mailto:your.email@example.com?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(body)}`;

                    form.reset();
                  }}
                >
                  <div className="form-row">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="youremail@email.com"
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

export default App;