import React from 'react';
import { Plane } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-lightblue flex flex-col font-sans">
            <header className="bg-navy text-white p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plane className="h-6 w-6 text-sage" />
                        <h1 className="text-2xl font-heading">Safr</h1>
                    </div>
                    <nav>
                        {/* Navigation items will go here */}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto p-4">
                {children}
            </main>
        </div>
    );
};
