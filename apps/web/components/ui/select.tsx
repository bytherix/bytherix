import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: Array<{ value: string; label: string }>
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, disabled, children, options, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            className={cn(
             "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 appearance-none pr-10",
              "bg-gray-900/80 border text-white placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500",
              "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
              error
                ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-800 hover:border-gray-700",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error ? (
          <p id={`${selectId}-error`} role="alert" className="mt-1.5 text-xs text-red-400 font-medium animate-fadeIn">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-gray-400">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)
Select.displayName = 'Select' 