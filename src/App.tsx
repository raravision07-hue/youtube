import { useState, useEffect } from 'react';
import { AudioUpload } from './components/AudioUpload';
import { VideoUpload } from './components/VideoUpload';
import { ContentResult } from './components/ContentResult';
import { processAudio, generateViralContent, TranscriptResult, SocialMediaContent } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RefreshCcw, 
  Mic, 
  Layout, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Video, 
  ChevronRight, 
  Menu, 
  X,
  Facebook,
  Music2 as TiktokIcon
} from 'lucide-react';

type AppMode = 'AUDIO' | 'VIDEO' | 'CONTENT';
type Status = 'IDLE' | 'PROCESSING' | 'RESULT';

export default function App() {
  const [mode, setMode] = useState<AppMode>('AUDIO');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Status and Progress
  const [status, setStatus] = useState<Status>('IDLE');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');

  // Shared Data
  const [transcriptData, setTranscriptData] = useState<TranscriptResult | null>(null);
  const [finalContent, setFinalContent] = useState<SocialMediaContent | null>(null);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const simulateProgress = (steps: string[], duration: number = 3000) => {
    let currentStep = 0;
    const stepDuration = duration / steps.length;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingText(steps[currentStep]);
        setLoadingProgress((prev) => Math.min(prev + (100 / steps.length), 95));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, stepDuration);
    
    return interval;
  };

  const handleFileSelect = async (file: File, type: 'AUDIO' | 'VIDEO') => {
    try {
      setStatus('PROCESSING');
      setLoadingProgress(10);
      setError(null);
      
      const steps = type === 'AUDIO' 
        ? ['Uploading Sound Fragments...', 'Analyzing Sonic Patterns...', 'Neural Transcription Active...', 'Detecting Linguistics...']
        : ['Processing Video Stream...', 'Extracting Audio Layer...', 'Synchronizing Frames...', 'Applying AI Transcription...'];
      
      const progressInterval = simulateProgress(steps, 4000);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const result = await processAudio(base64, file.type);
          clearInterval(progressInterval);
          setLoadingProgress(100);
          setTranscriptData(result);
          setTimeout(() => setStatus('RESULT'), 500);
        } catch (err: any) {
          clearInterval(progressInterval);
          setError(err.message || 'ফাইল প্রসেস করতে সমস্যা হয়েছে।');
          setStatus('IDLE');
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError('ফাইল আপলোড করতে সমস্যা হয়েছে।');
      setStatus('IDLE');
    }
  };

  const handleContentGenerate = async () => {
    if (!inputText.trim()) return;
    try {
      setStatus('PROCESSING');
      setLoadingProgress(5);
      setError(null);
      
      const steps = [
        'Ingesting Content Structure...',
        'Mapping Semantic Context...',
        'Architecting Platform Hooks...',
        'Injecting Viral SEO Factors...',
        'Polishing Final Dashboard...'
      ];
      
      const progressInterval = simulateProgress(steps, 6000);

      try {
        const content = await generateViralContent(inputText);
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setFinalContent(content);
        setTimeout(() => setStatus('RESULT'), 500);
      } catch (err: any) {
        clearInterval(progressInterval);
        setError(err.message || 'কন্টেন্ট জেনারেট করতে সমস্যা হয়েছে।');
        setStatus('IDLE');
      }
    } catch (err: any) {
      setError('সিস্টেম এরর।');
      setStatus('IDLE');
    }
  };

  const copyTranscript = () => {
    if (transcriptData) {
      const text = transcriptData.translatedTranscript || transcriptData.originalTranscript;
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const navItems = [
    { id: 'AUDIO' as AppMode, label: 'Audio Upload', icon: Mic, desc: 'অডিও ট্রান্সক্রাইব করুন' },
    { id: 'VIDEO' as AppMode, label: 'Video Upload', icon: Video, desc: 'ভিডিও থেকে টেক্সট' },
    { id: 'CONTENT' as AppMode, label: 'Generate Content', icon: Layout, desc: 'ভাইরাল কন্টেন্ট AI' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-slate-200 selection:bg-primary/30 selection:text-white pb-24 md:pb-0">
      {/* Background radial effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[140px] rounded-full" />
      </div>

      {/* Desktop Header */}
      <header className="relative z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 px-4 md:px-6 hidden md:block">
        <div className="max-w-7xl mx-auto h-18 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary shadow-lg shadow-primary/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-widest uppercase">
                Neural<span className="text-primary font-black">Viral</span>
              </h1>
            </div>
          </div>

          <div className="flex-none flex justify-center">
            <nav className="flex items-center gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setMode(item.id); setError(null); }}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${
                    mode === item.id 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-widest">Active_Node</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="relative z-50 px-6 h-16 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a] md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-sm font-black text-white tracking-widest uppercase">NeuralViral</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-[#050505] p-8 space-y-8 md:hidden"
          >
             <div className="flex justify-end">
               <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X className="w-8 h-8 text-white" /></button>
             </div>
             <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setMode(item.id); setIsMenuOpen(false); setError(null); }}
                    className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all ${
                      mode === item.id 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    <item.icon className="w-8 h-8" />
                    <div className="text-left">
                      <p className="text-lg font-black uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm opacity-60 font-light">{item.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto w-6 h-6 opacity-30" />
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-950/20 border border-red-500/30 rounded-2xl text-red-400 text-center text-sm">
              {error}
            </motion.div>
          )}

          {/* TRANSCRIPTION VIEW (AUDIO/VIDEO) */}
          {(mode === 'AUDIO' || mode === 'VIDEO') && (
            <motion.div 
              key={`${mode}-view`}
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                  {mode === 'AUDIO' ? 'Audio' : 'Video'}<br />
                  <span className="text-primary italic">Intelligence</span>
                </h2>
                <p className="text-slate-500 text-lg font-light tracking-tight px-4 underline decoration-primary/30 underline-offset-8">
                  {mode === 'AUDIO' ? 'অডিও থেকে ক্লিয়ার টেক্সট এ কনভার্ট করুন।' : 'ভিডিওর শব্দ থেকে সরাসরি টেক্সট তৈরি করুন।'}
                </p>
              </div>

              {((mode === 'AUDIO' && status === 'IDLE') || (mode === 'VIDEO' && status === 'IDLE')) && (
                 <div className="relative">
                   {mode === 'AUDIO' ? (
                     <AudioUpload onFileSelect={(file) => handleFileSelect(file, 'AUDIO')} isLoading={false} />
                   ) : (
                     <VideoUpload onFileSelect={(file) => handleFileSelect(file, 'VIDEO')} isLoading={false} />
                   )}
                 </div>
              )}

              {status === 'PROCESSING' && (mode === 'AUDIO' || mode === 'VIDEO') && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                   <div className="relative mb-12">
                     <svg className="w-40 h-40 transform -rotate-90">
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                       <motion.circle 
                         cx="80" cy="80" r="70" 
                         fill="transparent" 
                         stroke="currentColor" 
                         strokeWidth="4" 
                         strokeDasharray="440"
                         animate={{ strokeDashoffset: 440 - (440 * loadingProgress) / 100 }}
                         className="text-primary"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-white">{Math.round(loadingProgress)}%</span>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Status</span>
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-[0.2em] uppercase">{loadingText}</h3>
                  <p className="text-slate-500 mt-4 font-mono text-[10px] tracking-widest italic animate-pulse">NEURAL_SYNC_IN_PROGRESS</p>
                </div>
              )}

              {status === 'RESULT' && (mode === 'AUDIO' || mode === 'VIDEO') && transcriptData && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0a0a0a] p-4 rounded-3xl border border-white/10">
                      <div className="flex items-center gap-4 pl-4 font-mono text-[10px] text-slate-500">
                         <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">{transcriptData.language}</span>
                         <span className="tracking-[0.2em] uppercase hidden sm:inline">Confidence: 99.8%</span>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button onClick={() => setStatus('IDLE')} className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-2xl transition-all">
                           Reset
                        </button>
                        <button onClick={copyTranscript} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                           {copyFeedback ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                           {copyFeedback ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                   </div>

                   <div className="relative group">
                     <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                     <div className="relative p-6 md:p-12 bg-[#0c0c0c] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
                        <p className="text-sm md:text-2xl leading-relaxed text-slate-300 font-serif whitespace-pre-wrap selection:bg-primary/40">
                          {transcriptData.translatedTranscript || transcriptData.originalTranscript}
                        </p>
                     </div>
                   </div>

                   <div className="flex justify-center pt-4">
                     <button 
                       onClick={() => {
                         setInputText(transcriptData.translatedTranscript || transcriptData.originalTranscript);
                         setMode('CONTENT');
                         setStatus('IDLE');
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                       className="group flex items-center gap-4 px-12 py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                     >
                       Generate Viral Content
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* CONTENT GEN VIEW */}
          {mode === 'CONTENT' && (
            <motion.div 
              key="content-view" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                  AI Content<br />
                  <span className="text-primary italic">Architect</span>
                </h2>
                <p className="text-slate-500 text-lg font-light tracking-tight px-4 underline decoration-primary/30 underline-offset-8">
                  যেকোনো টেক্সটকে প্রফেশনাল মাল্টি-প্ল্যাটফর্ম কন্টেন্টে রূপান্তর করুন।
                </p>
              </div>

              {status === 'IDLE' && mode === 'CONTENT' && (
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-primary/10 rounded-[2.5rem] blur-xl opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="এখানে আপনার টেক্সট বা আইডিয়া পেস্ট করুন..."
                      className="relative w-full h-[300px] md:h-[450px] p-6 md:p-12 bg-[#0c0c0c] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] text-lg md:text-xl text-slate-200 outline-none focus:border-primary/40 focus:bg-[#0e0e0e] transition-all font-serif leading-relaxed shadow-inner"
                    />
                    <div className="absolute top-8 right-8 flex items-center gap-3">
                       <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-white/5">{inputText.length} Characters</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleContentGenerate}
                      disabled={!inputText.trim()}
                      className="group relative flex items-center gap-4 px-14 py-6 bg-primary text-white rounded-[2rem] font-black text-base tracking-[0.2em] uppercase hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-2xl shadow-primary/30"
                    >
                      Power Generate
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {status === 'PROCESSING' && mode === 'CONTENT' && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                   <div className="relative mb-12">
                     <svg className="w-40 h-40 transform -rotate-90">
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                       <motion.circle 
                         cx="80" cy="80" r="70" 
                         fill="transparent" 
                         stroke="currentColor" 
                         strokeWidth="4" 
                         strokeDasharray="440"
                         animate={{ strokeDashoffset: 440 - (440 * loadingProgress) / 100 }}
                         className="text-primary"
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-black text-white">{Math.round(loadingProgress)}%</span>
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">AI Logic</span>
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-[0.2em] uppercase">{loadingText}</h3>
                  <p className="text-slate-500 mt-4 font-mono text-[10px] tracking-widest italic animate-pulse">ARCHITECTING_VIRAL_FLOW</p>
                </div>
              )}

              {status === 'RESULT' && mode === 'CONTENT' && finalContent && (
                <div className="space-y-12">
                   <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary shadow-lg shadow-primary/20 p-3 rounded-2xl">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black text-white uppercase tracking-widest">Multi-Platform Suite v2.1</p>
                          <p className="text-[10px] font-mono text-slate-500 leading-none mt-1 uppercase">Generation Completed in 4.2s</p>
                        </div>
                      </div>
                      <button onClick={() => setStatus('IDLE')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-primary uppercase tracking-[0.25em] transition-all">
                        <RefreshCcw className="w-3 h-3" /> New Content Analysis
                      </button>
                   </div>
                   <ContentResult content={finalContent} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 px-4 h-20 flex items-center justify-around md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setMode(item.id); setError(null); setIsMenuOpen(false); }}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              mode === item.id ? 'text-primary scale-110' : 'text-slate-500'
            }`}
          >
            <item.icon className={`w-6 h-6 ${mode === item.id ? 'fill-primary/20' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.id === 'AUDIO' ? 'Audio' : item.id === 'VIDEO' ? 'Video' : 'AI'}</span>
          </button>
        ))}
      </nav>

      <footer className="relative mt-20 border-t border-white/5 py-12 px-4 md:px-8 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 font-mono text-[10px] tracking-widest text-slate-500 uppercase">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-slate-400 font-black">© {new Date().getFullYear()} Str Robin</span>
            </div>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/profile.php?id=61586575149744" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                <Facebook className="w-3 h-3" /> Facebook
              </a>
              <a href="https://www.tiktok.com/@strrobin1" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                <TiktokIcon className="w-3 h-3" /> TikTok
              </a>
            </div>
          </div>
          <div className="flex items-center gap-10 opacity-40 hidden md:flex">
             <span>Neural_Node_Stable</span>
             <span>Build: 04.22.2026.NV</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
