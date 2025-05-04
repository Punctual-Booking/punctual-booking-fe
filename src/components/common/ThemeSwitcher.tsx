import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'

interface ThemeSwitcherProps {
  className?: string
}

/**
 * ThemeSwitcher component - allows users to toggle between light and dark mode
 * Memoized to prevent unnecessary rerenders
 */
export const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme()

  // Memoize the toggle handler
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn('gap-2', className)}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
})
