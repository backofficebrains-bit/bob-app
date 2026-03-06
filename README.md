# BOB — BackOffice Brains
### Deploy in 10 minutes. Zero cost. Zero coding.

---

## What's inside
```
bob-app/
├── api/
│   └── chat.js          ← Serverless backend (calls Claude API securely)
├── public/
│   └── index.html       ← The full BOB frontend
├── vercel.json          ← Vercel deployment config
└── README.md
```

---

## Step 1 — Get your Anthropic API Key
1. Go to → https://console.anthropic.com
2. Sign up (free)
3. Click **API Keys** → **Create Key**
4. Copy it. Save it somewhere safe.

---

## Step 2 — Upload to GitHub
1. Go to → https://github.com/new
2. Create a new repository called `bob-app` (set to **Public**)
3. Upload all these files (drag and drop works)
4. Click **Commit changes**

---

## Step 3 — Deploy on Vercel
1. Go to → https://vercel.com
2. Sign up with your GitHub account
3. Click **Add New Project**
4. Select your `bob-app` repository
5. Click **Deploy** — Vercel auto-detects the config

---

## Step 4 — Add your API Key (the important one)
1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your key from Step 1
3. Click **Save**
4. Go to **Deployments** → click **Redeploy**

---

## Step 5 — You're live 🚀
Vercel gives you a URL like: `bob-app.vercel.app`

That's your link. Drop it in the LinkedIn post and watch the BOBs find it.

---

## Free tier limits (Vercel + Anthropic)
- Vercel free: 100GB bandwidth/month — more than enough to start
- Anthropic: Pay per use, but very cheap (~$0.003 per conversation)
- For early traction, cost is essentially zero

---

## Questions?
BOB was built by Partha — 10+ years of IB Ops, Bengaluru.
The guy who used AI as a growth companion and still won. 🔥
