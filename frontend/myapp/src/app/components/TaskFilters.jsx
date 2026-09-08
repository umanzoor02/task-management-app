const filters = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

export default function TaskFilters({
  filter,
  setFilter,
  taskCount,
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === item.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
      </p>
    </div>
  );
}