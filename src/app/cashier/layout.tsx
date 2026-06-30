import { CashierSidebar } from '@/components/shared/CashierSidebar';

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <CashierSidebar />
      {children}
    </div>
  );
}
