import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from './AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@dashboard.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary/20 transition-all`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary/20 transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-input text-primary focus:ring-primary/20" />
            <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground select-none">Remember me for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Demo Accounts:<br/>
            Admin: <span className="font-mono text-foreground">admin@dashboard.com</span><br/>
            Viewer: <span className="font-mono text-foreground">user@dashboard.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
