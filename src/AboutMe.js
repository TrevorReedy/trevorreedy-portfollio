export default function AboutMe() {
  const courses = [
    "Data Structures",
    "Algorithms",
    "Mobile Development",
    "Computer Architecture",
    "Object-Oriented Design and Implementation",
    "Operating Systems",
    "Databases",
    "Machine Learning",
    "Programming Languages",
  ];

  const skillGroups = [
    {
      title: "Programming Languages",
      skills: ["Java", "JavaScript", "TypeScript", "Python", "Kotlin", "SQL", "HTML", "CSS"],
    },
    {
      title: "Technologies & Frameworks",
      skills: ["React", "Next.js", "Node.js", "Supabase", "Tailwind CSS", "Git", "GitHub"],
    },
    {
      title: "Developer Tools",
      skills: ["VS Code", "IntelliJ IDEA", "Android Studio", "Vercel", "Chrome DevTools"],
    },
    {
      title: "AI Tools",
      skills: ["ChatGPT", "GitHub Copilot", "Claude"],
    },
  ];

  return (
    <section className="projects-section about-section" id="about">
      <div className="section-content">
        <h2>About Me</h2>

        <div className="about-grid">
          <article className="project-card about-profile-card">
            <h3>Trevor Reedy</h3>

            <p className="about-subtitle">
              Computer Science Student — Metropolitan State University
            </p>

            <p>
              I am a Computer Science student at Metropolitan State University
              working toward a career in software engineering. My experience
              includes building web applications, browser extensions, Java
              applications, and simulation tools using languages such as Java,
              JavaScript, Python, and SQL.
            </p>

            <p>
              I enjoy creating practical software that solves real problems,
              especially tools that improve workflows, automate repetitive tasks,
              or make technical information easier to understand. My current
              interests include full-stack development, applied AI, web
              performance, and building polished projects that can grow into
              professional portfolio pieces.
            </p>

            <p>
              I am continuing to strengthen my software engineering skills
              through coursework, independent projects, and hands-on development
              experience.
            </p>
          </article>
        </div>

        <div className="about-content-block">
          <article className="project-card about-table-card">
            <h3>Relevant Coursework</h3>

            <div className="about-table-wrapper">
              <table className="about-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Course Title</th>
                  </tr>
                </thead>

              
              </table>
            </div>
          </article>
        </div>

        <div className="about-content-block">
          <h2>Technical Skills</h2>

          <div className="projects-grid">
            {skillGroups.map((group) => (
              <article className="project-card" key={group.title}>
                <h3>{group.title}</h3>

                <div className="tech-tags">
                  {group.skills.map((skill) => (
                    <span className="tech-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}