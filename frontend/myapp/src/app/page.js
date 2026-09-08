'use client';

import { useEffect, useState } from 'react';

import EditTaskDialog from './components/EditTaskDialog';
import AppSidebar from './components/AppSidebar';
import TaskHeader from './components/TaskHeader';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import CreateTaskDialog from './components/CreateTaskDialog';

import {
  deleteTask,
  getTasks,
  updateTask,
} from './lib/api';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  function handleTaskCreated(newTask) {
    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  }

  async function handleToggleTask(task) {
    try {
      setError(null);

      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditTask(task) {
    setSelectedTask(task);
    setEditTaskOpen(true);
  }

  function handleTaskUpdated(updatedTask) {
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? updatedTask
          : currentTask
      )
    );

    setSelectedTask(null);
  }

  async function handleDeleteTask(task) {
    try {
      setError(null);

      await deleteTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) => currentTask.id !== task.id
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }

    if (filter === 'pending') {
      return !task.completed;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AppSidebar />

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
            <TaskHeader
              onNewTask={() => setCreateTaskOpen(true)}
            />

            <TaskFilters
              filter={filter}
              setFilter={setFilter}
              taskCount={tasks.length}
            />

            <div className="mt-6">
              {loading && (
                <div className="rounded-2xl border bg-card p-6">
                  <p className="text-sm text-muted-foreground">
                    Loading tasks...
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                  <p className="text-sm text-destructive">
                    Error: {error}
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                filteredTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                    <h3 className="text-lg font-semibold">
                      No tasks found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first task to start organizing your work.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                filteredTasks.length > 0 && (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </section>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        setOpen={setCreateTaskOpen}
        onTaskCreated={handleTaskCreated}
      />
      <EditTaskDialog
        open={editTaskOpen}
        setOpen={setEditTaskOpen}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </main>
  );
}