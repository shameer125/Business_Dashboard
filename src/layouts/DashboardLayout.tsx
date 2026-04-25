import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  X,
  Menu,
  ChevronDown,
  Info
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useTabStore, Tab } from '@/store/useTabStore';
import { useAuth } from '@/features/auth/AuthContext';
import { useKeyboardShortcut } from '@/hooks';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const SidebarItem = ({ 
  item, 
  collapsed, 
  active, 
  onNavigate 
}: { 
  item: any; 
  collapsed: boolean; 
  active: boolean; 
  onNavigate: (item: any) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren && !collapsed) {
    return (
      <div className="px-3 py-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
          <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-9 mt-1 space-y-1"
            >
              {item.children.map((child: any) => (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => onNavigate(child)}
                  className={cn(
                    "block py-2 px-3 rounded-lg text-xs font-medium transition-all",
                    active && child.path === window.location.pathname ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="px-3 py-1">
      <Link
        to={item.path}
        onClick={() => onNavigate(item)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium group",
          active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        <item.icon size={20} className={cn(active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    </div>
  );
};

const TabBar = () => {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-background/50 
    overflow-x-auto tabs-scrollbar scrollbar-hide">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            navigate(tab.path);
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-x border-t transition-all cursor-pointer whitespace-nowrap text-sm font-medium",
            activeTabId === tab.id 
              ? "bg-background border-border border-b-background -mb-[1px] text-primary" 
              : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
          )}
        >
          {tab.title}
          {tab.closable !== false && (
            <X 
              size={14} 
              className="hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CommandPalette = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="flex items-center p-4 border-b border-border">
          <Search size={20} className="text-muted-foreground" />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none px-3 text-foreground placeholder:text-muted-foreground" 
            placeholder="Search commands or pages... (Type 'help' for shortcuts)"
          />
          <kbd className="px-2 py-1 rounded bg-muted text-[10px] text-muted-foreground border border-border uppercase">Esc</kbd>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Navigation</div>
          <div className="space-y-1">
            <div className="p-3 hover:bg-muted rounded-xl flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">Go to Dashboard</span>
              </div>
              <span className="text-xs text-muted-foreground hidden group-hover:block">G D</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
    </div>
  );
};

// --- Main Layout ---

const DashboardLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar, theme, setTheme, toggleCommandPalette, cvMode, toggleCVMode } = useUIStore();
  const { addTab } = useTabStore();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard Shortcuts
  useKeyboardShortcut('k', toggleCommandPalette);
  useKeyboardShortcut('d', () => setTheme(theme === 'dark' ? 'light' : 'dark'));

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', id: 'dashboard' },
    { 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics', 
      id: 'analytics',
      children: [
        { label: 'Overview', path: '/analytics' },
        { label: 'Real-time', path: '/analytics/live' }
      ]
    },
    { label: 'User Management', icon: Users, path: '/users', id: 'users', role: 'admin' },
    { label: 'Settings', icon: Settings, path: '/settings', id: 'settings' },
  ];

  const handleNavigate = (item: any) => {
    addTab({ id: item.id || item.label, title: item.label, path: item.path });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className={cn(
          "relative flex flex-col border-r border-border bg-card z-30 transition-all",
          !sidebarOpen && "items-center"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">D</div>
            {sidebarOpen && <span className="text-lg font-heading font-bold tracking-tight">DashHub</span>}
          </div>
        </div>

        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            if (item.role && user?.role !== item.role) return null;
            return (
              <SidebarItem 
                key={item.label} 
                item={item} 
                collapsed={!sidebarOpen} 
                active={location.pathname.startsWith(item.path)}
                onNavigate={handleNavigate}
              />
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <button 
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
          >
            <ChevronLeft size={20} className={cn("transition-transform duration-300", !sidebarOpen && "rotate-180")} />
            {sidebarOpen && <span className="ml-2 text-sm">Collapse sidebar</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-muted rounded-lg" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Home</span>
              <span>/</span>
              <span className="text-foreground font-medium capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/30 text-muted-foreground text-xs hover:bg-muted transition-all"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
            </button>

            <button className="p-2 hover:bg-muted rounded-xl relative text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-px h-8 bg-border mx-2" />

            <div className="flex items-center gap-3 pl-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role}</p>
              </div>
              <div className="group relative">
                <img src={user?.avatar} className="w-9 h-9 rounded-xl bg-muted border border-border cursor-pointer" alt="Avatar" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-1 z-50">
                  <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-all">Profile Settings</button>
                  <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-all text-destructive" onClick={logout}>Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10 relative">
          <Outlet />
          
          {/* CV Mode Footer */}
          <footer className="mt-12 py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 DashHub Production-Ready System. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleCVMode}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
                  cvMode ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border"
                )}
              >
                <Info size={14} />
                <span>CV Mode: {cvMode ? 'On' : 'Off'}</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
};

export default DashboardLayout;
