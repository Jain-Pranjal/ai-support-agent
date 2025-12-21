import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface LastUsedBadgeProps {
    className?: string
}

export const LastUsedBadge = ({ className }: LastUsedBadgeProps) => {
    return (
        <Badge
            variant="secondary"
            className={cn(
                'bg-primary text-primary-foreground border-primary/20 absolute -top-2 -right-2 px-1.5 py-0.5 text-xs shadow-sm select-none',
                className
            )}
        >
            Last used
        </Badge>
    )
}
