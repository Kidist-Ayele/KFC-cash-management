'use client';

interface ProfileCardProps {
  profile: {
    name: string;
    email: string;
    role: string;
    phone: string;
    joinDate: string;
  };
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onProfileChange: (field: string, value: string) => void;
}

export function ProfileCard({
  profile,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onProfileChange,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E4002B] to-[#C4002B] p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#E4002B] text-4xl font-bold shadow-lg">
            {profile.name.charAt(0)}
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
            <p className="text-red-100">{profile.role}</p>
            <p className="text-red-100 text-sm mt-2">Member since {profile.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Personal Information</h3>
          {!isEditing ? (
            <button 
              onClick={onEdit}
              className="px-4 py-2 text-[#E4002B] border border-[#E4002B] rounded-lg hover:bg-red-50 font-medium"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={onSave}
                className="px-4 py-2 bg-[#E4002B] text-white rounded-lg hover:bg-[#C4002B]"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onProfileChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => onProfileChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4002B]"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <p className="text-gray-900 py-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {profile.role}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
