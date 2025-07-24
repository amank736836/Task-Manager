import { useEffect, useState } from "react";
import { API_BASE_URL } from "./App";

export const TaskManagement = ({ token, user, showMessage }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('createdAt:desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus) queryParams.append('status', filterStatus);
      if (sortOrder) queryParams.append('sort', sortOrder);
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('page', currentPage);
      queryParams.append('limit', limit);

      const res = await fetch(`${API_BASE_URL}/tasks?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.docs);
        setTotalPages(data.totalPages);
      } else {
        showMessage(data.message || 'Failed to fetch tasks.', 'error');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showMessage('An error occurred while fetching tasks.', 'error');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token, filterStatus, sortOrder, searchTerm, currentPage]);

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const method = editingTask ? 'PUT' : 'POST';
      const url = editingTask ? `${API_BASE_URL}/tasks/${editingTask._id}` : `${API_BASE_URL}/tasks`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage(editingTask ? 'Task updated successfully!' : 'Task created successfully!', 'success');
        setTitle('');
        setDescription('');
        setStatus('pending');
        setEditingTask(null);
        fetchTasks();
      } else {
        showMessage(data.message || `Failed to ${editingTask ? 'update' : 'create'} task.`, 'error');
      }
    } catch (error) {
      console.error('Error creating/updating task:', error);
      showMessage(`An error occurred while ${editingTask ? 'updating' : 'creating'} the task.`, 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('Task deleted successfully!', 'success');
        fetchTasks();
      } else {
        showMessage(data.message || 'Failed to delete task.', 'error');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showMessage('An error occurred while deleting the task.', 'error');
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', textAlign: 'center' }}>Your Tasks</h2>

      {/* Task Form */}
      <form onSubmit={handleCreateOrUpdateTask} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' } }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="taskTitle">
              Title
            </label>
            <input
              type="text"
              id="taskTitle"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', appearance: 'none', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="taskStatus">
              Status
            </label>
            <select
              id="taskStatus"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="taskDescription">
            Description
          </label>
          <textarea
            id="taskDescription"
            rows="3"
            style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', appearance: 'none', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            type="submit"
            style={{ backgroundColor: '#22c55e', color: '#fff', fontWeight: 'bold', padding: '8px 24px', borderRadius: '9999px', outline: 'none', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ backgroundColor: '#9ca3af', color: '#fff', fontWeight: 'bold', padding: '8px 24px', borderRadius: '9999px', outline: 'none', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filters and Search */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Filters & Search</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div style={{ '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr 1fr' } }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="filterStatus">
              Filter by Status
            </label>
            <select
              id="filterStatus"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="sortOrder">
              Sort By
            </label>
            <select
              id="sortOrder"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="title:asc">Title (A-Z)</option>
              <option value="title:desc">Title (Z-A)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px' }} htmlFor="searchTerm">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', appearance: 'none', border: '1px solid #d1d5db', borderRadius: '4px', width: '100%', padding: '8px 12px', color: '#374151', lineHeight: '1.5', outline: 'none' }}
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' }, '@media (min-width: 1024px)': { gridTemplateColumns: '1fr 1fr 1fr' } }}>
          {tasks.map((task) => (
            <div key={task._id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>{task.title}</h4>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '12px' }}>{task.description}</p>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '4px' }}>Status: <span style={{ fontWeight: '500', color: task.status === 'completed' ? '#10b981' : task.status === 'in-progress' ? '#3b82f6' : '#f59e0b' }}>{task.status}</span></p>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '16px' }}>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => startEdit(task)}
                  style={{ flex: '1', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.875rem', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ flex: '1', backgroundColor: '#ef4444', color: '#fff', fontWeight: 'bold', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.875rem', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '1.125rem', marginTop: '40px' }}>No tasks found. Create one!</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 16px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '9999px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', border: 'none' }}
          >
            Previous
          </button>
          <span style={{ color: '#374151', fontWeight: '600' }}>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 16px', backgroundColor: '#6366f1', color: '#fff', borderRadius: '9999px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', border: 'none' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
