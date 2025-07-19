import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button"

interface ProductsProps {}

export const Products: React.FC<ProductsProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh flex-space gap-4">
      <h1>Products Page</h1>
      <Button>Click me</Button>
    </div>
  );
};
