// @vitest-environment jsdom
import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import { Modal } from '../src/extraComponents'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => cleanup())

test('afterOpenChange receives true after opening and false after closing', () => {
  const afterOpenChange = vi.fn()
  function Harness() {
    const [open, setOpen] = useState(false)
    return <><button onClick={() => setOpen(true)}>Trigger</button><Modal open={open} title="T" onClose={() => setOpen(false)} afterOpenChange={afterOpenChange}><p>Body</p></Modal></>
  }
  render(<Harness />)
  expect(afterOpenChange).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Trigger' }))
  expect(afterOpenChange).toHaveBeenLastCalledWith(true)
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(afterOpenChange).toHaveBeenLastCalledWith(false)
  expect(afterOpenChange).toHaveBeenCalledTimes(2)
})

test('afterClose fires once per close, including with destroyOnClose', () => {
  const afterClose = vi.fn()
  function Harness() {
    const [open, setOpen] = useState(true)
    return <><button onClick={() => setOpen(true)}>Trigger</button><Modal open={open} title="T" onClose={() => setOpen(false)} afterClose={afterClose} destroyOnClose><p>Body</p></Modal></>
  }
  render(<Harness />)
  expect(afterClose).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(afterClose).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole('button', { name: 'Trigger' }))
  expect(afterClose).toHaveBeenCalledOnce()
})
