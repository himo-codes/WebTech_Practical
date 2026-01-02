document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;

  // Copy email to clipboard
  const copyBtn = document.getElementById('copyEmail');
  const email = 'himo2429@gmail.com';
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(()=> copyBtn.textContent = original, 1800);
      } catch (e) {
        window.location.href = 'mailto:' + email;
      }
    });
  }

  // Smooth in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (href && href.length>1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
});

// IntersectionObserver for pop-in animation and connect form handler
document.addEventListener('DOMContentLoaded', function(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.pop-in').forEach(el=>obs.observe(el));

  // connect form: generate mailto with visitor email and message
  const form = document.getElementById('connectForm');
  if (form){
    form.addEventListener('submit',(ev)=>{
      ev.preventDefault();
      const vEmail = document.getElementById('visitorEmail').value;
      const vMsg = document.getElementById('visitorMessage').value || '';
      const subject = encodeURIComponent('Connection request from portfolio');
      const body = encodeURIComponent('Visitor email: ' + vEmail + '\n\nMessage:\n' + vMsg + '\n\n— Sent from portfolio');
      window.location.href = `mailto:${encodeURIComponent('himo2429@gmail.com')}?subject=${subject}&body=${body}`;
    });
  }
});

// Add click pop interaction to interactive elements
document.addEventListener('DOMContentLoaded', function(){
  const clickableSelector = '.btn, .skill, .project-card, .nav a';
  const clickables = Array.from(document.querySelectorAll(clickableSelector));
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // subtle click sound using Web Audio API
  function playClickSound(){
    if (prefersReduced) return;
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 950;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.03, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start(now);
      o.stop(now + 0.14);
      // close context after short delay
      setTimeout(()=>{ try{ctx.close()}catch(e){} }, 300);
    }catch(e){}
  }

  clickables.forEach(el=>{
    el.setAttribute('tabindex', '0');
    el.style.touchAction = 'manipulation';
    el.addEventListener('click', ()=>{
      el.classList.remove('click-pop');
      void el.offsetWidth;
      el.classList.add('click-pop');
      setTimeout(()=> el.classList.remove('click-pop'), 520);
      playClickSound();
    });
    el.addEventListener('keyup', (e)=>{ if (e.key === 'Enter' || e.key === ' ') el.click(); });
  });
});
