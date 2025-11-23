import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export function Tabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {
  return <TabsPrimitive.Root defaultValue={defaultValue}>{children}</TabsPrimitive.Root>
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <TabsPrimitive.List className={cn('inline-flex gap-2 rounded-md border bg-white p-1', className)}>{children}</TabsPrimitive.List>
}

export function TabsTrigger({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <TabsPrimitive.Trigger value={value} className="rounded-md px-3 py-1.5 text-sm cursor-pointer data-[state=active]:bg-gray-100">
      {children}
    </TabsPrimitive.Trigger>
  )
}

export function TabsContent({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <TabsPrimitive.Content value={value} className="rounded-md border bg-white p-4">
      {children}
    </TabsPrimitive.Content>
  )
}