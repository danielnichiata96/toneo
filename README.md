# Toneo

> **The "Grammarly" of Chinese Pronunciation.**
>
> *Stop sounding like a robot. Start sounding native.*

Toneo is a Chinese tone learning app that visualizes Mandarin tones to help learners master pronunciation.

---

## Features

- **Real-time Tone Visualization**: Type any Chinese text and see the tone patterns instantly
- **Tone Sandhi Detection**: Automatically applies and highlights tone change rules
- **HSK Level Tags**: Words are tagged with their HSK level (1-6)
- **Brutalist Design**: Bold, high-contrast UI inspired by Mao-era propaganda posters

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **NLP**: `jieba` (segmentation) + `pypinyin` (tones)
- **Data**: CC-CEDICT (123k+ entries, CC BY-SA 4.0)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+

### Quick Start

#### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
python scripts/import_cedict.py  # Download CC-CEDICT database
uvicorn app.main:app --reload
```

*Backend runs on http://localhost:8000*

#### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

*Frontend runs on http://localhost:3000*

---

## Design: Neobrutalismo Maoista

The UI follows a "红光亮" (red, bright, shining) aesthetic:

| Element | Style |
|---------|-------|
| Colors | Red (#DE2910), Yellow (#FFDE00), Black |
| Borders | 3-4px solid black, no radius |
| Shadows | Hard offset shadows (4px 4px 0 #000) |
| Typography | Bold, uppercase, condensed |
| Hover | Color inversion (red → yellow) |

---

## Tone Colors

| Tone | Name | Color |
|------|------|-------|
| 1 | 阴平 (High) | Red |
| 2 | 阳平 (Rising) | Yellow |
| 3 | 上声 (Dipping) | Black |
| 4 | 去声 (Falling) | Dark Red |
| 5 | 轻声 (Neutral) | Brown |

---

## Tone Sandhi Rules

Toneo automatically detects and applies:

- **Third tone sandhi**: 3+3 → 2+3 (你好 nǐ hǎo → ní hǎo)
- **不 sandhi**: Before 4th tone → 2nd (不是 bú shì)
- **一 sandhi**: Before 4th → 2nd, before 1/2/3 → 4th
- **Reduplication**: AA → A+neutral (妈妈 māma)

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Analyze Chinese text |
| `/api/tts/voices` | GET | List available voices |
| `/api/tts` | POST | Text-to-speech (requires Azure) |

---

## Character Libraries

- **hanzi-writer**: Stroke order animations and practice ([GitHub](https://github.com/chanind/hanzi-writer))
  - Animates stroke order for any Chinese character
  - Custom grid backgrounds (田字格, 米字格)
  - Lightweight and focused on visualization

- **cnchar**: Comprehensive Chinese character toolkit ([GitHub](https://github.com/theajack/cnchar))
  - `cnchar-order`: Stroke names (横, 竖, 撇...) and metadata
  - `cnchar-radical`: Character decomposition by radicals
  - Provides educational context during stroke animations

---

## Data Sources

- **CC-CEDICT**: Chinese-English dictionary ([License](https://www.mdbg.net/chinese/dictionary?page=cedict))
- **pypinyin**: Python pinyin library ([GitHub](https://github.com/mozillazg/python-pinyin))
- **jieba**: Chinese text segmentation ([GitHub](https://github.com/fxsjy/jieba))

---

## License

MIT
