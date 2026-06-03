"use client";

import { useState, createContext, useContext } from 'react';

export const FlowContext = createContext({ accent: 'teal' });

const ACCENT_COLORS = {
  teal: {
    text: 'text-brand-teal',
    bg: 'bg-brand-tealBg',
    border: 'border-brand-tealBorder',
    focusRing: 'focus:ring-brand-teal/20',
    focusBorder: 'focus:border-brand-teal',
    solidBg: 'bg-brand-teal',
    solidBorder: 'border-brand-teal',
  },
  amber: {
    text: 'text-brand-amber',
    bg: 'bg-brand-amberBg',
    border: 'border-brand-amberBorder',
    focusRing: 'focus:ring-brand-amber/20',
    focusBorder: 'focus:border-brand-amber',
    solidBg: 'bg-brand-amber',
    solidBorder: 'border-brand-amber',
  },
  purple: {
    text: 'text-brand-purple',
    bg: 'bg-brand-purpleBg',
    border: 'border-brand-purpleBorder',
    focusRing: 'focus:ring-brand-purple/20',
    focusBorder: 'focus:border-brand-purple',
    solidBg: 'bg-brand-purple',
    solidBorder: 'border-brand-purple',
  },
  emerald: {
    text: 'text-brand-emerald',
    bg: 'bg-brand-emeraldBg',
    border: 'border-brand-emeraldBorder',
    focusRing: 'focus:ring-brand-emerald/20',
    focusBorder: 'focus:border-brand-emerald',
    solidBg: 'bg-brand-emerald',
    solidBorder: 'border-brand-emerald',
  }
};

export function Input({ label, value, onChange, placeholder, type = 'text', required, hint, prefix, overrideAccent, hideApprox = false }) {
  const [focused, setFocused] = useState(false);
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-brand-navyMid mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className={accentTheme.text}> *</span>}
          {!required && label && <span className="text-brand-slateLight font-normal text-[10px] ml-1">(Optional)</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slateLight text-sm font-semibold pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full text-sm text-brand-navy bg-brand-bgCard border rounded-[10px] outline-none transition-all duration-200 ${
            prefix ? 'pl-7 pr-3.5 py-2.5' : 'px-3.5 py-2.5'
          } ${
            focused 
              ? `${accentTheme.focusBorder} ring-2 ${accentTheme.focusRing}` 
              : 'border-brand-borderMid'
          }`}
        />
      </div>
      {hint && <p className="text-xs text-brand-slateLight mt-1">{hint}</p>}
      {value && type === 'number' && Number(value) > 10000 && !hideApprox && (
        <p className={`text-xs mt-1 ${accentTheme.text}`}>
          ≈ ₹{(Number(value) / 100000).toFixed(1)} Lakh
        </p>
      )}
    </div>
  );
}

export function Select({ label, value, onChange, options, required, placeholder, overrideAccent }) {
  const [focused, setFocused] = useState(false);
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-brand-navyMid mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className={accentTheme.text}> *</span>}
          {!required && label && <span className="text-brand-slateLight font-normal text-[10px] ml-1">(Optional)</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3.5 py-2.5 text-sm rounded-[10px] border bg-brand-bgCard outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_14px_center] ${
            value ? 'text-brand-navy' : 'text-brand-slateLight'
          } ${
            focused 
              ? `${accentTheme.focusBorder} ring-2 ${accentTheme.focusRing}` 
              : 'border-brand-borderMid'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238C97A8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          }}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function Toggle({ label, value, onChange, required, overrideAccent }) {
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-brand-navyMid mb-2 uppercase tracking-wider">
          {label}
          {required && <span className={accentTheme.text}> *</span>}
        </label>
      )}
      <div className="flex gap-3">
        {['Yes', 'No'].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-lg border font-semibold text-xs cursor-pointer transition-all duration-200 ${
              value === opt 
                ? `${accentTheme.solidBorder} ${accentTheme.bg} ${accentTheme.text}` 
                : 'border-brand-borderMid bg-brand-bgCard text-brand-slate hover:bg-brand-bgAlt'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AlertToggle({ label, sublabel, value, onChange, overrideAccent }) {
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between p-3.5 rounded-[10px] border cursor-pointer transition-all duration-200 mb-2 ${
        value 
          ? `${accentTheme.solidBorder} ${accentTheme.bg}` 
          : 'border-brand-borderMid bg-brand-bgCard hover:bg-brand-bgAlt'
      }`}
    >
      <div>
        <div className={`text-xs font-semibold ${value ? accentTheme.text : 'text-brand-navyMid'}`}>
          {label}
        </div>
        <div className="text-[11px] text-brand-slateLight mt-0.5">
          {sublabel}
        </div>
      </div>
      <div className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 flex-shrink-0 ${
        value ? accentTheme.solidBg : 'bg-brand-border'
      }`}>
        <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${
          value ? 'left-[21px]' : 'left-[3px]'
        }`} />
      </div>
    </div>
  );
}

export function FieldBadge({ n, active, overrideAccent }) {
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div
      className={`w-7 h-7 rounded-lg flex-shrink-0 border flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
        accentTheme.border
      } ${
        active 
          ? `${accentTheme.solidBg} text-white` 
          : `${accentTheme.bg} ${accentTheme.text}`
      }`}
    >
      {n.toString().padStart(2, '0')}
    </div>
  );
}

export function SectionHeader({ number, title, overrideAccent }) {
  const contextAccent = useContext(FlowContext).accent;
  const accent = overrideAccent || contextAccent;
  const accentTheme = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;

  return (
    <div className="flex items-center gap-2.5 mb-4 mt-1">
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${accentTheme.border} ${accentTheme.bg} ${accentTheme.text}`}>
        {number}
      </div>
      <h3 className="text-sm font-bold text-brand-navy tracking-tight">
        {title}
      </h3>
    </div>
  );
}
