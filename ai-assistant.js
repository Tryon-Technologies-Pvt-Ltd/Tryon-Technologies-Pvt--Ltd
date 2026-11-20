(() => {
  const config = window.TRYON_AI_CONFIG || {};
  const apiBase = (config.apiBase || "").replace(/\/$/, "");
  const style = document.createElement("style");
  style.textContent = `
  .tryon-ai-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:0;border-radius:50px;padding:14px 19px;background:linear-gradient(110deg,#0868ed,#20b9dc);color:#fff;font:800 14px system-ui;box-shadow:0 12px 36px #006cff55;cursor:pointer}
  .tryon-ai-panel{position:fixed;right:22px;bottom:82px;z-index:9999;width:min(380px,calc(100vw - 28px));height:min(540px,70vh);display:none;flex-direction:column;overflow:hidden;border:1px solid #9bbbe655;border-radius:20px;background:#071a33;color:#edf5ff;box-shadow:0 25px 80px #00142e88;font:14px/1.5 system-ui}
  .tryon-ai-panel.open{display:flex}.tryon-ai-head{padding:15px 16px;background:linear-gradient(110deg,#0753c7,#0b8eb5);display:flex;justify-content:space-between;align-items:center}.tryon-ai-head b{font-size:15px}.tryon-ai-head button{background:#ffffff22;color:white;border:0;border-radius:8px;padding:5px 9px;cursor:pointer}
  .tryon-ai-messages{padding:14px;overflow:auto;flex:1;display:flex;flex-direction:column;gap:10px}.tryon-ai-msg{padding:10px 12px;border-radius:13px;max-width:90%;white-space:pre-wrap}.tryon-ai-msg.bot{background:#102c4c;align-self:flex-start}.tryon-ai-msg.user{background:#096ce5;align-self:flex-end}.tryon-ai-hint{font-size:11px;color:#a9bed8;padding:0 14px 8px}.tryon-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid #ffffff20}.tryon-ai-form input{min-width:0;flex:1;border:1px solid #54718e;border-radius:10px;background:#0c2541;color:white;padding:11px}.tryon-ai-form button{border:0;border-radius:10px;background:#1688f7;color:white;font-weight:800;padding:0 14px;cursor:pointer}
  `;
  document.head.appendChild(style);
  const launch = document.createElement("button");
  launch.className = "tryon-ai-launch";
  launch.type = "button";
  launch.textContent = "✦ Ask Tryon AI";
  launch.setAttribute("aria-label","Open Tryon AI assistant");
  const panel = document.createElement("section");
  panel.className = "tryon-ai-panel";
  panel.innerHTML = `<div class="tryon-ai-head"><b>✦ Tryon AI Assistant</b><button type="button" aria-label="Close">✕</button></div><div class="tryon-ai-messages" aria-live="polite"><div class="tryon-ai-msg bot">Hello! I can help with Tryon services, CCTV, networking, IDS, fire alarm, websites and project enquiries. What would you like to know?</div></div><div class="tryon-ai-hint">AI responses may need human confirmation. Do not share passwords or sensitive data.</div><form class="tryon-ai-form"><input maxlength="1200" required placeholder="Type your question…" aria-label="Your question"><button type="submit">Send</button></form>`;
  document.body.append(launch,panel);
  const messages = panel.querySelector(".tryon-ai-messages");
  const input = panel.querySelector("input");
  const add = (text,who) => { const el=document.createElement("div");el.className="tryon-ai-msg "+who;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el; };
  launch.addEventListener("click",()=>panel.classList.toggle("open"));
  panel.querySelector(".tryon-ai-head button").addEventListener("click",()=>panel.classList.remove("open"));
  panel.querySelector("form").addEventListener("submit",async e=>{
    e.preventDefault();const question=input.value.trim();if(!question)return;
    add(question,"user");input.value="";
    const pending=add("Thinking…","bot");
    if(!apiBase){pending.textContent="The AI service is not connected yet. The website is ready for AI, but the Python backend must be deployed and its API URL added in assets/js/ai-assistant.js. For now, contact tryontechindia@gmail.com.";return;}
    try{
      const res=await fetch(apiBase+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:question})});
      if(!res.ok)throw new Error("AI service returned "+res.status);
      const data=await res.json();pending.textContent=data.reply||"I couldn't prepare a response. Please contact Tryon.";
    }catch(err){pending.textContent="I can't reach the AI service right now. Please try again later or email tryontechindia@gmail.com.";}
  });
})();