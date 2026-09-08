'use client';

import { useEffect, useState } from 'react';

import { createTask, getUsers } from '../lib/api';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateTaskDialog({
  open,
  setOpen,
  onTaskCreated,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadUsers() {
      try {
        setLoadingUsers(true);
        setError(null);

        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        completed: false,
      };

      if (assignedTo) {
        taskData.assigned_to = Number(assignedTo);
      }

      const newTask = await createTask(taskData);

      onTaskCreated(newTask);

      setTitle('');
      setDescription('');
      setAssignedTo('');
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenChange(value) {
    setOpen(value);

    if (!value) {
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>

          <DialogDescription>
            Add a task to your workspace and start tracking your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="task-title"
              className="text-sm font-medium"
            >
              Title
            </label>

            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build authentication flow"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="task-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add more details about this task..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="task-assignee"
              className="text-sm font-medium"
            >
              Assign to
            </label>

            <select
              id="task-assignee"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              disabled={loadingUsers}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {loadingUsers ? 'Loading users...' : 'Unassigned'}
              </option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>

            <p className="text-xs text-muted-foreground">
              Optional. Choose another user responsible for this task.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting || loadingUsers}
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}