import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '../../lib/utils'

export function Dropdown({ children }: { children: React.ReactNode }) {
  return <DropdownMenu.Root>{children}</DropdownMenu.Root>
}

export function DropdownTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DropdownMenu.Trigger className={cn('h-9 px-3 rounded-md border hover:bg-gray-100 cursor-pointer', className)}>
      {children}
    </DropdownMenu.Trigger>
  )
}

export function DropdownContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DropdownMenu.Content sideOffset={6} className={cn('min-w-[12rem] rounded-md border bg-white p-1 shadow-md', className)}>
      {children}
    </DropdownMenu.Content>
  )
}

export function DropdownItem({ children, className, onSelect }: { children: React.ReactNode; className?: string; onSelect?: () => void }) {
  return (
    <DropdownMenu.Item onSelect={onSelect} className={cn('cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100', className)}>
      {children}
    </DropdownMenu.Item>
  )
}

export function DropdownSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
}