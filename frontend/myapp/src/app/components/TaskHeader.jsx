import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TaskHeader({ onNewTask }) {
  return (
    <header>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            My Tasks
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Organize your work, track progress, and stay focused on what matters.
          </p>
        </div>

        <Button onClick={onNewTask} className="h-11 rounded-xl px-5">
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      <div className="relative mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search your tasks..."
          className="h-12 rounded-xl pl-11"
        />
      </div>
    </header>
  );
}