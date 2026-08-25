'use client';

import { useState } from 'react';

interface SendReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportText: string;
  summary: any;
}

export function SendReportModal({
  isOpen,
  onClose,
  reportText,
  summary,
}: SendReportModalProps) {
  const [method, setMethod] = useState<'telegram' | 'whatsapp' | 'email'>('telegram');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTelegram = async () => {
    setIsSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/reports/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: reportText,
          chatId: telegramChatId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Report sent to Telegram successfully!' });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to send to Telegram. Make sure your bot is configured in .env',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error sending to Telegram' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    const phone = ownerPhone.replace(/[^0-9]/g, '');
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('KFC Daily Sales & Closing Report');
    const body = encodeURIComponent(reportText);
    const mailto = ownerEmail
      ? `mailto:${ownerEmail}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Send Daily Report to Owner</h2>
            <p className="text-xs text-gray-500">
              Transmit daily revenue, payment methods, expenses, and foods sold
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => {
                setMethod('telegram');
                setStatusMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === 'telegram' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Telegram
            </button>
            <button
              onClick={() => {
                setMethod('whatsapp');
                setStatusMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === 'whatsapp' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                setMethod('email');
                setStatusMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                method === 'email' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email (Mailto)
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Method specifics */}
          {method === 'telegram' && (
            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs">
              <p className="text-blue-900 font-semibold">
                Send directly via Telegram Bot to the owner’s chat or management group:
              </p>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Telegram Chat ID / Channel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789 or @kfc_reports (or set TELEGRAM_CHAT_ID in .env)"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                />
              </div>
              <button
                onClick={handleSendTelegram}
                disabled={isSending}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm disabled:opacity-50"
              >
                {isSending ? 'Sending to Telegram...' : 'Send Telegram Message'}
              </button>
            </div>
          )}

          {method === 'whatsapp' && (
            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-xs">
              <p className="text-emerald-900 font-semibold">
                Open WhatsApp with pre-filled formatted message for the owner:
              </p>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Owner’s Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 251911223344"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                />
              </div>
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Open in WhatsApp
              </button>
            </div>
          )}

          {method === 'email' && (
            <div className="space-y-3 bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-xs">
              <p className="text-purple-900 font-semibold">
                Send report via email client (Gmail, Outlook, etc.):
              </p>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Owner’s Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. owner@kfc.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                />
              </div>
              <button
                onClick={handleSendEmail}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Open Email Client
              </button>
            </div>
          )}

          {/* Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Report Preview
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-[#E4002B] hover:underline font-semibold"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Text'}
              </button>
            </div>
            <pre className="p-3.5 bg-gray-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-56">
              {reportText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
