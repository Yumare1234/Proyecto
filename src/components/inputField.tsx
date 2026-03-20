// components/InputField.tsx
import React from 'react';

// Definimos las props con TypeScript
interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string; // 'text', 'number', 'url', etc.
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  isTextArea?: boolean; // Para la descripción
}

export const InputField: React.FC<InputFieldProps> = ({
  label, id, name, type = 'text', placeholder, value, onChange, required = false, isTextArea = false
}) => {
  
  // Clases compartidas para inputs y textareas (basadas en tu buscador)
  const baseClasses = "w-full p-3 rounded-lg bg-slate-900/50 border border-purple-500/30 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner text-sm";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        />
      )}
    </div>
  );
};