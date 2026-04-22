import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Upload, CheckCircle2, AlertCircle, FileVideo, Music } from 'lucide-react';

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onFileSelect, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer transition-all duration-500 rounded-[2.5rem] border-2 border-dashed overflow-hidden
          ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 bg-[#0c0c0c] hover:border-primary/30'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="p-12 flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 
              ${isDragActive ? 'bg-primary text-white rotate-12' : 'bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}
            `}>
              {file ? <FileVideo className="w-10 h-10" /> : <Video className="w-10 h-10" />}
            </div>
            {file && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-[#0c0c0c]"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {file ? file.name : 'ভিডিও ফাইল আপলোড করুন'}
            </h3>
            <p className="text-slate-500 font-light max-w-sm mx-auto">
              ভিডিও ফাইল থেকে অডিও এক্সট্রাক্ট করে ট্রান্সক্রিপশন তৈরি করার জন্য ড্র্যাগ অ্যান্ড ড্রপ করুন।
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
              <Upload className="w-3 h-3" /> MP4, MOV, MKV, WEBM
            </div>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all" />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
             <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Audio Extraction</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">ভিডিও থেকে অডিও আলাদা করে আপনার কাঙ্খিত ভাষায় ট্রান্সক্রাইব করবে।</p>
          </div>
        </div>
        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
             <AlertCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Quality Process</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">ব্যাকগ্রাউন্ড নয়েজ কমিয়ে ক্লিয়ার টেক্সট জেনারেট নিশ্চিত করে।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
