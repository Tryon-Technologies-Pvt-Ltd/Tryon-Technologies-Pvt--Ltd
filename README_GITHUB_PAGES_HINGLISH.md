# Tryon Technologies — Complete Website Upgrade

## Is package mein kya hai
- Purane multi-page release ke HTML pages aur assets preserve kiye gaye hain.
- Original T-shaped logo asset, founder portrait asset, product/service visuals aur existing page navigation preserve.
- Existing pages ke saath floating Tryon AI assistant UI add kiya gaya.
- Python FastAPI backend included hai. API key sirf server environment variable mein rahegi.
- Reusable React AI assistant component bhi `react-component/` mein diya gaya hai.
- Product catalogue, service pages, language selector, theme, FAQ/helper aur original portfolio content purane release se retained hain.

## GitHub par website publish karna
1. ZIP extract karein.
2. Is folder ke andar ki **saari files aur folders** repository ke root mein upload karein.
3. Ensure karein ki `index.html` repository ke root mein ho aur `assets/` folder uske saath ho.
4. GitHub repository → Settings → Pages → Deploy from branch → `main` → `/(root)` select karein.
5. Actions tab mein Pages deployment ka green tick check karein.

**Sirf ZIP upload mat karein.** ZIP ko extract karke uske andar ki files upload karni hain.

## AI assistant ko live kaise karein
GitHub Pages static hosting hai; Python backend ko alag Python hosting par deploy karna hoga (Render, Railway, VPS, etc.).
1. `backend/` folder ko Python hosting par deploy karein.
2. Hosting dashboard mein `OPENAI_API_KEY` secret/environment variable set karein.
3. `OPENAI_MODEL` optional hai; default `gpt-4.1-mini` hai.
4. `ALLOWED_ORIGINS` mein apni exact GitHub Pages website origin set karein.
5. Backend URL milne ke baad `assets/js/ai-assistant.js` mein `apiBase` config add karein, example:
   `window.TRYON_AI_CONFIG = { apiBase: "https://YOUR-BACKEND-DOMAIN" };`
   Ye line `ai-assistant.js` ke script tag se pehle load honi chahiye. Alternatively script ke top par config ko apne backend URL se set karein.

## Important
- AI assistant ka interface website mein added hai. AI answers tabhi kaam karenge jab Python backend deploy ho aur valid API key server par configure ho.
- API key kabhi bhi HTML, JavaScript, GitHub repository ya browser code mein paste na karein.
- Contact form ka existing behaviour purane version jaisa hi hai; direct server-side lead storage ke liye secure form service/database setup chahiye.
- Phone number, WhatsApp number, office address, product pricing, warranties aur unverified specifications invent nahi kiye gaye.
- Portfolio mein sirf Mahadev Plywood confirmed project name ke roop mein retained hai; other examples/capability areas ko verified client projects kehkar present na karein.
- Existing version ko `previous-release-backup.zip` mein bhi include kiya gaya hai.

Business email: tryontechindia@gmail.com
Founder & Director: Rudransh Mishra
