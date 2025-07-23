import React, { ReactNode } from 'react';

const AccountLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col md:flex-row min-h-[80vh] bg-gray-50">
    {children}
  </div>
);

export default AccountLayout;
