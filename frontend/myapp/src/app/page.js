'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import EditTaskDialog from './components/EditTaskDialog';
import AppSidebar from './components/AppSidebar';
import TaskHeader from './components/TaskHeader';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import CreateTaskDialog from './components/CreateTaskDialog';

import {
  deleteTask,
  getAssignedTasks,
  getTasks,
  updateAssignedTaskCompletion,
  getCurrentUser,
  updateTask,
} from './lib/api';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const [section, setSection] = useState('my-tasks');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const router = useRouter();
  useEffect(() => {
    async function initializeDashboard() {
      try {
        setLoading(true);
        setError(null);

        await getCurrentUser();

        const [myTasksData, assignedTasksData] =
          await Promise.all([
            getTasks(),
            getAssignedTasks(),
          ]);

        setTasks(myTasksData);
        setAssignedTasks(assignedTasksData);
      } catch {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }

    initializeDashboard();
  }, [router]);
  
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

  async function handleToggleAssignedTask(task) {
    try {
      setError(null);

      const updatedTask =
        await updateAssignedTaskCompletion(
          task.id,
          !task.completed
        );

      setAssignedTasks((currentTasks) =>
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

  function handleSectionChange(newSection) {
    setSection(newSection);
    setFilter('all');
    setError(null);
  }

  const currentTasks =
    section === 'my-tasks'
      ? tasks
      : assignedTasks;

  const filteredTasks = currentTasks.filter((task) => {
    const matchesFilter =
      filter === 'completed'
        ? task.completed
        : filter === 'pending'
          ? !task.completed
          : true;

    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description || '').toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AppSidebar />

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
            <TaskHeader
              onNewTask={() => setCreateTaskOpen(true)}
              search={search}
              setSearch={setSearch}
            />

            <div className="mt-6 inline-flex rounded-xl border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() =>
                  handleSectionChange('my-tasks')
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  section === 'my-tasks'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                My Tasks
                <span className="ml-2 text-xs text-muted-foreground">
                  {tasks.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSectionChange('assigned')
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  section === 'assigned'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Assigned to Me
                <span className="ml-2 text-xs text-muted-foreground">
                  {assignedTasks.length}
                </span>
              </button>
            </div>

            <TaskFilters
              filter={filter}
              setFilter={setFilter}
              taskCount={currentTasks.length}
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
                      {section === 'my-tasks'
                        ? 'No tasks found'
                        : 'No tasks assigned to you'}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {section === 'my-tasks'
                        ? 'Create your first task to start organizing your work.'
                        : 'Tasks assigned to you by other users will appear here.'}
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
                        onToggle={
                          section === 'my-tasks'
                            ? handleToggleTask
                            : handleToggleAssignedTask
                        }
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        canManage={section === 'my-tasks'}
                        assignedView={section === 'assigned'}
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