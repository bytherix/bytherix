import * as React from 'react'
import { cn } from '@/lib/utils'
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
         <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
            "bg-gray-900/80 border text-white placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
              : "border-gray-800 hover:border-gray-700",
            className
          )}
          {...props}
        />
          {error ? (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-400 font-medium animate-fadeIn">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-gray-400">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)
Input.displayName = 'Input'