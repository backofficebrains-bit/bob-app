export const COMPANY_KNOWLEDGE_BASE = {
  "Wells Fargo": {
    functions: ["trade operations", "payments", "reconciliations", "settlement monitoring", "client operations"],
    assetClasses: ["FX", "Fixed Income", "Treasury Operations"],
    signals: ["nostro breaks", "counterparty follow-up", "cash movement", "exception queues"]
  },
  "State Street": {
    functions: ["fund accounting", "custody operations", "corporate actions", "middle office", "reconciliations"],
    assetClasses: ["Equities", "Fixed Income", "Derivatives"],
    signals: ["NAV support", "custody settlement", "position reconciliation", "asset servicing"]
  },
  JPMorgan: {
    functions: ["investment banking operations", "treasury services", "clearing", "trade support", "risk operations"],
    assetClasses: ["FX", "Derivatives", "Treasury Operations", "Fixed Income"],
    signals: ["trade lifecycle", "cash management", "regulatory controls", "break resolution"]
  },
  "Goldman Sachs": {
    functions: ["securities operations", "prime brokerage support", "derivatives confirmations", "collateral operations"],
    assetClasses: ["Equities", "Derivatives", "Fixed Income"],
    signals: ["confirmation matching", "margin calls", "settlement risk", "client service"]
  },
  Broadridge: {
    functions: ["post-trade processing", "proxy operations", "settlement platforms", "trade communications"],
    assetClasses: ["Equities", "Fixed Income", "Derivatives"],
    signals: ["trade enrichment", "reference data", "SWIFT messages", "post-trade workflow"]
  },
  Accenture: {
    functions: ["managed operations", "process transformation", "reconciliations", "KYC support", "operations consulting"],
    assetClasses: ["FX", "Equities", "Treasury Operations"],
    signals: ["SOP ownership", "process migration", "automation", "quality controls"]
  },
  "Deutsche Bank": {
    functions: ["global markets operations", "FX operations", "rates operations", "payments", "confirmations"],
    assetClasses: ["FX", "Derivatives", "Fixed Income", "Treasury Operations"],
    signals: ["MT300 confirmations", "CLS settlement", "rates lifecycle", "nostro reconciliation"]
  }
};

const ASSET_KEYWORDS = {
  FX: ["fx", "foreign exchange", "forex", "cls", "mt300", "currency", "nostro", "swift", "spot", "forward"],
  Equities: ["equity", "equities", "stock", "corporate action", "dividend", "custody", "prime brokerage", "ipo"],
  "Fixed Income": ["fixed income", "bond", "rates", "treasury", "coupon", "repo", "gilts", "securities lending"],
  Derivatives: ["derivative", "swap", "option", "future", "isda", "markitwire", "dtcc", "collateral", "margin"],
  "Treasury Operations": ["treasury", "cash management", "liquidity", "payments", "funding", "cash", "wire", "settlement"]
};

const SKILL_KEYWORDS = [
  "confirmations",
  "settlements",
  "reconciliation",
  "exception management",
  "trade lifecycle",
  "swift",
  "murex",
  "calypso",
  "markitwire",
  "dtcc",
  "cls",
  "nostro",
  "corporate actions",
  "fund accounting",
  "kyc",
  "reference data",
  "static data",
  "break resolution",
  "cash management",
  "payments",
  "client service",
  "risk controls",
  "regulatory reporting",
  "excel",
  "sql",
  "power bi",
  "vba",
  "process improvement"
];

const TITLE_PATTERNS = [
  "Operations Analyst",
  "Senior Operations Analyst",
  "Trade Support Analyst",
  "Middle Office Analyst",
  "Associate",
  "Senior Associate",
  "Process Specialist",
  "Team Lead",
  "Assistant Manager",
  "Analyst",
  "Specialist",
  "Consultant"
];

const LOCATION_PATTERNS = [
  "Bangalore",
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Gurgaon",
  "Gurugram",
  "Noida",
  "London",
  "New York",
  "Singapore",
  "Hong Kong",
  "Dublin",
  "Manila",
  "Kolkata"
];

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesWord(text, phrase) {
  return new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
}

function extractCompanies(text) {
  const known = Object.keys(COMPANY_KNOWLEDGE_BASE).filter((company) => includesWord(text, company));
  const likely = text.match(/\b([A-Z][A-Za-z&.]+(?:\s+[A-Z][A-Za-z&.]+){0,3})\b/g) ?? [];
  const filtered = likely.filter((name) => /(Bank|Capital|Securities|Partners|Financial|Brothers|Markets|Services|Technologies|Solutions)$/i.test(name));
  return unique([...known, ...filtered]).slice(0, 8);
}

function extractTitles(text) {
  const matched = TITLE_PATTERNS.filter((title) => includesWord(text, title));
  const inlineTitles = text.match(/(?:^|\n)\s*([A-Z][A-Za-z ]{2,40}(?:Analyst|Associate|Specialist|Manager|Consultant|Lead))/gm) ?? [];
  return unique([...matched, ...inlineTitles.map((title) => title.trim())]).slice(0, 6);
}

function extractLocations(text) {
  return unique(LOCATION_PATTERNS.filter((location) => includesWord(text, location))).slice(0, 6);
}

function extractResponsibilities(text) {
  const lines = text
    .split(/\n|•|-/)
    .map((line) => line.trim())
    .filter((line) => /\b(managed|handled|processed|performed|monitored|resolved|reconciled|supported|prepared|reviewed|coordinated|investigated|validated|owned|led|created|improved)\b/i.test(line));

  const sentences = text
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 35 && /\b(managed|handled|processed|performed|monitored|resolved|reconciled|supported|prepared|reviewed|coordinated|investigated|validated|owned|led|created|improved)\b/i.test(sentence));

  return unique([...lines, ...sentences]).slice(0, 7);
}

function extractYears(text) {
  const explicitYears = [...text.matchAll(/(\d{1,2})\+?\s*(?:years|yrs)\b/gi)].map((match) => Number(match[1]));
  const dateRanges = [...text.matchAll(/(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(present|current|20\d{2}|19\d{2})/gi)];
  const rangeYears = dateRanges.map((match) => {
    const start = Number(match[1]);
    const end = /present|current/i.test(match[2]) ? new Date().getFullYear() : Number(match[2]);
    return Math.max(0, end - start);
  });
  return Math.max(0, Math.min(25, Math.round(Math.max(...explicitYears, ...rangeYears, 0))));
}

function scoreAssetClasses(text, companies) {
  const scores = Object.fromEntries(Object.keys(ASSET_KEYWORDS).map((asset) => [asset, 0]));

  Object.entries(ASSET_KEYWORDS).forEach(([asset, keywords]) => {
    keywords.forEach((keyword) => {
      if (includesWord(text, keyword)) scores[asset] += 3;
    });
  });

  companies.forEach((company) => {
    const knowledge = COMPANY_KNOWLEDGE_BASE[company];
    knowledge?.assetClasses.forEach((asset) => {
      scores[asset] += 2;
    });
  });

  return scores;
}

function getExplicitSkills(text) {
  return SKILL_KEYWORDS.filter((skill) => includesWord(text, skill)).map((skill) => skill.replace(/\b\w/g, (letter) => letter.toUpperCase()));
}

function inferSkills(assetClass, companies, explicitSkills) {
  const base = {
    FX: ["FX confirmations", "CLS settlement monitoring", "nostro break investigation", "currency trade lifecycle control"],
    Equities: ["custody settlement", "corporate action event handling", "position reconciliation", "broker query management"],
    "Fixed Income": ["coupon and maturity event support", "rates trade lifecycle", "bond settlement monitoring", "security static data checks"],
    Derivatives: ["confirmation matching", "collateral workflow awareness", "OTC lifecycle events", "valuation exception review"],
    "Treasury Operations": ["cash forecasting support", "payment repair queues", "liquidity movement monitoring", "funding exception escalation"]
  };

  const companySignals = companies.flatMap((company) => COMPANY_KNOWLEDGE_BASE[company]?.signals ?? []);
  const explicit = new Set(explicitSkills.map((skill) => skill.toLowerCase()));
  return unique([...base[assetClass], ...companySignals])
    .filter((skill) => !explicit.has(skill.toLowerCase()))
    .slice(0, 8);
}

export function analyzeCareerDna(jobDescription, resumeText) {
  const corpus = `${jobDescription}\n${resumeText}`.trim();
  const companies = extractCompanies(corpus);
  const jobTitles = extractTitles(corpus);
  const yearsOfExperience = extractYears(corpus);
  const locations = extractLocations(corpus);
  const responsibilities = extractResponsibilities(resumeText || corpus);
  const assetClassEvidence = scoreAssetClasses(corpus, companies);
  const likelyAssetClass = (Object.entries(assetClassEvidence).sort((a, b) => b[1] - a[1])[0]?.[0] || "Treasury Operations");
  const explicitSkills = getExplicitSkills(corpus);
  const inferredSkills = inferSkills(likelyAssetClass, companies, explicitSkills);
  const knownCompanyHits = companies.filter((company) => COMPANY_KNOWLEDGE_BASE[company]);
  const confidenceScore = Math.min(
    94,
    42 + explicitSkills.length * 4 + knownCompanyHits.length * 8 + responsibilities.length * 3 + (yearsOfExperience > 0 ? 8 : 0)
  );
  const primaryCompany = knownCompanyHits[0] || companies[0] || "the listed employers";
  const primaryLocation = locations[0] || "the listed location";

  return {
    companies,
    jobTitles,
    yearsOfExperience,
    locations,
    responsibilities,
    likelyAssetClass,
    assetClassEvidence,
    explicitSkills,
    inferredSkills,
    summary: `Candidate spent ${yearsOfExperience || "multiple"} ${yearsOfExperience === 1 ? "year" : "years"} around ${likelyAssetClass} operations signals and likely has exposure to ${inferredSkills.slice(0, 4).join(", ") || "trade lifecycle workflows"}.`,
    confidenceScore,
    reasoning: [
      `Resume and job-description language point strongest toward ${likelyAssetClass}, based on direct asset keywords plus employer-pattern inference.`,
      `${primaryCompany} is mapped in BOB's internal knowledge base to operations functions such as ${(COMPANY_KNOWLEDGE_BASE[primaryCompany]?.functions ?? ["trade support", "reconciliation", "settlement monitoring"]).slice(0, 3).join(", ")}.`,
      `Candidate location/history includes ${primaryLocation}; similar offshore and global capability teams commonly support reconciliations, settlement monitoring, counterparty interaction, and exception queues.`,
      `This is mock inference logic: it weighs explicit resume evidence first, then adds likely exposure from company operating models rather than treating every keyword as a hard claim.`
    ],
    recruiterVerdict:
      confidenceScore >= 78
        ? "Strong operations-aligned profile. Prioritize for recruiter screen and validate exact product/platform ownership."
        : confidenceScore >= 62
          ? "Promising operations profile. Screen for depth of ownership, products supported, and escalation examples."
          : "Early signal only. Ask for clearer resume detail around desks, products, platforms, volumes, and controls.",
    fitSignals: [
      `${likelyAssetClass} exposure indicated`,
      `${explicitSkills.length} explicit skill signals found`,
      `${knownCompanyHits.length || companies.length} relevant employer signal${(knownCompanyHits.length || companies.length) === 1 ? "" : "s"}`,
      responsibilities.length ? "Responsibility-led resume bullets detected" : "Limited responsibility bullets detected"
    ],
    watchouts: [
      "Validate whether exposure was maker, checker, SME, or supervisory ownership.",
      "Confirm platforms used and whether the candidate handled live breaks or only reporting.",
      "Ask for examples involving aging, risk impact, counterparty follow-up, and end-of-day controls."
    ]
  };
}
