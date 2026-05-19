import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Matter from "matter-js";
import "./App.css";
import BlogPostPage from "./BlogPostPage.js";

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
  "jest.svg",
  "aws.svg",
  "nextjs.svg",
  "supabase.svg",
];

export const PROJECTS = [
  {
    slug: "ziggit", 
    name: "ZigGit",
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
    {
    slug: "the-finals-combat-simulator",
    name: "The Finals FPS Combat Simulator",
    description: "A simulator for the FPS game The Finals to help players understand the complex combat mechanics and optimize their strategies",
    technologies: ["Javascript", "Jest"],
    githubUrl: "https://github.com/TrevorReedy/FinalsCombatSim",
    blog: {
      owner: "TrevorReedy",
      repo: "FinalsCombatSim",
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

  const [iconsLoaded, setIconsLoaded] = useState(false);

  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const isFallingRef = useRef(false);

  const scrollTimeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);

  // Repulsion field function - gently pushes icons away from edges
  const applyRepulsion = (body, screenWidth, screenHeight) => {
    const margin = 90; // Start pushing when within 90px of edge
    const maxForce = 0.6; // Maximum push strength
    
    const x = body.position.x;
    const y = body.position.y;
    
    let forceX = 0;
    let forceY = 0;
    
    // Left edge repulsion
    if (x < margin) {
      const strength = maxForce * (1 - x / margin);
      forceX += strength;
    }
    // Right edge repulsion
    else if (x > screenWidth - margin) {
      const strength = maxForce * (1 - (screenWidth - x) / margin);
      forceX -= strength;
    }
    
    // Top edge repulsion
    if (y < margin) {
      const strength = maxForce * (1 - y / margin);
      forceY += strength;
    }
    // Bottom edge repulsion
    else if (y > screenHeight - margin) {
      const strength = maxForce * (1 - (screenHeight - y) / margin);
      forceY -= strength;
    }
    
    // Apply the push force
    if (forceX !== 0 || forceY !== 0) {
      Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
    }
  };



  const getIconsPerRow = (width) => {
    if (width < 480) return 3;
    if (width < 900) return 4;
    return 5;
  };

  const getIconSize = (containerWidth, iconsPerRow) => {
  const padding = containerWidth * 0.12; // matches 6vw each side in CSS
  const gapTotal = (iconsPerRow - 1) * 16 ; // ~16px gap between icons
  const size = (containerWidth - padding - gapTotal) / (iconsPerRow + 5);
    return Math.max(48, Math.min(160, size));
  };
  const buildRandomRows = (container, iconNames, iconsPerRow, iconSize) => {
    const iconElements = [];

    // Shuffle a copy so the original ICONS array stays untouched
    const shuffled = [...iconNames].sort(() => Math.random() - 0.5);

    let i = 0;
    while (i < shuffled.length) {
        // Vary row size ±1 around iconsPerRow, clamped so we don't overshoot
        const remaining = shuffled.length - i;
        const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const rowSize = Math.min(Math.max(iconsPerRow + variance, 1), remaining);

        const row = document.createElement("div");
        row.className = "icon-row";

        const rowIcons = shuffled.slice(i, i + rowSize);

        rowIcons.forEach((iconName) => {
            const icon = document.createElement("img");
            icon.src = `/icons/${iconName}`;
            icon.title = iconName.replace(".svg", "");
            icon.className = "icon icon-layout-probe";

            if (iconName === "zig.svg") {
                icon.style.width = `${Math.round(iconSize * 2.86)}px`;
                icon.style.height = `${iconSize * 0.35}px`;
            } else {
                icon.style.width = `${iconSize}px`;
                icon.style.height = `${iconSize}px`;
            }

            row.appendChild(icon);
            iconElements.push({ iconName, img: icon });
        });

        container.appendChild(row);
        i += rowSize;
    }

    return iconElements;
};

  const buildEvenIconRows = (container, iconNames, iconsPerRow, iconSize) => {
    const iconElements = [];

    for (let i = 0; i < iconNames.length; i += iconsPerRow) {
      const row = document.createElement("div");
      row.className = "icon-row";

      const rowIcons = iconNames.slice(i, i + iconsPerRow);

      rowIcons.forEach((iconName) => {
        const icon = document.createElement("img");
        icon.src = `/icons/${iconName}`;
        icon.title = iconName.replace(".svg", "");
        icon.className = "icon icon-layout-probe";

        // Dynamic size — overrides the CSS constant via higher specificity
        if (iconName === "zig.svg") {
          icon.style.width = `${Math.round(iconSize * 2.86)}px`;
          icon.style.height = `${iconSize * 0.35}px`;
        } else {
          icon.style.width = `${iconSize}px`;
          icon.style.height = `${iconSize}px`;
        }

        row.appendChild(icon);
        iconElements.push({ iconName, img: icon });
      });

      container.appendChild(row);
    }

    return iconElements;
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
    const mobile = window.innerWidth < 768;

    console.log("Viewport / icon layout debug:", {
    windowInnerWidth: window.innerWidth,
    windowInnerHeight: window.innerHeight,
    containerWidth: cw,
    containerHeight: ch,
    mobile,
  });
    const iconsPerRow = getIconsPerRow(cw);
    const iconSize = getIconSize(cw, iconsPerRow);
    const iconElements = mobile ? buildEvenIconRows(container, ICONS, iconsPerRow, iconSize) : buildRandomRows(container, ICONS, iconsPerRow, iconSize);
    const containerRect = container.getBoundingClientRect();

    const positionedIcons = iconElements.map(({ iconName, img }) => {
      const rect = img.getBoundingClientRect();

      return {
        iconName,
        img,
        pos: {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        },
        visualWidth: rect.width,
        visualHeight: rect.height,
      };
    });

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const runner = Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;

    const newBodies = [];

    positionedIcons.forEach(({ iconName, img: icon, pos, visualWidth, visualHeight }, index) => {
      icon.classList.remove("icon-layout-probe");

      const radius = Math.max(visualWidth, visualHeight) / 2;

      icon.style.left = `${pos.x - visualWidth / 2}px`;
      icon.style.top = `${pos.y - visualHeight / 2}px`;

      let body;
      if (mobile) {
        // On mobile: enable collisions with walls but not with other bodies
        // We do this by setting collisionFilter to only collide with walls
        body = Bodies.circle(pos.x, pos.y, radius, {
          // restitution is lower on mobile to reduce bouncing and make it feel more grounded
          restitution: 0.9,
          frictionAir: 0.05,
          friction: 0.0005,
          density: 0.6,
          collisionFilter: {
            category: 0x0001,
            mask: 0x0002, // Only collide with walls (category 0x0002)
          },
          render: { visible: false },
        });
      } else {
        body = Bodies.circle(pos.x, pos.y, radius, {
          //restitution = bounciness, we can make it higher on desktop for a more playful feel since performance is better and it can handle the extra collisions
          restitution: 0.8,
          frictionAir: 0.001, //was 0.8 but that felt very stiff
          friction: 0.0005,
          density: 0.1,
          render: { visible: false },
        });
      }

      World.add(engine.world, body);
      newBodies.push({
        img: icon,
        body,
        originalPosition: { x: pos.x, y: pos.y },
        visualWidth,
        visualHeight,
        floatPhase: index * 0.7,
        floatDistance: 8 + (index % 4) * 2,
      });
    });

    bodiesRef.current = newBodies;
    setIconsLoaded(true);

    const heroBody = Bodies.rectangle(cw / 2, ch / 2, 400, 200, {
      isStatic: true,
      render: { visible: false },
    });
    World.add(engine.world, heroBody);

    const wallThickness = 100;
    // Assign category 0x0002 to walls so mobile bodies can collide with them
    const boundaries = [
      Bodies.rectangle(cw / 2, ch + wallThickness / 2, cw * 2, wallThickness, {
        isStatic: true,
        collisionFilter: { category: 0x0002 },
        render: { visible: false },
      }),
      Bodies.rectangle(cw / 2, -wallThickness / 2, cw * 2, wallThickness, {
        isStatic: true,
        collisionFilter: { category: 0x0002 },
        render: { visible: false },
      }),
      Bodies.rectangle(-wallThickness / 2, ch / 2, wallThickness, ch * 2, {
        isStatic: true,
        collisionFilter: { category: 0x0002 },
        render: { visible: false },
      }),
      Bodies.rectangle(cw + wallThickness / 2, ch / 2, wallThickness, ch * 2, {
        isStatic: true,
        collisionFilter: { category: 0x0002 },
        render: { visible: false },
      }),
    ];
    World.add(engine.world, boundaries);
    
    // Run physics on both mobile and desktop
    Runner.run(runner, engine);

    const lastMovingAt = new WeakMap();

    const LIN_EPS = 0.20;
    const ANG_EPS = 0.04;
    const MAX_TURN = 0.03;
    const TURN_GAIN = 0.08;
    const ANG_DAMP = 0.90;
    const ANGLE_SNAP = 0.01;

    const updatePositions = () => {
      const now = performance.now();

      // Apply repulsion field to all bodies to prevent bunching at edges
      newBodies.forEach(({ body }) => {
        applyRepulsion(body, cw, ch);
      });

      newBodies.forEach(({ img, body, visualWidth, visualHeight, floatPhase, floatDistance }) => {
        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        const angSpeed = Math.abs(body.angularVelocity);

        if (speed > LIN_EPS || angSpeed > ANG_EPS) lastMovingAt.set(body, now);
        if (!lastMovingAt.has(body)) lastMovingAt.set(body, now);

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

        const floatOffset = Math.sin(now / 900 + floatPhase) * floatDistance;
        img.style.transform = `rotate(${body.angle}rad)`;
        img.style.translate = `0 ${floatOffset}px`;

        img.style.left = `${body.position.x - visualWidth / 2}px`;
        img.style.top = `${body.position.y - visualHeight / 2}px`;
        
        if (isFallingRef.current) {
          img.classList.add("falling");
        } else {
          img.classList.remove("falling");
        }
      });

      requestAnimationFrame(updatePositions);
    };

    updatePositions();

    const currentContainer = container;
    
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
      if (currentContainer) {
        while (currentContainer.firstChild) {
          currentContainer.removeChild(currentContainer.firstChild);
        }
      }
      bodiesRef.current = [];
    };
  }, []);

useEffect(() => {
  const Body = Matter.Body;
  let scrollTimer;
  let lastScrollTriggerTime = 0;
  let isBufferActive = false;
  let bufferTimeout = null;

  const handleScroll = () => {
    const engine = engineRef.current;
    const bodies = bodiesRef.current;
    if (!engine || bodies.length === 0) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollYRef.current;
    lastScrollYRef.current = currentScrollY;
    
    if (Math.abs(scrollDelta) < 3) return;

    // TIME BUFFER: Check if we're in cooldown period
    const now = Date.now();
    if (isBufferActive || (now - lastScrollTriggerTime) < 500) {
      // Still in buffer period, ignore this scroll
      return;
    }

    // First scroll after buffer - trigger movement
    lastScrollTriggerTime = now;
    isBufferActive = true;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    isFallingRef.current = true;
    engine.gravity.y = 0;

    // Apply kick to all icons
    bodies.forEach(({ body }, index) => {
      const kick = 5;
      const direction = scrollDelta > 0 ? 1 : -1;
      const xPush = Math.sin(index * 1.7 + currentScrollY * 0.01) * kick * 0.45;
      const yPush = direction * (1.8 + (index % 4) * 0.35);

      Body.setVelocity(body, {
        x: Math.max(-kick, Math.min(kick, body.velocity.x + xPush)),
        y: Math.max(-kick, Math.min(kick, body.velocity.y + yPush)),
      });

      const added = Math.cos(index * 1.3 + currentScrollY * 0.01) * 0.018;
      const cap = 0.12;
      Body.setAngularVelocity(body, Math.max(-cap, Math.min(cap, body.angularVelocity + added)));
    });

    // Clear the falling flag after 500ms
    scrollTimeoutRef.current = setTimeout(() => {
      const engineNow = engineRef.current;
      if (!engineNow) return;
      engineNow.gravity.y = 0;
      isFallingRef.current = false;
    }, 500);

    // Clear the buffer after 500ms (allows next scroll to trigger again)
    if (bufferTimeout) clearTimeout(bufferTimeout);
    bufferTimeout = setTimeout(() => {
      isBufferActive = false;
      bufferTimeout = null;
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
    if (bufferTimeout) clearTimeout(bufferTimeout);
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