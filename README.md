# Cloudera Clinical Sandbox

A medical AI demonstration platform for validating experimental machine learning models in radiology workflows. This application simulates a "Head of Radiology AI" interface where clinicians can evaluate and promote AI segmentation models to clinical PACS systems.

![Demo Screenshot](./docs/screenshot.png)

## 🎯 Purpose

This demo showcases how multimodal AI models (combining image + text analysis) can outperform vision-only models in clinical segmentation tasks. 

## ✨ Key Features

### 1. **Blind Clinical Evaluation Mode**
- Radiologists evaluate segmentations based on **visual quality alone** - no metrics shown initially
- No bias from model names, architectures, or performance scores
- They **select their choice first**, then results are revealed
- Mimics real-world clinical validation workflows where quality judgments come before quantitative analysis

### 2. **Interactive Model Comparison**
- 2x2 grid layout comparing 4 approaches:
  - Raw MRI data (baseline reference)
  - EXP-001: UNet baseline (conservative segmentation)
  - EXP-002: Vision Transformer (aggressive boundaries)
  - EXP-003: Multimodal Fusion (text + image context)
- Real-time mask overlays on brain MRI scans
- Performance metrics revealed only after selection (Dice score, Sensitivity, Specificity)

### 3. **Dramatic Reveal & Context**
- After selection, all metrics appear with animations
- Personalized feedback based on radiologist's choice
- Patient context sidebar **automatically opens** to show clinical report
- Explains WHY the multimodal model won using the actual radiology report text

### 4. **Multimodal Advantage Demonstration**
- Shows full radiology report with highlighted clinical phrases
- Demonstrates how EXP-003 used the phrase "TUMOR RECURRENCE" to adjust segmentation
- Proves text + image fusion outperforms vision-only models
- Clear insight box explaining the multimodal decision-making process

### 5. **PACS Integration Simulation**
- "Promote to PACS" workflow for approved models
- Simulates DICOM C-STORE transaction
- Shows deployment to GE PACS (Clinical Node)
- State management showing which models have been deployed

### 6. **Professional Medical UI**
- Dark mode "research lab" aesthetic
- Medical-grade color scheme (Emerald for success, Sky Blue for actions)
- Smooth animations and transitions
- Responsive layout with hover states and interactive feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or navigate to the project:**
```bash
cd /path/to/radiology-sandbox-demo
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up Tailwind CSS v3** (if not already configured):
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx tailwindcss init -p
```

4. **Prepare your assets:**

Create the following structure:
```
public/
└── assets/
    ├── mri_base.png           # Base MRI brain scan
    ├── mask_conservative.png  # UNet segmentation (blue)
    ├── mask_aggressive.png    # Vision Transformer segmentation
    └── mask_gold.png          # Multimodal segmentation (gold standard)
```

**Asset Requirements:**
- All images should be 600x600px or larger
- PNG format with transparency support
- Segmentation masks should be colored overlays (RGB channels)
- MRI base image should be grayscale

**Don't have assets yet?** Use placeholder images temporarily:
```typescript
// In App.tsx, replace the ASSETS object:
const ASSETS = {
  mriBase: 'https://placehold.co/600x600/1e293b/64748b?text=MRI+Base',
  maskConservative: 'https://placehold.co/600x600/3b82f6/ffffff?text=UNet',
  maskAggressive: 'https://placehold.co/600x600/8b5cf6/ffffff?text=ViT',
  maskGold: 'https://placehold.co/600x600/10b981/ffffff?text=Multimodal',
};
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open in browser:**
```
http://localhost:5173
```

## 📖 Usage Guide

### Demo Script

**Phase 1: Introduction (30 seconds)**
1. Open the application
2. Point out the header: Project name, PACS target node
3. Note the "🔍 Evaluation Mode" indicator
4. Explain: "This is a blind evaluation - you'll pick the best segmentation based purely on visual quality"

**Phase 2: Blind Clinical Evaluation (1-2 minutes)**
1. Read the instruction banner aloud: *"Select the model that shows the most clinically accurate tumor boundaries"*
2. **Important**: Point out that metrics and model performance are HIDDEN
3. Review each segmentation visually with the radiologist:
   - Raw Data (reference - no overlay)
   - EXP-001 (blue mask overlay)
   - EXP-002 (colored mask overlay)
   - EXP-003 (colored mask overlay)
4. Discuss what makes a "good" segmentation:
   - Clear tumor boundaries
   - Appropriate coverage of enhancement
   - Clinical accuracy
   - Not too conservative, not too aggressive
5. Ask: **"Based purely on what you see, which segmentation looks most accurate?"**
6. Have them click to select their choice

**Phase 3: The Reveal (2-3 minutes)**
1. Results banner appears with their selection
2. Show personalized feedback:
   - If they picked EXP-003: "Excellent choice! You identified the best performing model."
   - If they picked another: "Now see how it compares to the multimodal approach"
3. Point out what just appeared:
   - Performance metrics for ALL models (Dice, Sensitivity, Specificity)
   - WINNER badge on EXP-003 (with bounce animation)
   - "Your Choice" badge on their selected model
4. Compare the scores:
   - EXP-001: 0.847 (conservative baseline)
   - EXP-002: 0.863 (aggressive vision-only)
   - EXP-003: 0.924 (multimodal - significantly better)

**Phase 4: Patient Context Auto-Reveal (2-3 minutes)**
1. Watch as the sidebar **automatically slides open** after selection
2. Read the "Multimodal Advantage" insight box aloud
3. Scroll through the radiology report
4. Point out the highlighted phrase: **"TUMOR RECURRENCE"** (animated)
5. **Key message**: "EXP-003 didn't just look at the image - it READ this clinical context"
6. Explain the multimodal advantage:
   - Vision-only models (EXP-001, EXP-002) only see pixels
   - EXP-003 combines image analysis + text understanding
   - When it detected "TUMOR RECURRENCE" in the report, it adjusted segmentation thresholds
   - This is why it captured subtle enhancement patterns the other models missed

**Phase 5: Deployment (1 minute)**
1. Ask: "Now that we've validated EXP-003, ready to deploy?"
2. Click "Promote to PACS" on EXP-003
3. Show the DICOM C-STORE simulation alert:
   - Converting segmentation to DICOM SC format
   - Pushing to GE PACS (Clinical Node)
   - Success confirmation
4. Observe the button state change to "Deployed to PACS"

**Phase 6: Reset & Re-Demo (optional)**
1. Click "Reset Evaluation" in the header
2. Interface returns to blind evaluation mode
3. Run through again, perhaps letting a different stakeholder choose
4. Show consistency: EXP-003 always wins based on metrics + context

**Key Talking Points:**
- "This mimics real clinical validation - you judged quality FIRST, without bias"
- "Notice how the multimodal model doesn't just see better - it UNDERSTANDS clinical context"
- "This is the future of medical AI - not replacing radiologists, but augmenting them with comprehensive analysis"

### Customization

**Adjust mask opacity:**
```typescript
// In ModelCard component, line ~287
className="absolute inset-0 w-full h-full object-cover opacity-75"
//                                                        ^^^^^^^^
// Change to: opacity-50, opacity-60, opacity-90, etc.
```

**Change model performance scores:**
```typescript
// In MODELS array
{
  id: 'exp-001',
  name: 'EXP-001',
  diceScore: 0.847,      // Change these values
  sensitivity: 0.812,
  specificity: 0.923,
  // ...
}
```

**Modify radiology report:**
```typescript
// Update the RADIOLOGY_REPORT constant
const RADIOLOGY_REPORT = `
Your custom report text here...
Include the phrase TUMOR RECURRENCE for highlighting
`;
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Styling framework
- **Lucide React** - Icon library

## 📁 Project Structure

```
radiology-sandbox-demo/
├── public/
│   └── assets/              # MRI images and segmentation masks
├── src/
│   ├── App.tsx             # Main application component
│   ├── index.css           # Tailwind directives
│   └── main.tsx            # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

**Colors:**
- Background: `slate-950` (deep dark)
- Cards: `slate-900` 
- Borders: `slate-800`, `slate-700`
- Success: `emerald-500` (winner, promotion)
- Action: `sky-500` (interactive elements)
- Warning: `amber-500` (highlights)

**Typography:**
- System font stack (san-serif)
- Bold headers for hierarchy
- Monospace for clinical data

**Spacing:**
- 6px grid system (Tailwind defaults)
- Generous padding for readability
- Balanced whitespace

## 🚨 Troubleshooting

### Tailwind styles not applying

1. Ensure Tailwind v3 is installed:
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

2. Verify `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

3. Check `src/index.css` includes directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 🎯 Use Cases

**Sales Demonstrations:**
- Healthcare IT decision makers
- Chief Medical Information Officers (CMIOs)
- Radiology department heads
- AI/ML evaluation committees

**Educational Settings:**
- Medical AI workshops
- Radiology resident training
- Clinical informatics courses
- AI ethics discussions

**Research Presentations:**
- Conference demos
- Grant proposal visuals
- Institutional review boards
- Publication supplementary materials

## 🔒 Compliance Notes

This is a **demonstration platform only** and is not:
- FDA cleared for clinical use
- HIPAA compliant (uses synthetic/anonymized data)
- Intended for actual patient care
- A diagnostic device

Always use de-identified or synthetic patient data for demonstrations.
