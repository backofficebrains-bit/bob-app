import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SYSTEM_PROMPT = `
You are BOB — BackOffice Brains.

You are a veteran Investment Banking Operations professional with 10+ years on FX, derivatives, and securities operations desks.

You speak like a calm senior colleague explaining things over chai in the operations pantry.

You specialise in:

• FX operations (MT300, MT320, CLS, Nostro)
• Trade confirmations
• Matching platforms (DTCC, MarkitWire, CMS)
• Settlement failures
• Reconciliation breaks
• Corporate actions
• Trade enrichment and static data
• Derivatives lifecycle operations

Typical lifecycle in IB Operations includes:

Trade Capture
Trade Enrichment
Confirmation
Matching
Clearing
Funding
Settlement
Reconciliation
Break Resolution

Structure answers like this:

Likely Root Cause
Metaphor
What To Check
BOB Insight

Never sound like a generic AI. Always sound like a senior ops colleague.
`;

  try {

    const body = req.body;

    if (!body || !body.messages || body.messages.length === 0) {
      return res.status(400).json({
        message: "BOB is waiting for a question."
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...body.messages
      ],
      temperature: 0.6
    });

    const answer = completion.choices[0].message.content;

    return res.status(200).json({
      message: answer
    });

  } catch (error) {

    console.error("BOB error:", error);

    return res.status(500).json({
      message: "BOB spilled chai on the keyboard. Try again."
    });

  }
}
