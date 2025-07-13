import { useTasks } from "../hooks/useTasks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

export default function Home() {
    const { tasks, loading, error, refetchTasks } = useTasks();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#1a1a1a',
            padding: '0'
        },
        content: {
            minWidth: '800px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 20px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column' as const
        },
        header: {
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '32px',
            textAlign: 'left' as const
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
        },
        logoutButton: {
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: '#b0b0b0',
            border: '1px solid #404040',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        logoutButtonHover: {
            backgroundColor: '#ff6b6b',
            color: '#ffffff',
            borderColor: '#ff6b6b'
        },
        loading: {
            color: '#b0b0b0',
            fontSize: '18px',
            textAlign: 'center' as const,
            padding: '40px 20px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        error: {
            color: '#ff6b6b',
            fontSize: '16px',
            textAlign: 'center' as const,
            padding: '20px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            margin: '20px 0'
        },
        taskList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            flex: 1,
            overflowY: 'auto' as const
        },
        taskItem: {
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            border: '1px solid #404040',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
        },
        taskItemHover: {
            borderColor: '#007acc',
            boxShadow: '0 4px 12px rgba(0, 122, 204, 0.2)',
            transform: 'translateY(-2px)'
        },
        taskTitle: {
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px',
            margin: 0
        },
        taskDescription: {
            color: '#b0b0b0',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: 0
        },
        emptyState: {
            color: '#b0b0b0',
            fontSize: '18px',
            textAlign: 'center' as const,
            padding: '60px 20px',
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            border: '1px solid #404040',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        createButton: {
            padding: '16px 32px',
            backgroundColor: '#007acc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '24px',
            marginBottom: '24px',
            alignSelf: 'flex-start' as const
        },
        createButtonHover: {
            backgroundColor: '#005a9e',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 122, 204, 0.3)'
        }
    };

    const handleCreateTask = () => {
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleTaskClick = async (task: any) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${task.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }
            
            const taskDetails = await response.json();
            setSelectedTask(taskDetails);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };

    const handleCompleteTask = async (taskId: number) => {
        setIsCompleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({is_complete: true})
            });
            
            if (!response.ok) {
                throw new Error('Failed to complete task');
            }
            
            refetchTasks();
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error completing task:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleUpdateTask = async (taskId: number, updates: { title?: string; description?: string; assignee_id?: number }) => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            // Refetch tasks to get updated data
            refetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            // Close modal and refetch tasks
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
            refetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTaskSubmit = async (taskData: { title: string; description: string; assignedTo: number }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({title: taskData.title, description: taskData.description, assignee_id: taskData.assignedTo})
            });
            
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            
            // Refetch tasks instead of reloading the page
            refetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.headerContainer}>
                    <h1 style={styles.header}>Your Tasks</h1>
                    <button 
                        style={styles.logoutButton}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor;
                            e.currentTarget.style.color = styles.logoutButtonHover.color;
                            e.currentTarget.style.borderColor = styles.logoutButtonHover.borderColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor;
                            e.currentTarget.style.color = styles.logoutButton.color;
                            e.currentTarget.style.borderColor = '#404040';
                        }}
                    >
                        Logout
                    </button>
                </div>
                
                {loading && (
                    <div style={styles.loading}>
                        Loading your tasks...
                    </div>
                )}
                
                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}
                
                {!loading && !error && (
                    <>
                        <button 
                            style={styles.createButton}
                            onClick={handleCreateTask}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles.createButtonHover.backgroundColor;
                                e.currentTarget.style.transform = styles.createButtonHover.transform;
                                e.currentTarget.style.boxShadow = styles.createButtonHover.boxShadow;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = styles.createButton.backgroundColor;
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            + Create Task
                        </button>
                        <ul style={styles.taskList}>
                            {tasks.length === 0 ? (
                                <li style={styles.emptyState}>
                                    No tasks found. Create your first task to get started!
                                </li>
                            ) : (
                                tasks.map(task => (
                                    <li 
                                        key={task.id} 
                                        style={styles.taskItem}
                                        onClick={() => handleTaskClick(task)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = styles.taskItemHover.borderColor;
                                            e.currentTarget.style.boxShadow = styles.taskItemHover.boxShadow;
                                            e.currentTarget.style.transform = styles.taskItemHover.transform;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#404040';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'none';
                                        }}
                                    >
                                        <h3 style={styles.taskTitle}>{task.title}</h3>
                                        {task.description && (
                                            <p style={styles.taskDescription}>{task.description}</p>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </>
                )}
            </div>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleTaskSubmit}
            />

            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
                onCompleteTask={handleCompleteTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                isCompleting={isCompleting}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
            />
        </div>
    );
} 