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

    // ── Advance Order preparation state ────────
    let activePendingCount = 2;
    function advanceOrder(orderId) {
      const card = document.getElementById('order-card-' + orderId);
      const label = document.getElementById('status-label-' + orderId);
      const btn = document.getElementById('btn-order-' + orderId);

      if (label.textContent === 'Cooking') {
        label.textContent = 'Ready';
        label.className = 'badge badge-success';
        btn.textContent = 'Complete Dispatch';
        btn.className = 'btn btn-outline btn-sm';
      } else {
        // Complete order removal
        card.remove();
        activePendingCount--;
        document.getElementById('pending-counter').textContent = `${activePendingCount} Orders Cooking`;
        if (activePendingCount === 0) {
          document.getElementById('pending-counter').textContent = 'Queue Clear';
          document.getElementById('pending-counter').style.color = 'var(--success)';
        }
      }
    }

    // ── Simulate New Order incoming ────────────
    function simulateNewOrder() {
      activePendingCount++;
      document.getElementById('pending-counter').textContent = `${activePendingCount} Orders Cooking`;
      document.getElementById('pending-counter').style.color = 'var(--warning)';

      const container = document.getElementById('orders-list-container');
      const mockId = Math.floor(Math.random() * 90) + 10;

      const orderDiv = document.createElement('div');
      orderDiv.className = 'glass-card p-6 order-card flex justify-between items-center animate-fadeInUp';
      orderDiv.id = 'order-card-' + mockId;
      orderDiv.innerHTML = `
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="badge badge-gold">Token #${mockId}X</span>
            <span class="badge badge-warning" id="status-label-${mockId}">Cooking</span>
            <span style="font-size:12px;color:var(--text-muted);">Placed just now</span>
          </div>
          <h3 style="font-size:18px;margin-top:8px;">1x Shawarma Wrap, 2x Cheesy Fries</h3>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;">Client: Robert Davis (Section D Row 8 Seat 14). Payment: Mobile verification confirmed.</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" id="btn-order-${mockId}" onclick="advanceOrder(${mockId})">Mark Ready for Pickup</button>
        </div>
      `;

      container.insertBefore(orderDiv, container.firstChild);
      alert('Incoming concession order submitted!');
    }

    // ── Live Revenue Counter Increments ─────────
    let revenueVal = 4842.50;
    const revCounter = document.getElementById('revenue-counter-val');
    setInterval(() => {
      revenueVal += Math.random() > 0.4 ? 9.50 : 5.00;
      revCounter.textContent = '$' + revenueVal.toFixed(2);
    }, 4500);

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
