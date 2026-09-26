import { forwardRef, type HTMLAttributes } from 'react'
import type { SemanticStyling } from '../components/index'

export type ProgressStatus = 'normal' | 'active' | 'success' | 'exception'

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'bar' | 'inner' | 'info'> {
  percent: number
  status?: ProgressStatus
  showInfo?: boolean
  size?: 's' | 'm'
  strokeColor?: string
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ percent, status = 'normal', showInfo = true, size = 'm', strokeColor, className = '', classNames, style, styles, ...props }, ref) {
  const value = Math.min(100, Math.max(0, percent))
  const effective = value >= 100 ? 'success' : status
  return <div {...props} ref={ref} className={`kvzd-design-progress kvzd-design-progress--${size} kvzd-design-progress--${effective} ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-progress__bar ${classNames?.bar ?? ''}`.trim()} style={styles?.bar}>
      <div
        className={`kvzd-design-progress__inner ${classNames?.inner ?? ''}`.trim()}
        style={{ width: `${value}%`, background: strokeColor, ...styles?.inner }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      />
    </div>
    {showInfo && <span className={`kvzd-design-progress__info ${classNames?.info ?? ''}`.trim()} style={styles?.info}>{value}%</span>}
  </div>
})
