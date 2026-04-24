import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  User as UserIcon,
  X,
  Camera,
  Loader2
} from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useDebounce } from '@/hooks';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  avatar: string;
  lastActive: string;
}

const mockUsers: AppUser[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `U-${100 + i}`,
  name: ['Alex Rivera', 'Jordan Smith', 'Sarah Chen', 'Michael Scott', 'Dwight Schrute', 'Pam Beesly', 'Jim Halpert'][i % 7],
  email: `user${i}@example.com`,
  role: i % 5 === 0 ? 'Admin' : i % 3 === 0 ? 'Editor' : 'Viewer',
  status: i % 10 === 0 ? 'Inactive' : i % 8 === 0 ? 'Pending' : 'Active',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
  lastActive: '2 hours ago',
}));

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { cvMode } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, users]);

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const columns: ColumnDef<AppUser>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img src={row.original.avatar} className="w-8 h-8 rounded-full bg-muted border border-border" alt="" />
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue('role') === 'Admin' ? <Shield size={14} className="text-primary" /> : <UserIcon size={14} className="text-muted-foreground" />}
          <span className="text-sm">{row.getValue('role')}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === 'Active' && "bg-emerald-100 text-emerald-700",
            status === 'Inactive' && "bg-muted text-muted-foreground",
            status === 'Pending' && "bg-amber-100 text-amber-700"
          )}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Active',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setEditingUser(row.original);
              setIsModalOpen(true);
            }}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 hover:bg-muted rounded-lg text-rose-500 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users, roles, and permissions.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus size={18} />
          Add New User
        </button>
      </div>

      <div className={cn("bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative", cvMode && "cv-highlight")}>
        {cvMode && <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded z-10">User CRUD + Debounced Search</div>}
        <div className="p-6 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <DataTable columns={columns} data={filteredUsers} />
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-heading font-bold">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <form className="p-6 space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setIsSaving(true);
                setTimeout(() => {
                  setIsSaving(false);
                  setIsModalOpen(false);
                  toast.success(editingUser ? 'User updated' : 'User created');
                }, 1000);
              }}>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer">
                    <img 
                      src={editingUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser'} 
                      className="w-24 h-24 rounded-full bg-muted border-4 border-background shadow-md group-hover:brightness-75 transition-all" 
                      alt="" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white">
                      <Camera size={24} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Click to upload avatar</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                    <input defaultValue={editingUser?.name} required className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                    <input defaultValue={editingUser?.email} type="email" required className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Role</label>
                    <select defaultValue={editingUser?.role} className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none">
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                    <select defaultValue={editingUser?.status} className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none">
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-all">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-8 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                    {isSaving && <Loader2 className="animate-spin" size={16} />}
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
