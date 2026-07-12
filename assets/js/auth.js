'use strict';

let activeRole = 'fan';

    // Parse URL parameter on load
    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      if (roleParam && ['fan', 'admin', 'volunteer', 'vendor'].includes(roleParam)) {
        setRole(roleParam);
      } else {
        setRole('fan'); // Default fallback
      }
    });

    function setRole(role) {
      activeRole = role;
      document.querySelectorAll('.role-badge-select').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.role === role) el.classList.add('active');
      });

      // Update mock placeholder emails
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      if (role === 'fan') {
        emailInput.value = 'fan.guest@worldcup2026.com';
        passInput.value = 'nexusguestpass2026';
      } else if (role === 'admin') {
        emailInput.value = 'commander.hq@nexus.fifa.com';
        passInput.value = 'commandsecureroot2026';
      } else if (role === 'volunteer') {
        emailInput.value = 'volunteer.assist@crew.fifa.org';
        passInput.value = 'crewvolunteersecure';
      } else if (role === 'vendor') {
        emailInput.value = 'vendor.kitchen@concessions.com';
        passInput.value = 'vendorsecurekitchen';
      }
    }

    const CREDENTIALS = {
      fan: { email: 'fan.guest@worldcup2026.com', password: 'nexusguestpass2026' },
      admin: { email: 'commander.hq@nexus.fifa.com', password: 'commandsecureroot2026' },
      volunteer: { email: 'volunteer.assist@crew.fifa.org', password: 'crewvolunteersecure' },
      vendor: { email: 'vendor.kitchen@concessions.com', password: 'vendorsecurekitchen' }
    };

    function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      const expected = CREDENTIALS[activeRole];
      if (expected && expected.email === email && expected.password === password) {
        sessionStorage.setItem('nexus_user', JSON.stringify({ email, role: activeRole }));
        window.location.href = activeRole + '.html';
      } else {
        alert('Authentication failed: Invalid credentials for the selected role.');
      }
    }

    function startBiometric(type) {
      const modal = document.getElementById('scan-modal');
      const laser = document.getElementById('scan-laser');
      const icon = document.getElementById('scan-icon');
      const status = document.getElementById('scan-status');
      const subtext = document.getElementById('scan-subtext');

      modal.classList.add('active');

      if (type === 'face') {
        laser.style.display = 'block';
        icon.textContent = '👤';
        icon.style.color = 'var(--text-secondary)';
        status.textContent = 'Scanning Face Geometry...';
        subtext.textContent = 'Reading 486 points of interest on device sensor.';

        setTimeout(() => {
          status.textContent = 'Matching Neural Signature...';
          icon.style.color = 'var(--primary)';
        }, 1500);

        setTimeout(() => {
          status.textContent = 'Authentication Granted!';
          icon.textContent = '✓';
          icon.style.color = 'var(--success)';
          laser.style.display = 'none';
        }, 3000);

        setTimeout(() => {
          const email = CREDENTIALS[activeRole]?.email || `${activeRole}.guest@worldcup2026.com`;
          sessionStorage.setItem('nexus_user', JSON.stringify({ email, role: activeRole }));
          window.location.href = activeRole + '.html';
        }, 3800);

      } else {
        // Passkey flow
        laser.style.display = 'none';
        icon.textContent = '🔑';
        icon.style.color = 'var(--text-secondary)';
        status.textContent = 'Querying Hardware Passkey...';
        subtext.textContent = 'Touch your security key or biometric credential sensor.';

        setTimeout(() => {
          status.textContent = 'Signature Verified!';
          icon.textContent = '✓';
          icon.style.color = 'var(--success)';
        }, 1500);

        setTimeout(() => {
          const email = CREDENTIALS[activeRole]?.email || `${activeRole}.guest@worldcup2026.com`;
          sessionStorage.setItem('nexus_user', JSON.stringify({ email, role: activeRole }));
          window.location.href = activeRole + '.html';
        }, 2200);
      }
    }

    function cancelScan() {
      document.getElementById('scan-modal').classList.remove('active');
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
