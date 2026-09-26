import { forwardRef, useState, type HTMLAttributes, type ReactEventHandler, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'onError'>, SemanticStyling<'root' | 'image' | 'text'> {
  src?: string
  alt?: string
  /** Fallback icon when there is no image or text. */
  icon?: ReactNode
  /** Initials or short text shown when there is no image. */
  children?: ReactNode
  shape?: 'circle' | 'square'
  /** Pixel size, a CSS size string (e.g. '2rem'), or a named size. */
  size?: number | 's' | 'm' | 'l' | 'xl' | (string & {})
  /** Background colour for text or icon avatars. */
  bgColor?: string
  /** Text colour for text or icon avatars. */
  color?: string
  /** Called when the image fails to load; after an error the fallback (children or icon) is shown. */
  onError?: ReactEventHandler<HTMLImageElement>
}

const NAMED_SIZES: Record<'s' | 'm' | 'l' | 'xl', number> = { s: 24, m: 32, l: 40, xl: 64 }

const PERSON_ICON = <svg viewBox="0 0 24 24" width="55%" height="55%" aria-hidden="true"><circle cx="12" cy="8.5" r="4" fill="currentColor" /><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v1H4z" fill="currentColor" /></svg>

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({ src, alt = '', icon, children, shape = 'circle', size = 'm', bgColor, color, onError, className = '', classNames, style, styles, ...props }, ref) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imageFailed = failedSrc !== null && failedSrc === src
  const namedSize = typeof size === 'number' ? size : NAMED_SIZES[size as keyof typeof NAMED_SIZES]
  const sizeValue = namedSize ?? size
  const numericSize = typeof namedSize === 'number' ? namedSize : undefined
  const handleError: ReactEventHandler<HTMLImageElement> = (event) => { onError?.(event); if (src !== undefined) setFailedSrc(src) }
  return <span
    {...props}
    ref={ref}
    className={`kvzd-design-avatar kvzd-design-avatar--${shape} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{
      width: sizeValue,
      height: sizeValue,
      fontSize: numericSize !== undefined ? numericSize * (children ? 0.4 : 0.55) : undefined,
      background: bgColor,
      color,
      ...styles?.root,
      ...style,
    }}
  >
    {src && !imageFailed
      ? <img className={`kvzd-design-avatar__image ${classNames?.image ?? ''}`.trim()} style={styles?.image} src={src} alt={alt} onError={handleError} />
      : children !== undefined && children !== null
        ? <span className={`kvzd-design-avatar__text ${classNames?.text ?? ''}`.trim()} style={styles?.text}>{children}</span>
        : <span className="kvzd-design-avatar__text" aria-hidden="true">{icon ?? PERSON_ICON}</span>}
  </span>
})
