import type { InputHTMLAttributes } from 'react';

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export function AppInput({ label, id, className, errorMessage, ...props }: AppInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const classes = ['app-input', errorMessage ? 'app-input--invalid' : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="form-field" htmlFor={inputId}>
      <span className="form-field__label">{label}</span>
      <input id={inputId} className={classes} aria-invalid={Boolean(errorMessage)} {...props} />
      {errorMessage ? <span className="form-field__error">{errorMessage}</span> : null}
    </label>
  );
}
