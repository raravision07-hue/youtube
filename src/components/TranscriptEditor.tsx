import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, Send } from 'lucide-react';

interface TranscriptEditorProps {
  transcript: string;
  onEdit: (text: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  transcript,
  onEdit,
  onConfirm,
  isLoading,
}) => {
  const [localText, setLocalText] = useState(transcript);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
    onEdit(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8"
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Source_Transcript.raw</h2>
          <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 font-mono tracking-widest">BENGALI_BUFFER_SYNCED</span>
        </div>

        <div className="relative group flex-1 min-h-[400px]">
          <textarea
            className="w-full h-full p-8 bg-black/40 border border-white/5 rounded-2xl shadow-inner focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none text-base leading-relaxed text-slate-300 font-serif"
            value={localText}
            onChange={handleChange}
            placeholder="Transcription will appear here..."
          />
          <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-600 font-mono tracking-widest uppercase">
            {localText.length} BYTES
          </div>
        </div>
      </div>

      <div className="w-full md:w-[320px] flex flex-col gap-6 pt-10">
        <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl space-y-6">
          <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Analysis Engine</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Original Length', value: '00:00', icon: '⏱️' },
              { label: 'NLP Accuracy', value: '99.8%', icon: '🎯' },
              { label: 'Language', value: 'Bengali', icon: '🌐' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-light">{stat.label}</span>
                <span className="text-white font-mono">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isLoading || !localText.trim()}
              className="w-full group relative overflow-hidden flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-bold text-xs tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all uppercase"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Build Content
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Smart Analysis Phase</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
             <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Viral Hook Synthesis</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
