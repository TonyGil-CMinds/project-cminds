"use client";

import { useState } from "react";
import Link from "next/link";

interface ReportFile {
  language:    string;
  url:         string;
  file_name:   string;
  title:       string;
  description: string;
  cover_image: string;
}

interface RawReport {
  id:             string;
  title:          string;
  description:    string;
  cover_image:    string;
  published_date: string;
  files:          ReportFile[];
}

function fmtDate(raw: string) {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch { return raw; }
}

function saveAs(url: string, title: string) {
  if (!url || url === "#") return;
  const ext      = url.split("?")[0].split(".").pop()?.toLowerCase() || "pdf";
  const proxy    = `/api/download?url=${encodeURIComponent(url)}`;
  const filename = title.replace(/[^a-zA-ZÀ-ÿ0-9 _-]/g, "").trim().slice(0, 80) || "report";
  const a        = document.createElement("a");
  a.href         = proxy;
  a.download     = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ReportDetail({ report }: { report: RawReport }) {
  const [activeLang, setActiveLang] = useState(0);

  const files    = report.files ?? [];
  const file     = files[activeLang] ?? null;
  const title    = file?.title       || report.title;
  const desc     = file?.description || report.description;
  const cover    = file?.cover_image || report.cover_image;
  const dlUrl    = file?.url         || "#";
  const date     = fmtDate(report.published_date);

  return (
    <div className="rp-root">
      {/* Back nav */}
      <nav className="rp-nav">
        <Link href="/mindscope" className="rp-nav-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Mindscope
        </Link>
      </nav>

      <main className="rp-main">
        {/* Cover */}
        <div className="rp-cover-wrap">
          {cover
            ? <img src={cover} alt={title} className="rp-cover-img" />
            : <div className="rp-cover-placeholder" />
          }
        </div>

        {/* Content */}
        <div className="rp-content">
          {/* Language tabs */}
          {files.length > 1 && (
            <div className="archive-lang-tabs rp-lang-tabs">
              {files.map((f, i) => (
                <button
                  key={f.language}
                  className={`archive-lang-btn${activeLang === i ? " archive-lang-btn--active" : ""}`}
                  onClick={() => setActiveLang(i)}
                >
                  {f.language.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <p className="rp-date">{date}</p>
          <h1 className="rp-title">{title}</h1>
          <p className="rp-desc">{desc}</p>

          <div className="rp-actions">
            <button
              className="archive-download-btn"
              onClick={() => saveAs(dlUrl, title)}
              disabled={!dlUrl || dlUrl === "#"}
            >
              Save as PDF
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            <Link href={`/mindscope?report=${report.id}`} className="rp-archive-btn">
              Ver en The Archive
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
