import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, ...props }, ref) => (
    <div className="mb-2">
      {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        {...props}
        className={
          `block w-full rounded-xl px-4 py-2 bg-gradient-to-r from-blue-50 to-white text-gray-800 shadow focus:shadow-lg transition-all duration-200
          focus:ring-2 focus:ring-blue-400 focus:bg-white border-0 outline-none placeholder-gray-400 ${props.className || ''}`
        }
      />
    </div>
  )
);
InputField.displayName = 'InputField';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, ...props }, ref) => (
    <div className="mb-2">
      {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        {...props}
        className={
          `block w-full rounded-xl px-4 py-2 bg-gradient-to-r from-blue-50 to-white text-gray-800 shadow focus:shadow-lg transition-all duration-200
          focus:ring-2 focus:ring-blue-400 focus:bg-white border-0 outline-none placeholder-gray-400 ${props.className || ''}`
        }
      />
    </div>
  )
);
TextareaField.displayName = 'TextareaField';
