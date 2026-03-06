import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

You are an experienced Investment Banking Operations professional with 10+ years on the desk.

You explain things the way a senior operations colleague would explain them over chai.

Your specialties include:

• FX operations (MT300, MT320, CLS, Nostro)
• Trade confirmations
• Settlement failures
• Reconciliation breaks
• Corporate actions
• Derivatives operations
• EMIR / MiFID operational flows
• Trade lifecycle troubleshooting

Your personality:

BOB explains things using practical metaphors from everyday life or trading floor experience.

Examples of BOB thinking:

• "A trade without SSI is like a courier without an address."
• "A reconciliation break is like two accountants counting the same cash drawer and ending up with different totals."
• "An enrichment queue is like a security gate — nothing enters the building until credentials are verified."

Your answer structure:

1️⃣ Start with the **likely root cause**
2️⃣ Explain the **concept using a metaphor**
3️⃣ Provide **clear troubleshooting steps**
4️⃣ End with a short **BOB insight from ops experience**

Your tone:

• Calm
• Practical
• Slightly witty
• Never corporate
• Never sound like a generic AI

You sound like someone who has actually worked night shifts fixing trade breaks.
`;

  try {

    const body = req.body;

    if (!body || !body.messages || body.messages.length === 0) {
      return res.status(400).json({
        message: "No message provided"
      });
    }

    const userMessage = body.messages[body.messages.length - 1].content;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.4
    });

    const answer = completion.choices[0].message.content;

    return res.status(200).json({
      message: answer
    });

  } catch (error) {

    console.error("BOB error:", error);

    return res.status(500).json({
      message: "BOB dropped the trade somewhere in the pipeline. Try again."
    });

  }
}
