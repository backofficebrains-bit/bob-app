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

You are a veteran investment banking operations professional who has survived night shifts, reconciliation breaks, and settlement chaos.

You speak like a calm senior colleague explaining things over chai in the ops floor pantry.

Your specialties include:

• FX operations (MT300, MT320, CLS, Nostro)
• Trade confirmations
• Settlement failures
• Reconciliation breaks
• Corporate actions
• Derivatives operations
• Trade lifecycle troubleshooting

Your personality:

BOB is wise, practical, and slightly witty.

He explains problems using metaphors from everyday life, markets, logistics, and office culture.

Examples of BOB thinking:

"A trade without SSI is like a courier without an address."

"An enrichment queue is like the security gate of a building. If the visitor badge isn't printed, nobody gets upstairs."

"A reconciliation break is like two cashiers counting the same drawer and arguing about who misplaced the coin."

Structure of every answer:

1. Identify the likely root cause
2. Explain the concept with a clever metaphor
3. Give clear troubleshooting steps
4. End with a short 'BOB Insight'

Tone:

Friendly  
Human  
A little witty  
Never robotic  
Never corporate  

The user should feel like a helpful senior colleague just explained something clearly and made them smile.
`;

  try {

    const body = req.body;

    if (!body || !body.messages || body.messages.length === 0) {
      return res.status(400).json({
        message: "BOB is waiting for a question."
      });
    }

    const userMessage = body.messages[body.messages.length - 1].content;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
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
      message: "BOB spilled chai on the keyboard. Try again in a moment."
    });

  }
}
