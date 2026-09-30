<div align="center">

# 🗝️ Colossal Cave Adventure · Illustrated Antiquarian Chronicle

### *The 1976 Legendary Subterranean Odyssey — Reimagined for the Modern Web*

[![Live Demo](https://img.shields.io/badge/Play_Now-Live_on_Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://colossal-cave-adventure.pages.dev)
[![Retro Edition](https://img.shields.io/badge/Terminal_Edition-Retro_Single--File-10B981?style=for-the-badge&logo=gnubash&logoColor=white)](https://colossal-cave-adventure.pages.dev/colossal_cave)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Co--Crafted_With-Google_AI_Studio-4285F4?style=flat-square&logo=google&logoColor=white" alt="Google AI Studio" />
  <img src="https://img.shields.io/badge/Autonomous_Pair-Antigravity_AI-8E75FF?style=flat-square" alt="Antigravity AI" />
  <img src="https://img.shields.io/badge/Deployed_Via-Cloudflare_Wrangler-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Wrangler" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

```
   _________________________________________________________________________
  /                                                                         \
 |   "YOU ARE STANDING AT THE END OF A ROAD BEFORE A SMALL BRICK BUILDING.   |
 |    AROUND YOU IS A FOREST. A SMALL STREAM FLOWS OUT OF THE BUILDING       |
 |    AND DOWN A GULLY..."                                                   |
  \_________________________________________________________________________/
          \
           \   (\__/)
               (•ㅅ•)  [Enter if you dare...]
               / 　 づ
```

**[🎮 PLAY THE EXPEDITION LIVE](https://colossal-cave-adventure.pages.dev)** • **[📜 RETRO TERMINAL EDITION](https://colossal-cave-adventure.pages.dev/colossal_cave)** • **[✨ REPORT ISSUE](https://github.com/adnan-ash/colossal-cave-adventure/issues)**

---

</div>

## 🌌 The Legend Reborn

In 1976, Will Crowther and Don Woods pioneered the interactive fiction genre with **Colossal Cave Adventure (ADVENT)** on the PDP-10 mainframe. Decades later, this reimagined edition transforms that sacred subterranean lore into an **Illustrated Antiquarian Manuscript & Interactive Web Odyssey**.

Step through misty forests, descend into cavernous limestone vaults, outsmart the ferocious green dragon, cross the chasm of breath, uncover fabled pirate hoards, and whisper the ancient Incantations of Power.

---

## ✨ Features

### 🗺️ Dual-World Visual Modalities
* **Antiquarian Illustrated Codex**: Classical woodcut engravings, hand-inked cartography, and high-fidelity SVG views of each cavern chamber.
* **Pure Retro Terminal Mode**: Nostalgic amber & green phosphor CRT displays, authentic ASCII renderings, and prompt-driven command lines.
* **Interactive Compass & Topography**: Real-time subterranean direction radar with tactile passage indications.

### 🎒 Deep Inventory & Item Physics
* Collect and utilize authentic relics: the **Brass Lantern**, **Wicker Cage**, **Black Rod**, **Little Bird**, **Velvet Pillow**, **Jeweled Chest**, and bars of subterranean silver.
* Real environmental puzzle solving: calm the fierce serpent, cross bottomless chasms, and discover secret sliding panels.

### 🎙️ Subterranean Audio & Spoken Narrations
* **Dynamic Cave Soundscape**: Real-time synthesized ambient dripping water, hollow caverns, and reverberating echoes.
* **Integrated Voice Narration**: In-game voice synthesis narrates descriptions of forgotten halls and perilous chasms.

### ⚡ Arcane Secrets & God Mode
* Classic magic words faithfully preserved: `XYZZY`, `PLUGH`, `PTRACE`, `BLAST`, and `FEE FIE FOE FOO`.
* Built-in **God Mode Debug Console** to manipulate inventory, teleport instantly across subterranean quadrants, and inspect dungeon states.

### 📦 Zero-Install Offline Export
* Export and download the complete adventure as a single self-contained `.html` file that plays in any web browser without an internet connection!

---

## 🛠️ Created With Next-Gen AI & Modern Engineering

This project was built from the ground up through human-AI synergy, blending cutting-edge developer platforms with autonomous agentic intelligence:

| Tool / Platform | Role in the Project |
| :--- | :--- |
| <img src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" width="24" height="24" /> **Google AI Studio** | Generative architectural ideation, comprehensive room lore adaptation, dialogue scripting, and antiquarian prompt engineering. |
| 🚀 **Google Antigravity** | Autonomous agentic coding assistant: dependency conflict resolution, cross-platform build pipeline orchestration, full-stack debugging, and seamless Cloudflare deployment. |
| ⛅ **Cloudflare Wrangler** | Built and distributed globally across 300+ edge cities via Cloudflare Pages using the Wrangler CLI. |
| ⚛️ **React 19 & TypeScript** | Componentized UI architecture, strict type contracts, and reactive game-state reducers. |
| 🎨 **Tailwind CSS v4 & Motion** | Antique parchment styling, CRT scanlines, and fluid layout transitions. |
| 🎯 **Lucide Icons** | Minimalist cartographic symbology and compass navigation indicators. |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/adnan-ash/colossal-cave-adventure.git
cd colossal-cave-adventure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start your subterranean journey!

### 4. Build for Production
```bash
npm run build
```
The compiled, minified bundle will be ready in the `dist/` directory.

---

## ⛅ Deploying to Cloudflare with Wrangler

You can easily deploy your own instance to Cloudflare Pages in seconds:

```bash
# 1. Login to your Cloudflare account
npx wrangler login

# 2. Build the project
npm run build

# 3. Deploy directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name colossal-cave-adventure
```

---

## 📜 Classic Spells & Incantations

| Spell | Effect |
| :--- | :--- |
| `XYZZY` | Transports the adventurer between the brick building and the inside of the cavern. |
| `PLUGH` | Whispers an ancient pathway between the Wellhouse and the Y2 chamber. |
| `FEE FIE FOE FOO` | Summons subterranean forces near the Giant's Room. |
| `LOOK` | Re-examines your surroundings in rich descriptive prose. |
| `INVENTORY` | Takes inventory of your satchel and provisions. |
| `/god` | Opens the Arcane Developer Portal with instant room teleportation. |

---

## 📂 Repository Architecture

```text
├── colossal_cave.html    # Standalone single-file retro CRT playable release
├── index.html            # Primary application entry template
├── package.json          # Dependency definitions and build scripts
├── vite.config.ts        # Vite 8 & Tailwind v4 bundler configuration
├── wrangler.toml         # Cloudflare Pages deployment configuration
├── public/               # Static assets & icons
└── src/
    ├── App.tsx           # Master game loop, state orchestration & UI layout
    ├── main.tsx          # React 19 application mount
    ├── index.css         # Theme tokens, antique paper styling & typography
    ├── components/       # Visual components (SVG Cartography, Compass, Terminal, God Mode)
    ├── data/             # Chamber layouts, item tables, connection graphs & ASCII glyphs
    ├── types/            # Game state, room ids, and command types
    └── utils/            # Web Audio synthesizer, voice synthesizer & HTML exporter
```

---

## 📜 License & Lore Tribute

Dedicated with utmost admiration to **Will Crowther** and **Don Woods**, whose 1976 masterwork ignited the imaginations of millions of software pioneers and gamers worldwide.

Distributed under the [MIT License](LICENSE). Feel free to fork, expand, explore, and share!

<div align="center">
<sub>Crafted with passion, nostalgia May your lantern never extinguish. 🕯️</sub>
</div>
