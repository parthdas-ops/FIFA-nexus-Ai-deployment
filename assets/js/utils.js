/**
 * FIFA Nexus AI — Shared Utility Script
 */

// escapeHTML sanitizes untrusted input to prevent DOM XSS
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// formatMarkdown escapes HTML and parses basic markdown syntax into safe HTML tags
function formatMarkdown(text) {
  if (!text) return '';
  const escaped = escapeHTML(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
}

// checkRouteGuard validates user role access and manages visual leakage protection
function checkRouteGuard(requiredRole) {
  if (typeof sessionStorage === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  const userStr = sessionStorage.getItem('nexus_user');
  if (!userStr) {
    if (typeof document !== 'undefined') {
      document.documentElement.style.display = 'none';
    }
    alert('Access Denied: Please log in first.');
    window.location.replace('auth.html');
    return false;
  }
  try {
    const user = JSON.parse(userStr);
    if (user.role !== requiredRole) {
      if (typeof document !== 'undefined') {
        document.documentElement.style.display = 'none';
      }
      alert(`Access Denied: You do not have permission to view the ${requiredRole.toUpperCase()} Portal.`);
      window.location.replace('auth.html');
      return false;
    }
    // Grant access: show document body on load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.style.display = 'block';
    });
    return true;
  } catch (e) {
    if (typeof document !== 'undefined') {
      document.documentElement.style.display = 'none';
    }
    window.location.replace('auth.html');
    return false;
  }
}

// Export for Node Jest environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHTML,
    formatMarkdown,
    checkRouteGuard
  };
}
