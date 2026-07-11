/**
 * FIFA Nexus AI — Unit Tests
 */

const { escapeHTML, formatMarkdown, checkRouteGuard } = require('../assets/js/utils');

describe('FIFA Nexus AI Utilities Suite', () => {
  
  describe('escapeHTML()', () => {
    test('should return empty string if input is null or undefined', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
      expect(escapeHTML('')).toBe('');
    });

    test('should escape HTML syntax characters correctly', () => {
      expect(escapeHTML('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      
      expect(escapeHTML("John's & Sally's tag"))
        .toBe('John&#039;s &amp; Sally&#039;s tag');
    });
  });

  describe('formatMarkdown()', () => {
    test('should return empty string if input is null or empty', () => {
      expect(formatMarkdown(null)).toBe('');
      expect(formatMarkdown('')).toBe('');
    });

    test('should translate bold markdown correctly', () => {
      expect(formatMarkdown('This is **bold** text.'))
        .toBe('This is <strong>bold</strong> text.');
    });

    test('should translate italic markdown correctly', () => {
      expect(formatMarkdown('This is *italic* text.'))
        .toBe('This is <em>italic</em> text.');
    });

    test('should translate code block markdown correctly', () => {
      expect(formatMarkdown('Run `npm test` block.'))
        .toBe('Run <code>npm test</code> block.');
    });

    test('should translate line breaks correctly', () => {
      expect(formatMarkdown('Line 1\nLine 2'))
        .toBe('Line 1<br />Line 2');
    });

    test('should prevent HTML injection before formatting markdown', () => {
      expect(formatMarkdown('**XSS**: <script>alert(1)</script>'))
        .toBe('<strong>XSS</strong>: &lt;script&gt;alert(1)&lt;/script&gt;');
    });
  });

  describe('checkRouteGuard()', () => {
    let mockReplace;
    let mockAlert;

    beforeEach(() => {
      // Mock sessionStorage
      const store = {};
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn(key => store[key] || null),
          setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
          removeItem: jest.fn(key => { delete store[key]; }),
          clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); })
        },
        writable: true
      });

      // Mock window.location
      mockReplace = jest.fn();
      delete window.location;
      window.location = {
        replace: mockReplace
      };

      // Mock alert
      mockAlert = jest.fn();
      window.alert = mockAlert;

      // Reset document element style
      document.documentElement.style.display = '';
      document.body.style.display = '';
    });

    test('should block access and redirect if no session exists', () => {
      const authorized = checkRouteGuard('admin');
      
      expect(authorized).toBe(false);
      expect(document.documentElement.style.display).toBe('none');
      expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining('Access Denied'));
      expect(mockReplace).toHaveBeenCalledWith('auth.html');
    });

    test('should block access if session role does not match required role', () => {
      window.sessionStorage.setItem('nexus_user', JSON.stringify({
        email: 'fan.guest@worldcup2026.com',
        role: 'fan'
      }));

      const authorized = checkRouteGuard('admin');
      
      expect(authorized).toBe(false);
      expect(document.documentElement.style.display).toBe('none');
      expect(mockAlert).toHaveBeenCalledWith(expect.stringContaining('Access Denied'));
      expect(mockReplace).toHaveBeenCalledWith('auth.html');
    });

    test('should authorize and trigger body display when role matches', () => {
      window.sessionStorage.setItem('nexus_user', JSON.stringify({
        email: 'commander.hq@nexus.fifa.com',
        role: 'admin'
      }));

      const authorized = checkRouteGuard('admin');
      
      expect(authorized).toBe(true);
      expect(document.documentElement.style.display).not.toBe('none');
      expect(mockReplace).not.toHaveBeenCalled();

      // Trigger DOMContentLoaded manually to test access grant block
      const event = document.createEvent('Event');
      event.initEvent('DOMContentLoaded', true, true);
      document.dispatchEvent(event);

      expect(document.body.style.display).toBe('block');
    });
  });
});
