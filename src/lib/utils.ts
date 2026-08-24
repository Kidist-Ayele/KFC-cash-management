import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `ETB ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Prices are VAT inclusive (15% included)
export function calculateVATInclusive(total: number, rate: number = 0.15): { subtotal: number; vat: number; total: number } {
  const vat = Math.round((total * rate / (1 + rate)) * 100) / 100;
  const subtotal = Math.round((total - vat) * 100) / 100;
  return { subtotal, vat, total };
}

export function calculateVAT(amount: number, rate: number = 0.15): number {
  return Math.round((amount * rate / (1 + rate)) * 100) / 100;
}

export function calculateTotal(subtotal: number, vatRate: number = 0.15): number {
  return subtotal;
}

export function getCurrentShift(): 'MORNING' | 'AFTERNOON' | 'EVENING' {
  const hour = new Date().getHours();
  if (hour < 12) return 'MORNING';
  if (hour < 18) return 'AFTERNOON';
  return 'EVENING';
}

export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER#${timestamp}${random}`;
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
