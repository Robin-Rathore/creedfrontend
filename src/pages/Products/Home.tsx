import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button"

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh flex-space gap-4">
      <h1>Home Page</h1>
      <Button>Click me</Button>
    </div>
  );
};
