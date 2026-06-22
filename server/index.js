const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "../client/build")));

// ── Parse quiz text ──────────────────────────────────────────────────────────
function parseQuiz(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const questions = [];
  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const qMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    if (qMatch) {
      if (current) questions.push(current);
      current = { id: parseInt(qMatch[1]), question: qMatch[2], options: [], answer: null };
      continue;
    }
    const optMatch = line.match(/^[\(]?([A-Da-d])[\).\s]\s*(.+)/);
    if (optMatch && current) {
      current.options.push({ letter: optMatch[1].toUpperCase(), text: optMatch[2] });
      continue;
    }
    const ansMatch = line.match(/^(?:answer|ans|correct)[:\s]+([A-Da-d])/i);
    if (ansMatch && current) current.answer = ansMatch[1].toUpperCase();
  }
  if (current) questions.push(current);
  return questions.filter((q) => q.options.length >= 2);
}

app.post("/api/parse", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });
  try {
    const questions = parseQuiz(text);
    if (!questions.length) return res.status(422).json({ error: "No questions found. Check your format." });
    res.json({ questions, count: questions.length });
  } catch (e) {
    res.status(500).json({ error: "Failed to parse quiz." });
  }
});

// ── Save score to Google Sheets via Apps Script Web App ──────────────────────
app.post("/api/save-score", async (req, res) => {
  const SHEET_URL = process.env.GOOGLE_SHEET_URL;
  if (!SHEET_URL) return res.status(500).json({ error: "GOOGLE_SHEET_URL not configured" });

  const { studentName, score, total, percentage, quizTitle, answers } = req.body;
  if (!studentName || score === undefined) return res.status(400).json({ error: "Missing fields" });

  try {
    const payload = {
      studentName,
      score,
      total,
      percentage,
      quizTitle: quizTitle || "Quiz",
      timestamp: new Date().toISOString(),
      wrongQuestions: answers || []
    };
    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    if (!response.ok) throw new Error("Sheet rejected request: " + response.status);
    res.json({ ok: true });
  } catch (e) {
    console.error("Sheet error:", e.message);
    res.status(500).json({ error: "Could not save to Google Sheets: " + e.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
