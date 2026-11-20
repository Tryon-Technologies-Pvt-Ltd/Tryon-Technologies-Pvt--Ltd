import { useState } from "react";

export default function TryonAI({ apiBase = "" }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! Ask me about Tryon services, CCTV, networking, IDS, fire alarm or website projects." }
  ]);
  const [busy, setBusy] = useState(false);

  async function send(e) {
    e.preventDefault();
    const message = question.trim();
    if (!message || busy) return;
    setMessages(m => [...m, { role: "user", text: message }]);
    setQuestion("");
    setBusy(true);
    try {
      if (!apiBase) throw new Error("AI backend URL is not configured.");
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "AI service unavailable.");
      setMessages(m => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: `${err.message} Please email tryontechindia@gmail.com.` }]);
    } finally { setBusy(false); }
  }

  return <div className="tryon-ai-react">
    <button onClick={() => setOpen(v => !v)}>✦ {open ? "Close Tryon AI" : "Ask Tryon AI"}</button>
    {open && <section className="tryon-ai-window">
      <header><strong>Tryon AI Assistant</strong></header>
      <div className="tryon-ai-history">{messages.map((m, i) =>
        <p key={i} className={m.role}>{m.text}</p>)}</div>
      <form onSubmit={send}><input value={question} onChange={e => setQuestion(e.target.value)} maxLength={1200} placeholder="Ask a question…" />
        <button disabled={busy}>{busy ? "…" : "Send"}</button></form>
      <small>Do not share passwords, OTPs or sensitive personal information.</small>
    </section>}
  </div>;
}
