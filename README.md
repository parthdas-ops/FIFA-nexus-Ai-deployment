# FIFA Nexus AI — Smart Stadium Operating System

**AI-Powered Smart Stadium Operating System for FIFA World Cup 2026.** Real-time crowd intelligence, RAG-powered AI concierge, computer vision safety, and seamless venue operations.

FIFA Nexus AI orchestrates 65,000+ fans per match at major venues (like Mercedes-Benz Stadium) with sub-second predictive intelligence, multilingual support (100+ languages), and ESG sustainability metrics.

---

## 🚀 Key Capabilities

*   **RAG-Powered AI Concierge**: Multilingual AI assistant with real-time stadium knowledge, seating navigation, transit routes, and concessions queues.
*   **Live Crowd Heatmap**: Dynamic crowd density matrix visualization with timeline predictions for post-match egress optimization.
*   **Computer Vision Security**: Simulated real-time fall detection, crowd panic alerts, and safety dispatch triggers.
*   **Dynamic QR Tickets**: Refreshing dynamic barcodes to prevent ticket cloning and gate fraud.
*   **ESG Sustainability Tracker**: Solar energy grid, water retention loops, and carbon target offset indicators.
*   **Volunteer & Vendor Portals**: Dispatch queues, order tracking, and shift task assignment hubs.

---

## 🔒 Security Compliance Enhancements

We recently audited and secured this codebase before deployment:

1.  **Secret Redaction**: Removed all public hardcoded API keys from client-side script files. The app now securely queries Gemini models using browser `localStorage` credentials or backend variables.
2.  **XSS Protection**: Implemented dynamic HTML escaping on chat prompts and AI translation outputs to prevent client-side HTML/JS injection.
3.  **Role-Based Access Control (RBAC)**: Added client-side route guards on dashboard portals to prevent direct address-bar access to admin, vendor, or volunteer portals without valid login sessions.
4.  **Secure Logouts**: Session variables are cleared immediately from memory upon logout to prevent browser back-button session hijacking.

---

## 📦 Deployment

### Local Development
Open `index.html` directly in any web browser, or serve it using a lightweight local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node (npx)
npx serve .
```

### Vercel Deployment
This repository is optimized for deployment to Vercel as a static project. Every commit pushed to `main` will trigger a new preview or production deployment.
*   Live URL: [https://fifa-nexus-ai-deployment.vercel.app/](https://fifa-nexus-ai-deployment.vercel.app/)
