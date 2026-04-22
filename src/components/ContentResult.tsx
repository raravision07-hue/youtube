import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Twitter as TikTok, 
  Globe, 
  Award, 
  Maximize2,
  Layout,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  Zap,
  Share2,
  BarChart3,
  Hash,
  Download,
  FileText,
  RefreshCcw
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SocialMediaContent } from '../services/geminiService';

interface ContentResultProps {
  content: SocialMediaContent;
}

const CopyButton = ({ text }: { text: string | string[] }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const contentToCopy = Array.isArray(text) ? text.join('\n') : text;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-2 rounded-lg transition-all duration-300 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const SectionHeader = ({ title, icon: Icon, textToCopy, color = "text-primary" }: { title: string, icon: any, textToCopy?: string | string[], color?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h4>
    </div>
    {textToCopy && <CopyButton text={textToCopy} />}
  </div>
);

const ScoreCard = ({ label, value, colorClass = "text-primary", bgClass = "bg-primary/20" }: { label: string, value: number, colorClass?: string, bgClass?: string }) => (
  <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-white/10 transition-all">
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{label}</span>
    <span className={`text-4xl font-display font-black ${colorClass}`}>{value}%</span>
    <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${value}%` }} 
        className={`h-full ${bgClass.replace('/20', '')}`}
      />
    </div>
  </div>
);

export const ContentResult: React.FC<ContentResultProps> = ({ content }) => {
  const [activePlatform, setActivePlatform] = useState<'youtube' | 'facebook'>('youtube');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const platforms = [
    { id: 'youtube', label: 'YouTube Content', icon: Youtube },
    { id: 'facebook', label: 'Facebook Social', icon: Facebook },
  ];

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural_viral_${Date.now()}.json`;
    a.click();
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const element = reportRef.current;
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = 295;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = position - 295; // Use fixed page height for translation
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`NeuralViral_Report_${Date.now()}.pdf`);
      element.style.display = 'none';
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-32">
      {/* Hidden printable report for high-fidelity PDF export */}
      <div 
        ref={reportRef} 
        style={{ display: 'none', position: 'absolute', left: '-9999px', width: '800px' }}
        className="bg-white text-black p-12 overflow-hidden"
      >
        <div className="border-b-4 border-blue-600 pb-6 mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">NeuralViral Intelligence Report</h1>
          <div className="flex justify-between items-end">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
              {new Date().toLocaleString()}
            </p>
            <p className="text-blue-600 font-bold text-sm uppercase">Topic: {content.global.mainTopic}</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Section 1: Global Analysis */}
          <section>
            <h2 className="text-xl font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-wider">I. Strategic Core</h2>
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Content Transformation Analysis</h3>
                <p className="text-slate-700 leading-relaxed italic">{content.global.contentAnalysis}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Strategy Pillars</h3>
                  <ul className="space-y-2">
                    {content.global.subtopics.map((s, i) => (
                      <li key={i} className="text-sm font-bold text-slate-800 flex gap-2">
                        <span className="text-blue-500 font-mono">▸</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Viral Strategy Scorecard</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase">
                      <span>SEO Power</span>
                      <span className="text-blue-600">{content.global.scoring.seo}%</span>
                    </div>
                    <div className="flex justify-between text-xs font-black uppercase">
                      <span>Viral Hook Potential</span>
                      <span className="text-blue-600">{content.global.scoring.viral}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: YouTube Service */}
          <section>
            <h2 className="text-xl font-black text-red-600 border-b-2 border-red-50 border-slate-100 pb-2 mb-6 uppercase tracking-wider">II. YouTube Video Service</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">SEO Optimized Titles (Target CTR: {content.platforms.youtube.clickabilityScore}%)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {content.platforms.youtube.seoTitles.map((t, i) => (
                    <p key={i} className="p-3 bg-red-50/50 rounded-lg border border-red-50 text-sm font-bold text-slate-800">
                      {i+1}. {t}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Master Video Description</h3>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{content.platforms.youtube.longDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Video Meta Tags (15-25)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono">{content.platforms.youtube.tags.join(', ')}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hashtags</h3>
                  <p className="text-xs text-red-600 font-bold">{content.platforms.youtube.hashtags.map(h => `#${h}`).join(' ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Timestamp Chapters</h3>
                  <p className="text-[11px] font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">{content.platforms.youtube.chapters}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Viral Hooks & Thumbnail Text</h3>
                  <div className="space-y-4">
                    <p className="text-xs font-black text-red-600 italic">Thumbnail: "{content.platforms.youtube.thumbnailTextIdeas[0]}"</p>
                    <div className="space-y-1">
                      {content.platforms.youtube.viralHooks.map((h, i) => (
                        <p key={i} className="text-[11px] text-slate-600 leading-tight">• {h}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Facebook Service */}
          <section>
            <h2 className="text-xl font-black text-blue-700 border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-wider">III. Facebook Social Service</h2>
            <div className="space-y-8">
              <div className="p-8 bg-blue-50/20 rounded-3xl border border-blue-100 relative">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Optimized Narrative Caption</h3>
                <p className="text-slate-800 text-lg leading-relaxed">{content.platforms.facebook.engagingCaption}</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Viral Hook Sentences</h3>
                    <div className="space-y-2">
                       {content.platforms.facebook.viralHookLines.map((line, i) => (
                         <p key={i} className="text-xs italic text-slate-600 leading-relaxed font-serif">"{line}"</p>
                       ))}
                    </div>
                  </div>
                  <div className="p-6 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Call To Action</h3>
                    <p className="text-sm font-black">{content.platforms.facebook.cta}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Score</h3>
                      <p className="text-xl font-black text-blue-600">{content.platforms.facebook.shareabilityScore}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Time</h3>
                      <p className="text-sm font-black text-slate-800">{content.platforms.facebook.bestPostingTime}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Audience Strategy</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{content.platforms.facebook.audienceSuggestion}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Interaction Hashtags</h3>
                    <p className="text-xs font-mono text-blue-600">{content.platforms.facebook.hashtags.map(h => `#${h}`).join(' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 text-center">
           <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.5em]">NeuralViral Engine v2.5 Preview | Secure Data Export</p>
           <p className="text-[8px] text-slate-300 mt-2">© {new Date().getFullYear()} AI Architect Dashboard</p>
        </div>
      </div>

      {/* Premium Platform Switcher */}
      <div className="z-40 py-4 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl md:rounded-full">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl md:rounded-full transition-all whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${
                activePlatform === p.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-105' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <p.icon className="w-4 h-4" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* TAB CONTENT: YOUTUBE */}
          {activePlatform === 'youtube' && (
            <div className="lg:col-span-12 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    {/* Integrated Core Analysis from Global */}
                    <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-14 rounded-[3.5rem] relative overflow-hidden group premium-shadow">
                      <div className="absolute top-0 right-0 p-8">
                        <CopyButton text={content.global.contentAnalysis} />
                      </div>
                      <SectionHeader title="Core Video Strategy" icon={BarChart3} color="text-indigo-400" />
                      <h2 className="text-xl md:text-5xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight">
                        {content.global.mainTopic}
                      </h2>
                      <p className="text-sm md:text-xl text-slate-400 font-light leading-relaxed max-w-4xl">
                        {content.global.contentAnalysis}
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] space-y-10">
                      <SectionHeader title="SEO Optimized Titles" icon={Award} textToCopy={content.platforms.youtube.seoTitles} color="text-red-500" />
                      <div className="space-y-3 md:space-y-4">
                        {content.platforms.youtube.seoTitles.map((title, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 md:p-6 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl group hover:border-primary/20 transition-all">
                            <span className="text-sm md:text-xl text-white font-bold tracking-tight">{title}</span>
                            <CopyButton text={title} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem]">
                       <SectionHeader title="Long Video Description" icon={Layout} textToCopy={content.platforms.youtube.longDescription} />
                       <div className="relative">
                          <textarea readOnly className="w-full h-80 bg-black/40 border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 text-sm text-slate-400 font-light leading-relaxed resize-none outline-none" value={content.platforms.youtube.longDescription} />
                          <div className="absolute top-2 right-2"><CopyButton text={content.platforms.youtube.longDescription} /></div>
                       </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] space-y-6">
                       <SectionHeader title="Video SEO Meta Tags" icon={Hash} textToCopy={content.platforms.youtube.tags.join(', ')} color="text-red-400" />
                       <div className="flex flex-wrap gap-2">
                         {content.platforms.youtube.tags.map((tag, i) => (
                           <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-mono rounded-lg hover:border-red-500/30 transition-colors uppercase tracking-wider">{tag}</span>
                         ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-6 md:p-10 bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem]">
                          <SectionHeader title="Video Chapters" icon={Clock} textToCopy={content.platforms.youtube.chapters} />
                          <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
                            <p className="font-mono text-[10px] md:text-[11px] text-primary leading-loose whitespace-pre-wrap">{content.platforms.youtube.chapters}</p>
                          </div>
                       </div>
                       <div className="p-6 md:p-10 bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem]">
                          <SectionHeader title="Thumbnail Text" icon={Sparkles} textToCopy={content.platforms.youtube.thumbnailTextIdeas} />
                          <div className="space-y-3">
                             {content.platforms.youtube.thumbnailTextIdeas.map((idea, i) => (
                               <p key={i} className="text-xs font-bold text-slate-300 italic p-4 bg-white/5 rounded-2xl border border-white/5 text-center">{idea}</p>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                     <div className="grid grid-cols-1 gap-4">
                        <ScoreCard label="SEO Optimization" value={content.platforms.youtube.seoScore} colorClass="text-red-500" bgClass="bg-red-500/20" />
                        <ScoreCard label="Clickability" value={content.platforms.youtube.clickabilityScore} colorClass="text-amber-500" bgClass="bg-amber-500/20" />
                        <ScoreCard label="Viral Potential" value={content.platforms.youtube.viralScore} colorClass="text-primary" bgClass="bg-primary/20" />
                     </div>

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 md:p-10 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Growth Hacks" icon={Zap} textToCopy={content.global.viralOptimizationIdeas} />
                        <div className="space-y-3 md:space-y-4">
                          {content.global.viralOptimizationIdeas.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                              <span className="text-primary font-mono text-[10px] mt-1 italic">#0{idx+1}</span>
                              <p className="text-xs text-slate-300 font-bold leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                     </div>

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Viral Hooks" icon={TrendingUp} textToCopy={content.platforms.youtube.viralHooks} />
                        <div className="space-y-3">
                           {content.platforms.youtube.viralHooks.map((hook, i) => (
                             <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 leading-relaxed font-medium italic">
                               "{hook}"
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Shorts/Reels Ideas" icon={Share2} textToCopy={content.platforms.youtube.shortsReelsIdeas} />
                        <div className="space-y-3">
                           {content.platforms.youtube.shortsReelsIdeas.map((idea, i) => (
                             <div key={i} className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-xs text-primary/80 font-bold">
                               {idea}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB CONTENT: FACEBOOK */}
          {activePlatform === 'facebook' && (
            <div className="lg:col-span-12 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-14 rounded-[3.5rem] space-y-8">
                      <SectionHeader title="Engaging Caption" icon={Facebook} textToCopy={content.platforms.facebook.engagingCaption} color="text-blue-500" />
                      <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[3rem] text-sm md:text-2xl text-slate-200 leading-relaxed font-serif relative">
                         {content.platforms.facebook.engagingCaption}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                         <div className="space-y-4">
                            <SectionHeader title="Short Version" icon={Layout} textToCopy={content.platforms.facebook.shortPostVersion} />
                            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-sm text-slate-400">
                               {content.platforms.facebook.shortPostVersion}
                            </div>
                         </div>
                         <div className="space-y-4">
                            <SectionHeader title="Call To Action" icon={Zap} textToCopy={content.platforms.facebook.cta} />
                            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 font-bold">
                               {content.platforms.facebook.cta}
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 space-y-6">
                         <SectionHeader title="Facebook Meta Tags" icon={Hash} textToCopy={content.platforms.facebook.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(', ')} color="text-blue-400" />
                         <div className="flex flex-wrap gap-3">
                            {content.platforms.facebook.hashtags.map((tag, i) => (
                              <span key={i} className="px-5 py-3 bg-blue-500/5 border border-blue-500/10 text-blue-300 text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/5">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                     <ScoreCard label="Shareability" value={content.platforms.facebook.shareabilityScore} colorClass="text-blue-500" bgClass="bg-blue-500/20" />

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Best Posting Time" icon={Clock} color="text-amber-500" />
                        <p className="text-2xl font-black text-white text-center pb-4 border-b border-white/5">{content.platforms.facebook.bestPostingTime}</p>
                        <div className="pt-2">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 text-center">Audience Suggestion</p>
                           <p className="text-xs text-slate-400 text-center leading-relaxed italic">{content.platforms.facebook.audienceSuggestion}</p>
                        </div>
                     </div>

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Viral Hook Lines" icon={TrendingUp} textToCopy={content.platforms.facebook.viralHookLines} />
                        <div className="space-y-3">
                           {content.platforms.facebook.viralHookLines.map((line, i) => (
                             <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400 italic">
                               "{line}"
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                        <SectionHeader title="Interaction Tags" icon={Hash} textToCopy={content.platforms.facebook.hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(', ')} />
                        <div className="flex flex-wrap gap-2">
                           {content.platforms.facebook.hashtags.map((h, i) => (
                             <span key={i} className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[10px] font-mono rounded-lg">
                               {h.startsWith('#') ? h : `#${h}`}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4 pt-10">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="group flex items-center gap-4 px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isExporting ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isExporting ? 'Generating Report...' : 'Download PDF Report'}
          </button>
          
          <button 
            onClick={handleExportJSON}
            className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] transition-all hover:bg-white/10"
          >
            <Share2 className="w-5 h-5" /> Export Data (JSON)
          </button>
        </div>
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Powered by NeuralViral AI Engine v2.5 PRE</p>
      </div>
    </div>
  );
};
