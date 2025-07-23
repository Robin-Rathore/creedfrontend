import React from "react";
import {
  User,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Eye,
  Settings,
  LogOut,
} from "lucide-react";

const sections = [
  {
    key: "profile",
    label: "Profile Info",
    icon: User,
    description: "Personal details & preferences",
  },
  {
    key: "wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Saved items",
  },
  {
    key: "addresses",
    label: "Address Book",
    icon: MapPin,
    description: "Shipping & billing addresses",
  },
  // {
  //   key: "payments",
  //   label: "Payment Methods",
  //   icon: CreditCard,
  //   description: "Saved cards & wallets",
  // },
  // {
  //   key: "notifications",
  //   label: "Notifications",
  //   icon: Bell,
  //   description: "Alerts & preferences",
  // },
  // {
  //   key: "recently-viewed",
  //   label: "Recently Viewed",
  //   icon: Eye,
  //   description: "Your browsing history",
  // },
  // {
  //   key: "settings",
  //   label: "Account Settings",
  //   icon: Settings,
  //   description: "Privacy & security",
  // },
];

interface SidebarNavProps {
  current: string;
  onChange: (next: string) => void;
  onLogout: () => void;
  userStats?: {
    wishlistCount?: number;
    addressCount?: number;
    paymentMethodCount?: number;
  };
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  current,
  onChange,
  onLogout,
  userStats = {},
}) => (
  <nav className="md:min-w-[280px] bg-white border-r border-gray-200 p-6 flex flex-col h-full">
    {/* Profile Header */}
    <div className="mb-8 pb-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">My Account</h3>
          <p className="text-sm text-gray-500">Manage your profile</p>
        </div>
      </div>
    </div>

    {/* Navigation Sections */}
    <ul className="flex-1 space-y-2">
      {sections.map((section) => {
        const Icon = section.icon;
        let badge = null;

        // Add badges for sections with counts
        if (section.key === "wishlist" && userStats.wishlistCount) {
          badge = userStats.wishlistCount;
        } else if (section.key === "addresses" && userStats.addressCount) {
          badge = userStats.addressCount;
        } else if (section.key === "payments" && userStats.paymentMethodCount) {
          badge = userStats.paymentMethodCount;
        }

        const isActive = current === section.key;

        return (
          <li key={section.key}>
            <button
              onClick={() => onChange(section.key)}
              className={`w-full text-left rounded-lg px-4 py-3 transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <div>
                    <div
                      className={`font-medium text-sm ${
                        isActive ? "text-blue-900" : ""
                      }`}
                    >
                      {section.label}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {section.description}
                    </div>
                  </div>
                </div>
                {badge && (
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>

    {/* Logout Button */}
    <div className="mt-6 pt-6 border-t border-gray-100">
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </nav>
);

export default SidebarNav;
