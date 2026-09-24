import { forwardRef, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'

interface ExitShortcut {
  progress: (count: number, message: string) => void
  exit: () => void
}

const shortcuts = new Set<ExitShortcut>()
let shiftCount = 0
let lastKeyWasModified = false
let shortcutTimer: ReturnType<typeof setTimeout> | undefined

function resetShortcut(message = '') {
  if (shortcutTimer) clearTimeout(shortcutTimer)
  shortcutTimer = undefined
  shiftCount = 0
  shortcuts.values().next().value?.progress(0, message)
}

function onShortcutKeyUp(event: globalThis.KeyboardEvent) {
  const active = shortcuts.values().next().value
  if (!active) return
  if (event.key === 'Shift' && !lastKeyWasModified) {
    shiftCount += 1
    if (shiftCount === 3) {
      resetShortcut()
      active.exit()
    } else {
      active.progress(shiftCount, shiftCount === 1 ? 'Shift, press 2 more times to exit.' : 'Shift, press 1 more time to exit.')
      if (shiftCount === 1) shortcutTimer = setTimeout(() => resetShortcut('Exit this page expired.'), 5000)
    }
  } else if (shiftCount) {
    resetShortcut()
  }
  lastKeyWasModified = event.shiftKey
}

function registerShortcut(shortcut: ExitShortcut) {
  shortcuts.add(shortcut)
  if (shortcuts.size === 1) document.addEventListener('keyup', onShortcutKeyUp, true)
  return () => {
    shortcuts.delete(shortcut)
    resetShortcut()
    if (!shortcuts.size) {
      document.removeEventListener('keyup', onShortcutKeyUp, true)
      lastKeyWasModified = false
    }
  }
}

export interface ExitThisPageProps {
  href?: string
  children?: ReactNode
  secondaryLabel?: string
  loadingText?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  onExit?: () => void
  style?: CSSProperties
}

export const ExitThisPage = forwardRef<HTMLAnchorElement, ExitThisPageProps>(function ExitThisPage({
  children,
  href = 'https://www.bbc.co.uk/weather',
  loadingText = 'Loading.',
  onClick,
  onExit,
  secondaryLabel = 'Emergency exit this page',
  style,
}, ref) {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState('')
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const clearOverlay = () => {
    overlayRef.current?.remove()
    overlayRef.current = null
    document.body.classList.remove('govuk-exit-this-page-hide-content')
  }

  const exit = () => {
    if (!overlayRef.current) {
      const overlay = document.createElement('div')
      overlay.className = 'govuk-exit-this-page-overlay'
      overlay.setAttribute('role', 'alert')
      overlay.textContent = loadingText
      document.body.appendChild(overlay)
      overlayRef.current = overlay
      document.body.classList.add('govuk-exit-this-page-hide-content')
    }
    try {
      onExit?.()
    } finally {
      window.location.assign(href)
    }
  }

  const exitRef = useRef(exit)
  useEffect(() => { exitRef.current = exit })
  useEffect(() => {
    const shortcut: ExitShortcut = {
      progress: (next, message) => { setCount(next); setStatus(message) },
      exit: () => exitRef.current(),
    }
    const unregister = registerShortcut(shortcut)
    window.addEventListener('pageshow', clearOverlay)
    return () => { unregister(); window.removeEventListener('pageshow', clearOverlay); clearOverlay() }
  }, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    try {
      onClick?.(event)
    } finally {
      exit()
    }
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === ' ') { event.preventDefault(); event.currentTarget.click() }
  }

  return <div className="govuk-exit-this-page">
    <a ref={ref} href={href} role="button" draggable={false} rel="nofollow noreferrer" className="govuk-button govuk-button--warning govuk-exit-this-page__button" style={style} onClick={handleClick} onKeyDown={handleKeyDown}>
      {children ?? <><span className="govuk-visually-hidden">Emergency</span>{' '}Exit this page</>}
      <span className={`govuk-exit-this-page__indicator ${count ? 'govuk-exit-this-page__indicator--visible' : ''}`} aria-hidden="true">
        {[1, 2, 3].map((light) => <span key={light} className={`govuk-exit-this-page__indicator-light ${count >= light ? 'govuk-exit-this-page__indicator-light--on' : ''}`} />)}
      </span>
    </a>
    <a href={href} rel="nofollow noreferrer" className="govuk-link govuk-visually-hidden-focusable" onClick={handleClick}>{secondaryLabel}</a>
    <span className="govuk-visually-hidden" role="status">{status}</span>
  </div>
})
