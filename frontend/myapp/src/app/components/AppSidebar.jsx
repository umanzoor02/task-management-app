import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  Settings,
  CheckSquare2,
} from 'lucide-react';

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
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CheckSquare2 className="size-5" />
          </div>

          <div>
            <p className="font-semibold tracking-tight">Django Next</p>
            <p className="text-xs text-muted-foreground">Task Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
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
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm font-medium">Stay productive</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Keep your daily tasks organized and focused.
          </p>
        </div>
      </div>
    </aside>
  );
}