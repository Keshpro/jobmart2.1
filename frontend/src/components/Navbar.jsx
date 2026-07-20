import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, Search, Bell, Globe, Menu, X, ChevronDown 
} from 'lucide-react';

const GREEN = '#4A7C59';
const INK = '#0F172A';

const navLinks = [
  { name: 'Home', path: '/' },
  { 
    name: 'Jobs', 
    path: '/jobs',
    dropdown: ['Browse Jobs', 'Remote Jobs', 'Internships', 'Graduate Jobs']
  },
  { 
    name: 'Companies', 
    path: '/companies',
    dropdown: ['Top Companies', 'Startup Jobs', 'Company Reviews']
  },
  { 
    name: 'Career Advice', 
    path: '/advice',
    dropdown: ['Resume Builder', 'Interview Tips', 'Salary Guide', 'Career Blog']
  },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Simulate active route for styling
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Simulate user authentication state
  const token = localStorage.getItem('token');

  // Handle scroll effect for sticky nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-300 font-sans ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white border-b border-slate-100'}`}
      style={{ height: '80px' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Left Section: Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setMobileOpen(false)}>
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)`, boxShadow: '0 4px 14px 0 rgba(74, 124, 89, 0.3)' }}
          >
            <Briefcase size={22} strokeWidth={2} />
          </div>
          <span className="text-2xl font-bold tracking-tight font-serif" style={{ color: INK }}>
            Job<span style={{ color: GREEN }}>Mart</span>
          </span>
        </Link>

        {/* Center Navigation (Desktop) */}
        <div className="hidden lg:flex items-center h-full gap-1 xl:gap-4">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative h-full flex items-center group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={link.path}
                className={`px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-300 flex items-center gap-1
                  ${isActive(link.path) 
                    ? 'bg-[#4A7C59]/10 text-[#4A7C59]' 
                    : 'text-slate-600 hover:text-[#4A7C59]'
                  }`}
              >
                {link.name}
                {link.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180 text-[#4A7C59]' : 'text-slate-400'}`} />}
                
                {/* Hover Underline Animation (Only for non-active links) */}
                {!isActive(link.path) && (
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#4A7C59] rounded-full transition-all duration-300 group-hover:w-6 opacity-0 group-hover:opacity-100"></span>
                )}
              </Link>

              {/* Dropdown Menu */}
              {link.dropdown && (
                <div 
                  className={`absolute top-[70px] left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-xl rounded-2xl w-56 py-3 transition-all duration-300 origin-top
                    ${activeDropdown === link.name ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                >
                  {link.dropdown.map((item) => (
                    <Link 
                      key={item} 
                      to={`${link.path}/${item.toLowerCase().replace(' ', '-')}`}
                      className="block px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-[#4A7C59] hover:bg-[#4A7C59]/5 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section (Desktop) */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          
          {/* Search Bar / Icon */}
          <div className="flex items-center">
            <div className={`flex items-center transition-all duration-300 overflow-hidden ${searchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-100 text-sm text-slate-700 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-[#4A7C59]/50 focus:ring-2 focus:ring-[#4A7C59]/20"
                autoFocus={searchOpen}
              />
            </div>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-[#4A7C59] hover:bg-[#4A7C59]/10 rounded-full transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Notifications */}
          <button className="p-2 text-slate-500 hover:text-[#4A7C59] hover:bg-[#4A7C59]/10 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Language Selector */}
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#4A7C59] text-sm font-medium transition-colors mr-2">
            <Globe size={18} />
            EN <ChevronDown size={14} />
          </button>

          <div className="w-[1px] h-6 bg-slate-200"></div>

          {/* Auth Buttons */}
          {token ? (
            <Link to="/dashboard">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0F172A] font-bold hover:border-[#4A7C59] transition-colors cursor-pointer">
                US
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border-2 hover:bg-[#4A7C59]/5 transition-colors"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: GREEN, boxShadow: '0 8px 20px -8px rgba(74,124,89,0.6)' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar / Drawer */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xl font-bold text-slate-900">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link 
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl font-medium ${isActive(link.path) ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-slate-600 hover:bg-slate-50'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
                {link.dropdown && (
                  <div className="pl-6 pr-4 pb-2 border-l-2 border-slate-100 ml-6 mt-1 flex flex-col gap-1">
                    {link.dropdown.map(item => (
                      <Link 
                        key={item}
                        to={`${link.path}/${item.toLowerCase().replace(' ', '-')}`}
                        className="py-2 text-sm text-slate-500 hover:text-[#4A7C59]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
            {!token ? (
              <>
                <Link 
                  to="/login"
                  className="w-full py-3 text-center rounded-xl font-semibold bg-white border-2"
                  style={{ color: GREEN, borderColor: GREEN }}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="w-full py-3 text-center rounded-xl font-semibold text-white"
                  style={{ background: GREEN }}
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <button 
                className="w-full py-3 text-center rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}