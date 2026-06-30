import { PaymentChannel } from '@prisma/client';

export interface PaymentChannelInfo {
  value: PaymentChannel;
  label: string;
  description: string;
  icon: string;
}

export const PAYMENT_CHANNELS: PaymentChannelInfo[] = [
  {
    value: 'TELEBIRR',
    label: 'Telebirr',
    description: 'Mobile money payment',
    icon: '📱',
  },
  {
    value: 'KUKU_CBE',
    label: 'Kuku CBE',
    description: 'Business bank account',
    icon: '🏦',
  },
  {
    value: 'SAMUEL_CBE',
    label: 'Samuel CBE',
    description: 'Personal bank account',
    icon: '💳',
  },
  {
    value: 'CASH',
    label: 'Cash',
    description: 'Physical cash payment',
    icon: '💵',
  },
];

export const VAT_RATE = 0.15; // 15% VAT
