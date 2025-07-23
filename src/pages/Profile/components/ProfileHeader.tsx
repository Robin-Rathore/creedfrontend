//@ts-nocheck

import React from "react";

import type { ReactElement } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/queries/hooks/user";

export const ProfileHeader: React.FC = (): ReactElement => {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatarMutation.mutateAsync(file);
      } catch (error) {
        console.error("Upload avatar error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[var(--lightest)]">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-[var(--lightest)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--medium)]/5 to-[var(--dark)]/5"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[var(--medium)] to-[var(--dark)] p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {profile?.avatar?.url ? (
                    <img
                      src={profile.avatar.url || "/placeholder.svg"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              </div>

              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploadAvatarMutation.isPending}
                />
              </label>

              {uploadAvatarMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile?.firstName} {profile?.lastName}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-[var(--medium)] text-white">
                          {profile?.role === "admin"
                            ? "Administrator"
                            : "Customer"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <Mail className="w-5 h-5 text-[var(--medium)]" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                    </div>

                    {profile?.phone && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <Phone className="w-5 h-5 text-[var(--medium)]" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    )}

                    {profile?.dateOfBirth && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-[var(--medium)]" />
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[var(--medium)]" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">
                          {new Date(
                            profile?.createdAt || ""
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Edit Profile
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={updateProfileMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                        className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
