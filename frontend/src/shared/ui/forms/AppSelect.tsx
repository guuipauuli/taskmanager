import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  errorMessage?: string;
}

export function AppSelect({ label, options, id, className, errorMessage, ...props }: AppSelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const classes = ['app-select', errorMessage ? 'app-select--invalid' : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="form-field" htmlFor={inputId}>
      <span className="form-field__label">{label}</span>
      <select id={inputId} className={classes} aria-invalid={Boolean(errorMessage)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage ? <span className="form-field__error">{errorMessage}</span> : null}
    </label>
  );
}
