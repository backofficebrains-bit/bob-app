export const OPERATIONS_QUEUES = [
  {
    id: "FX-CLS-001",
    sourceSystem: "Murex MX.3",
    assetClass: "FX Spot",
    lifecycleStage: "Settlement",
    tradeId: "MX-785431",
    counterparty: "Barclays London",
    currencyPair: "USD/INR",
    notional: 12500000,
    valueDate: "2026-06-03",
    issue: "CLS settlement held because counterparty SSI BIC is missing from the outbound MT300 confirmation.",
    symptoms: ["MT300 validation failed", "SSI enrichment missing BIC", "CLS cut-off in 42 minutes"],
    availableData: {
      nostro: "WFBIUS6SXXX",
      counterpartyBic: "BARCGB22XXX",
      settlementAccount: "INR-CLS-4471",
      confirmationStatus: "Unmatched",
      cashProjection: "Funded"
    },
    manualMinutes: 28,
    riskWeight: 92
  },
  {
    id: "EQ-FAIL-014",
    sourceSystem: "Custody Fails Queue",
    assetClass: "Equities",
    lifecycleStage: "Reconciliation",
    tradeId: "EQ-441909",
    counterparty: "Goldman Sachs",
    currencyPair: "USD",
    notional: 840000,
    valueDate: "2026-06-03",
    issue: "Depot position break after settlement affirmation; broker quantity differs from internal booking.",
    symptoms: ["Position mismatch", "Broker query pending", "No cash impact yet"],
    availableData: {
      internalQuantity: "18,000",
      brokerQuantity: "17,000",
      isin: "US0378331005",
      confirmationStatus: "Affirmed"
    },
    manualMinutes: 35,
    riskWeight: 74
  },
  {
    id: "OTC-CFM-009",
    sourceSystem: "MarkitWire / Murex",
    assetClass: "Rates Swap",
    lifecycleStage: "Confirmation",
    tradeId: "IRS-229801",
    counterparty: "JPMorgan Chase",
    currencyPair: "GBP",
    notional: 50000000,
    valueDate: "2026-06-04",
    issue: "OTC confirmation remains unmatched because floating-rate reset convention differs between MarkitWire and Murex.",
    symptoms: ["Economic mismatch", "Reset convention mismatch", "T+1 confirmation SLA at risk"],
    availableData: {
      murexReset: "GBP-SONIA-OIS Compound",
      streetReset: "GBP-SONIA Compounded Index",
      paymentFrequency: "Annual",
      confirmationStatus: "Unmatched"
    },
    manualMinutes: 46,
    riskWeight: 88
  }
];

const CONTROL_CATALOG = {
  settlement: [
    "Verify value date is today and cash projection is funded before release.",
    "Validate enriched SSI BIC against approved counterparty static data.",
    "Retain maker-checker audit evidence for the repaired MT300."
  ],
  reconciliation: [
    "Do not auto-book quantity or cash changes without broker evidence.",
    "Open broker query and tag the break as no-cash-impact until validated.",
    "Escalate if aging crosses same-day settlement cut-off."
  ],
  confirmation: [
    "Compare economic fields only; avoid legal text mutation in automation mode.",
    "Route convention mismatch to authorized confirmer for four-eyes approval.",
    "Capture Murex and platform values for audit replay."
  ]
};

const ACTION_LIBRARY = {
  settlement: [
    "Enriched counterparty SSI BIC from approved static data cache.",
    "Regenerated outbound MT300 payload for the same trade ID.",
    "Queued maker-checker review with CLS cut-off priority flag."
  ],
  reconciliation: [
    "Created broker query pack with internal versus street quantity evidence.",
    "Classified break as position-only pending broker response.",
    "Parked auto-adjustment because source-of-truth evidence is incomplete."
  ],
  confirmation: [
    "Mapped equivalent SONIA reset convention labels across Murex and MarkitWire.",
    "Prepared economic-field amendment note for confirmer approval.",
    "Attached before-and-after field comparison for audit review."
  ]
};

function getQueueType(queueItem) {
  const stage = queueItem.lifecycleStage.toLowerCase();
  if (stage.includes("settlement")) return "settlement";
  if (stage.includes("reconciliation")) return "reconciliation";
  return "confirmation";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function runFirstEngagement(queueItem = OPERATIONS_QUEUES[0]) {
  const queueType = getQueueType(queueItem);
  const confidence = Math.min(96, 64 + queueItem.symptoms.length * 6 + Object.keys(queueItem.availableData).length * 3);
  const autoExecutable = queueType === "settlement" && confidence >= 82 && Boolean(queueItem.availableData.counterpartyBic);
  const tokenCostUsd = 0.018;
  const hourlyOpsCostUsd = 42;
  const minutesSaved = autoExecutable ? queueItem.manualMinutes - 4 : Math.round(queueItem.manualMinutes * 0.45);
  const valueSavedUsd = (minutesSaved / 60) * hourlyOpsCostUsd;

  return {
    queueType,
    confidence,
    autoExecutable,
    status: autoExecutable ? "First Engagement Ready" : "Human Approval Required",
    mission: autoExecutable
      ? `BOB can repair ${queueItem.tradeId}, rebuild the outbound confirmation, and route it for maker-checker release before cut-off.`
      : `BOB can package ${queueItem.tradeId} for faster human approval, but should not mutate books automatically yet.`,
    actions: ACTION_LIBRARY[queueType],
    controls: CONTROL_CATALOG[queueType],
    auditTrail: [
      `Source: ${queueItem.sourceSystem}`,
      `Trade: ${queueItem.tradeId} / ${queueItem.counterparty}`,
      `Exposure: ${formatCurrency(queueItem.notional)} ${queueItem.assetClass}`,
      `Decision: ${autoExecutable ? "automation proposed with four-eyes release" : "automation stopped at evidence pack"}`
    ],
    economics: {
      manualMinutes: queueItem.manualMinutes,
      bobMinutes: autoExecutable ? 4 : Math.max(6, Math.round(queueItem.manualMinutes * 0.55)),
      minutesSaved,
      tokenCostUsd,
      valueSavedUsd: Number(valueSavedUsd.toFixed(2)),
      roiMultiple: Number((valueSavedUsd / tokenCostUsd).toFixed(0))
    }
  };
}

export function getFirstEngagementCandidate(queues = OPERATIONS_QUEUES) {
  return [...queues].sort((a, b) => b.riskWeight - a.riskWeight)[0];
}
