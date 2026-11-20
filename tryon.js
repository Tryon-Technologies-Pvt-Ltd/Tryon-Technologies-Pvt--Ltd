
(() => {
  'use strict';
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  const menuButton = document.querySelector('.menu');
  menuButton?.addEventListener('click', () => {
    const open = document.querySelector('.links')?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });

  function initReveal() {
    const active = document.querySelector('.page.active');
    if (!active) return;
    const items = active.querySelectorAll('.reveal,.reveal-left,.reveal-right');
    if (!('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: .12, rootMargin: '0px 0px -40px'});
    items.forEach(item => observer.observe(item));
  }

  window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (height > 0 ? window.scrollY / height * 100 : 0) + '%';
  }, {passive: true});
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', event => {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
      glow.style.opacity = '1';
    }, {passive: true});
    window.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }
  const visual = document.querySelector('.hero-visual');
  if (visual && window.matchMedia('(pointer:fine)').matches) {
    visual.addEventListener('mousemove', event => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      visual.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
    });
    visual.addEventListener('mouseleave', () => visual.style.transform = '');
  }

  // Google Website Translator: supports the requested languages and additional options.
  window.googleTranslateElementInit = function () {
    if (window.google?.translate?.TranslateElement) {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,de,fr,es,bn,ar,gu,ja,pt,zh-CN,it,ru',
        autoDisplay: false
      }, 'google_translate_element');
    }
  };
  const languageSelect = document.getElementById('languageSelect');
  languageSelect?.addEventListener('change', () => {
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) {
      toast('The translation service is loading. Please try again in a moment.');
      return;
    }
    combo.value = languageSelect.value;
    combo.dispatchEvent(new Event('change', {bubbles: true}));
    document.documentElement.setAttribute('lang', languageSelect.value);
  });
  const translateScript = document.createElement('script');
  translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  translateScript.async = true;
  translateScript.onerror = () => toast('Automatic translation could not load. Please check your internet connection.');
  document.head.appendChild(translateScript);

  // Email-based contact form. No message is uploaded or stored by this static site.
  document.getElementById('contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent('Website enquiry: ' + data.get('service'));
    const body = encodeURIComponent(
      `Name: ${data.get('name')}
Email: ${data.get('email')}
Phone: ${data.get('phone') || 'Not provided'}
Service: ${data.get('service')}

Project details:
${data.get('message')}`
    );
    document.getElementById('contactFormStatus').textContent = 'Opening your email application with the enquiry details…';
    window.location.href = `mailto:tryontechindia@gmail.com?subject=${subject}&body=${body}`;
  });

  // Local-only content dashboard: edits remain in this browser and can be exported.
  const STORE_KEY = 'tryon-site-content-v1';
  const readStore = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {projects: [], testimonials: []}; }
    catch { return {projects: [], testimonials: []}; }
  };
  const saveStore = value => localStorage.setItem(STORE_KEY, JSON.stringify(value));
  const testimonialList = document.getElementById('testimonialList');
  function renderProjects() {
    const list = document.getElementById('managedProjectList');
    if (!list) return;
    const projects = readStore().projects;
    list.replaceChildren();
    projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'work-card';
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'TRYON PROJECT';
      const title = document.createElement('h3'); title.textContent = project.title;
      const description = document.createElement('p'); description.textContent = project.description;
      card.append(tag, title, description); list.appendChild(card);
    });
  }
  function renderTestimonials() {
    if (!testimonialList) return;
    const items = readStore().testimonials;
    testimonialList.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Client testimonials will appear here after they are reviewed and approved.';
      testimonialList.appendChild(empty);
      return;
    }
    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'quote';
      const stars = document.createElement('div'); stars.className = 'stars'; stars.textContent = '★★★★★';
      const quote = document.createElement('p'); quote.textContent = '“' + item.quote + '”';
      const name = document.createElement('strong'); name.textContent = item.name;
      const company = document.createElement('small'); company.textContent = item.company || 'Client';
      card.append(stars, quote, name, company);
      testimonialList.appendChild(card);
    });
  }
  renderTestimonials();
  renderProjects();

  const modal = document.getElementById('adminModal');
  const openAdmin = document.getElementById('openAdmin');
  const closeAdmin = document.getElementById('closeAdmin');
  function renderAdminList() {
    const list = document.getElementById('adminContentList');
    if (!list) return;
    const store = readStore();
    list.replaceChildren();
    [...store.projects.map((x,i)=>({type:'Project',title:x.title,index:i})),
     ...store.testimonials.map((x,i)=>({type:'Testimonial',title:x.name,index:i}))].forEach(entry => {
      const row = document.createElement('div'); row.className = 'admin-list-item';
      const label = document.createElement('span'); label.textContent = `${entry.type}: ${entry.title}`;
      const del = document.createElement('button'); del.type = 'button'; del.textContent = 'Remove';
      del.addEventListener('click', () => {
        const latest = readStore();
        (entry.type === 'Project' ? latest.projects : latest.testimonials).splice(entry.index, 1);
        saveStore(latest); renderAdminList(); renderTestimonials(); toast('Removed from this browser.');
      });
      row.append(label, del); list.appendChild(row);
    });
    if (!list.children.length) list.textContent = 'No locally saved content yet.';
  }
  openAdmin?.addEventListener('click', () => {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
    renderAdminList();
  });
  closeAdmin?.addEventListener('click', () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
  });
  modal?.addEventListener('click', event => {
    if (event.target === modal) closeAdmin?.click();
  });
  document.getElementById('adminProjectForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const store = readStore();
    store.projects.push({title: data.get('projectTitle'), description: data.get('projectDescription')});
    saveStore(store); form.reset(); renderAdminList(); renderProjects(); toast('Project saved in this browser only.');
  });
  document.getElementById('adminTestimonialForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const store = readStore();
    store.testimonials.push({name: data.get('clientName'), company: data.get('clientCompany'), quote: data.get('clientQuote')});
    saveStore(store); form.reset(); renderAdminList(); renderTestimonials(); toast('Testimonial saved in this browser only.');
  });
  document.getElementById('exportAdmin')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(readStore(), null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tryon-site-content.json'; a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('clearAdmin')?.addEventListener('click', () => {
    if (!confirm('Delete all locally saved projects and testimonials from this browser?')) return;
    saveStore({projects: [], testimonials: []}); renderAdminList(); renderProjects(); renderTestimonials(); toast('Local content cleared.');
  });

  // FAQ chat helper. This is an on-site FAQ assistant, not a staffed live-agent service.
  const chatPanel = document.getElementById('chatPanel');
  document.getElementById('chatToggle')?.addEventListener('click', () => chatPanel?.classList.toggle('open'));
  document.getElementById('chatClose')?.addEventListener('click', () => chatPanel?.classList.remove('open'));
  document.querySelectorAll('[data-chat-question]').forEach(button => button.addEventListener('click', () => {
    const answer = document.getElementById('chatResponse');
    const answers = {
      services: 'Tryon offers websites and software, AI and automation, networking, cybersecurity, CCTV, cloud, IoT and IT support.',
      quote: 'Please use the project enquiry form or email tryontechindia@gmail.com with your requirements and expected timeline.',
      support: 'For support or maintenance enquiries, email tryontechindia@gmail.com with your site or system details.'
    };
    answer.textContent = answers[button.dataset.chatQuestion] || answers.quote;
  }));

  // Configure the company's WhatsApp number below in international format, digits only.
  const WHATSAPP_NUMBER = '';
  document.getElementById('whatsappButton')?.addEventListener('click', () => {
    if (!WHATSAPP_NUMBER) {
      toast('WhatsApp is ready to connect. Add the company WhatsApp number in the site configuration first.');
      window.location.href = 'contact.html';
      return;
    }
    const message = encodeURIComponent('Hello Tryon Technologies, I would like to discuss a business requirement.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  });

  let toastTimer;
  function toast(message) {
    const el = document.getElementById('siteToast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
  }
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      modal?.classList.remove('open');
      chatPanel?.classList.remove('open');
    }
  });


  // Interactive product catalogue: category chips and live text search.
  const productCards = [...document.querySelectorAll('.product-card[data-category]')];
  const productSearch = document.getElementById('productSearch');
  const productFilters = [...document.querySelectorAll('[data-product-filter]')];
  const productResultCount = document.getElementById('productResultCount');
  let activeProductFilter = 'all';
  function filterProducts() {
    const term = (productSearch?.value || '').trim().toLowerCase();
    let visible = 0;
    productCards.forEach(card => {
      const matchesCategory = activeProductFilter === 'all' || card.dataset.category === activeProductFilter;
      const matchesText = !term || (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase().includes(term);
      const show = matchesCategory && matchesText;
      card.hidden = !show;
      if (show) visible++;
    });
    if (productResultCount) productResultCount.textContent = `Showing ${visible} of ${productCards.length} products`;
  }
  productFilters.forEach(button => button.addEventListener('click', () => {
    activeProductFilter = button.dataset.productFilter;
    productFilters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    filterProducts();
  }));
  productSearch?.addEventListener('input', filterProducts);
  filterProducts();

  initReveal();
})();



(()=>{
 const v=document.querySelector('.hero-video');
 if(!v) return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{ if(reduce.matches || document.hidden){v.pause();} else {const p=v.play(); if(p&&p.catch)p.catch(()=>{});} };
 document.addEventListener('visibilitychange',sync);
 if(reduce.addEventListener) reduce.addEventListener('change',sync);
 sync();
})();



(()=>{
  const root=document.documentElement;
  const button=document.getElementById('themeToggle');
  if(!button) return;
  let saved='dark';
  try{saved=localStorage.getItem('tryon-theme')||'dark'}catch(e){}
  function apply(theme){
    const value=theme==='light'?'light':'dark';
    root.dataset.theme=value;
    const icon=button.querySelector('.theme-icon');
    const label=button.querySelector('.theme-label');
    if(icon) icon.textContent=value==='dark'?'☼':'◐';
    if(label) label.textContent=value==='dark'?'White mode':'Blue mode';
    button.setAttribute('aria-label',value==='dark'?'Switch to white mode':'Switch to blue mode');
    button.setAttribute('aria-pressed',String(value==='light'));
    try{localStorage.setItem('tryon-theme',value)}catch(e){}
  }
  button.addEventListener('click',()=>apply(root.dataset.theme==='light'?'dark':'light'));
  apply(saved);
})();
