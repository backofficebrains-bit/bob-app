"use client";

import { useMemo, useState } from "react";
import { getFirstEngagementCandidate, OPERATIONS_QUEUES, runFirstEngagement } from "@/lib/bobOps";

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

function ExecutiveCard({ role, title, children }) {
  return (
    <article className="dna-card executive-card">
      <span>[{role}]</span>
      <strong>{title}</strong>
      <p>{children}</p>
    </article>
  );
}

function QueueCard({ item, selected, onSelect }) {
  return (
    <button className={`queue-card ${selected ? "selected" : ""}`} onClick={() => onSelect(item.id)} type="button">
      <span>{item.id}</span>
      <strong>{item.tradeId}</strong>
      <small>{item.lifecycleStage} · {item.assetClass} · risk {item.riskWeight}</small>
      <p>{item.issue}</p>
    </button>
  );
}

function EngagementReport({ queueItem, report }) {
  return (
    <section className="report-shell" aria-live="polite">
      <div className="report-header">
        <div>
          <p className="eyebrow">BOB First Engagement</p>
          <h2>{report.status}</h2>
        </div>
        <div className="score-orb">
          <span>{report.confidence}</span>
          <small>control confidence</small>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Trade selected" value={queueItem.tradeId} hint={`${queueItem.sourceSystem} queue`} />
        <MetricCard label="Minutes saved" value={`${report.economics.minutesSaved} min`} hint={`${report.economics.manualMinutes} min manual baseline`} />
        <MetricCard label="ROI proof" value={`${report.economics.roiMultiple}x`} hint={`$${report.economics.valueSavedUsd} labor value / $${report.economics.tokenCostUsd} token cost`} />
      </div>

      <div className="report-section summary-section">
        <p className="section-kicker">Execution Decision</p>
        <p>{report.mission}</p>
        <strong>{report.autoExecutable ? "Proceed: automation can complete the repair with maker-checker release." : "Stop: package evidence for human approval before book mutation."}</strong>
      </div>

      <div className="two-column">
        <div className="report-section">
          <p className="section-kicker">CTO Automation Runbook</p>
          <ul className="clean-list numbered">
            {report.actions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        </div>
        <div className="report-section">
          <p className="section-kicker">CFO Risk Controls</p>
          <ul className="clean-list warning">
            {report.controls.map((control) => <li key={control}>{control}</li>)}
          </ul>
        </div>
      </div>

      <div className="two-column">
        <div className="report-section">
          <p className="section-kicker">Audit Trail</p>
          <ul className="clean-list compact">
            {report.auditTrail.map((entry) => <li key={entry}>{entry}</li>)}
          </ul>
        </div>
        <div className="report-section">
          <p className="section-kicker">Available Data</p>
          <div className="pill-row blue">
            {Object.entries(queueItem.availableData).map(([key, value]) => <Pill key={key}>{key}: {value}</Pill>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const firstCandidate = useMemo(() => getFirstEngagementCandidate(), []);
  const [selectedId, setSelectedId] = useState(firstCandidate.id);
  const selectedQueueItem = OPERATIONS_QUEUES.find((item) => item.id === selectedId) || firstCandidate;
  const report = useMemo(() => runFirstEngagement(selectedQueueItem), [selectedQueueItem]);

  return (
    <main className="app-shell">
      <section className="hero-panel glass-card">
        <div className="hero-copy">
          <p className="eyebrow">Back Office Brains · IB Ops Automation</p>
          <h1>BOB is now a first-engagement command center.</h1>
          <p className="hero-lede">
            Pick a live-style operations break, let BOB triage the Murex or trade-lifecycle evidence, and prove a controlled automation outcome with ROI in one screen.
          </p>
          <div className="hero-actions">
            <a href="#engagement" className="primary-action">Run first engagement</a>
            <a href="#queue" className="secondary-action">Review queue</a>
          </div>
        </div>
        <div className="hero-orb" aria-label="BOB automation status">
          <span>BOB</span>
          <small>Execution mode</small>
        </div>
      </section>

      <section className="dna-grid">
        <ExecutiveCard role="CEO" title="Immediate next step">
          Execute the highest-risk queue item first, then freeze scope until one controlled trade-lifecycle repair is demonstrably ready for release.
        </ExecutiveCard>
        <ExecutiveCard role="CTO" title="Automation built">
          Dummy Murex-style queues, deterministic triage logic, action runbooks, and audit output are wired locally for repeatable demos.
        </ExecutiveCard>
        <ExecutiveCard role="CFO" title="Risk and ROI proof">
          Every proposed action includes maker-checker controls, mutation limits, minutes saved, token cost, and ROI multiple before deployment.
        </ExecutiveCard>
      </section>

      <section id="queue" className="workspace-grid">
        <div className="input-panel glass-card">
          <div className="panel-heading">
            <span>01</span>
            <div>
              <h2>Operations queue</h2>
              <p>Select the break BOB should attempt. The default is the highest risk-weighted candidate for first engagement.</p>
            </div>
          </div>
          <div className="queue-list">
            {OPERATIONS_QUEUES.map((item) => (
              <QueueCard item={item} key={item.id} onSelect={setSelectedId} selected={item.id === selectedId} />
            ))}
          </div>
        </div>

        <div className="input-panel glass-card">
          <div className="panel-heading">
            <span>02</span>
            <div>
              <h2>Selected trade evidence</h2>
              <p>BOB reads the operational symptoms and available static data before proposing any book-impacting action.</p>
            </div>
          </div>
          <div className="trade-ticket">
            <Pill>{selectedQueueItem.assetClass}</Pill>
            <Pill>{selectedQueueItem.lifecycleStage}</Pill>
            <Pill>{selectedQueueItem.valueDate}</Pill>
            <h3>{selectedQueueItem.tradeId} · {selectedQueueItem.counterparty}</h3>
            <p>{selectedQueueItem.issue}</p>
            <ul className="clean-list compact">
              {selectedQueueItem.symptoms.map((symptom) => <li key={symptom}>{symptom}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div id="engagement" className="sticky-analyze glass-card">
        <div className="standup-strip">
          <strong>[CEO]</strong> Execute selected queue item.
          <strong>[CTO]</strong> Run deterministic BOB triage.
          <strong>[CFO]</strong> Validate controls and ROI before release.
        </div>
      </div>

      <EngagementReport queueItem={selectedQueueItem} report={report} />
    </main>
  );
}
