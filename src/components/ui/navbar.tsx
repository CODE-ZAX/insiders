import React from "react";
import AuthAwareButtons from "../AuthAwareButtons";

const NavbarMain = () => {
  const productName = process.env.NEXT_PUBLIC_PRODUCTNAME;
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1>{productName}</h1>
        <div className="gap-4 flex items-center">
          <AuthAwareButtons />
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
