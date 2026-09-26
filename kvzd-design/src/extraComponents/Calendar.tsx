import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'
import '../styles/calendar.css'

/** Strip the time portion so day-level comparisons stay stable across timezones. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function addDays(date: Date, amount: number): Date {
  const next = startOfDay(date)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(date: Date, amount: number): Date {
  const year = date.getFullYear()
  const month = date.getMonth() + amount
  const day = date.getDate()
  const target = new Date(year, month, 1)
  target.setDate(Math.min(day, daysInMonth(target.getFullYear(), target.getMonth())))
  return target
}

function addYears(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear() + amount, date.getMonth(), 1)
  target.setDate(Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth())))
  return target
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** First day of the week (Monday = 1 by default) that contains `date`. */
function startOfWeek(date: Date, weekStartsOn: number): Date {
  const day = date.getDay()
  const diff = (day - weekStartsOn + 7) % 7
  return addDays(date, -diff)
}

function toKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Build the visible grid: whole weeks covering the month, `weekStartsOn` first. */
function buildWeeks(month: Date, weekStartsOn: number): Date[][] {
  const first = startOfMonth(month)
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const total = daysInMonth(first.getFullYear(), first.getMonth())
  const weekCount = Math.ceil((offset + total) / 7)
  const start = addDays(first, -offset)
  const weeks: Date[][] = []
  for (let week = 0; week < weekCount; week++) {
    const days: Date[] = []
    for (let day = 0; day < 7; day++) days.push(addDays(start, week * 7 + day))
    weeks.push(days)
  }
  return weeks
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, SemanticStyling<'root' | 'header' | 'nav' | 'title' | 'grid' | 'weekdays' | 'cell'> {
  /** Selected day (controlled). Pass null for no selection. */
  value?: Date | null
  /** Initially selected day when uncontrolled. */
  defaultValue?: Date | null
  onChange?: (date: Date) => void
  /** Earliest selectable day. */
  min?: Date
  /** Latest selectable day. */
  max?: Date
  /** Extra marker rendered in the bottom-right corner of a day cell. */
  dateCellRender?: (date: Date) => ReactNode
  /** Month to display (controlled). */
  month?: Date
  /** Initially displayed month when uncontrolled. Defaults to the selected day or today. */
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  /** Show a "Today" button that jumps back to the current month and day. */
  showToday?: boolean
  /** BCP 47 locale used for weekday and month names; week starts on Monday. */
  locale?: string
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar({
  value, defaultValue = null, onChange, min, max, dateCellRender, month, defaultMonth, onMonthChange,
  showToday = true, locale = 'en-GB', className = '', classNames, style, styles, ...props
}, ref) {
  const today = startOfDay(new Date())
  const [innerSelected, setInnerSelected] = useState<Date | null>(defaultValue)
  const selected = value !== undefined ? value : innerSelected
  const [innerMonth, setInnerMonth] = useState<Date>(() => startOfMonth(defaultMonth ?? defaultValue ?? today))
  const visibleMonth = startOfMonth(month ?? innerMonth)
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(defaultValue ?? today))

  const gridRef = useRef<HTMLDivElement | null>(null)
  const keyboardFocusRef = useRef(false)

  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
  const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' })
  // 2020-06-01 was a Monday, so iterating seven days from it yields locale weekday names in order.
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays: string[] = []
  for (let index = 0; index < 7; index++) weekdays.push(weekdayFormatter.format(addDays(new Date(2020, 5, 1), index)))

  const minDay = min ? startOfDay(min) : undefined
  const maxDay = max ? startOfDay(max) : undefined
  const isDisabled = (date: Date) => (minDay !== undefined && date < minDay) || (maxDay !== undefined && date > maxDay)
  const weeks = buildWeeks(visibleMonth, 1)

  const updateMonth = (next: Date) => {
    if (month === undefined) setInnerMonth(startOfMonth(next))
    onMonthChange?.(startOfMonth(next))
  }
  const selectDate = (date: Date) => {
    if (isDisabled(date)) return
    if (value === undefined) setInnerSelected(date)
    setFocusDate(date)
    onChange?.(date)
  }

  // After keyboard navigation changes the focused day (possibly flipping the
  // visible month), move focus to the matching cell button.
  useEffect(() => {
    if (!keyboardFocusRef.current) return
    keyboardFocusRef.current = false
    const target = gridRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${toKey(focusDate)}"]`)
    target?.focus()
  })

  const moveFocus = (next: Date) => {
    const day = startOfDay(next)
    keyboardFocusRef.current = true
    setFocusDate(day)
    if (!isSameMonth(day, visibleMonth)) updateMonth(day)
  }

  const onCellKeyDown = (date: Date, event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        moveFocus(addDays(date, -1))
        break
      case 'ArrowRight':
        event.preventDefault()
        moveFocus(addDays(date, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(addDays(date, -7))
        break
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(addDays(date, 7))
        break
      case 'Home':
        event.preventDefault()
        moveFocus(startOfWeek(date, 1))
        break
      case 'End':
        event.preventDefault()
        moveFocus(addDays(startOfWeek(date, 1), 6))
        break
      case 'PageUp':
        event.preventDefault()
        moveFocus(event.shiftKey ? addYears(date, -1) : addMonths(date, -1))
        break
      case 'PageDown':
        event.preventDefault()
        moveFocus(event.shiftKey ? addYears(date, 1) : addMonths(date, 1))
        break
    }
  }

  const goToday = () => {
    updateMonth(today)
    selectDate(today)
    keyboardFocusRef.current = true
    setFocusDate(today)
  }

  return <div
    {...props}
    ref={ref}
    className={`kvzd-design-calendar ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    <div className={`kvzd-design-calendar__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      <div className={`kvzd-design-calendar__nav ${classNames?.nav ?? ''}`.trim()} style={styles?.nav}>
        <button
          type="button"
          className="kvzd-design-calendar__nav-button"
          aria-label="Previous month"
          onClick={() => updateMonth(addMonths(visibleMonth, -1))}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          type="button"
          className="kvzd-design-calendar__nav-button"
          aria-label="Next month"
          onClick={() => updateMonth(addMonths(visibleMonth, 1))}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className={`kvzd-design-calendar__title ${classNames?.title ?? ''}`.trim()} style={styles?.title} aria-live="polite">
        {monthFormatter.format(visibleMonth)}
      </div>
      {showToday && <button type="button" className="kvzd-design-calendar__today" onClick={goToday}>Today</button>}
    </div>
    <div
      ref={gridRef}
      className={`kvzd-design-calendar__grid ${classNames?.grid ?? ''}`.trim()}
      style={styles?.grid}
      role="grid"
      aria-label={monthFormatter.format(visibleMonth)}
    >
      <div className={`kvzd-design-calendar__weekdays ${classNames?.weekdays ?? ''}`.trim()} style={styles?.weekdays} role="row">
        {weekdays.map((weekday) => <span key={weekday} className="kvzd-design-calendar__weekday" role="columnheader">{weekday}</span>)}
      </div>
      {weeks.map((week, weekIndex) => <div key={weekIndex} className="kvzd-design-calendar__week" role="row">
        {week.map((date) => {
          const disabled = isDisabled(date)
          const outside = !isSameMonth(date, visibleMonth)
          const isToday = isSameDay(date, today)
          const isSelected = selected !== null && isSameDay(date, selected)
          const classNamesCell = [
            'kvzd-design-calendar__cell',
            outside ? 'kvzd-design-calendar__cell--outside' : '',
            isToday ? 'kvzd-design-calendar__cell--today' : '',
            isSelected ? 'kvzd-design-calendar__cell--selected' : '',
            classNames?.cell ?? '',
          ].filter(Boolean).join(' ')
          return <button
            key={toKey(date)}
            type="button"
            role="gridcell"
            data-date={toKey(date)}
            tabIndex={isSameDay(date, focusDate) && !outside ? 0 : -1}
            disabled={disabled}
            aria-pressed={isSelected}
            aria-label={dayFormatter.format(date)}
            aria-current={isToday ? 'date' : undefined}
            className={classNamesCell}
            style={styles?.cell}
            onClick={() => selectDate(date)}
            onKeyDown={(event) => onCellKeyDown(date, event)}
          >
            <span className="kvzd-design-calendar__cell-date">{dayFormatter.format(date)}</span>
            {dateCellRender && <span className="kvzd-design-calendar__cell-marker">{dateCellRender(date)}</span>}
          </button>
        })}
      </div>)}
    </div>
  </div>
})
