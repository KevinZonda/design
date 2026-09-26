import { forwardRef, type HTMLAttributes } from 'react'
import type { SemanticStyling } from '../components/index'

export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception'
export type ProgressType = 'line' | 'circle' | 'dashboard' | 'steps'

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'bar' | 'inner' | 'info'> {
  percent: number
  status?: ProgressStatus
  type?: ProgressType
  showInfo?: boolean
  size?: 's' | 'm'
  /** Width and height of circle and dashboard types in pixels. */
  width?: number
  /** Gap of the dashboard type as a percentage of the circle circumference (0-100). */
  gapDegree?: number
  /** Number of segments for the steps type; defaults to the clamped percent. */
  stepsCount?: number
  strokeColor?: string
}

const statusColour: Record<ProgressStatus, string> = {
  normal: 'var(--govuk-brand-colour, #00703c)',
  active: 'var(--govuk-brand-colour, #00703c)',
  success: 'var(--govuk-brand-colour, #00703c)',
  exception: 'var(--govuk-error-colour, #d4351c)',
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ percent, status = 'normal', type = 'line', showInfo = true, size = 'm', width, gapDegree = 8, stepsCount, strokeColor, className = '', classNames, style, styles, ...props }, ref) {
  const value = Math.min(100, Math.max(0, percent))
  const effective: ProgressStatus = value >= 100 ? 'success' : status
  const colour = strokeColor ?? statusColour[effective]

  const info = showInfo && <span className={`kvzd-design-progress__info ${classNames?.info ?? ''}`.trim()} style={styles?.info}>{value}%</span>
  const barProps = { role: 'progressbar' as const, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': value }

  if (type === 'circle' || type === 'dashboard') {
    const sizePx = width ?? (size === 's' ? 72 : 112)
    const stroke = size === 's' ? 6 : 8
    const radius = (sizePx - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const gap = type === 'dashboard' ? (gapDegree / 100) * circumference : 0
    const filled = (value / 100) * (circumference - gap)
    return <div {...props} ref={ref} className={`kvzd-design-progress kvzd-design-progress--circle kvzd-design-progress--${effective} ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
      <svg {...barProps} className="kvzd-design-progress__svg" width={sizePx} height={sizePx} viewBox={`0 0 ${sizePx} ${sizePx}`}>
        <circle className="kvzd-design-progress__track" cx={sizePx / 2} cy={sizePx / 2} r={radius} fill="none" strokeWidth={stroke}
          strokeDasharray={`${circumference - gap} ${circumference}`}
          transform={type === 'dashboard' ? `rotate(${90 + (gapDegree / 2)} ${sizePx / 2} ${sizePx / 2})` : undefined} />
        <circle className="kvzd-design-progress__ring" cx={sizePx / 2} cy={sizePx / 2} r={radius} fill="none" stroke={colour} strokeWidth={stroke}
          strokeDasharray={`${filled} ${circumference - filled}`} strokeLinecap="butt"
          transform={type === 'dashboard' ? `rotate(${90 + (gapDegree / 2)} ${sizePx / 2} ${sizePx / 2})` : 'rotate(-90 ' + sizePx / 2 + ' ' + sizePx / 2 + ')'} />
      </svg>
      {showInfo && <span className={`kvzd-design-progress__info kvzd-design-progress__info--center ${classNames?.info ?? ''}`.trim()} style={styles?.info}>{value}%</span>}
    </div>
  }

  if (type === 'steps') {
    const count = Math.max(1, Math.floor(stepsCount ?? value))
    const filledSteps = Math.round((value / 100) * count)
    return <div {...props} ref={ref} className={`kvzd-design-progress kvzd-design-progress--steps ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
      <div {...barProps} className="kvzd-design-progress__segments" style={styles?.bar}>
        {Array.from({ length: count }, (_, index) => <span key={index} className={`kvzd-design-progress__segment ${index < filledSteps ? 'kvzd-design-progress__segment--filled' : ''}`} style={index < filledSteps ? { background: colour } : undefined} />)}
      </div>
      {info}
    </div>
  }

  return <div {...props} ref={ref} className={`kvzd-design-progress kvzd-design-progress--${size} kvzd-design-progress--${effective} ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-progress__bar ${classNames?.bar ?? ''}`.trim()} style={styles?.bar}>
      <div
        className={`kvzd-design-progress__inner ${classNames?.inner ?? ''}`.trim()}
        style={{ width: `${value}%`, backgroundColor: colour, ...styles?.inner }}
        {...barProps}
      />
    </div>
    {info}
  </div>
})
