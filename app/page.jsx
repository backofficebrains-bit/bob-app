"use client";

import { useMemo, useState } from "react";
import { analyzeCareerDna, COMPANY_KNOWLEDGE_BASE } from "@/lib/careerDna";

const sampleResume = `Wells Fargo, Bangalore — Senior Operations Analyst (2020-Present)
Managed FX confirmations, SWIFT MT300 repair queues and nostro reconciliation breaks.
Resolved settlement exceptions with counterparties and monitored CLS cut-off queues.
Prepared daily risk controls, aging reports and escalation commentary for trade lifecycle issues.

Accenture, Bengaluru — Process Specialist (2018-2020)
Supported cash management operations, process migration and SOP creation for banking clients.
Improved exception management trackers using Excel and SQL.`;

const sampleJobDescription = `Hiring for Global Markets Operations Associate supporting FX and derivatives trade lifecycle. Responsibilities include confirmations, settlements, reconciliation, counterparty interaction, exception management, risk controls and process improvement.`;

async function readResumeFile(file) {
  if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
    return file.text();
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const buffer = await file.arrayBuffer();
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    const readableText = decoded
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return readableText.length > 120
      ? readableText
      : `PDF uploaded: ${file.name}. Mock v0.1 can accept PDFs locally, but best results need selectable PDF text or pasted resume content.`;
  }

  return file.text();
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function ReportCard({ report }) {
  const evidenceRows = Object.entries(report.assetClassEvidence).sort((a, b) => b[1] - a[1]);

  return (
    <section className="report-shell" aria-live="polite">
      <div className="report-header">
        <div>
          <p className="eyebrow">Recruiter Report Card</p>
          <h2>Career DNA Reconstruction</h2>
        </div>
        <div className="score-orb">
          <span>{report.confidenceScore}</span>
          <small>confidence</small>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Likely asset class" value={report.likelyAssetClass} hint="Highest combined signal" />
        <MetricCard label="Experience" value={report.yearsOfExperience ? `${report.yearsOfExperience} yrs` : "Needs detail"} hint="Parsed from dates / year claims" />
        <MetricCard label="Companies" value={report.companies.length ? String(report.companies.length) : "0"} hint="Known + inferred employers" />
      </div>

      <div className="report-section summary-section">
        <p className="section-kicker">Career DNA Summary</p>
        <p>{report.summary}</p>
        <strong>{report.recruiterVerdict}</strong>
      </div>

      <div className="two-column">
        <div className="report-section">
          <p className="section-kicker">Extracted Profile</p>
          <h3>Companies</h3>
          <div className="pill-row">{report.companies.length ? report.companies.map((company) => <Pill key={company}>{company}</Pill>) : <Pill>No clear company names found</Pill>}</div>
          <h3>Job Titles</h3>
          <div className="pill-row">{report.jobTitles.length ? report.jobTitles.map((title) => <Pill key={title}>{title}</Pill>) : <Pill>No clear title found</Pill>}</div>
          <h3>Locations</h3>
          <div className="pill-row">{report.locations.length ? report.locations.map((location) => <Pill key={location}>{location}</Pill>) : <Pill>No location detected</Pill>}</div>
        </div>

        <div className="report-section">
          <p className="section-kicker">Asset-Class Evidence</p>
          <div className="evidence-list">
            {evidenceRows.map(([asset, score]) => (
              <div className="evidence-row" key={asset}>
                <span>{asset}</span>
                <div className="bar"><i style={{ width: `${Math.min(100, score * 9)}%` }} /></div>
                <b>{score}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-column">
        <div className="report-section">
          <p className="section-kicker">Explicit Skills</p>
          <div className="pill-row gold">{report.explicitSkills.length ? report.explicitSkills.map((skill) => <Pill key={skill}>{skill}</Pill>) : <Pill>None directly detected</Pill>}</div>
        </div>
        <div className="report-section">
          <p className="section-kicker">Inferred Skills</p>
          <div className="pill-row blue">{report.inferredSkills.map((skill) => <Pill key={skill}>{skill}</Pill>)}</div>
        </div>
      </div>

      <div className="report-section">
        <p className="section-kicker">Responsibilities Extracted</p>
        <ul className="clean-list">
          {report.responsibilities.length ? report.responsibilities.map((item) => <li key={item}>{item}</li>) : <li>Add responsibility bullets for stronger reconstruction.</li>}
        </ul>
      </div>

      <div className="two-column">
        <div className="report-section">
          <p className="section-kicker">Reasoning</p>
          <ul className="clean-list numbered">
            {report.reasoning.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
        <div className="report-section">
          <p className="section-kicker">Recruiter Notes</p>
          <h3>Fit Signals</h3>
          <ul className="clean-list compact">{report.fitSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
          <h3>Watchouts</h3>
          <ul className="clean-list compact warning">{report.watchouts.map((watchout) => <li key={watchout}>{watchout}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription);
  const [resumeText, setResumeText] = useState(sampleResume);
  const [fileName, setFileName] = useState("Sample resume loaded");
  const [report, setReport] = useState(() => analyzeCareerDna(sampleJobDescription, sampleResume));
  const [isReading, setIsReading] = useState(false);

  const knowledgeCompanies = useMemo(() => Object.keys(COMPANY_KNOWLEDGE_BASE), []);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsReading(true);
    setFileName(file.name);
    const text = await readResumeFile(file);
    setResumeText(text);
    setIsReading(false);
  }

  function analyze() {
    setReport(analyzeCareerDna(jobDescription, resumeText));
  }

  function resetDemo() {
    setJobDescription(sampleJobDescription);
    setResumeText(sampleResume);
    setFileName("Sample resume loaded");
    setReport(analyzeCareerDna(sampleJobDescription, sampleResume));
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">BOB Career DNA Engine v0.1</p>
          <h1>Reconstruct operations exposure from career evidence — not ATS keywords.</h1>
          <p className="hero-text">
            BOB reads resume content and job history to infer likely asset class, operating model exposure, explicit skills, adjacent skills, and recruiter screening angles for banking operations talent.
          </p>
          <div className="hero-actions">
            <button onClick={analyze} className="primary-button">Analyze Career DNA</button>
            <button onClick={resetDemo} className="secondary-button">Reload demo</button>
          </div>
        </div>
        <div className="dna-card">
          <span>Mock inference mode</span>
          <strong>Company × Function × Asset Class</strong>
          <p>Premium local prototype. No candidate data leaves the browser.</p>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="input-panel">
          <div className="panel-heading">
            <span>01</span>
            <div>
              <h2>Upload Job Description</h2>
              <p>Paste target role context so BOB can compare the candidate against desk expectations.</p>
            </div>
          </div>
          <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste job description here..." />
        </div>

        <div className="input-panel">
          <div className="panel-heading">
            <span>02</span>
            <div>
              <h2>Upload Resume</h2>
              <p>Upload a PDF/text file or paste resume content directly. PDF support is local and mock-friendly for selectable text.</p>
            </div>
          </div>
          <label className="file-drop">
            <input type="file" accept=".pdf,.txt,text/plain,application/pdf" onChange={handleFileChange} />
            <strong>{isReading ? "Reading file..." : "Choose PDF or text resume"}</strong>
            <small>{fileName}</small>
          </label>
          <textarea className="resume-textarea" value={resumeText} onChange={(event) => setResumeText(event.target.value)} placeholder="Paste resume text here..." />
        </div>
      </section>

      <section className="knowledge-strip">
        <p>Internal knowledge base</p>
        <div>{knowledgeCompanies.map((company) => <Pill key={company}>{company}</Pill>)}</div>
      </section>

      <div className="sticky-analyze">
        <button onClick={analyze} className="primary-button wide">Analyze button</button>
      </div>

      <ReportCard report={report} />
    </main>
  );
}
