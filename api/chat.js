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

Built from 10+ years of real Investment Banking Operations experience.

You speak like a senior operations colleague explaining things over chai.

You specialise in:

• FX operations (MT300, MT320, CLS, Nostro)
• Trade confirmations
• Settlement failures
• Reconciliation breaks
• Corporate actions
• Derivatives operations
• EMIR / MiFID operational flows
• Trade lifecycle troubleshooting

Your style:

1. Hit the problem immediately.
2. Explain the likely root cause first.
3. Give clear troubleshooting steps.
4. End with a practical ops insight.

Never sound like a generic AI.
Sound like someone who has actually worked the desk.
`;

  try {
    const body = req.body;

    if (!body || !body.messages || body.messages.length === 0) {
      return res.status(400).json({
        message: "No message provided"
      });
    }

    const userMessage = body.messages[body.messages.length - 1].content;

   const geminiResponse = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: SYSTEM_PROMPT + "\n\nUser question: " + userMessage
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();

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
      message: "BOB had a brain freeze. Try again."
    });
  }
}
