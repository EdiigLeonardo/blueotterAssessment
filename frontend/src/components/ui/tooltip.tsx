import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/utils'

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
}

export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <TooltipPrimitive.Content sideOffset={6} className={cn('rounded-md bg-gray-900 px-2 py-1 text-xs text-white', className)}>
      {children}
    </TooltipPrimitive.Content>
  )
}