'use strict';

// ── Live fan counter update ────────────────
  const fansEl = document.getElementById('live-fans');
  let fans = 64847;
  setInterval(() => {
    fans += Math.floor(Math.random() * 20) - 8;
    fans = Math.max(63000, Math.min(65000, fans));
    fansEl.textContent = fans.toLocaleString();
  }, 2500);

  // ── Scroll reveal ──────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Count-up animation ─────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString() + (target === 99 ? '.9%' : target === 100 ? '+' : target === 65000 ? '' : '');
        }, 25);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));

  // ── Demo chat animation ────────────────────
  setTimeout(() => {
    document.getElementById('typing-msg').style.display = '';
    setTimeout(() => {
      document.getElementById('typing-msg').style.display = 'none';
      document.getElementById('bot-response').style.display = '';
    }, 2000);
  }, 1500);

  // ── Demo input send ────────────────────────
  var demoInputEl = document.getElementById('demo-input');
  var chatDemoEl = document.getElementById('chat-demo');
  const demoResponses = [
    "🔍 Let me check that for you… The nearest restroom from your current location is on Level 2, Section C — about 90 seconds walk. All restrooms are currently clean and accessible. ♿",
    "🚌 The shuttle to Downtown Hotel Zone departs every 15 minutes. Next departure: <strong>8 minutes</strong>. Estimated journey time: 22 minutes. Platform 3, Gate F exit.",
    "📊 Current crowd density in your section is <strong>72%</strong> — comfortable! Peak congestion is expected near Gate A post-match. I recommend exiting via Gate D for a faster route. 🟢",
    "🎵 The halftime show starts in <strong>23 minutes</strong>! Today's performer is a special surprise act. Fan zones around Gates B and C have premium viewing spots available.",
    "🏥 The nearest First Aid station is at Section B, Row 12. Medical staff are on standby 24/7. For emergencies, tap the SOS button in the app or press any red emergency button.",
  ];
  let demoIdx = 0;

  // escapeHTML is loaded from shared assets/js/utils.js

  function sendDemoMsg() {
    var msg = sanitizeInput(demoInputEl.value);
    if (!msg) return;
    var chat = chatDemoEl;

    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.innerHTML = `<div class="chat-bubble">${escapeHTML(msg)}</div><div class="chat-time">Just now</div>`;
    chat.appendChild(userDiv);

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
    demoInputEl.value = '';

    setTimeout(() => {
      typingDiv.remove();
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.innerHTML = `<div class="chat-bubble">${demoResponses[demoIdx % demoResponses.length]}</div><div class="chat-time">Just now</div>`;
      chat.appendChild(botDiv);
      chat.scrollTop = chat.scrollHeight;
      demoIdx++;
    }, 1500);
  }

  demoInputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendDemoMsg();
  }, { passive: false });

  // ── Navbar scroll effect (debounced for performance) ───
  var navEl = document.querySelector('nav');
  window.addEventListener('scroll', debounce(function () {
    if (window.scrollY > 20) {
      navEl.style.background = 'rgba(5,10,20,0.97)';
    } else {
      navEl.style.background = 'rgba(5,10,20,0.85)';
    }
  }, 100), { passive: true });

// ── Unified Event Delegation & Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
  // Global click delegator
  document.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    
    const action = actionEl.dataset.action;
    
    if (action === 'switchTab') {
      switchTab(actionEl.dataset.target);
    } else if (action === 'setRole') {
      setRole(actionEl.dataset.target);
    } else if (action === 'sendQuickQuery') {
      sendQuickQuery(actionEl.dataset.target);
    } else if (action === 'highlightMapSector') {
      highlightMapSector(actionEl.dataset.target);
    } else if (action === 'completeTask') {
      completeTask(parseInt(actionEl.dataset.id));
    } else if (action === 'advanceOrder') {
      advanceOrder(parseInt(actionEl.dataset.id));
    } else if (action === 'addFoodOrder') {
      addFoodOrder(actionEl.dataset.item, parseFloat(actionEl.dataset.price));
    } else if (action === 'removeBasketItem') {
      removeBasketItem(parseInt(actionEl.dataset.index));
    } else if (action === 'startBiometric') {
      startBiometric(actionEl.dataset.type);
    } else if (action === 'toggleMapOverlay') {
      toggleMapOverlay(actionEl.dataset.target);
    } else if (action === 'sendDemoMsg') {
      sendDemoMsg();
    } else if (action === 'cancelScan') {
      cancelScan();
    } else if (action === 'triggerTestAlarm') {
      triggerTestAlarm();
    } else if (action === 'toggleMobileSidebar') {
      toggleMobileSidebar();
    } else if (action === 'submitChatMsg') {
      submitChatMsg();
    } else if (action === 'clearChat') {
      clearChat();
    } else if (action === 'startNavigationGuide') {
      startNavigationGuide();
    } else if (action === 'submitFoodOrder') {
      submitFoodOrder();
    } else if (action === 'resetFoodTracker') {
      resetFoodTracker();
    } else if (action === 'triggerSOSAlarm') {
      triggerSOSAlarm();
    } else if (action === 'cancelSOS') {
      cancelSOS();
    } else if (action === 'simulateNewOrder') {
      simulateNewOrder();
    } else if (action === 'simulateSpeechToText') {
      simulateSpeechToText();
    } else if (action === 'executeTranslation') {
      executeTranslation();
    } else if (action === 'alert') {
      alert(actionEl.dataset.message);
    }
  });

  // Logout listener
  document.querySelectorAll('.logout-link').forEach(el => {
    el.addEventListener('click', () => {
      sessionStorage.removeItem('nexus_user');
    });
  });

  // Form submit listeners
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', handleLogin);
  }

  const incidentForm = document.getElementById('incident-form');
  if (incidentForm) {
    incidentForm.addEventListener('submit', submitIncident);
  }

  // Input listeners
  const slider = document.getElementById('heatmap-time-slider');
  if (slider) {
    slider.addEventListener('input', simulateHeatmapShift);
  }
});
