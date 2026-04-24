import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  Smartphone,
  Globe,
  Palette
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { theme, setTheme, cvMode } = useUIStore();
  const [showApiKey, setShowApiKey] = React.useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and application configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Notifications', icon: Bell },
            { label: 'Security', icon: Shield },
            { label: 'Appearance', icon: Palette },
            { label: 'API Keys', icon: Key },
            { label: 'Integrations', icon: Globe },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                item.active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded">Profile Form</div>}
            <h3 className="text-lg font-heading font-bold mb-6">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                  <input defaultValue="Alex" className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                  <input defaultValue="Rivera" className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Bio</label>
                <textarea 
                  rows={3} 
                  defaultValue="Senior Product Designer based in San Francisco. I love building clean and functional interfaces."
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            <h3 className="text-lg font-heading font-bold mb-6">Appearance</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: Smartphone },
                { id: 'dark', label: 'Dark', icon: Smartphone, isDark: true },
                { id: 'system', label: 'System', icon: Smartphone },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
                    theme === t.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:border-border"
                  )}
                >
                  <div className={cn(
                    "w-12 h-16 rounded-md border border-border shadow-sm",
                    t.isDark ? "bg-slate-950" : "bg-white"
                  )} />
                  <span className="text-xs font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* API Keys Section */}
          <div className={cn("bg-card p-6 rounded-2xl border border-border shadow-sm relative", cvMode && "cv-highlight")}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-bold">API Keys</h3>
              <button className="text-primary text-xs font-bold uppercase hover:underline">Regenerate</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl border border-border flex items-center justify-between gap-4">
                <div className="flex-1 font-mono text-sm overflow-hidden text-ellipsis">
                  {showApiKey ? 'sk_live_51MabcXYZ1234567890' : '••••••••••••••••••••••••••••'}
                </div>
                <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
