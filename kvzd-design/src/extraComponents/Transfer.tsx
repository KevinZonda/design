import { forwardRef, useId, useState, type HTMLAttributes, type Key, type ReactNode } from 'react'
import { Button, type SemanticStyling } from '../components/index'
import '../styles/transfer.css'

export type TransferDirection = 'left' | 'right'

export interface TransferItem {
  key: Key
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface TransferProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>, SemanticStyling<'root' | 'panel' | 'header' | 'body' | 'list' | 'item' | 'search' | 'operations' | 'operation'> {
  dataSource: TransferItem[]
  /** Keys of items shown in the right-hand (target) panel; controlled. */
  targetKeys?: Key[]
  defaultTargetKeys?: Key[]
  onChange?: (targetKeys: Key[], direction: TransferDirection, movedKeys: Key[]) => void
  /** Keys of checked items across both panels; controlled. */
  selectedKeys?: Key[]
  defaultSelectedKeys?: Key[]
  onSelectChange?: (selectedKeys: Key[], direction: TransferDirection) => void
  /** Panel titles: [source, target]. */
  titles?: [ReactNode, ReactNode]
  /** Show a search input above each list. */
  showSearch?: boolean
  /** Custom filter used by both search inputs. Defaults to a case-insensitive label match. */
  filterOption?: (input: string, item: TransferItem) => boolean
  /** Disable the whole component. */
  disabled?: boolean
  /** Labels of the two move buttons: [move-to-target, move-to-source]. A direction triangle always renders beside the label. */
  operations?: [ReactNode, ReactNode]
}

const DEFAULT_TITLES: [ReactNode, ReactNode] = ['Source', 'Target']
const DEFAULT_OPERATIONS: [ReactNode, ReactNode] = ['Add', 'Remove']
const NO_KEYS: Key[] = []

function defaultFilterOption(input: string, item: TransferItem): boolean {
  if (typeof item.label !== 'string' && typeof item.label !== 'number') return true
  return String(item.label).toLowerCase().includes(input.trim().toLowerCase())
}

function DirectionIcon({ direction }: { direction: TransferDirection }) {
  return <svg className="kvzd-design-transfer__operation-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" aria-hidden="true" focusable="false">
    {direction === 'right' ? <path fill="currentColor" d="M0 0l8 6-8 6z" /> : <path fill="currentColor" d="M8 0L0 6l8 6z" />}
  </svg>
}

export const Transfer = forwardRef<HTMLDivElement, TransferProps>(function Transfer({
  dataSource, targetKeys, defaultTargetKeys = NO_KEYS, onChange,
  selectedKeys, defaultSelectedKeys = NO_KEYS, onSelectChange,
  titles = DEFAULT_TITLES, showSearch = false, filterOption, disabled = false,
  operations = DEFAULT_OPERATIONS, className = '', classNames, style, styles, ...props
}, ref) {
  const uid = useId().replace(/:/g, '')
  const [innerTarget, setInnerTarget] = useState<Key[]>(defaultTargetKeys)
  const activeTarget = targetKeys ?? innerTarget
  const [innerSelected, setInnerSelected] = useState<Key[]>(defaultSelectedKeys)
  const activeSelected = selectedKeys ?? innerSelected
  const [leftFilter, setLeftFilter] = useState('')
  const [rightFilter, setRightFilter] = useState('')

  const itemByKey = new Map(dataSource.map((item) => [item.key, item]))
  const leftItems = dataSource.filter((item) => !activeTarget.includes(item.key))
  const rightItems = dataSource.filter((item) => activeTarget.includes(item.key))

  const matches = (item: TransferItem, input: string) => input.trim() === '' || (filterOption ?? defaultFilterOption)(input, item)
  const leftSelected = activeSelected.filter((key) => leftItems.some((item) => item.key === key))
  const rightSelected = activeSelected.filter((key) => rightItems.some((item) => item.key === key))
  // Disabled (or removed) items cannot move; skip them rather than blocking the move.
  const movableLeft = leftSelected.filter((key) => !itemByKey.get(key)?.disabled)
  const movableRight = rightSelected.filter((key) => !itemByKey.get(key)?.disabled)

  const visibleItemsEmpty = (direction: TransferDirection, items: TransferItem[]) => {
    const filter = direction === 'left' ? leftFilter : rightFilter
    return filter.trim() !== '' && items.every((item) => !matches(item, filter))
  }

  const updateSelected = (keys: Key[], direction: TransferDirection) => {
    if (selectedKeys === undefined) setInnerSelected(keys)
    onSelectChange?.(keys, direction)
  }
  const toggleItem = (item: TransferItem, direction: TransferDirection) => {
    if (disabled || item.disabled) return
    const next = activeSelected.includes(item.key)
      ? activeSelected.filter((key) => key !== item.key)
      : [...activeSelected, item.key]
    updateSelected(next, direction)
  }

  const move = (direction: TransferDirection) => {
    const movedKeys = direction === 'right' ? movableLeft : movableRight
    if (disabled || movedKeys.length === 0) return
    const next = direction === 'right'
      ? [...activeTarget, ...movedKeys]
      : activeTarget.filter((key) => !movedKeys.includes(key))
    if (targetKeys === undefined) setInnerTarget(next)
    if (selectedKeys === undefined) setInnerSelected(activeSelected.filter((key) => !movedKeys.includes(key)))
    onChange?.(next, direction, movedKeys)
  }

  const renderPanel = (direction: TransferDirection, items: TransferItem[], filter: string, setFilter: (value: string) => void) => {
    const checkedKeys = direction === 'left' ? leftSelected : rightSelected
    const title = direction === 'left' ? titles[0] : titles[1]
    const searchId = `${uid}-${direction}-search`
    return <div className={`kvzd-design-transfer__panel kvzd-design-transfer__panel--${direction} ${classNames?.panel ?? ''}`.trim()} style={styles?.panel}>
      <div className={`kvzd-design-transfer__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
        <span className="kvzd-design-transfer__title">{title}</span>
        <span className="kvzd-design-transfer__count">{items.length} item{items.length === 1 ? '' : 's'}</span>
      </div>
      {showSearch && <div className={`kvzd-design-transfer__search ${classNames?.search ?? ''}`.trim()} style={styles?.search}>
        <label className="govuk-visually-hidden" htmlFor={searchId}>Search {typeof title === 'string' ? title : direction} list</label>
        <input
          id={searchId}
          className="govuk-input kvzd-design-transfer__search-input"
          type="search"
          value={filter}
          disabled={disabled}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>}
      <div className={`kvzd-design-transfer__body ${classNames?.body ?? ''}`.trim()} style={styles?.body}>
        {items.length === 0
          ? <div className="kvzd-design-transfer__empty">No data</div>
          : visibleItemsEmpty(direction, items)
            ? <div className="kvzd-design-transfer__empty">No matches</div>
            : <ul className={`kvzd-design-transfer__list ${classNames?.list ?? ''}`.trim()} style={styles?.list}>
              {items.filter((item) => matches(item, filter)).map((item) => {
                const checked = checkedKeys.includes(item.key)
                const inputId = `${uid}-${direction}-${String(item.key)}`
                return <li key={item.key} className={`kvzd-design-transfer__item ${checked ? 'kvzd-design-transfer__item--checked' : ''} ${item.disabled ? 'kvzd-design-transfer__item--disabled' : ''} ${classNames?.item ?? ''}`.trim()} style={styles?.item}>
                  <div className="govuk-checkboxes govuk-checkboxes--small">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled || item.disabled}
                        onChange={() => toggleItem(item, direction)}
                      />
                      <label className="govuk-label govuk-checkboxes__label kvzd-design-transfer__label" htmlFor={inputId}>
                        <span className="kvzd-design-transfer__item-label">{item.label ?? String(item.key)}</span>
                        {item.description && <span className="kvzd-design-transfer__item-description">{item.description}</span>}
                      </label>
                    </div>
                  </div>
                </li>
              })}
            </ul>}
      </div>
    </div>
  }

  return <div
    {...props}
    ref={ref}
    className={`kvzd-design-transfer ${disabled ? 'kvzd-design-transfer--disabled' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    {renderPanel('left', leftItems, leftFilter, setLeftFilter)}
    <div className={`kvzd-design-transfer__operations ${classNames?.operations ?? ''}`.trim()} style={styles?.operations}>
      <Button
        variant="primary"
        icon={<DirectionIcon direction="right" />}
        iconPosition="right"
        className={`kvzd-design-transfer__operation kvzd-design-transfer__operation--add ${classNames?.operation ?? ''}`.trim()}
        style={styles?.operation}
        disabled={disabled || movableLeft.length === 0}
        aria-label="Add selected items to the target list"
        onClick={() => move('right')}
      >{operations[0]}</Button>
      <Button
        variant="warning"
        icon={<DirectionIcon direction="left" />}
        className={`kvzd-design-transfer__operation kvzd-design-transfer__operation--remove ${classNames?.operation ?? ''}`.trim()}
        style={styles?.operation}
        disabled={disabled || movableRight.length === 0}
        aria-label="Remove selected items from the target list"
        onClick={() => move('left')}
      >{operations[1]}</Button>
    </div>
    {renderPanel('right', rightItems, rightFilter, setRightFilter)}
  </div>
})
