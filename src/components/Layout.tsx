import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Camera, 
  MapPin,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Flower2,
  Cookie,
  Activity,
  LineChart,
  Heart,
  Plane,
  PawPrint,
  BookOpenCheck,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis', icon: Camera, label: 'Pet Analysis' },
    { path: '/travel', icon: Plane, label: 'Travel Planner' },
    { path: '/services', icon: MapPin, label: 'Pet Services' },
    { path: '/adoption', icon: Home, label: 'Adoption Centers' },
    { path: '/telehealth', icon: MessageSquare, label: 'Health Assessment' },
    { path: '/first-aid', icon: AlertTriangle, label: 'First Aid' },
    { path: '/training', icon: BookOpen, label: 'Training' },
    { path: '/diary', icon: BookOpenCheck, label: 'Pet Diary' },
    { path: '/plant-checker', icon: Flower2, label: 'Plant Checker' },
    { path: '/treat-maker', icon: Cookie, label: 'Treat Maker' },
    { path: '/fitness', icon: Activity, label: 'Fitness' },
    { path: '/growth', icon: LineChart, label: 'Growth Tracker' },
    { path: '/memorial', icon: Heart, label: 'Memorial' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-md lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Pet Care Hub</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex h-full flex-col">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pet Care Hub</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}