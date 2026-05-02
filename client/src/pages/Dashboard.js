import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTasks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks', config);
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', { title, description }, config);
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, config);
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🎓 Internship Manager</h2>
        <div>
          <span style={styles.welcome}>Welcome, {user?.name}!</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.card}>
          <h3>Add New Task</h3>
          <form onSubmit={addTask}>
            <input style={styles.input} type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input style={styles.input} type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <button style={styles.button} type="submit">Add Task</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>My Tasks ({tasks.length})</h3>
          {tasks.length === 0 && <p style={{color:'#888'}}>No tasks yet! Add one above.</p>}
          {tasks.map(task => (
            <div key={task.id} style={styles.taskCard}>
              <div>
                <h4 style={styles.taskTitle}>{task.title}</h4>
                <p style={styles.taskDesc}>{task.description}</p>
                <span style={{
                  ...styles.badge,
                  background: task.status === 'completed' ? '#10b981' : task.status === 'in-progress' ? '#f59e0b' : '#6366f1'
                }}>
                  {task.status}
                </span>
              </div>
              <div style={styles.taskActions}>
                <select style={styles.select} value={task.status} onChange={e => updateStatus(task.id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f2f5' },
  navbar: { background: '#4f46e5', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', margin: 0 },
  welcome: { color: 'white', marginRight: '15px' },
  logoutBtn: { padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  main: { padding: '30px', maxWidth: '800px', margin: '0 auto' },
  card: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '25px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  taskCard: { border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { margin: '0 0 5px 0', color: '#333' },
  taskDesc: { margin: '0 0 8px 0', color: '#666', fontSize: '13px' },
  badge: { padding: '3px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  taskActions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default Dashboard;