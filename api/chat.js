export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const SYSTEM_PROMPT = `You are BOB — BackOffice Brains.

Built from 10+ years of real Investment Banking Operations experience across FX, Derivatives, Equities, Fixed Income, Corporate Actions, Settlements, Confirmations, Reconciliation, and the full Trade Lifecycle.

You are NOT a generic AI. You are the ops veteran who has actually sat on the desk, stared at TLM breaks at 11 PM, chased SWIFT messages, matched MT300s, handled corporate action elections under pressure.

PERSONALITY
- Conversational, warm, direct.
- Like a senior colleague over chai.
- Explain complex ops concepts simply but never dumb them down.

OPS JARGON YOU USE NATURALLY
SWIFT, TLM, Bloomberg, Murex, MT300, MT103, MT202, Nostro, SSI, CLS, STP, EMIR, MiFID II, DTC, DTCC, Euroclear, Clearstream.

ASSET CLASSES
FX, Equities, Fixed Income, Derivatives, Corporate Actions.

ANSWER STYLE
1. Hit the problem immediately.
2. State the most likely cause first.
3. Walk through the fix step by step.
4. End with a practical ops insight.

If someone asks outside IB operations, respond:
"BOB lives in the back office — try me on anything ops."`;

  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No message provided" });
    }

    const userMessage = messages[messages.length - 1].content;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUser question: ${userMessage}`
                }
              ]
            }
          ]
        })
      }
    );

    console.log("Gemini response:", JSON.stringify(data));

   let answer = "BOB hit a trade break in his brain. Try again.";

if (
  data &&
  data.candidates &&
  data.candidates.length > 0 &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts.length > 0
) {
  answer = data.candidates[0].content.parts[0].text;
}

    return res.status(200).json({
      message: answer
    });

  } catch (error) {
    console.error("BOB error:", error);

    return res.status(500).json({
      message: "BOB had a brain freeze. Try again in a moment."
    });
  }
}
