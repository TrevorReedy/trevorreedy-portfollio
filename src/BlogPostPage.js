import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { PROJECTS } from "./App.js";

function buildRawUrl(blog) {
  const owner = blog.owner;
  const repo = blog.repo;
  const branch = blog.branch || "main";
  const folder = blog.folder ? blog.folder.replace(/^\/|\/$/g, "") : "";
  const file = blog.file;

  const path = folder ? `${folder}/${file}` : file;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

export default function BlogPostPage() {
  const { slug } = useParams();

  const project = useMemo(() => {
    return PROJECTS.find((p) => p.slug === slug);
  }, [slug]);

  const rawUrl = useMemo(() => {
    if (!project?.blog) return "";
    return buildRawUrl(project.blog);
  }, [project]);

  const [md, setMd] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      setMd("");

      if (!project) {
        setErr(`No blog mapped for slug: ${slug}`);
        setLoading(false);
        return;
      }

      if (!rawUrl) {
        setErr(`Project "${project.name}" has no blog configuration.`);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(rawUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${rawUrl}`);
        const text = await res.text();
        if (!cancelled) setMd(text);
      } catch (e) {
        if (!cancelled) setErr(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, project, rawUrl]);

  return (
    <div className="blog-page">
      <div className="blog-topbar">
        <Link to="/" className="blog-back">← Back</Link>
        {project?.name ? <div className="blog-title">{project.name}</div> : <div />}
        {rawUrl ? (
          <a className="blog-raw" href={rawUrl} target="_blank" rel="noreferrer">
            View raw
          </a>
        ) : (
          <div />
        )}
      </div>

      {loading && <p className="blog-status">Loading…</p>}

      {err && (
        <div className="blog-error">
          <h2>Blog failed to load</h2>
          <p>{err}</p>
          {project?.blog && (
            <p style={{ opacity: 0.85 }}>
              Expected raw URL:
              <br />
              <code>{rawUrl}</code>
            </p>
          )}
        </div>
      )}

      {!loading && !err && (
        <article className="blog-article">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {md}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
