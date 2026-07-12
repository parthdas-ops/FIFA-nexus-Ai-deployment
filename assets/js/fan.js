'use strict';

// ── CONFIGURATION: HARDCODE YOUR API KEY HERE ──
    const GEMINI_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your real Google AI Studio key
    const GEMINI_MODEL_NAME = 'gemini-3.1-flash-lite'; // Stable model for chat concierge responses

    // ── Tab switcher ───────────────────────────
    function switchTab(tabId) {
      document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabId);
      if (targetView) targetView.classList.add('active');

      const activeSidebarItem = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
      if (activeSidebarItem) activeSidebarItem.classList.add('active');

      // Sync specific views
      if (tabId === 'tickets') resetQRTimer();
    }

    // ── Mobile Sidebar Toggle ──────────────────
    function toggleMobileSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
    }

    // ── Live Game Clock ────────────────────────
    const clockEl = document.getElementById('game-clock');
    let seconds = 74 * 60 + 12;
    setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      clockEl.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);

    // ── AI Concierge Responses ──────────────────
    const promptResponses = {
      "Where is my seat, Section D Row 14 Seat 06?": "📍 Your seat is located in the **West Stand (Section D)**. \n\n1. From your current location, take the Level 1 concourse staircase next to **Gate D2**.\n2. Go up to aisle D-14.\n3. Row 14 is the middle tier row, Seat 06 is next to the aisle corridor.\n\n*A glowing path has been generated on the navigation tab.* 🗺️",
      "Where is the nearest halal shawarma food stall?": "🥙 The nearest halal shawarma is **Al-Majd Kitchen** located directly at **Concourse Level 1, near Gate D2**.\n\n* Current queue time: **~3 minutes**.\n* Signature Wrap price: **$9.50**.\n\nYou can order directly from the *Fast Food tab* for instant counter pickup!",
      "Show me the quickest exit route after the match": "🚶 **Post-Match Exit Advisory:** \n\n* **Primary Route:** Exit via South Concourse Tunnel directly to the Metro station plaza. Estimated clearing time: **8-10 minutes**.\n* **Congestion Alert:** Avoid Gate A (East Tunnel) as it is predicted to experience high exit volumes (~35% bottleneck surge).\n\nLet me know if you would like to pre-book a digital Metro boarding token. 🎫",
      "How do I contact emergency medical first aid?": "🏥 **Emergency Medical Information:**\n\n* There is a fully equipped First Aid station on Level 1, near Section A (under the North scoreboard).\n* For immediate assistance, tap the **Emergency SOS** tab. It will route responders directly to your seat coordinates, emitting an active BLE locator beacon from your mobile device."
    };

    // Load Gemini API Key on start
    window.addEventListener('DOMContentLoaded', () => {
      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
        document.getElementById('gemini-key-input').value = '••••••••••••••••';
        document.getElementById('gemini-key-input').disabled = true;
        document.getElementById('gemini-key-input').title = "API Key loaded from hardcoded config";
        localStorage.setItem('gemini_api_key', GEMINI_API_KEY); // Sync to other portals
      } else {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
          document.getElementById('gemini-key-input').value = storedKey;
        }
      }
    });

    function saveGeminiKey() {
      const keyVal = document.getElementById('gemini-key-input').value.trim();
      if (keyVal) {
        localStorage.setItem('gemini_api_key', keyVal);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }

    function sendQuickQuery(query) {
      const inputBox = document.getElementById('chat-input-box');
      inputBox.value = query;
      submitChatMsg();
    }

    // Shared utilities (escapeHTML, formatMarkdown) loaded from utils.js

    async function submitChatMsg() {
      const inputBox = document.getElementById('chat-input-box');
      const userText = inputBox.value.trim();
      if (!userText) return;

      const conversation = document.getElementById('chat-conversation');

      // User Bubble
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg user animate-fadeInUp';
      userDiv.innerHTML = `<div class="chat-bubble">${escapeHTML(userText)}</div><div class="chat-time">Just now</div>`;
      conversation.appendChild(userDiv);
      conversation.scrollTop = conversation.scrollHeight;
      inputBox.value = '';

      // Typing Indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-msg bot';
      typingDiv.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
      conversation.appendChild(typingDiv);
      conversation.scrollTop = conversation.scrollHeight;

      // Check if real API Key exists
      let apiKey = null;
      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
        apiKey = GEMINI_API_KEY;
      } else {
        apiKey = localStorage.getItem('gemini_api_key');
      }
      if (apiKey) {
        // Real Gemini API Flow
        const langVal = document.getElementById('lang-select').value;
        const systemText = `You are Nexus, the official FIFA World Cup 2026 Smart Stadium guide. You know everything about the Mercedes-Benz Stadium in Atlanta. You help fans find seats, concessions, restrooms, first aid, exit routes, match updates, and food queues. Keep answers helpful, concise (maximum 3-4 sentences), and related to stadium navigation. You must respond in the language code selected: ${langVal}. Feel free to use emojis.`;

        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userText }] }],
              systemInstruction: { parts: [{ text: systemText }] }
            })
          });

          typingDiv.remove();

          const botDiv = document.createElement('div');
          botDiv.className = 'chat-msg bot animate-fadeInUp';

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Failed API call");
          }

          const data = await response.json();
          let botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
          botDiv.innerHTML = `<div class="chat-bubble">${formatMarkdown(botResponse)}</div><div class="chat-time">Just now</div>`;
          conversation.appendChild(botDiv);
        } catch (err) {
          typingDiv.remove();
          const botDiv = document.createElement('div');
          botDiv.className = 'chat-msg bot animate-fadeInUp';
          botDiv.innerHTML = `<div class="chat-bubble" style="color:var(--danger);">⚠️ Gemini API Error: ${escapeHTML(err.message)}. Please verify your API key and connection.</div><div class="chat-time">Just now</div>`;
          conversation.appendChild(botDiv);
        }
        conversation.scrollTop = conversation.scrollHeight;
      } else {
        // Fallback Mock Response Flow
        setTimeout(() => {
          typingDiv.remove();

          const botDiv = document.createElement('div');
          botDiv.className = 'chat-msg bot animate-fadeInUp';
          let botResponse = "🔍 Checking stadium live logs... I understand your question, but that system link is currently in demo sandbox mode. Paste your Gemini API key in the field above to enable real-time AI responses! 💡";

          for (let key in promptResponses) {
            if (userText.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(userText.toLowerCase())) {
              botResponse = promptResponses[key];
              break;
            }
          }

          botDiv.innerHTML = `<div class="chat-bubble">${formatMarkdown(botResponse)}</div><div class="chat-time">Just now</div>`;
          conversation.appendChild(botDiv);
          conversation.scrollTop = conversation.scrollHeight;
        }, 1200);
      }
    }

    function clearChat() {
      const conversation = document.getElementById('chat-conversation');
      conversation.innerHTML = `<div class="chat-msg bot"><div class="chat-bubble">👋 Chat session cleared. I am ready to answer any new stadium questions.</div><div class="chat-time">Just now</div></div>`;
    }

    document.getElementById('chat-input-box').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitChatMsg();
    });

    // ── Smart Stadium Map Route Planning ──────────
    function calculateRoute() {
      const dest = document.getElementById('navigation-dest').value;
      const routePath = document.getElementById('navigation-route');
      const metrics = document.getElementById('route-metrics');
      const walkTime = document.getElementById('walk-time-est');

      if (dest === 'none') {
        routePath.style.display = 'none';
        metrics.style.display = 'none';
        return;
      }

      routePath.style.display = 'block';
      metrics.style.display = 'block';

      if (dest === 'food') {
        routePath.setAttribute('d', 'M 210 280 Q 220 300 240 320');
        walkTime.textContent = '1 min 45 sec';
      } else if (dest === 'washroom') {
        routePath.setAttribute('d', 'M 210 280 Q 230 230 240 180');
        walkTime.textContent = '1 min 10 sec';
      } else if (dest === 'firstaid') {
        routePath.setAttribute('d', 'M 210 280 Q 220 180 290 130 T 400 80');
        walkTime.textContent = '4 min 12 sec';
      }
    }

    function highlightMapSector(sector) {
      document.querySelectorAll('.map-gate').forEach(el => el.classList.remove('active'));
      const activeEl = document.getElementById('gate-sec-' + sector.toLowerCase());
      if (activeEl) activeEl.classList.add('active');
    }

    function startNavigationGuide() {
      const dest = document.getElementById('navigation-dest').value;
      if (dest === 'none') {
        alert('Please choose a valid concession or gate destination first.');
        return;
      }
      alert('Audio GPS navigation mode initiated: "Head North along concourse aisle toward Section D restroom..."');
    }

    // ── Hologram Ticket Hover Effect ─────────────
    const ticketCard = document.getElementById('ticket-card');
    function handleTicketGlow(e) {
      const rect = ticketCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      // Card Tilting
      const rotY = ((x - rect.width / 2) / rect.width) * 10;
      const rotX = -((y - rect.height / 2) / rect.height) * 10;

      ticketCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      ticketCard.style.setProperty('--glow-x', `${px}%`);
      ticketCard.style.setProperty('--glow-y', `${py}%`);
    }

    function resetTicketGlow() {
      ticketCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }

    // Dynamic Ticket QR Code regenerator
    let qrTimeLeft = 10;
    let qrTimerInterval;
    function resetQRTimer() {
      clearInterval(qrTimerInterval);
      qrTimeLeft = 10;
      const timerLabel = document.getElementById('qr-timer-seconds');
      const timerLine = document.getElementById('qr-timer-line');

      timerLabel.textContent = qrTimeLeft;
      timerLine.style.width = '100%';

      qrTimerInterval = setInterval(() => {
        qrTimeLeft--;
        timerLabel.textContent = qrTimeLeft;
        timerLine.style.width = (qrTimeLeft * 10) + '%';

        if (qrTimeLeft <= 0) {
          qrTimeLeft = 10;
          timerLine.style.width = '100%';
          // Simulating QR code change blink
          const qrSvg = document.querySelector('.qr-container svg');
          qrSvg.style.opacity = '0.3';
          setTimeout(() => { qrSvg.style.opacity = '1'; }, 150);
        }
      }, 1000);
    }
    resetQRTimer();

    // ── Fast Food Ordering ────────────────────────
    let cart = [];
    function addFoodOrder(name, price) {
      cart.push({ name, price });
      updateBasket();
    }

    function updateBasket() {
      const basket = document.getElementById('basket-content');
      const totalEl = document.getElementById('basket-total');
      if (cart.length === 0) {
        basket.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding-top:40px;font-size:13px;">Basket is currently empty</div>';
        totalEl.textContent = '$0.00';
        return;
      }

      basket.innerHTML = '';
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center';
        itemDiv.style.background = 'rgba(255,255,255,0.02)';
        itemDiv.style.padding = '8px 12px';
        itemDiv.style.borderRadius = '6px';
        itemDiv.innerHTML = `
          <div>
            <div style="font-size:13px;font-weight:600;">${escapeHTML(item.name)}</div>
            <div style="font-size:11px;color:var(--text-muted);">$${item.price.toFixed(2)}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="removeBasketItem(${index})" style="color:var(--danger);padding:2px 8px;" aria-label="Remove item">✕</button>
        `;
        basket.appendChild(itemDiv);
      });
      totalEl.textContent = '$' + total.toFixed(2);
    }

    function removeBasketItem(idx) {
      cart.splice(idx, 1);
      updateBasket();
    }

    function submitFoodOrder() {
      if (cart.length === 0) {
        alert('Your basket is empty. Please select food items first.');
        return;
      }

      document.getElementById('food-checkout-card').style.display = 'none';
      const tracker = document.getElementById('food-tracker-card');
      tracker.style.display = 'flex';

      // Simulating real-time preparation steps
      let progress = 25;
      const fillBar = document.getElementById('food-tracker-progress');
      const statusBadge = document.getElementById('food-status-badge');

      setTimeout(() => {
        progress = 65;
        fillBar.style.width = '65%';
        document.getElementById('status-step-2').textContent = 'Complete';
        document.getElementById('status-step-2').style.color = 'var(--success)';
        document.getElementById('status-step-3').textContent = 'Active (Ready soon)';
        document.getElementById('status-step-3').style.color = 'var(--warning)';
        document.getElementById('track-step-3').style.color = 'var(--text-secondary)';
      }, 5000);

      setTimeout(() => {
        progress = 100;
        fillBar.style.width = '100%';
        statusBadge.textContent = 'Ready';
        statusBadge.className = 'badge badge-success';
        document.getElementById('status-step-3').textContent = 'READY FOR PICKUP';
        document.getElementById('status-step-3').style.color = 'var(--success)';
        document.getElementById('label-step-2').textContent = '✓ 2. Cooked & Prepared';
        alert('Fast Food Order Ready! Head to Gate D2 Concessions Counter 4. Show Pickup Token #73A.');
      }, 10000);
    }

    // ── Emergency SOS System ──────────────────────
    let sosTimerVal = 5;
    let sosTimerInterval;

    function triggerSOS() {
      document.getElementById('sos-trigger-state').style.display = 'none';
      document.getElementById('sos-countdown-state').style.display = 'block';

      sosTimerVal = 5;
      const label = document.getElementById('sos-timer');
      label.textContent = sosTimerVal;

      sosTimerInterval = setInterval(() => {
        sosTimerVal--;
        label.textContent = sosTimerVal;
        if (sosTimerVal <= 0) {
          clearInterval(sosTimerInterval);
          initiateSOSDispatch();
        }
      }, 1000);
    }

    function cancelSOS() {
      clearInterval(sosTimerInterval);
      document.getElementById('sos-countdown-state').style.display = 'none';
      document.getElementById('sos-dispatch-state').style.display = 'none';
      document.getElementById('sos-trigger-state').style.display = 'block';
    }

    function initiateSOSDispatch() {
      document.getElementById('sos-countdown-state').style.display = 'none';
      document.getElementById('sos-dispatch-state').style.display = 'block';

      // Simulating timer ETA decrement
      let etaSeconds = 105; // 1 min 45 sec
      const etaLabel = document.getElementById('medic-eta');

      const etaInterval = setInterval(() => {
        etaSeconds--;
        const m = Math.floor(etaSeconds / 60);
        const s = etaSeconds % 60;
        etaLabel.textContent = `${m} min ${s < 10 ? '0' : ''}${s} sec`;

        if (etaSeconds <= 0) {
          clearInterval(etaInterval);
          etaLabel.textContent = 'ARRIVED (Arriving Section D Row 14)';
        }
      }, 1000);
    }

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
