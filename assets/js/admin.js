'use strict';

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

    // ── Live Fan Count Increments (cached DOM ref) ──
    var liveFansEl = document.getElementById('fan-count-live');
    var fans = 64847;
    setInterval(function () {
      fans += Math.floor(Math.random() * 8) - 3;
      fans = Math.max(64000, Math.min(65000, fans));
      liveFansEl.textContent = fans.toLocaleString();
    }, 3000);

    // ── Simulate Heatmap Shifts ────────────────
    function simulateHeatmapShift() {
      const sliderVal = document.getElementById('heatmap-time-slider').value;
      const label = document.getElementById('time-prediction-label');

      const zoneA = document.getElementById('hm-sec-a');
      const zoneB = document.getElementById('hm-sec-b');
      const zoneC = document.getElementById('hm-sec-c');
      const zoneD = document.getElementById('hm-sec-d');

      const valA = document.getElementById('hm-val-a');
      const valB = document.getElementById('hm-val-b');
      const valC = document.getElementById('hm-val-c');
      const valD = document.getElementById('hm-val-d');

      if (sliderVal === '0') {
        label.textContent = 'LIVE STATUS';
        zoneA.setAttribute('fill', 'url(#grad-low)');
        zoneB.setAttribute('fill', 'url(#grad-high)');
        zoneC.setAttribute('fill', 'url(#grad-low)');
        zoneD.setAttribute('fill', 'url(#grad-med)');

        valA.textContent = '38% (Normal)'; valA.style.color = 'var(--success)';
        valB.textContent = '88% (Bottle-Neck)'; valB.style.color = 'var(--danger)';
        valC.textContent = '42% (Normal)'; valC.style.color = 'var(--success)';
        valD.textContent = '64% (Dense)'; valD.style.color = 'var(--warning)';
      } else if (sliderVal === '1') {
        label.textContent = 'PREDICTION: +15 MIN';
        zoneA.setAttribute('fill', 'url(#grad-med)');
        zoneB.setAttribute('fill', 'url(#grad-med)');
        zoneC.setAttribute('fill', 'url(#grad-low)');
        zoneD.setAttribute('fill', 'url(#grad-high)');

        valA.textContent = '52% (Dense)'; valA.style.color = 'var(--warning)';
        valB.textContent = '68% (Dense)'; valB.style.color = 'var(--warning)';
        valC.textContent = '45% (Normal)'; valC.style.color = 'var(--success)';
        valD.textContent = '84% (Bottle-Neck)'; valD.style.color = 'var(--danger)';
      } else if (sliderVal === '2') {
        label.textContent = 'PREDICTION: +30 MIN';
        zoneA.setAttribute('fill', 'url(#grad-high)');
        zoneB.setAttribute('fill', 'url(#grad-low)');
        zoneC.setAttribute('fill', 'url(#grad-med)');
        zoneD.setAttribute('fill', 'url(#grad-low)');

        valA.textContent = '91% (Bottle-Neck)'; valA.style.color = 'var(--danger)';
        valB.textContent = '41% (Normal)'; valB.style.color = 'var(--success)';
        valC.textContent = '55% (Dense)'; valC.style.color = 'var(--warning)';
        valD.textContent = '36% (Normal)'; valD.style.color = 'var(--success)';
      } else {
        label.textContent = 'PREDICTION: POST-MATCH EXIT';
        zoneA.setAttribute('fill', 'url(#grad-high)');
        zoneB.setAttribute('fill', 'url(#grad-high)');
        zoneC.setAttribute('fill', 'url(#grad-high)');
        zoneD.setAttribute('fill', 'url(#grad-high)');

        valA.textContent = '96% (Bottle-Neck)'; valA.style.color = 'var(--danger)';
        valB.textContent = '98% (Bottle-Neck)'; valB.style.color = 'var(--danger)';
        valC.textContent = '94% (Bottle-Neck)'; valC.style.color = 'var(--danger)';
        valD.textContent = '97% (Bottle-Neck)'; valD.style.color = 'var(--danger)';
      }
    }

    // ── Live Security Alert Simulator ──────────
    function triggerTestAlarm() {
      const feed = document.getElementById('ops-log-feed');
      const counter = document.getElementById('alert-counter-live');

      // Update counters
      counter.textContent = '2';
      counter.parentElement.querySelector('.metric-change').textContent = '↑ 2 Active Emergency Actions';
      counter.parentElement.querySelector('.metric-change').className = 'metric-change down';

      // Prepend alarm log to stream
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      const newAlert = document.createElement('div');
      newAlert.style.display = 'flex';
      newAlert.style.alignItems = 'start';
      newAlert.style.gap = '12px';
      newAlert.style.background = 'rgba(255,59,78,0.05)';
      newAlert.style.border = '1px solid rgba(255,59,78,0.1)';
      newAlert.style.padding = '12px';
      newAlert.style.borderRadius = '8px';
      newAlert.className = 'animate-fadeInUp';
      newAlert.innerHTML = `
        <span style="font-size:18px;">🚨</span>
        <div style="flex-1;">
          <div style="display:flex;justify-content:between;font-weight:700;font-size:13px;color:var(--danger);">
            <span>AI CCTV Panic Threat</span>
            <span>${timeStr}</span>
          </div>
          <p style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Crowd panic/fall surge detected in Section D Gate D2 corridor. Dispatching standby safety marshalls immediately.</p>
        </div>
      `;

      feed.insertBefore(newAlert, feed.firstChild);
      alert('Security Threat Alarm Broadcasted: standby units alerted.');
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
