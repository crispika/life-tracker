import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  if (!date) return ''

  // 确保date是Date对象
  const dateObj = date instanceof Date ? date : new Date(date)

  // 格式化日期为YYYY-MM-DD
  return dateObj.toISOString().split('T')[0]
}
