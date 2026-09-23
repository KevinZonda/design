import { forwardRef, type HTMLAttributes } from 'react'

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton'
  size?: 's' | 'm' | 'l'
  label?: string
  lines?: number
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(function Loading({ variant = 'spinner', size = 'm', label = 'Loading', lines = 3, className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`kvzd-loading kvzd-loading--${variant} kvzd-loading--${size} ${className}`.trim()} role="status" aria-label={label}>
    {variant === 'spinner'
      ? <><span className="kvzd-loading__spinner" aria-hidden="true" /><span>{label}</span></>
      : <><span className="govuk-visually-hidden">{label}</span><span className="kvzd-loading__skeleton" aria-hidden="true">{Array.from({ length: Math.max(1, lines) }, (_, index) => <span className="kvzd-loading__line" key={index} />)}</span></>}
  </div>
})
