'use client';

import { useEffect, useState } from 'react';

import { getUsers, updateTask } from '../lib/api';

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

function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function EditTaskDialog({
  open,
  setOpen,
  task,
  onTaskUpdated,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(toDateTimeLocal(task.due_date));

      setAssignedTo(
        task.assigned_to ? String(task.assigned_to) : ''
      );

      setError(null);
    }
  }, [task]);

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

    if (!task) {
      return;
    }

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updatedTask = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),

        due_date: dueDate
          ? new Date(dueDate).toISOString()
          : null,

        assigned_to: assignedTo
          ? Number(assignedTo)
          : null,
      });

      onTaskUpdated(updatedTask);
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
          <DialogTitle>Edit task</DialogTitle>

          <DialogDescription>
            Update the task details, deadline, or assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="edit-task-title"
              className="text-sm font-medium"
            >
              Title
            </label>

            <Input
              id="edit-task-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-task-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="edit-task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Add more details about this task..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-task-due-date"
              className="text-sm font-medium"
            >
              Due date
            </label>

            <Input
              id="edit-task-due-date"
              type="datetime-local"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />

            <p className="text-xs text-muted-foreground">
              Optional. Clear the field to remove the deadline.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-task-assignee"
              className="text-sm font-medium"
            >
              Assign to
            </label>

            <select
              id="edit-task-assignee"
              value={assignedTo}
              onChange={(event) =>
                setAssignedTo(event.target.value)
              }
              disabled={loadingUsers}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {loadingUsers
                  ? 'Loading users...'
                  : 'Unassigned'}
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.username}
                </option>
              ))}
            </select>

            <p className="text-xs text-muted-foreground">
              Change the assignee or select Unassigned to remove
              the current assignment.
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
              {submitting
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}