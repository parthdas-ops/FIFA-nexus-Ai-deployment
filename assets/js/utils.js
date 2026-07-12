/**
 * FIFA Nexus AI — Shared Utility Library
 * @module utils
 * @description Centralised security, sanitisation, and performance utilities
 *   shared across all FIFA Nexus AI portal pages. Every portal page loads this
 *   script synchronously in the document head so that route guards, escaping
 *   helpers, and UI utilities are available before any DOM content renders.
 * @version 2.0.0
 * @license MIT
 */
'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURATION CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Immutable application-wide configuration.
 * Using Object.freeze prevents accidental mutation of security-critical values.
 * @constant {Object}
 */
var NEXUS_CONFIG = Object.freeze({
  /** @type {string} SessionStorage key for the authenticated user token */
  SESSION_KEY: 'nexus_user',
  /** @type {string} Redirect target when access is denied */
  AUTH_PAGE: 'auth.html',
  /** @type {number} Maximum allowed length for user text inputs (chars) */
  MAX_INPUT_LENGTH: 2000,
  /** @type {number} Default debounce delay in milliseconds */
  DEBOUNCE_MS: 150,
  /** @type {string} Content-Security-Policy for meta tag injection */
  CSP_CONTENT: "default-src 'self'; script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
});

/* ═══════════════════════════════════════════════════════════════════════════
   SANITISATION UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Escapes HTML special characters to prevent DOM-based XSS.
 * Converts &, <, >, ", and ' into their HTML entity equivalents.
 * @param {string|null|undefined} str — Raw string to escape.
 * @returns {string} The escaped string, or empty string if input is falsy.
 * @example
 *   escapeHTML('<script>alert("xss")</script>')
 *   // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitises and caps user input to a safe length.
 * Trims whitespace and truncates to prevent payload overflow or denial-of-service
 * through excessively long strings.
 * @param {string|null|undefined} str — Raw user input.
 * @param {number} [maxLength=NEXUS_CONFIG.MAX_INPUT_LENGTH] — Maximum character count.
 * @returns {string} Trimmed and length-capped string.
 * @example
 *   sanitizeInput('  hello world  ', 5) // => 'hello'
 */
function sanitizeInput(str, maxLength) {
  if (!str) return '';
  var limit = (typeof maxLength === 'number' && maxLength > 0)
    ? maxLength
    : NEXUS_CONFIG.MAX_INPUT_LENGTH;
  return String(str).trim().substring(0, limit);
}

/**
 * Escapes HTML entities then translates basic Markdown syntax into safe HTML.
 * Supports **bold**, *italic*, `code`, and \n line breaks.
 * Input is always escaped first to prevent XSS through Markdown content.
 * @param {string|null|undefined} text — Raw Markdown-flavoured text.
 * @returns {string} Safe HTML string with Markdown formatting applied.
 * @example
 *   formatMarkdown('**Hello** *World*')
 *   // => '<strong>Hello</strong> <em>World</em>'
 */
function formatMarkdown(text) {
  if (!text) return '';
  var escaped = escapeHTML(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
}

/* ═══════════════════════════════════════════════════════════════════════════
   SESSION & SECURITY UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Parses the session token from sessionStorage and validates the role field.
 * Returns the parsed user object on success, or null on any failure
 * (missing token, malformed JSON, wrong role, missing role field).
 * @param {string} requiredRole — The role string the user must have (e.g. 'admin', 'fan').
 * @returns {{ email: string, role: string } | null} The parsed user or null.
 */
function validateSessionToken(requiredRole) {
  if (typeof sessionStorage === 'undefined') return null;
  var userStr = sessionStorage.getItem(NEXUS_CONFIG.SESSION_KEY);
  if (!userStr) return null;
  try {
    var user = JSON.parse(userStr);
    if (!user || typeof user.role !== 'string') return null;
    if (user.role !== requiredRole) return null;
    return user;
  } catch (e) {
    return null;
  }
}

/**
 * Client-side route guard that checks the user session and either grants
 * access (showing the page) or blocks it (hiding the page and redirecting).
 *
 * Security flow:
 *   1. Page loads with `body { display: none }` in a head style tag.
 *   2. This function runs synchronously in the head.
 *   3. If the token is invalid, the HTML root is hidden and we redirect.
 *   4. If valid, a DOMContentLoaded listener unhides the body.
 *
 * This prevents visual flash of protected content even if scripts are slow.
 *
 * @param {string} requiredRole — The role required to view this page.
 * @returns {boolean} True if access is granted, false otherwise.
 */
function checkRouteGuard(requiredRole) {
  if (typeof window === 'undefined') return false;

  var user = validateSessionToken(requiredRole);

  if (!user) {
    // Block: hide everything and redirect
    if (typeof document !== 'undefined') {
      document.documentElement.style.display = 'none';
    }
    alert('Access Denied: Please log in first.');
    window.location.replace(NEXUS_CONFIG.AUTH_PAGE);
    return false;
  }

  // Grant: schedule body reveal on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    document.body.style.display = 'block';
  });
  return true;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Creates a debounced version of a function that delays invocation until
 * after `delay` milliseconds have elapsed since the last call.
 * Useful for scroll, resize, and input handlers.
 * @param {Function} fn — The function to debounce.
 * @param {number} [delay=NEXUS_CONFIG.DEBOUNCE_MS] — Delay in milliseconds.
 * @returns {Function} The debounced function.
 * @example
 *   window.addEventListener('scroll', debounce(handleScroll, 100), { passive: true });
 */
function debounce(fn, delay) {
  var timerId = null;
  var wait = (typeof delay === 'number' && delay > 0) ? delay : NEXUS_CONFIG.DEBOUNCE_MS;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE EXPORTS (Node.js / Jest compatibility)
   ═══════════════════════════════════════════════════════════════════════════ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NEXUS_CONFIG: NEXUS_CONFIG,
    escapeHTML: escapeHTML,
    sanitizeInput: sanitizeInput,
    formatMarkdown: formatMarkdown,
    validateSessionToken: validateSessionToken,
    checkRouteGuard: checkRouteGuard,
    debounce: debounce
  };
}
