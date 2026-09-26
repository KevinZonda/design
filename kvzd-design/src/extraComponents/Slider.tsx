import { forwardRef, useState } from 'react'
import type { ChangeEvent, HTMLAttributes, PointerEvent, ReactNode } from 'react'
import type { SemanticStyling } from '../components/styling'
import '../styles/slider.css'

export interface SliderMark {
  value: number
  label?: ReactNode
}

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, SemanticStyling<'root' | 'track' | 'rail' | 'fill' | 'thumb' | 'mark' | 'tooltip'> {
  min?: number
  max?: number
  step?: number
  /** Render two handles for selecting a [lower, upper] range. */
  range?: boolean
  value?: number | [number, number]
  defaultValue?: number | [number, number]
  onChange?: (value: number | [number, number]) => void
  /** Tick marks rendered under the track, with optional labels. */
  marks?: SliderMark[]
  disabled?: boolean
  /** When to show the current value bubble. */
  tooltip?: 'hover' | 'always' | 'never'
  /** Accessible name; in range mode each handle gets `${ariaLabel} minimum` / `maximum`. */
  ariaLabel?: string
  /** Form field name; in range mode the handles submit as `${name}-lower` / `${name}-upper`. */
  name?: string
}

const clampTo = (v: number, min: number, max: number) => Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min

function toRange(v: number | [number, number] | undefined, min: number, max: number): [number, number] {
  if (Array.isArray(v)) {
    const lo = clampTo(Number(v[0]), min, max)
    const hi = clampTo(Number(v[1]), min, max)
    return lo <= hi ? [lo, hi] : [hi, lo]
  }
  const single = clampTo(Number(v ?? min), min, max)
  return [single, single]
}

/** Strip binary floating-point noise so 0.1 + 0.2 does not render as 0.30000000000000004. */
const formatValue = (v: number) => Number.parseFloat(v.toPrecision(10))

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider({
  min = 0,
  max = 100,
  step = 1,
  range = false,
  value,
  defaultValue,
  onChange,
  marks,
  disabled = false,
  tooltip = 'hover',
  ariaLabel,
  name,
  className = '',
  classNames,
  style,
  styles,
  ...props
}, ref) {
  const fallback = range ? toRange(defaultValue ?? [min, max], min, max) : clampTo(Number(defaultValue ?? min), min, max)
  const [inner, setInner] = useState<number | [number, number]>(fallback)
  const [lo, hi] = toRange(value ?? inner, min, max)
  const span = max - min || 1
  const percent = (v: number) => ((clampTo(v, min, max) - min) / span) * 100

  /* The native thumb travels between half-thumb insets at each end of the
     track, so thumb-centre (and everything aligned to it: fill end, tooltip,
     marks) is half + (100% - thumb-size) * fraction — never just fraction%. */
  const along = (p: number) => {
    const f = (clampTo(p, 0, 100) / 100).toFixed(4)
    return `calc(var(--kvzd-design-slider-thumb-half) + (100% - var(--kvzd-design-slider-thumb-size)) * ${f})`
  }
  const spanLength = (from: number, to: number) => {
    const f = ((clampTo(to, 0, 100) - clampTo(from, 0, 100)) / 100).toFixed(4)
    return `calc((100% - var(--kvzd-design-slider-thumb-size)) * ${f})`
  }
  /* The fill anchors to the track's left edge: at the minimum there is
     nothing to show, and the thumb itself covers the junction. */
  const fillLeft = range && lo !== min ? along(percent(lo)) : '0'
  const fillWidth = range
    ? lo !== min ? spanLength(percent(lo), percent(hi)) : along(percent(hi))
    : along(percent(lo))

  const handleSingle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clampTo(Number(event.target.value), min, max)
    if (value === undefined) setInner(next)
    onChange?.(next)
  }
  const handleLower = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clampTo(Math.min(Number(event.target.value), hi), min, max)
    if (value === undefined) setInner([next, hi])
    onChange?.([next, hi])
  }
  const handleUpper = (event: ChangeEvent<HTMLInputElement>) => {
    const next = clampTo(Math.max(Number(event.target.value), lo), min, max)
    if (value === undefined) setInner([lo, next])
    onChange?.([lo, next])
  }

  // The input has pointer-events:none (only the thumb receives events), so CSS
  // :active never matches; track the pressed state with pointer handlers
  // instead. The class is added imperatively to survive re-renders while
  // dragging, and the release listener goes on window: during a native drag the
  // pointerup targets the slider root, not the input.
  const handlePointerDown = (event: PointerEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    input.classList.add('kvzd-design-slider__input--pressed')
    const release = () => {
      input.classList.remove('kvzd-design-slider__input--pressed')
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }
  const pressProps = { onPointerDown: handlePointerDown }

  // The native inputs span the full min/max so handle positions match the
  // fill and marks; crossing is prevented by clamping in the change handlers.
  const tooltipOverlap = range && percent(hi) - percent(lo) < 12
  const tooltipNode = (v: number, key: string, raised = false) => tooltip !== 'never' ? (
    <span
      key={key}
      aria-hidden="true"
      className={`kvzd-design-slider__tooltip ${raised ? 'kvzd-design-slider__tooltip--raised' : ''} ${classNames?.tooltip ?? ''}`.trim()}
      style={{ left: along(percent(v)), ...styles?.tooltip }}
    >
      {formatValue(v)}
    </span>
  ) : null

  const inputClass = `kvzd-design-slider__input ${classNames?.thumb ?? ''}`.trim()
  const shownMarks = (marks ?? []).filter((mark) => mark.value >= min && mark.value <= max)

  return (
    <div
      {...props}
      ref={ref}
      className={`kvzd-design-slider ${range ? 'kvzd-design-slider--range' : ''} ${disabled ? 'kvzd-design-slider--disabled' : ''} kvzd-design-slider--tooltip-${tooltip} ${classNames?.root ?? ''} ${className}`.trim()}
      style={{ ...styles?.root, ...style }}
    >
      <div className={`kvzd-design-slider__track ${classNames?.track ?? ''}`.trim()} style={styles?.track}>
        <div className={`kvzd-design-slider__rail ${classNames?.rail ?? ''}`.trim()} style={styles?.rail} aria-hidden="true" />
        <div
          className={`kvzd-design-slider__fill ${classNames?.fill ?? ''}`.trim()}
          aria-hidden="true"
          style={{ left: fillLeft, width: fillWidth, ...styles?.fill }}
        />
        {range ? (
          <>
            <input
              type="range"
              className={`${inputClass} kvzd-design-slider__input--lower`.trim()}
              style={styles?.thumb}
              min={min}
              max={max}
              step={step}
              value={lo}
              disabled={disabled}
              name={name ? `${name}-lower` : undefined}
              aria-label={ariaLabel ? `${ariaLabel} minimum` : undefined}
              onChange={handleLower}
              {...pressProps}
            />
            <input
              type="range"
              className={`${inputClass} kvzd-design-slider__input--upper`.trim()}
              style={styles?.thumb}
              min={min}
              max={max}
              step={step}
              value={hi}
              disabled={disabled}
              name={name ? `${name}-upper` : undefined}
              aria-label={ariaLabel ? `${ariaLabel} maximum` : undefined}
              onChange={handleUpper}
              {...pressProps}
            />
            {tooltipNode(lo, 'lo')}
            {tooltipNode(hi, 'hi', tooltipOverlap)}
          </>
        ) : (
          <>
            <input
              type="range"
              className={inputClass}
              style={styles?.thumb}
              min={min}
              max={max}
              step={step}
              value={lo}
              disabled={disabled}
              name={name}
              aria-label={ariaLabel}
              onChange={handleSingle}
              {...pressProps}
            />
            {tooltipNode(lo, 'single')}
          </>
        )}
      </div>
      {shownMarks.length > 0 && (
        <div className="kvzd-design-slider__marks">
          {shownMarks.map((mark, index) => (
            <div
              key={index}
              className={`kvzd-design-slider__mark ${shownMarks.length > 1 && index === 0 ? 'kvzd-design-slider__mark--first' : ''} ${shownMarks.length > 1 && index === shownMarks.length - 1 ? 'kvzd-design-slider__mark--last' : ''} ${classNames?.mark ?? ''}`.trim()}
              style={{ left: along(percent(mark.value)), ...styles?.mark }}
            >
              <span className="kvzd-design-slider__mark-dot" aria-hidden="true" />
              {mark.label !== undefined && <span className="kvzd-design-slider__mark-label">{mark.label}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
