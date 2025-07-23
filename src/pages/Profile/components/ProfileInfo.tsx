import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Camera, Save, X, CheckCircle } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  country: string;
  profileImage?: string;
}

interface ProfileInfoProps {
  initialProfile?: UserProfile;
  onSave?: (profile: UserProfile) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  initialProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-06-15',
    gender: 'male',
    city: 'Mumbai',
    country: 'India'
  },
  onSave 
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onSave?.(editedProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const profileCompletion = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'city', 'country'];
    const filledFields = fields.filter(field => profile[field as keyof UserProfile]?.toString().trim());
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const completionPercentage = profileCompletion();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
          <p className="text-gray-600 mt-1">Manage your personal details and preferences</p>
        </div>
        
        {saveSuccess && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        )}
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-sm font-medium text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Complete your profile to get personalized recommendations and better service
        </p>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
              Change profile picture
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit3 className="w-4 h-4" />
              <span className="font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.firstName}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.lastName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.phone}</span>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedProfile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              {isEditing ? (
                <select
                  value={editedProfile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 capitalize">{profile.gender || 'Not specified'}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.city}</span>
                </div>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              {isEditing ? (
                <select
                  value={editedProfile.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  {/* Add more countries as needed */}
                </select>
              ) : (
                <div className="flex items-center space-x-3 py-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.country}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Member Since</h3>
          <p className="text-2xl font-bold text-blue-700">2 Years</p>
          <p className="text-sm text-blue-600">Joined March 2023</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-green-700">24</p>
          <p className="text-sm text-green-600">₹45,680 spent</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Loyalty Points</h3>
          <p className="text-2xl font-bold text-purple-700">1,250</p>
          <p className="text-sm text-purple-600">₹125 value</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;