import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
}

export function Alert({ className, variant = 'info', icon, children, ...props }: AlertProps) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
  };

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4', variants[variant], className)} {...props}>
      {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
