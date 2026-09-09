import {
  CalendarDays,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
  canManage = true,
  assignedView = false,
}) {
  return (
    <article className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggle(task)}
          className="mt-1 text-muted-foreground transition hover:text-primary"
          aria-label={
            task.completed
              ? 'Mark task as pending'
              : 'Mark task as completed'
          }
        >
          {task.completed ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className={`font-semibold ${
                  task.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground'
                }`}
              >
                {task.title}
              </h2>

              {task.description && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  aria-label="Task options"
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Pencil className="size-4" />
                    Edit task
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onDelete(task)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-lg">
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>

            {task.due_date && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Due{' '}
                {new Date(task.due_date).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Task no {task.id}
            </div>

            {assignedView && task.owner_username && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="size-3.5" />
                From {task.owner_username}
              </div>
            )}

            {!assignedView && task.assigned_to_username && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="size-3.5" />
                Assigned to {task.assigned_to_username}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}