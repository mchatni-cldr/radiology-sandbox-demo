import React, { useState } from 'react';
import { Activity, Upload, Eye, EyeOff, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

// Mock data configuration
const ASSETS = {
  mriBase: '/assets/mri_base.png',
  maskConservative: '/assets/mask_conservative.png',
  maskAggressive: '/assets/mask_aggressive.png',
  maskGold: '/assets/mask_gold.png',
};

interface ModelCard {
  id: string;
  name: string;
  architecture: string;
  maskImage: string | null;
  diceScore: number;
  sensitivity: number;
  specificity: number;
  isBaseline?: boolean;
  isWinner?: boolean;
  description: string;
}

const MODELS: ModelCard[] = [
  {
    id: 'raw',
    name: 'Raw Data',
    architecture: 'Original MRI Scan',
    maskImage: null,
    diceScore: 0,
    sensitivity: 0,
    specificity: 0,
    description: 'T1-weighted post-contrast FLAIR sequence',
  },
  {
    id: 'exp-001',
    name: 'EXP-001',
    architecture: 'UNet Baseline',
    maskImage: ASSETS.maskConservative,
    diceScore: 0.847,
    sensitivity: 0.812,
    specificity: 0.923,
    isBaseline: true,
    description: 'Conservative segmentation approach',
  },
  {
    id: 'exp-002',
    name: 'EXP-002',
    architecture: 'Vision Transformer',
    maskImage: ASSETS.maskAggressive,
    diceScore: 0.863,
    sensitivity: 0.891,
    specificity: 0.887,
    description: 'Aggressive boundary detection',
  },
  {
    id: 'exp-003',
    name: 'EXP-003',
    architecture: 'Multimodal Fusion',
    maskImage: ASSETS.maskGold,
    diceScore: 0.924,
    sensitivity: 0.938,
    specificity: 0.941,
    isWinner: true,
    description: 'Text + Image context-aware segmentation',
  },
];

const RADIOLOGY_REPORT = `CLINICAL HISTORY:
68-year-old male with history of glioblastoma multiforme (GBM), status post gross total resection (GTR) and concurrent chemoradiation completed 14 months ago. Patient presents with new onset headaches and cognitive changes over the past 3 weeks.

TECHNIQUE:
MRI brain with and without contrast. Axial T1, T2, FLAIR, DWI, and post-contrast T1 sequences obtained.

COMPARISON:
Previous MRI dated 8 months ago.

FINDINGS:
There is an irregular enhancing mass in the right temporal lobe measuring approximately 2.8 x 2.4 x 3.1 cm, centered at the site of prior surgical resection. This represents significant interval growth compared to the prior study where subtle enhancement measured 1.2 x 0.9 cm.

The enhancement pattern is heterogeneous with central necrosis and irregular peripheral nodular enhancement. Surrounding FLAIR hyperintensity extends into the adjacent white matter, consistent with vasogenic edema and/or tumor infiltration.

Notable mass effect with 4mm leftward midline shift, increased from 1mm on prior exam. Mild effacement of the right lateral ventricle.

No additional enhancing lesions identified. No restricted diffusion to suggest acute infarction. Ventricular system is otherwise normal in caliber.

IMPRESSION:
Enlarging heterogeneously enhancing mass at the site of prior GBM resection with increased mass effect and midline shift. Findings are concerning for TUMOR RECURRENCE. Clinical correlation and possible tissue diagnosis recommended.

Differential considerations include radiation necrosis, although the interval growth pattern and enhancement characteristics favor recurrence.

RECOMMENDATION:
1. Multidisciplinary tumor board discussion
2. Consider advanced imaging (MR spectroscopy, perfusion)
3. Surgical consultation for possible re-resection vs biopsy`;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [promotedModels, setPromotedModels] = useState<Set<string>>(new Set());
  const [evaluationMode, setEvaluationMode] = useState<'selecting' | 'revealed'>('selecting');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleModelSelect = (modelId: string) => {
    if (evaluationMode === 'selecting' && modelId !== 'raw') {
      setSelectedModel(modelId);
      setEvaluationMode('revealed');
      // Open sidebar after a short delay for dramatic effect
      setTimeout(() => setSidebarOpen(true), 600);
    }
  };

  const handleReset = () => {
    setEvaluationMode('selecting');
    setSelectedModel(null);
    setSidebarOpen(false);
    setPromotedModels(new Set());
  };

  const handlePromoteToPACS = (modelId: string, modelName: string) => {
    // Simulate DICOM C-STORE transaction
    const steps = [
      'Initializing DICOM C-STORE...',
      `Converting ${modelName} segmentation to DICOM SC format...`,
      'Establishing connection to GE PACS (Clinical Node)...',
      'Verifying DICOM compliance...',
      'Transferring study data...',
      'SUCCESS: Model deployed to clinical PACS',
    ];

    let message = steps.join('\n\n');
    alert(message);
    
    setPromotedModels(prev => new Set(prev).add(modelId));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-50">
                    Cloudera Clinical Sandbox
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Project: GBM_Multimodal_Research
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                      Target Node: GE PACS (Clinical)
                    </span>
                    {evaluationMode === 'selecting' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium animate-pulse">
                        🔍 Evaluation Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {evaluationMode === 'revealed' && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-all duration-200 hover:scale-105"
                >
                  <Activity className="w-4 h-4" />
                  <span className="font-medium">Reset Evaluation</span>
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                disabled={evaluationMode === 'selecting'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  evaluationMode === 'selecting'
                    ? 'bg-slate-800/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                    : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 hover:scale-105'
                }`}
              >
                {sidebarOpen ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="font-medium">Hide Patient Context</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">View Patient Context</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex">
        {/* Arena - 2x2 Grid */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'mr-[480px]' : 'mr-0'}`}>
          <div className="container mx-auto max-w-7xl">
            {/* Instruction Banner */}
            {evaluationMode === 'selecting' && (
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-emerald-500/10 border border-sky-500/20 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-50 mb-1">Clinical Evaluation</h3>
                    <p className="text-slate-300">
                      Review the segmentations below and <strong>select the model that shows the most clinically accurate tumor boundaries</strong>. 
                      Make your choice based on visual assessment alone.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Banner */}
            {evaluationMode === 'revealed' && selectedModel && (
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-50 mb-1">
                        You Selected: {MODELS.find(m => m.id === selectedModel)?.name}
                      </h3>
                      <p className="text-slate-300">
                        {selectedModel === 'exp-003' ? (
                          <span className="text-emerald-400 font-medium">Excellent choice! You identified the best performing model.</span>
                        ) : (
                          <span>Now see how it compares to the multimodal approach that leverages clinical context.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {MODELS.map((model, index) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isPromoted={promotedModels.has(model.id)}
                  onPromote={() => handlePromoteToPACS(model.id, model.name)}
                  animationDelay={index * 100}
                  evaluationMode={evaluationMode}
                  isSelected={selectedModel === model.id}
                  onSelect={() => handleModelSelect(model.id)}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar - Patient Context */}
        <aside
          className={`fixed top-[73px] right-0 h-[calc(100vh-73px)] w-[480px] bg-slate-900 border-l border-slate-800 overflow-y-auto transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-50 mb-2">Patient Context</h2>
              <p className="text-sm text-slate-400">Radiology Report Analysis</p>
            </div>

            {/* Insight Box */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-400 mb-2">Multimodal Advantage</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Model <strong>EXP-003</strong> achieved superior performance by integrating the radiology report text. 
                    Upon detecting the phrase <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs">"TUMOR RECURRENCE"</span>, 
                    it dynamically adjusted segmentation thresholds to capture subtle enhancement patterns missed by vision-only models.
                  </p>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <h3 className="font-bold text-slate-200 mb-3 text-sm uppercase tracking-wide">Full Radiology Report</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-mono bg-slate-950/50 p-4 rounded border border-slate-800">
                    {RADIOLOGY_REPORT.split('TUMOR RECURRENCE').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold animate-pulse">
                            TUMOR RECURRENCE
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface ModelCardProps {
  model: ModelCard;
  isPromoted: boolean;
  onPromote: () => void;
  animationDelay: number;
  evaluationMode: 'selecting' | 'revealed';
  isSelected: boolean;
  onSelect: () => void;
}

function ModelCard({ model, isPromoted, onPromote, animationDelay, evaluationMode, isSelected, onSelect }: ModelCardProps) {
  const isExperimental = model.id !== 'raw';
  const isInSelectingMode = evaluationMode === 'selecting';
  const isRevealed = evaluationMode === 'revealed';
  const showMetrics = isRevealed && isExperimental;
  const showBadges = isRevealed;

  return (
    <div
      onClick={isInSelectingMode && isExperimental ? onSelect : undefined}
      className={`group relative bg-slate-900 rounded-xl border overflow-hidden transition-all duration-300 ${
        isInSelectingMode && isExperimental
          ? 'border-slate-700 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-500/20 cursor-pointer hover:scale-[1.02]'
          : isSelected && isRevealed
          ? 'border-sky-500 shadow-2xl shadow-sky-500/30'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-900/50'
      }`}
      style={{ 
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Selection Indicator Overlay */}
      {isInSelectingMode && isExperimental && (
        <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/5 transition-all duration-300 pointer-events-none z-10 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/40 backdrop-blur-sm">
            <span className="text-sky-300 font-bold">Click to Select</span>
          </div>
        </div>
      )}

      {/* Selected Overlay */}
      {isSelected && isRevealed && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-sky-500/20 border-2 border-sky-500 backdrop-blur-sm animate-pulse">
          <span className="text-sky-300 font-bold text-sm">Your Choice</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-50">{model.name}</h3>
            <p className="text-sm text-slate-400">{model.architecture}</p>
          </div>
          {showBadges && (
            <>
              {model.isWinner && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 animate-bounce">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">WINNER</span>
                </div>
              )}
              {model.isBaseline && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700/50 border border-slate-600">
                  <AlertCircle className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">BASELINE</span>
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-slate-500">{model.description}</p>
      </div>

      {/* Image Display */}
      <div className="relative aspect-square bg-slate-950">
        {/* Base MRI Image */}
        <img
          src={ASSETS.mriBase}
          alt="MRI Base"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Mask Overlay */}
        {model.maskImage && (
          <img
            src={model.maskImage}
            alt={`${model.name} Mask`}
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />
        )}

        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Metrics - Only show after reveal */}
      {showMetrics && (
        <div className="p-4 bg-slate-900/30 border-t border-slate-800">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MetricBadge label="Dice" value={model.diceScore} isWinner={model.isWinner} />
            <MetricBadge label="Sensitivity" value={model.sensitivity} isWinner={model.isWinner} />
            <MetricBadge label="Specificity" value={model.specificity} isWinner={model.isWinner} />
          </div>

          {/* Action Button - Only show after reveal */}
          {isRevealed && (
            <button
              onClick={onPromote}
              disabled={isPromoted}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isPromoted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                  : model.isWinner
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105'
                  : 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 hover:border-sky-500/40'
              }`}
            >
              {isPromoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Deployed to PACS</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Promote to PACS</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface MetricBadgeProps {
  label: string;
  value: number;
  isWinner?: boolean;
}

function MetricBadge({ label, value, isWinner }: MetricBadgeProps) {
  return (
    <div className={`text-center p-2 rounded-lg border ${
      isWinner 
        ? 'bg-emerald-500/10 border-emerald-500/20' 
        : 'bg-slate-800/50 border-slate-700'
    }`}>
      <div className={`text-xs font-medium mb-1 ${
        isWinner ? 'text-emerald-400' : 'text-slate-400'
      }`}>
        {label}
      </div>
      <div className={`text-lg font-bold ${
        isWinner ? 'text-emerald-300' : 'text-slate-200'
      }`}>
        {value.toFixed(3)}
      </div>
    </div>
  );
}

export default App;