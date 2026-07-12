'use strict';

// ── CONFIGURATION: HARDCODE YOUR API KEY HERE ──
    const GEMINI_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your real Google AI Studio key

    // ── Tab switcher ───────────────────────────
    function switchTab(tabId) {
      document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabId);
      if (targetView) targetView.classList.add('active');

      const activeSidebarItem = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
      if (activeSidebarItem) activeSidebarItem.classList.add('active');
    }

    // ── Mobile Sidebar Toggle ──────────────────
    function toggleMobileSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('open');
    }

    // ── Complete Tasks ─────────────────────────
    let remainingTasks = 3;
    function completeTask(taskId) {
      const card = document.getElementById('task-card-' + taskId);
      card.classList.add('completed');
      card.querySelector('button').disabled = true;
      card.querySelector('button').textContent = 'Completed ✓';
      card.querySelector('button').className = 'btn btn-outline btn-sm';

      remainingTasks--;
      document.getElementById('active-task-label').textContent = `${remainingTasks} Tasks Remaining`;

      if (remainingTasks === 0) {
        document.getElementById('active-task-label').textContent = 'All Clear ✓';
        document.getElementById('active-task-label').style.color = 'var(--success)';
        alert('All shift assignments complete. Standing by for operations dispatch...');
      }
    }

    // ── AI Translation Desk Mock ───────────────
    const translationsList = {
      "ar": {
        "text": "أين يقع مكتب المفقودات؟ لقد فقدت محفظتي بالقرب من البوابة د.",
        "translation": "📍 **Translation:** \"Where is the Lost & Found office? I lost my wallet near Gate D.\"\n\n* **Suggested Response:** Guide the fan to the Section D Guest Services counter, or file a lost item report on their Fan App."
      },
      "es": {
        "text": "¿Dónde puedo encontrar agua potable? El clima de Atlanta está muy caluroso hoy.",
        "translation": "💧 **Translation:** \"Where can I find drinking water? The Atlanta weather is very hot today.\"\n\n* **Suggested Response:** Direct them to the nearest eco-cooling hydration fountain next to Section D row 10."
      },
      "fr": {
        "text": "Mon ticket ne s'affiche pas sur mon téléphone. Pouvez-vous m'aider ?",
        "translation": "🎫 **Translation:** \"My ticket is not loading on my phone. Can you help me?\"\n\n* **Suggested Response:** Verify their identity using the face registration desk, or redirect them to Ticket Resolution Window 3."
      }
    };

    function simulateSpeechToText() {
      const src = document.getElementById('translate-source-lang').value;
      const input = document.getElementById('translate-input-box');

      if (src === 'ar') {
        input.value = "أين يقع مكتب المفقودات؟ لقد فقدت محفظتي بالقرب من البوابة د.";
      } else if (src === 'es') {
        input.value = "¿Dónde puedo encontrar agua potable? El clima de Atlanta está muy caluroso hoy.";
      } else {
        input.value = "Mon ticket ne s'affiche pas sur mon téléphone. Pouvez-vous m'aider ?";
      }
    }

    // Shared formatMarkdown utility function loaded from utils.js

    async function executeTranslation() {
      const src = document.getElementById('translate-source-lang').value;
      const output = document.getElementById('translate-output-box');
      const inputVal = document.getElementById('translate-input-box').value.trim();

      if (!inputVal) {
        alert('Please select or type a statement to translate.');
        return;
      }

      output.textContent = 'Processing neural translation context...';

      // Check if real API Key exists
      let apiKey = null;
      if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
        apiKey = GEMINI_API_KEY;
      } else {
        apiKey = localStorage.getItem('gemini_api_key');
      }
      if (apiKey) {
        try {
          const systemText = `You are a real-time speech translation assistant at the FIFA World Cup 2026. Translate the user input text from language code ${src} into clear English. Along with the translation, add a single bullet point titled "Suggested Response" providing helpful advice for a stadium volunteer handling this situation. Limit response to 3 sentences total. Use markdown formatting.`;

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: inputVal }] }],
              systemInstruction: { parts: [{ text: systemText }] }
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Failed API call");
          }

          const data = await response.json();
          let translationResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "No translation output.";
          output.innerHTML = formatMarkdown(translationResult);
        } catch (err) {
          output.innerHTML = `<span style="color:var(--danger);">⚠️ Translation Error: ${escapeHTML(err.message)}. Verification key issue or network error.</span>`;
        }
      } else {
        // Fallback Mock Response Flow
        setTimeout(() => {
          if (translationsList[src] && inputVal.includes(translationsList[src].text.slice(0, 10))) {
            output.innerHTML = formatMarkdown(translationsList[src].translation);
          } else {
            output.innerHTML = `📍 **Translation:** "Can you direct me to the nearest concession vendor?"<br/><br/>* **Suggested Response:** Concourse Level 1 concessions are next to Gate D.<br/><br/>💡 *Note: Enter your Gemini API key in the Fan Portal settings to translate arbitrary inputs using live AI.*`;
          }
        }, 800);
      }
    }

    // ── Submit Incident Report ──────────────────
    function submitIncident(e) {
      e.preventDefault();
      const type = document.getElementById('inc-type').value;
      const loc = document.getElementById('inc-loc').value;
      const desc = document.getElementById('inc-desc').value;

      alert(`Alert successfully transmitted to HQ Dispatch!\nClass: ${type.toUpperCase()}\nLocation: ${loc}`);
      document.getElementById('incident-report-form').reset();
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
