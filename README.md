# FIFA Nexus AI — Smart Stadium OS for World Cup 2026

FIFA Nexus AI is an AI-powered smart stadium operating system designed to orchestrate massive-scale operations and elevate the fan experience during the FIFA World Cup 2026. The platform serves as the intelligence core, managing crowd density, security threats, concession queues, sustainability metrics, and localized helper tasks.

## 🚀 Key Features

*   **RAG-Powered AI Concierge**: Multilingual AI assistant supporting 100+ languages to guide fans through seating, stadium events, concession options, and transportation in real time.
*   **Live Crowd Heatmap**: Real-time density analytics using predictive modeling to dynamically reroute foot traffic and prevent bottlenecks.
*   **Computer Vision Safety**: Direct CCTV integration using smart computer vision models to identify crowd surges, falls, smoke, and security hazards instantly.
*   **Anti-Cloning Smart Tickets**: High-security, rotating dynamic QR codes to eliminate ticket cloning and fraudulent entries.
*   **ESG Sustainability Dashboard**: IoT-integrated resource tracker reporting renewable energy roof generation, water recovery loops, and carbon targets.
*   **Vendor Concession Suite**: Real-time queue optimization, inventory health indicators, and digital order-ready pickup notifications.
*   **Volunteer Translator Hub**: Intelligent task dispatching alongside real-time audio and text translation to guide international visitors.

---

## 🏗️ Architecture Flow

This diagram illustrates how users authenticate and traverse the various portal consoles, protected by our client-side security architecture:

```mermaid
graph TD
    User[🏟️ Stadium Visitor / Operator] -->|Access App| Home[index.html Landing Page]
    Home -->|Click Portal| Auth[auth.html Login Desk]
    
    subgraph Authentication & Access
        Auth -->|Credentials / Biometrics Scan| Validate{Verify Identity?}
        Validate -->|Valid| SetSession[Create sessionStorage Token]
        Validate -->|Invalid| ShowError[Access Denied Alert]
        ShowError --> Auth
    end

    subgraph Portal Core (Guarded Routes)
        SetSession --> Portals[Portal Redirects]
        Portals --> Fan[fan.html - Fan Portal]
        Portals --> Admin[admin.html - Admin Console]
        Portals --> Vendor[vendor.html - Vendor Suite]
        Portals --> Volunteer[volunteer.html - Volunteer Hub]
    end

    subgraph Security Layer
        Guard[🔒 Route Guards - Active checking on load]
        Sanitizer[🧼 XSS Input Sanitizer - Sanitizes Chat/Input]
        NoSecrets[🔑 Local Storage Key Input - No hardcoded secrets]
    end

    Fan -.-> Guard & Sanitizer & NoSecrets
    Admin -.-> Guard
    Vendor -.-> Guard
    Volunteer -.-> Guard & Sanitizer & NoSecrets

    style Guard fill:#111D35,stroke:#00E5CC,stroke-width:2px;
    style Sanitizer fill:#111D35,stroke:#00E5CC,stroke-width:2px;
    style NoSecrets fill:#111D35,stroke:#00E5CC,stroke-width:2px;
```

---

## 🔒 Security Hardening (Walkthrough)

During our security audit, several client-side vulnerabilities were patched:

1.  **Secret Key Removal**: Removed a hardcoded public Gemini API key from `fan.html` and `volunteer.html`. The portals now rely on user-provided local API keys, securely stored in browser `localStorage`.
2.  **DOM XSS Prevention**: Added HTML escaping to user chat boxes and AI response interpreters to stop potential script injection attacks from untrusted payloads.
3.  **Portal Route Guards**: Enforced role check validation on portal entries. Direct access to dashboard URLs is blocked; unauthorized users are automatically redirected to `auth.html`.
4.  **Session Clearing**: Wired active logout controls to clean out authentication tokens when operators sign out of their portals.

---

## 📦 Deployment & Setup

### Vercel Deployment
This project is configured as a fully optimized static site. It is currently deployed and hosted at:
👉 **[FIFA Nexus AI OS Portal](https://fifa-nexus-ai-deployment.vercel.app/)**

To deploy updates via terminal:
```bash
# Set up vercel CLI and deploy production
npx vercel --prod
```

### GitHub Sync
To clone and push changes to GitHub, use the configured remote:
```bash
# Push directly to main branch
git push -u origin main
```
