'use client';

import { useState } from 'react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ChangePasswordCard } from '@/components/profile/ChangePasswordCard';
import { ActivitySummaryCard } from '@/components/profile/ActivitySummaryCard';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@kfc.com',
    role: 'Super Admin',
    phone: '+251 90 000 0000',
    joinDate: 'Jan 1, 2024',
  });

  const [isEditing, setIsEditing] = useState(false);

  const activityStats = [
    { value: '3', label: 'Branches Managed' },
    { value: '24', label: 'Total Users' },
    { value: '90', label: 'Days Active' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your account information and preferences</p>
          </div>

          <ProfileCard
            profile={profile}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
            onProfileChange={handleProfileChange}
          />

          <ChangePasswordCard />

          <ActivitySummaryCard stats={activityStats} />
        </div>
      </div>
    </>
  );
}
