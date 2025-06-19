import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { Calendar, Users, Settings, BookOpen, User, Layers } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, switchRole } = useUser();
  const location = useLocation();

  const studentNavItems = [
    { path: '/', label: 'Generate Timetable', icon: Calendar },
    { path: '/browse-subjects', label: 'Browse Subjects', icon: BookOpen },
    { path: '/browse-sections', label: 'Browse Sections', icon: Layers },
    { path: '/my-timetable', label: 'My Timetable', icon: Calendar },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: Settings },
    { path: '/admin/subjects', label: 'Academic', icon: BookOpen },
    { path: '/admin/people', label: 'People', icon: Users },
    { path: '/admin/requests', label: 'Requests', icon: Calendar },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                Smart Timetable
              </Link>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User info and role switcher */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{user?.name}</span>
                <Badge variant={user?.role === 'admin' ? 'destructive' : 'default'}>
                  {user?.role}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchRole(user?.role === 'admin' ? 'student' : 'admin')}
              >
                Switch to {user?.role === 'admin' ? 'Student' : 'Admin'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
