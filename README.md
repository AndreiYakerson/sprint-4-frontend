🌅 OneDay — Task Delegation & Team Collaboration App

Plan. Delegate. Collaborate.
A vibrant, modern workspace for managing daily goals and team productivity — beautifully crafted with React + Vite + Redux + Socket.io.


✨ Overview

OneDay is a collaborative task management app that helps teams break down goals into actionable steps — and get them done together.
Built for speed, clarity, and delight, it blends productivity with playful, animated micro-interactions.

💡 Think “Trello meets calm focus” — everything your team needs to turn One Day into day one.

🎯 Highlights
🌈 Category	💡 Key Features
Task Management	Assign, prioritize, and organize tasks with live updates
Floating Popovers	Smart UI for labels, members, and status — intuitive and beautiful
Realtime Collaboration	Socket.io integration for instant task sync and notifications
UI & Experience	Smooth animations, colorful themes, focus-driven micro-UX
Architecture	Modular React + Redux design with service-driven logic
Developer Ready	Vite fast reload ⚡, ESLint, and fully mockable local services
🧩 Tech Stack
Layer	Tools
Frontend	React 18 + Vite
State Management	Redux + react-redux
Drag & Drop	@dnd-kit + react-beautiful-dnd
Realtime	socket.io-client
Utilities	axios, lodash, luxon
Styling	CSS Variables (var.css) + modular component CSS
🎨 Design & Theming

OneDay’s interface is built around color harmony, playful details, and accessibility.

🎭 CSS Variables

--color-primary: #6C63FF;
--color-surface: #ffffff;
--radius-lg: 12px;
--transition-fast: 0.15s ease-in-out;


🖼 Design Principles

Adaptive light/dark color palettes 🌗

SVG icons imported via Vite for crisp scaling

Floating UI via React Portals (#portal-root)

Gentle transitions on hover, focus, and popovers

Consistent spacing & z-index hierarchy across UI

⚙️ Quick Start
# 1️⃣ Clone
git clone <your-repo-url>
cd sprint-4-frontend

# 2️⃣ Install
npm install

# 3️⃣ Run (local demo)
npm run dev

# 4️⃣ Build for production
npm run build && npm run preview


💬 npm run dev enables VITE_LOCAL=true for local mock services.
For remote mode, run npm run dev:remote.

🧭 Floating Popover Logic

🪄 The secret sauce behind OneDay’s fluid interactivity.

Component	Role
FloatingContainerCmp.jsx	Core anchor-based popover using React Portal
FloatingSecondary.jsx	Redux-driven variant (legacy/experimental)
FloatingContainerCmpNotToUse.jsx	Deprecated prototype — kept for reference

💡 Best Practice

Keep popover state local for responsiveness.

Use FloatingContainerCmp.jsx as canonical implementation.

Provide a small FloatingProvider context for cross-tree triggers.

Avoid Redux for transient UI (use context or local state instead).

🗂 Project Structure
src/
 ┣ cmps/           → Reusable UI (Board, Task, Sidebar, etc.)
 ┣ pages/          → Routed views (BoardDetails, HomePage)
 ┣ services/       → Logic & APIs (board, user, socket, util)
 ┣ store/          → Redux store + actions
 ┣ assets/styles/  → var.css + global CSS
 ┗ index.jsx       → Entry point

🧠 Development Tips

Use makeId() from util.service.js for deterministic IDs.

Extend color tokens in var.css for theming.

Replace Redux with FloatingContext for faster popover updates.

Keep your popovers simple, composable, and decoupled.

🧑‍💻 Contributing

Fork & branch: feat/your-feature

Run npm run lint before committing

Add screenshots or GIFs for UI changes

PRs welcome — clarity and color encouraged 🎨

📸 Visual Assets & Badges to Add
Asset	Location	Purpose
hero.gif	/public/img/	Animated drag-drop demo
board-item-img.svg	/public/img/	Board preview
dashboard-item-img.svg	/public/img/	Dashboard preview
logo.png	/public/img/	App logo
Badges	Shields.io	Stars ⭐, CI status, Releases 🏷️
📜 License

🧾 MIT License – Free to use, modify, and share.
(Include an explicit LICENSE file in your repository.)

💎 Layout Styles

Minimal Layout: concise for developers (no hero GIF, tight spacing).
Rich Layout (Recommended): hero animation, colorful tables, and emoji rhythm for a welcoming experience 😄

🌟 Credits & Inspiration

OneDay draws visual and structural inspiration from:

Vite + React starter templates (layout & readability)

Trello-style Kanban interfaces (interaction design)

Material-UI and MERN example repos (badge and section aesthetics)