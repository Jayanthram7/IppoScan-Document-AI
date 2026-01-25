import React from 'react';

interface FooterProps {
    className?: string;
}

const Footer = ({ className = "bg-[#FAFAFA]" }: FooterProps) => {
    return (
        <footer className={`mt-20 border-t border-gray-200 pt-16 pb-8 ${className}`}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 px-8">
                {/* Left Column - Brand */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md border border-gray-100">
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
                                <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">IppoScan</span>
                    </div>

                    <p className="text-gray-500 max-w-xs leading-relaxed">
                        The intelligent platform for modern logistics, inventory, and invoice management.
                    </p>
                    <div className="flex gap-4 mt-2">
                        {/* Social Icons Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-500 transition-colors cursor-pointer">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-500 transition-colors cursor-pointer">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Right Column - Team & Links */}
                <div className="flex flex-wrap gap-12 md:gap-24">
                    {/* Team Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-emerald-500 uppercase tracking-wider text-sm">Team</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                            <ul className="flex flex-col gap-3">
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Jayanthram K</li>
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Agilan ED</li>
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Gokul T</li>
                            </ul>
                            <ul className="flex flex-col gap-3">
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Harsha Ram A</li>
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Sakthivel S</li>
                                <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Kishor G</li>
                            </ul>
                        </div>
                    </div>

                    {/* Product Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-emerald-500 uppercase tracking-wider text-sm">Product</h3>
                        <ul className="flex flex-col gap-3">
                            <li><a href="/features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a></li>
                            <li><a href="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">Dashboard</a></li>
                            <li><a href="https://github.com/StartVisionPro/Docusense-AI" className="text-gray-600 hover:text-emerald-600 transition-colors">Architecture</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
