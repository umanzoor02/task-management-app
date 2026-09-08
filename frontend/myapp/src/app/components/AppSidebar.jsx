'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Settings,
  CheckSquare2,
  LogOut,
  LogIn,
  UserPlus,
  UserRound,
} from 'lucide-react';

import {
  getCurrentUser,
  logoutUser,
} from '../lib/api';

const navigation = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Tasks',
    icon: ListTodo,
    active: true,
  },
  {
    label: 'Calendar',
    icon: CalendarDays,
  },
  {
    label: 'Settings',
    icon: Settings,
  },
];

export default function AppSidebar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken && !refreshToken) {
        setLoadingUser(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        logoutUser();
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadCurrentUser();
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    router.push('/login');
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {user ? (
              <UserRound className="size-5" />
            ) : (
              <CheckSquare2 className="size-5" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight">
              {loadingUser
                ? 'Loading...'
                : user
                  ? user.username
                  : 'Task Manager'}
            </p>

            <p className="text-xs text-muted-foreground">
              {user ? 'Your workspace' : 'Organize your work'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                item.active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {loadingUser ? (
          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Checking session...
            </p>
          </div>
        ) : user ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-muted p-4">
              <p className="truncate text-sm font-medium">
                {user.username}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Signed in
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <LogIn className="size-4" />
              Sign in
            </button>

            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
            >
              <UserPlus className="size-4" />
              Sign up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}