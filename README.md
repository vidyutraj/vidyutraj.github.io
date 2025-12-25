# Vidyut Rajagopal - Portfolio

> Cybersecurity & Cloud Engineer | Georgia Tech '27 | Building secure, resilient systems

A modern, responsive portfolio website showcasing my work in cybersecurity, cloud infrastructure, and automation. Built with React, TypeScript, and deployed on GitHub Pages with a secure Cloudflare Worker backend.

🌐 **Live Site:** [https://vidyutraj.github.io/Vidyut-Portfolio/](https://vidyutraj.github.io/Vidyut-Portfolio/)

## ✨ Features

- **Modern UI/UX** - Dark theme with terminal-inspired design
- **AI-Powered Chatbot** - Interactive portfolio assistant powered by Groq AI
- **Secure Architecture** - API keys stored server-side via Cloudflare Workers
- **Responsive Design** - Optimized for all devices
- **Performance Optimized** - Fast loading with Vite build system
- **SEO Friendly** - Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **Deployment:** GitHub Pages (frontend), Cloudflare Workers (backend)
- **AI:** Groq API (via secure Cloudflare Worker proxy)
- **Animations:** Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/vidyutraj/Vidyut-Portfolio.git
cd Vidyut-Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the site.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── data/          # Portfolio content (projects, experience, etc.)
│   ├── config/        # Configuration files
│   ├── lib/           # Utility functions
│   └── pages/         # Page components
├── cloudflare-worker/ # Backend API proxy
├── public/            # Static assets
└── dist/              # Build output (gitignored)
```

## 🔒 Security

This portfolio uses a secure architecture where API keys are never exposed to the client:

- **Frontend** → Calls Cloudflare Worker endpoint
- **Cloudflare Worker** → Securely proxies requests to Groq API
- **API Key** → Stored only in Cloudflare's secret storage

See [CHATBOT_SECURITY.md](./CHATBOT_SECURITY.md) for detailed security documentation.

## 📝 Customization

### Updating Content

All portfolio content is in `src/data/`:

- `personal.ts` - Personal info, bio, social links
- `projects.ts` - Project listings
- `experience.ts` - Work experience
- `certifications.ts` - Certifications
- `education.ts` - Education details
- `leadership.ts` - Leadership roles
- `writing.ts` - Articles and blog posts

### Styling

- Global styles: `src/index.css`
- Theme configuration: `tailwind.config.ts`
- Component styles: Tailwind classes in component files

## 🚢 Deployment

### Frontend (GitHub Pages)

The site is automatically deployed via GitHub Actions on every push to `main`. 

**Manual deployment:**
```bash
npm run build
npm run deploy
```

### Backend (Cloudflare Worker)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick setup:**
```bash
cd cloudflare-worker
npm install
wrangler secret put GROQ_API_KEY
npm run deploy
```

## 📚 Documentation

- [CHATBOT_SECURITY.md](./CHATBOT_SECURITY.md) - Security architecture details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [cloudflare-worker/README.md](./cloudflare-worker/README.md) - Worker setup

## 🤝 Contributing

This is a personal portfolio, but suggestions and feedback are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Portfolio:** [https://vidyutraj.github.io/Vidyut-Portfolio/](https://vidyutraj.github.io/Vidyut-Portfolio/)
- **GitHub:** [@vidyutraj](https://github.com/vidyutraj)
- **LinkedIn:** [vidyut-rajagopal](https://linkedin.com/in/vidyut-rajagopal)
- **Medium:** [@vidyut.rajagopal2006](https://medium.com/@vidyut.rajagopal2006)

---

Built with ❤️ by Vidyut Rajagopal
