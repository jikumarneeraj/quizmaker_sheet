import React, { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "";

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f0ede8; color: #1a1a1a; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  nav { background: #1a1a1a; padding: 0 2rem; height: 56px; display: flex; align-items: center; justify-content: space-between; }
  .logo { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
  .logo span { color: #7fff6b; }
  .nav-hint { font-size: 13px; color: #888; }
  main { flex: 1; padding: 2.5rem 1rem; max-width: 780px; margin: 0 auto; width: 100%; }
  .hero { text-align: center; margin-bottom: 2.5rem; }
  .hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(28px, 5vw, 42px); font-weight: 700; color: #1a1a1a; letter-spacing: -1px; line-height: 1.1; margin-bottom: 10px; }
  .hero h1 em { color: #2d6a4f; font-style: normal; }
  .hero p { font-size: 16px; color: #555; line-height: 1.6; }
  .format-card { background: #fff; border: 1px solid #e0dcd6; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; }
  .format-card h3 { font-size: 13px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .format-example { font-family: monospace; font-size: 13px; color: #333; background: #f7f5f2; border-radius: 8px; padding: 12px 14px; line-height: 1.8; white-space: pre-wrap; }
  .format-example .hl { color: #2d6a4f; font-weight: 600; }
  .paste-card { background: #fff; border: 1px solid #e0dcd6; border-radius: 14px; overflow: hidden; margin-bottom: 1.5rem; }
  .paste-card-header { padding: 1rem 1.5rem 0; display: flex; align-items: center; justify-content: space-between; }
  .paste-card-header label { font-size: 14px; font-weight: 600; color: #1a1a1a; }
  .char-count { font-size: 13px; color: #aaa; }
  textarea { width: 100%; min-height: 280px; border: none; outline: none; resize: vertical; font-family: monospace; font-size: 13.5px; line-height: 1.7; color: #1a1a1a; background: transparent; padding: 1rem 1.5rem 1.5rem; }
  textarea::placeholder { color: #bbb; }
  .btn-primary { width: 100%; padding: 14px; background: #1a1a1a; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: background 0.15s, transform 0.1s; letter-spacing: -0.2px; }
  .btn-primary:hover { background: #2d6a4f; }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { background: #ccc; cursor: not-allowed; }
  .btn-secondary { padding: 9px 20px; background: transparent; color: #1a1a1a; font-size: 14px; font-weight: 500; border: 1px solid #d0ccc6; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
  .btn-secondary:hover { background: #f0ede8; }
  .btn-ghost { background: none; border: none; font-size: 14px; color: #888; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
  .btn-ghost:hover { background: #f0ede8; color: #1a1a1a; }
  .error-box { background: #fff1f0; border: 1px solid #ffc9c9; border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #c0392b; margin-bottom: 1.5rem; }
  .editor-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 8px; }
  .editor-header h2 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .badge { display: inline-block; background: #e8f5e9; color: #2d6a4f; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 99px; border: 1px solid #b7dfc0; }
  .q-card { background: #fff; border: 1px solid #e0dcd6; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 12px; }
  .q-card-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
  .q-number { background: #1a1a1a; color: #fff; font-size: 12px; font-weight: 600; min-width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .q-input { flex: 1; font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500; color: #1a1a1a; border: none; outline: none; background: transparent; resize: none; line-height: 1.5; min-height: 28px; padding: 0; }
  .options-grid { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .option-row { display: flex; align-items: center; gap: 8px; border: 1px solid #e8e4df; border-radius: 8px; padding: 6px 10px; transition: border-color 0.15s, background 0.15s; cursor: pointer; }
  .option-row:hover { border-color: #b0d8bc; background: #f6fcf7; }
  .option-row.is-answer { border-color: #2d6a4f; background: #f0faf2; }
  .opt-letter-badge { width: 26px; height: 26px; border-radius: 6px; background: #f0ede8; color: #555; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, color 0.15s; }
  .option-row.is-answer .opt-letter-badge { background: #2d6a4f; color: #fff; }
  .opt-input { flex: 1; font-family: 'Inter', sans-serif; font-size: 14px; color: #1a1a1a; border: none; outline: none; background: transparent; padding: 0; }
  .opt-check { font-size: 11px; color: #2d6a4f; font-weight: 600; flex-shrink: 0; }
  .answer-hint { font-size: 12px; color: #aaa; margin-top: 4px; }
  .delete-q { background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 4px; }
  .delete-q:hover { color: #e74c3c; background: #fff5f5; }
  .start-bar { background: #fff; border: 1px solid #e0dcd6; border-radius: 12px; padding: 1.25rem 1.5rem; margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .start-info h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; }
  .start-info p { font-size: 13px; color: #888; margin-top: 2px; }
  .start-btn { padding: 12px 32px; background: #2d6a4f; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
  .start-btn:hover { background: #1e4d39; }
  .start-btn:disabled { background: #ccc; cursor: not-allowed; }
  .quiz-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 8px; }
  .quiz-meta { font-size: 13px; color: #888; }
  .quiz-meta strong { color: #1a1a1a; font-weight: 600; }
  .timer-pill { background: #1a1a1a; color: #7fff6b; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; padding: 6px 16px; border-radius: 99px; min-width: 70px; text-align: center; letter-spacing: 1px; }
  .timer-pill.low { background: #c0392b; color: #fff; }
  .progress-track { height: 5px; background: #e0dcd6; border-radius: 99px; margin-bottom: 1.75rem; overflow: hidden; }
  .progress-fill { height: 100%; background: #2d6a4f; border-radius: 99px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
  .quiz-card { background: #fff; border: 1px solid #e0dcd6; border-radius: 16px; padding: 2rem 1.75rem; margin-bottom: 1.25rem; }
  .quiz-q-num { font-size: 12px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .quiz-q-text { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; line-height: 1.4; margin-bottom: 1.5rem; letter-spacing: -0.3px; }
  .quiz-options { display: flex; flex-direction: column; gap: 10px; }
  .quiz-opt { display: flex; align-items: center; gap: 12px; border: 1.5px solid #e0dcd6; border-radius: 10px; padding: 13px 16px; cursor: pointer; transition: border-color 0.15s, background 0.15s, transform 0.1s; font-size: 15px; color: #1a1a1a; background: #fff; }
  .quiz-opt:hover:not(.locked) { border-color: #2d6a4f; background: #f0faf2; transform: translateX(2px); }
  .quiz-opt.selected { border-color: #2d6a4f; background: #f0faf2; }
  .quiz-opt.correct { border-color: #2d6a4f; background: #e8f5e9; }
  .quiz-opt.wrong { border-color: #c0392b; background: #fff1f0; color: #c0392b; }
  .quiz-opt.show-correct { border-color: #2d6a4f; background: #e8f5e9; }
  .quiz-opt.locked { cursor: default; }
  .quiz-opt-letter { width: 32px; height: 32px; border-radius: 8px; background: #f0ede8; color: #555; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, color 0.15s; }
  .quiz-opt.correct .quiz-opt-letter, .quiz-opt.show-correct .quiz-opt-letter { background: #2d6a4f; color: #fff; }
  .quiz-opt.wrong .quiz-opt-letter { background: #c0392b; color: #fff; }
  .quiz-feedback { border-radius: 10px; padding: 12px 16px; font-size: 14px; font-weight: 500; margin-top: 12px; display: none; }
  .quiz-feedback.show { display: block; }
  .quiz-feedback.correct { background: #e8f5e9; color: #2d6a4f; border: 1px solid #b7dfc0; }
  .quiz-feedback.wrong { background: #fff1f0; color: #c0392b; border: 1px solid #ffc9c9; }
  .quiz-next { display: flex; justify-content: flex-end; }
  .btn-next { padding: 12px 28px; background: #1a1a1a; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
  .btn-next:hover { background: #2d6a4f; }

  /* NAME MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; }
  .modal-box { background: #fff; border-radius: 16px; padding: 2rem; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
  .modal-box h2 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
  .modal-box p { font-size: 14px; color: #888; margin-bottom: 1.5rem; line-height: 1.5; }
  .name-input { width: 100%; padding: 12px 14px; border: 1.5px solid #e0dcd6; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 15px; color: #1a1a1a; outline: none; transition: border-color 0.15s; margin-bottom: 12px; }
  .name-input:focus { border-color: #2d6a4f; }
  .modal-actions { display: flex; gap: 8px; }

  /* RESULTS */
  .results-wrap { text-align: center; }
  .results-hero { background: #1a1a1a; border-radius: 20px; padding: 2.5rem 2rem; margin-bottom: 1.5rem; color: #fff; }
  .results-score { font-family: 'Space Grotesk', sans-serif; font-size: 72px; font-weight: 700; color: #7fff6b; line-height: 1; letter-spacing: -2px; }
  .results-denom { font-size: 18px; color: #888; margin-top: 4px; }
  .results-msg { font-size: 18px; color: #ccc; margin-top: 12px; line-height: 1.5; }
  .results-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 1.5rem; }
  .result-stat { background: #fff; border: 1px solid #e0dcd6; border-radius: 12px; padding: 1rem; }
  .result-stat-val { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: #1a1a1a; }
  .result-stat-lbl { font-size: 12px; color: #aaa; margin-top: 3px; }
  .sheet-status { border-radius: 10px; padding: 12px 16px; font-size: 14px; font-weight: 500; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }
  .sheet-status.saving { background: #f7f5f2; color: #888; border: 1px solid #e0dcd6; }
  .sheet-status.saved { background: #e8f5e9; color: #2d6a4f; border: 1px solid #b7dfc0; }
  .sheet-status.failed { background: #fff1f0; color: #c0392b; border: 1px solid #ffc9c9; }
  .results-review { text-align: left; margin-bottom: 1.5rem; }
  .results-review h3 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; margin-bottom: 12px; }
  .review-item { background: #fff; border: 1px solid #e0dcd6; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; gap: 12px; align-items: flex-start; }
  .review-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .review-q { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
  .review-ans { font-size: 13px; color: #888; }
  .review-ans .correct-ans { color: #2d6a4f; font-weight: 500; }
  .review-ans .your-ans { color: #c0392b; }
  .results-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .loading-wrap { text-align: center; padding: 3rem 0; color: #888; font-size: 15px; }
  .spinner { width: 32px; height: 32px; border: 3px solid #e0dcd6; border-top-color: #2d6a4f; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 500px) {
    main { padding: 1.5rem 1rem; }
    .results-stats { grid-template-columns: 1fr 1fr; }
    .start-bar { flex-direction: column; text-align: center; }
    .start-btn { width: 100%; }
  }
`;

const EXAMPLE = `1. What is nutrition?
A) Breathing
B) Process of obtaining and using food
C) Movement
D) Reproduction
Answer: B

2. The process by which green plants make food is called:
A) Respiration
B) Digestion
C) Photosynthesis
D) Transpiration
Answer: C`;

// ── Name Modal ────────────────────────────────────────────────────────────────
function NameModal({ onSubmit, onSkip }) {
  const [name, setName] = useState("");
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Quiz complete! 🎉</h2>
        <p>Enter your name so your teacher can see your score in Google Sheets. You can also skip this.</p>
        <input
          className="name-input"
          type="text"
          placeholder="Your name (e.g. Ravi Sharma)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onSubmit(name.trim())}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onSkip} style={{ flex: 1 }}>Skip</button>
          <button
            className="start-btn"
            style={{ flex: 2 }}
            disabled={!name.trim()}
            onClick={() => onSubmit(name.trim())}
          >
            Submit score →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────
function ResultsScreen({ questions, userAnswers, studentName, onRetry, onNew }) {
  const [sheetStatus, setSheetStatus] = useState(studentName ? "saving" : "skipped");

  const score = questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((score / questions.length) * 100);
  const msg =
    pct === 100 ? "Perfect score! Outstanding." :
    pct >= 80 ? "Excellent! Great understanding." :
    pct >= 60 ? "Good job! A bit more review will help." :
    "Keep studying — you'll improve!";

  useEffect(() => {
    if (!studentName) return;
    const wrongList = questions
      .map((q, i) => userAnswers[i] !== q.answer ? `Q${i+1}: ${q.question}` : null)
      .filter(Boolean);

    fetch(`${API}/api/save-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName,
        score,
        total: questions.length,
        percentage: pct,
        quizTitle: "Science Quiz",
        answers: wrongList
      })
    })
      .then((r) => { if (!r.ok) throw new Error(); setSheetStatus("saved"); })
      .catch(() => setSheetStatus("failed"));
  }, []);

  return (
    <div className="results-wrap">
      <div className="results-hero">
        <div className="results-score">{score}</div>
        <div className="results-denom">out of {questions.length}</div>
        <div className="results-msg">{msg}</div>
        {studentName && <div style={{ marginTop: 8, fontSize: 14, color: "#7fff6b" }}>— {studentName}</div>}
      </div>
      <div className="results-stats">
        <div className="result-stat"><div className="result-stat-val">{pct}%</div><div className="result-stat-lbl">Accuracy</div></div>
        <div className="result-stat"><div className="result-stat-val">{score}</div><div className="result-stat-lbl">Correct</div></div>
        <div className="result-stat"><div className="result-stat-val">{questions.length - score}</div><div className="result-stat-lbl">Wrong</div></div>
      </div>

      {sheetStatus === "saving" && <div className="sheet-status saving">⏳ Saving your score to Google Sheets…</div>}
      {sheetStatus === "saved" && <div className="sheet-status saved">✅ Score saved to Google Sheets! Your teacher can see it.</div>}
      {sheetStatus === "failed" && <div className="sheet-status failed">⚠ Could not save to Google Sheets. Check your setup.</div>}

      <div className="results-review">
        <h3>Review</h3>
        {questions.map((q, i) => {
          const ua = userAnswers[i];
          const correct = ua === q.answer;
          const correctOpt = q.options.find((o) => o.letter === q.answer);
          const userOpt = q.options.find((o) => o.letter === ua);
          return (
            <div className="review-item" key={i}>
              <span className="review-icon">{correct ? "✅" : "❌"}</span>
              <div>
                <div className="review-q">{q.question}</div>
                <div className="review-ans">
                  {correct ? (
                    <span className="correct-ans">Correct: {q.answer}) {correctOpt?.text}</span>
                  ) : (
                    <>
                      <span className="your-ans">Your answer: {ua ? `${ua}) ${userOpt?.text}` : "Not answered"}</span>
                      {" · "}
                      <span className="correct-ans">Correct: {q.answer}) {correctOpt?.text}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="results-actions">
        <button className="btn-secondary" onClick={onRetry}>Retake quiz</button>
        <button className="start-btn" onClick={onNew}>Make new quiz</button>
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20);

  const q = questions[current];

  const lock = useCallback((letter) => {
    if (locked) return;
    setSelected(letter);
    setLocked(true);
    setUserAnswers((prev) => ({ ...prev, [current]: letter }));
  }, [locked, current]);

  useEffect(() => { setSelected(null); setLocked(false); setTimeLeft(20); }, [current]);

  useEffect(() => {
    if (locked) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); setLocked(true); setUserAnswers((prev) => ({ ...prev, [current]: null })); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [current, locked]);

  const next = () => {
    if (current + 1 >= questions.length) onFinish(userAnswers);
    else setCurrent((c) => c + 1);
  };

  const isCorrect = selected === q.answer;

  return (
    <div className="quiz-wrap">
      <div className="quiz-top">
        <div className="quiz-meta">Question <strong>{current + 1}</strong> of <strong>{questions.length}</strong></div>
        <div className={`timer-pill${timeLeft <= 5 ? " low" : ""}`}>{timeLeft}s</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>
      <div className="quiz-card">
        <div className="quiz-q-num">Question {current + 1}</div>
        <div className="quiz-q-text">{q.question}</div>
        <div className="quiz-options">
          {q.options.map((opt) => {
            let cls = "quiz-opt";
            if (locked) {
              cls += " locked";
              if (opt.letter === q.answer) cls += " correct";
              else if (opt.letter === selected) cls += " wrong";
            } else if (opt.letter === selected) cls += " selected";
            return (
              <button key={opt.letter} className={cls} onClick={() => lock(opt.letter)}>
                <span className="quiz-opt-letter">{opt.letter}</span>
                {opt.text}
              </button>
            );
          })}
        </div>
        {locked && (
          <div className={`quiz-feedback show ${isCorrect || !selected ? "correct" : "wrong"}`}>
            {!selected
              ? `Time's up! Correct answer: ${q.answer}) ${q.options.find((o) => o.letter === q.answer)?.text}`
              : isCorrect ? "Correct! Well done."
              : `Incorrect. The correct answer is ${q.answer}) ${q.options.find((o) => o.letter === q.answer)?.text}`}
          </div>
        )}
      </div>
      {locked && (
        <div className="quiz-next">
          <button className="btn-next" onClick={next}>
            {current + 1 >= questions.length ? "See results →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Editor ────────────────────────────────────────────────────────────────────
function EditorScreen({ questions: initial, onStart, onBack }) {
  const [questions, setQuestions] = useState(initial);
  const unanswered = questions.filter((q) => !q.answer).length;
  const setQ = (idx, field, val) => setQuestions((qs) => qs.map((q, i) => i === idx ? { ...q, [field]: val } : q));
  const setOpt = (qIdx, optIdx, val) => setQuestions((qs) => qs.map((q, i) => {
    if (i !== qIdx) return q;
    return { ...q, options: q.options.map((o, oi) => oi === optIdx ? { ...o, text: val } : o) };
  }));
  const setAnswer = (qIdx, letter) => setQuestions((qs) => qs.map((q, i) => i === qIdx ? { ...q, answer: q.answer === letter ? null : letter } : q));
  const deleteQ = (idx) => setQuestions((qs) => qs.filter((_, i) => i !== idx).map((q, i) => ({ ...q, id: i + 1 })));

  return (
    <div>
      <div className="editor-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <h2>Edit quiz</h2>
          <span className="badge">{questions.length} questions</span>
        </div>
        {unanswered > 0 && <span style={{ fontSize: "13px", color: "#e67e22", fontWeight: 500 }}>{unanswered} need answer marked</span>}
      </div>
      {questions.map((q, qi) => (
        <div className="q-card" key={qi}>
          <div className="q-card-header">
            <div className="q-number">{qi + 1}</div>
            <textarea className="q-input" value={q.question} onChange={(e) => setQ(qi, "question", e.target.value)} rows={2} />
            <button className="delete-q" onClick={() => deleteQ(qi)}>✕</button>
          </div>
          <div className="options-grid">
            {q.options.map((opt, oi) => (
              <div key={oi} className={`option-row${q.answer === opt.letter ? " is-answer" : ""}`} onClick={() => setAnswer(qi, opt.letter)}>
                <div className="opt-letter-badge">{opt.letter}</div>
                <input className="opt-input" value={opt.text} onChange={(e) => { e.stopPropagation(); setOpt(qi, oi, e.target.value); }} onClick={(e) => e.stopPropagation()} />
                {q.answer === opt.letter && <span className="opt-check">✓ correct</span>}
              </div>
            ))}
          </div>
          {!q.answer && <div className="answer-hint"><span>Click an option to mark the correct answer</span></div>}
        </div>
      ))}
      <div className="start-bar">
        <div className="start-info">
          <h3>Ready to start?</h3>
          <p>{unanswered > 0 ? `Mark ${unanswered} more answer${unanswered > 1 ? "s" : ""} first` : "All answers marked — good to go!"}</p>
        </div>
        <button className="start-btn" disabled={unanswered > 0 || !questions.length} onClick={() => onStart(questions)}>Start quiz →</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("paste");
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [studentName, setStudentName] = useState(null);
  const [pendingAnswers, setPendingAnswers] = useState(null);
  const [error, setError] = useState("");

  const handleParse = async () => {
    if (!text.trim()) return;
    setError("");
    setScreen("loading");
    try {
      const res = await fetch(`${API}/api/parse`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");
      setQuestions(data.questions);
      setScreen("editor");
    } catch (e) {
      setError(e.message || "Something went wrong");
      setScreen("paste");
    }
  };

  const handleFinish = (answers) => {
    setPendingAnswers(answers);
    setScreen("name-modal");
  };

  const handleNameSubmit = (name) => {
    setStudentName(name);
    setUserAnswers(pendingAnswers);
    setScreen("results");
  };

  const handleSkipName = () => {
    setStudentName(null);
    setUserAnswers(pendingAnswers);
    setScreen("results");
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav>
          <div className="logo">Quiz<span>Maker</span></div>
          <span className="nav-hint">Paste · Edit · Play</span>
        </nav>

        {screen === "name-modal" && (
          <NameModal onSubmit={handleNameSubmit} onSkip={handleSkipName} />
        )}

        <main>
          {screen === "paste" && (
            <>
              <div className="hero">
                <h1>Paste your questions,<br /><em>play your quiz</em></h1>
                <p>Supports NCERT-style MCQs. Scores auto-save to Google Sheets.</p>
              </div>
              <div className="format-card">
                <h3>Accepted format</h3>
                <div className="format-example">
                  <span className="hl">1.</span> What is photosynthesis?{"\n"}
                  <span className="hl">A)</span> Breathing{"\n"}
                  <span className="hl">B)</span> Making food from sunlight{"\n"}
                  <span className="hl">C)</span> Movement{"\n"}
                  <span className="hl">D)</span> Reproduction{"\n"}
                  <span className="hl">Answer: B</span>   ← optional, you can mark later
                </div>
              </div>
              {error && <div className="error-box">⚠ {error}</div>}
              <div className="paste-card">
                <div className="paste-card-header">
                  <label>Your quiz text</label>
                  <span className="char-count">{text.length} chars</span>
                </div>
                <textarea placeholder={"Paste your MCQ questions here...\n\n" + EXAMPLE} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
              </div>
              <button className="btn-primary" onClick={handleParse} disabled={!text.trim()}>Parse quiz →</button>
            </>
          )}
          {screen === "loading" && <div className="loading-wrap"><div className="spinner" />Parsing your questions…</div>}
          {screen === "editor" && <EditorScreen questions={questions} onStart={(qs) => { setQuestions(qs); setScreen("quiz"); }} onBack={() => setScreen("paste")} />}
          {screen === "quiz" && <QuizScreen questions={questions} onFinish={handleFinish} />}
          {screen === "results" && <ResultsScreen questions={questions} userAnswers={userAnswers} studentName={studentName} onRetry={() => setScreen("quiz")} onNew={() => { setText(""); setScreen("paste"); }} />}
        </main>
      </div>
    </>
  );
}
