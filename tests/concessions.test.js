/**
 * FIFA Nexus AI — Concessions System Integration Tests
 */

// Define TextEncoder/Decoder polyfills for JSDOM
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

describe('Concessions & Basket Integration Suite', () => {
  let dom;
  let window;

  beforeEach(() => {
    // Read local fan.html file
    const filePath = path.resolve(__dirname, '../pages/fan.html');
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    // Remove external utilities script tag to prevent JSDOM loading errors
    htmlContent = htmlContent.replace(/<script src="\.\.\/assets\/js\/utils\.js"><\/script>/g, '');
    htmlContent = htmlContent.replace(/<script src="\.\.\/assets\/js\/fan-guard\.js"><\/script>/g, '');
    
    // Inline the external fan.js script for JSDOM execution
    const jsPath = path.resolve(__dirname, '../assets/js/fan.js');
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    htmlContent = htmlContent.replace(
      /<script src="\.\.\/assets\/js\/fan\.js"><\/script>/g,
      () => `<script>${jsContent}</script>`
    );

    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console);

    // Emulate window and sessionStorage before parsing scripts
    dom = new JSDOM(htmlContent, {
      virtualConsole,
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost/pages/fan.html',
      beforeParse(win) {
        // Mock sessionStorage to bypass client role check
        const store = {
          'nexus_user': JSON.stringify({
            email: 'fan.guest@worldcup2026.com',
            role: 'fan'
          })
        };
        win.sessionStorage = {
          getItem: jest.fn(key => store[key] || null),
          setItem: jest.fn((k, v) => { store[k] = v.toString(); }),
          removeItem: jest.fn(k => { delete store[k]; })
        };
        // Mock standard dialog
        win.alert = jest.fn();
        // Mock shared utilities that would otherwise fail to load via relative script src
        win.checkRouteGuard = jest.fn(() => true);
        win.escapeHTML = jest.fn(str => str);
        win.formatMarkdown = jest.fn(str => str);
      }
    });

    window = dom.window;

    // Manually trigger DOMContentLoaded to invoke load bindings
    const event = window.document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(event);
  });

  afterEach(() => {
    if (window) {
      window.close();
    }
  });

  test('should initialize cart state as empty and display empty cart text', () => {
    const basketEl = window.document.getElementById('basket-content');
    expect(basketEl.innerHTML).toContain('Basket is currently empty');
  });

  test('should add items to cart, recalculate subtotal, and render order item', () => {
    window.addFoodOrder('Shawarma Wrap', 9.50);
    
    const totalEl = window.document.getElementById('basket-total');
    expect(totalEl.textContent).toBe('$9.50');

    const basketEl = window.document.getElementById('basket-content');
    expect(basketEl.innerHTML).toContain('Shawarma Wrap');
    expect(basketEl.innerHTML).toContain('$9.50');
  });

  test('should remove item from cart, update total, and show empty state when last item is removed', () => {
    window.addFoodOrder('Shawarma Wrap', 9.50);
    window.addFoodOrder('Cheesy Fries', 6.50);

    let totalEl = window.document.getElementById('basket-total');
    expect(totalEl.textContent).toBe('$16.00');

    // Remove first item
    window.removeBasketItem(0);

    totalEl = window.document.getElementById('basket-total');
    expect(totalEl.textContent).toBe('$6.50');

    // Remove last item
    window.removeBasketItem(0);

    totalEl = window.document.getElementById('basket-total');
    expect(totalEl.textContent).toBe('$0.00');

    const basketEl = window.document.getElementById('basket-content');
    expect(basketEl.innerHTML).toContain('Basket is currently empty');
  });

  test('should trigger order preparation tracking and switch UI display elements', () => {
    // Basket is empty by default, submit should alert
    window.submitFoodOrder();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('basket is empty'));

    // Populate basket and submit
    window.addFoodOrder('Classic Hotdog', 5.00);
    window.submitFoodOrder();

    const checkoutCard = window.document.getElementById('food-checkout-card');
    const trackerCard = window.document.getElementById('food-tracker-card');

    expect(checkoutCard.style.display).toBe('none');
    expect(trackerCard.style.display).toBe('flex');
  });
});
