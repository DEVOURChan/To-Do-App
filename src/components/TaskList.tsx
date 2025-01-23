import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { deleteTask } from '../store/slices/taskSlice';
import type { RootState } from '../store';

const TaskList: React.FC = () => {
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 className="text-lg font-medium">{task.title}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.weather && (
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <img
                    src={`http://openweathermap.org/img/w/${task.weather.icon}.png`}
                    alt="weather"
                    className="w-6 h-6"
                  />
                  {task.weather.temp}°C - {task.weather.description}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => dispatch(deleteTask(task.id))}
            className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tasks yet. Add one above!</div>
      )}
    </div>
  );
};

export default TaskList;