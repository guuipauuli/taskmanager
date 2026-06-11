import type { TextareaHTMLAttributes } from 'react';

interface AppTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errorMessage?: string;
}

export function AppTextArea({ label, id, className, errorMessage, ...props }: AppTextAreaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const classes = ['app-textarea', errorMessage ? 'app-textarea--invalid' : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="form-field" htmlFor={inputId}>
      <span className="form-field__label">{label}</span>
      <textarea id={inputId} className={classes} aria-invalid={Boolean(errorMessage)} {...props} />
      {errorMessage ? <span className="form-field__error">{errorMessage}</span> : null}
    </label>
  );
}
