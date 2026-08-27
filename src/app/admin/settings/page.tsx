'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Kuku Fried Chicken (KFC)',
    branchName: 'Main Branch — Ayat, Addis Ababa',
    ownerName: 'Samuel Mulat',
    managerName: 'Lishan Bekele',
    vatRate: 15,
    currency: 'ETB',
    timezone: 'Africa/Addis_Ababa',
    telegramBot: '@kuku_kfc_report_bot',
    telegramChatId: '1794854523',
    telebirrActive: true,
    kukuCbeActive: true,
    samuelCbeActive: true,
    cashActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  // 1. Fetch persistent settings from PostgreSQL
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            companyName: data.companyName ?? 'Kuku Fried Chicken (KFC)',
            branchName: data.branchName ?? 'Main Branch — Ayat, Addis Ababa',
            ownerName: data.ownerName ?? 'Samuel Mulat',
            managerName: data.managerName ?? 'Lishan Bekele',
            vatRate: data.vatRate ?? 15,
            currency: data.currency ?? 'ETB',
            timezone: data.timezone ?? 'Africa/Addis_Ababa',
            telegramBot: data.telegramBot ?? '@kuku_kfc_report_bot',
            telegramChatId: data.telegramChatId ?? '1794854523',
            telebirrActive: data.telebirrActive ?? true,
            kukuCbeActive: data.kukuCbeActive ?? true,
            samuelCbeActive: data.samuelCbeActive ?? true,
            cashActive: data.cashActive ?? true,
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // 2. Save settings to PostgreSQL database
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save settings');
      }

      const updated = await res.json();
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Test Telegram Ping
  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/reports/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🍗 *KFC Settings Ping*\n\n✅ System settings verified and connected for Owner: *${settings.ownerName}* (Manager: *${settings.managerName}*).`,
          botToken: undefined,
          chatId: settings.telegramChatId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus('Ping delivered to Telegram!');
        setTimeout(() => setTestStatus(null), 3500);
      } else {
        alert(data.error || 'Failed to ping Telegram bot');
      }
    } catch (err: any) {
      alert(err.message || 'Error testing Telegram');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header role="admin" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Top Header & Save Button Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Restaurant System Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Live configurations for restaurant facility, tax compliance, payment channels & Telegram bot
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 animate-fade-in flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved to Database!
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving || isLoading}
              className="px-5 py-2.5 bg-[#E4002B] hover:bg-[#C4002B] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-gray-400 text-xs">Loading persistent settings...</div>
        ) : (
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Facility & Management Info */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Facility & Leadership
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Operating Location (Main Branch)
                </label>
                <input
                  type="text"
                  value={settings.branchName}
                  onChange={(e) => setSettings({ ...settings, branchName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Business Owner
                  </label>
                  <input
                    type="text"
                    value={settings.ownerName}
                    onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    General Manager
                  </label>
                  <input
                    type="text"
                    value={settings.managerName}
                    onChange={(e) => setSettings({ ...settings, managerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Tax & Financial Calculations */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Tax & Currency Policy
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  VAT Rate (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.vatRate}
                    onChange={(e) =>
                      setSettings({ ...settings, vatRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-xs font-semibold text-gray-500">
                    Inclusive (List prices already include VAT)
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-bold">Active Tax Formula:</p>
                <p className="font-mono text-[11px] text-blue-800">
                  VAT Amount = Total Bill × ({settings.vatRate} / {100 + settings.vatRate})
                </p>
                <p className="text-[11px] text-blue-700/80">
                  Customers pay the listed menu price. Changing this applies to all future orders.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="ETB">Ethiopian Birr (ETB)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="Africa/Addis_Ababa">Africa/Addis Ababa (UTC+3)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Channels Active Toggle */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Payment Channels Status
              </h3>

              {[
                {
                  key: 'telebirrActive',
                  label: 'Telebirr Merchant',
                  desc: 'QR Code & USSD Direct Pay',
                  active: settings.telebirrActive,
                  color: 'text-blue-600',
                },
                {
                  key: 'kukuCbeActive',
                  label: 'KUKU CBE Account',
                  desc: 'Commercial Bank of Ethiopia (Restaurant Business)',
                  active: settings.kukuCbeActive,
                  color: 'text-purple-600',
                },
                {
                  key: 'samuelCbeActive',
                  label: 'Samuel CBE Account',
                  desc: 'Commercial Bank of Ethiopia (Owner Account)',
                  active: settings.samuelCbeActive,
                  color: 'text-fuchsia-600',
                },
                {
                  key: 'cashActive',
                  label: 'Cash Drawer',
                  desc: 'Physical Cash Register & Float Settlement',
                  active: settings.cashActive,
                  color: 'text-emerald-600',
                },
              ].map((channel) => (
                <div
                  key={channel.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className={`text-xs font-bold ${channel.color}`}>{channel.label}</p>
                    <p className="text-[11px] text-gray-400">{channel.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.active}
                      onChange={(e) =>
                        setSettings({ ...settings, [channel.key]: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E4002B]"></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Telegram Daily Closing Bot Settings */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Telegram Closing Bot</h3>
                  <p className="text-xs text-gray-500">Nightly financial report destination</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Connected
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Telegram Bot Username
                </label>
                <input
                  type="text"
                  value={settings.telegramBot}
                  onChange={(e) => setSettings({ ...settings, telegramBot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Owner Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={settings.telegramChatId}
                  onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={isTestingTelegram}
                  className="px-4 py-2 bg-[#229ED9] hover:bg-[#1E88E5] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isTestingTelegram ? 'Sending Ping...' : 'Send Test Ping to Telegram'}
                </button>

                {testStatus && (
                  <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                    ✓ {testStatus}
                  </span>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
