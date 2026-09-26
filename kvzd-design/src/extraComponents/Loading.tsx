import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton'
  size?: 's' | 'm' | 'l'
  label?: string
  lines?: number
  delay?: number
  fullscreen?: boolean
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(function Loading({ variant = 'spinner', size = 'm', label, lines = 3, delay = 0, fullscreen = false, className = '', ...props }, ref) {
  const [visible, setVisible] = useState(delay <= 0)

  useEffect(() => {
    if (delay <= 0) return
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) return null

  return <div {...props} ref={ref} className={`kvzd-design-loading kvzd-design-loading--${variant} kvzd-design-loading--${size} ${fullscreen ? 'kvzd-design-loading--fullscreen' : ''} ${className}`.trim()} role="status" aria-label={label}>
    {variant === 'spinner'
      ? <><span className="kvzd-design-loading__spinner" aria-hidden="true" />{label !== undefined && <span>{label}</span>}</>
      : <>{label !== undefined && <span className="govuk-visually-hidden">{label}</span>}<span className="kvzd-design-loading__skeleton" aria-hidden="true">{Array.from({ length: Math.max(1, lines) }, (_, index) => <span className="kvzd-design-loading__line" key={index} />)}</span></>}
  </div>
})
