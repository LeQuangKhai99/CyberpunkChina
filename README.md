# CYBERNET // OS v3.84 - Cyberpunk Terminal & Netrunner Hacking Game

An immersive, retro-futuristic Cyberpunk Terminal and Netrunner Cyberdeck simulator built with Vanilla HTML5, CSS3, and JavaScript. Featuring procedural sound synthesis via Web Audio API, authentic Cyberpunk 2077 Breach Protocol minigame mechanics, cryptographic ciphers, and live telemetry HUD.

![Cyberpunk Terminal Preview](preview.png)

---

## ⚡ Features

- **Cyberpunk 2077 Breach Protocol**: Real-time 5x5 hex matrix buffer injection minigame with alternating row/col mechanics, daemon sequences (`DATAMINE`, `CAMERA_OVERRIDE`, `ICE_MELTER`), and bonus credits.
- **Cryptographic Cipher Bypass**: Wordle/Bulls & Cows style numeric passcode decryptor with visual peg status and security lockout.
- **Pure Web Audio API Synthesizer**: Procedural mechanical key clicks, error buzzers, achievement chimes, and toggleable ambient synthwave arpeggio drone (Zero external audio file dependencies).
- **Subnet Target Scanner**: Interactive radar scanning local nodes (`Arasaka Proxy`, `Militech Blacksite`, `Kiroshi Optics Vault`, `Trauma Team`).
- **Telemetry Oscilloscope**: Real-time oscillating signal frequency and corporate intrusion threat monitor.
- **Multi-Theme Engine**:
  - `Cyberpunk Neon` (Default)
  - `Matrix Deep Green` (with animated digital data rain)
  - `80s Retro Amber` (Phosphor monochrome aesthetic)
  - `Syndicate Violet`
- **CRT Screen Effects**: Toggleable scanlines, phosphor glow, screen curvature vignette, and CRT flicker.
- **Black Market Cyberdeck Upgrades**: Expand buffer capacity, upgrade ICE-breaker software, and buy proxy tunnels to scrub trace levels.

---

## 🚀 Quick Start

No build tools or external dependencies needed! Simply open `index.html` in any modern web browser or serve it locally:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js / npx
npx serve .
```

Then visit [http://localhost:8080](http://localhost:8080).

---

## 💻 Terminal Command Reference

| Command | Description |
| :--- | :--- |
| `help` | Display interactive command reference table |
| `scan` | Scan local subnet for vulnerable corporate nodes |
| `breach [target]` | Launch Breach Protocol hex matrix minigame |
| `decrypt` | Start cryptographic passcode bypass minigame |
| `guess <code>` | Submit code guess during Cipher minigame |
| `shop` / `buy <id>` | Access Black Market cyberdeck upgrades |
| `stats` / `profile` | Display Netrunner dossier, rank, EXP, and credits |
| `trace` / `clear-trace` | Check or pay credits to scrub corporate trace levels |
| `theme <name>` | Switch palette (`cyberpunk`, `matrix`, `amber`, `syndicate`) |
| `matrix` | Toggle digital data rain background |
| `sound [on\|off]` | Toggle procedural Web Audio sound FX |
| `bgm [on\|off]` | Toggle generative synthwave ambient drone |
| `crt` | Toggle CRT scanline flicker |
| `ping <host>` | Send ICMP ping to remote cyber server |
| `cat <file>` | Read lore data files (e.g. `corpo_secrets.txt`) |
| `clear` | Clear terminal output buffer |

---

## 📁 Project Structure

```
├── index.html     # Main HUD layout, Radar, Oscilloscope & Terminal Viewport
├── style.css      # Cyberpunk design system, themes, and CRT scanlines
├── audio.js       # Web Audio API procedural sound synthesizer & BGM engine
├── games.js       # Breach Protocol and Cipher minigames logic
├── app.js         # Core CLI controller, animations & telemetry graphs
└── README.md      # Project documentation
```

---

## 📜 License

MIT License. Designed and coded with ❤️ for Netrunners and Cyberpunk enthusiasts.
