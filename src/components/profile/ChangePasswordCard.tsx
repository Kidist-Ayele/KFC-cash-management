'use client';

export function ChangePasswordCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
      <h3 className="text-xl font-bold mb-6">Change Password</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
          />
        </div>
        <button className="px-6 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B] font-medium">
          Update Password
        </button>
      </div>
    </div>
  );
}
