import React from 'react';
import { Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-100/80 backdrop-blur-lg sticky top-0 z-50 border-b border-dark-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
             <div className="bg-brand-primary p-2 rounded-lg">
                <Palette className="text-white" size={24} />
             </div>
            <h1 className="text-2xl font-bold text-dark-800">
              Color Pal
            </h1>
          </div>
          <nav>
            {/* Future navigation links can go here */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;