import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepItem {
  key: string
  title: ReactNode
  description?: ReactNode
  status?: StepStatus
  disabled?: boolean
  icon?: ReactNode
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'onChange'>, SemanticStyling<'root' | 'item' | 'icon' | 'title' | 'description'> {
  items: StepItem[]
  current?: number
  defaultCurrent?: number
  onChange?: (index: number) => void
  direction?: 'horizontal' | 'vertical'
  size?: 's' | 'm' | 'l'
  /** Render dot indicators instead of numbered circles; finished steps keep a check. */
  progressDot?: boolean
}

export const Steps = forwardRef<HTMLOListElement, StepsProps>(function Steps({ items, current, defaultCurrent = 0, onChange, direction = 'horizontal', size = 'm', progressDot = false, className = '', classNames, style, styles, ...props }, ref) {
  const [inner, setInner] = useState(defaultCurrent)
  const active = current ?? inner

  const resolveStatus = (item: StepItem, index: number): StepStatus => item.status ?? (index < active ? 'finish' : index === active ? 'process' : 'wait')

  return <ol
    {...props}
    ref={ref}
    className={`kvzd-design-steps kvzd-design-steps--${direction} kvzd-design-steps--${size} ${progressDot ? 'kvzd-design-steps--dot' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    {items.map((item, index) => {
      const status = resolveStatus(item, index)
      return <li
        key={item.key}
        aria-current={status === 'process' ? 'step' : undefined}
        className={`kvzd-design-steps__item kvzd-design-steps__item--${status} ${item.disabled ? 'kvzd-design-steps__item--disabled' : ''} ${classNames?.item ?? ''}`.trim()}
        style={styles?.item}
        onClick={item.disabled ? undefined : () => { if (current === undefined) setInner(index); onChange?.(index) }}
      >
        <span className={`kvzd-design-steps__tail`} aria-hidden="true" />
        <span className={`kvzd-design-steps__icon ${progressDot ? 'kvzd-design-steps__icon--dot' : ''} ${classNames?.icon ?? ''}`.trim()} style={styles?.icon}>
          {item.icon ?? (progressDot && status !== 'finish'
            ? <span className="kvzd-design-steps__dot" />
            : status === 'finish' ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : index + 1)}
        </span>
        <span className="kvzd-design-steps__text">
          <span className={`kvzd-design-steps__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{item.title}</span>
          {item.description && <span className={`kvzd-design-steps__description ${classNames?.description ?? ''}`.trim()} style={styles?.description}>{item.description}</span>}
        </span>
      </li>
    })}
  </ol>
})
