import React, { useCallback, useState } from 'react';
import { Upload, Music, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative group h-72 border border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden
          ${isDragging ? 'border-primary bg-primary/5 scale-102' : 'border-white/10 bg-[#0c0c0c] hover:border-white/20'}
          ${isLoading ? 'pointer-events-none opacity-80' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && document.getElementById('audio-input')?.click()}
      >
        <input
          id="audio-input"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-sm font-mono tracking-widest text-primary uppercase">INGESTING_AUDIO_STREAM...</p>
            </motion.div>
          ) : file ? (
            <motion.div
              key="file"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="bg-primary/10 p-5 rounded-2xl mb-6 ring-1 ring-primary/20">
                <Music className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-white truncate max-w-xs">{file.name}</p>
              <div className="mt-8 flex items-center gap-2 text-indigo-400 font-mono text-[10px] tracking-widest uppercase">
                <CheckCircle className="w-4 h-4" />
                <span>READY_FOR_ANALYSIS</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white/5 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all border border-white/5">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-lg font-medium text-white">Upload Audio Engine</p>
              <p className="text-sm text-slate-500 mt-2 font-light">ড্র্যাগ করুন অথবা ক্লিক করে ফাইল সিলেক্ট করুন</p>
              <div className="mt-8 flex gap-4">
                <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5">WAV</span>
                <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5">MP3</span>
                <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5">M4A</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Music, label: 'স্বয়ংক্রিয়া ট্রান্সক্রিপশন', sub: 'Neural Engine' },
          { icon: CheckCircle, label: 'সঠিক বাংলা অনুবাদ', sub: 'Native Quality' },
          { icon: AlertCircle, label: 'ভাইরাল কন্টেন্ট জেনারেশন', sub: 'SEO Optimized' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-3 p-5 bg-[#0c0c0c] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <item.icon className="w-5 h-5 text-primary" />
            <div>
              <span className="block text-sm font-medium text-white leading-tight">{item.label}</span>
              <span className="block text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-wider">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
