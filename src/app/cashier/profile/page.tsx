'use client';

import { useState } from 'react';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ChangePasswordCard } from '@/components/profile/ChangePasswordCard';
import { ActivitySummaryCard } from '@/components/profile/ActivitySummaryCard';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Lishan B..',
    email: 'lishan@kfc.com',
    role: 'Cashier',
    phone: '+251 91 012 1070',
    joinDate: 'Jan 15, 2024',
  });

  const [isEditing, setIsEditing] = useState(false);

  const activityStats = [
    { value: '127', label: 'Orders Processed' },
    { value: 'ETB 45,890', label: 'Total Sales' },
    { value: '24', label: 'Days Active' },
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
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
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
