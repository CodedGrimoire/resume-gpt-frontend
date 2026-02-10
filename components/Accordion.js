'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Accordion({ title, children, icon: Icon, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-3 text-slate-400" />}
          <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="w-full px-6 pb-6 pt-2 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  );
}
