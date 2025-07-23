// import React, { useState, useEffect } from 'react';

// interface ProfileProps {}

// export const Profile: React.FC<ProfileProps> = () => {
//   return (
//     <div>
//       <h1>Profile Page</h1>
//     </div>
//   );
// };


import React, { useState } from 'react';
import AccountLayout from './components/AccountLayout';
import SidebarNav from './components/SidebarNav';
import  ProfileInfo  from './components/ProfileInfo';
import Wishlist from './components/Wishlist';
import AddressBook from './components/AddressBook';
// import AvatarUpload from './components/AvatarUpload';

export const Profile: React.FC = () => {
  const [section, setSection] = useState('profile');

  const handleLogout = () => {
    alert('Logging out...');
    // Perform logout logic
  };

  return (
    <AccountLayout>
      <SidebarNav current={section} onChange={setSection} onLogout={handleLogout} />
      <section className="flex-1 min-w-0 p-6">
        {section === 'profile' && <ProfileInfo />}
        {section === 'wishlist' && <Wishlist />}
        {section === 'addresses' && <AddressBook />}
      </section>
    </AccountLayout>
  );
};
