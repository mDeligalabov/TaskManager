import { useTasks } from "../hooks/useTasks";
import { useGetAllTasks } from "../hooks/useGetAllTasks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

export default function Home() {
    const { tasks, loading, error, refetchTasks } = useTasks();
    const { tasks: allTasks, loading: loadingAllTasks, error: errorAllTasks, refetchAllTasks } = useGetAllTasks();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');

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

    const handleTaskUpdated = async () => {
        refetchTasks();
        if (activeTab === 'all') {
            refetchAllTasks();
        }
        
        // If the details modal is open, re-fetch the selected task to update the modal
        if (isDetailsModalOpen && selectedTask) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${selectedTask.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch updated task details');
                }
                
                const updatedTaskDetails = await response.json();
                setSelectedTask(updatedTaskDetails);
            } catch (error) {
                console.error('Error fetching updated task details:', error);
            }
        }
    };

    return (
        <div className="min-vh-100 bg-dark">
            <div className="container py-5 min-w-800">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="text-white fw-bold">Task Manager</h1>
                    <button 
                        className="btn btn-outline-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <ul className="nav nav-tabs nav-tabs-dark mb-4" id="taskTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link ${activeTab === 'my' ? 'active' : ''}`}
                            id="my-tasks-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#my-tasks"
                            type="button"
                            role="tab"
                            aria-controls="my-tasks"
                            aria-selected={activeTab === 'my'}
                            onClick={() => setActiveTab('my')}
                        >
                            My Tasks
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                            id="all-tasks-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#all-tasks"
                            type="button"
                            role="tab"
                            aria-controls="all-tasks"
                            aria-selected={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                        >
                            All Tasks
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="taskTabsContent">
                    <div className={`tab-pane fade ${activeTab === 'my' ? 'show active' : ''}`} id="my-tasks" role="tabpanel" aria-labelledby="my-tasks-tab">
                        {loading && (
                            <div className="d-flex justify-content-center align-items-center text-secondary py-5">
                                Loading your tasks...
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}
                        {!loading && !error && (
                            <>
                                <button 
                                    className="btn btn-primary mb-4"
                                    onClick={handleCreateTask}
                                >
                                    + Create Task
                                </button>
                                <ul className="list-unstyled">
                                    {tasks.length === 0 ? (
                                        <li className="bg-secondary bg-opacity-25 rounded p-5 text-center text-light">
                                            No tasks found. Create your first task to get started!
                                        </li>
                                    ) : (
                                        tasks.map(task => (
                                            <li 
                                                key={task.id} 
                                                className="bg-secondary bg-opacity-75 rounded p-4 mb-3 border border-dark-subtle task-hover"
                                                onClick={() => handleTaskClick(task)}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h3 className="text-white fw-semibold mb-0">{task.title}</h3>
                                                    <span className={`badge ${task.is_complete ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {task.is_complete ? 'Completed' : 'Not completed'}
                                                    </span>
                                                </div>
                                                {task.description && (
                                                    <p className="text-light mb-2">{task.description}</p>
                                                )}
                                                {task.assignee && (
                                                    <div className="mt-2">
                                                        <small className="text-light">
                                                            Assigned to: {task.assignee.name}({task.assignee.email})
                                                        </small>
                                                    </div>
                                                )}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </>
                        )}
                    </div>

                    <div className={`tab-pane fade ${activeTab === 'all' ? 'show active' : ''}`} id="all-tasks" role="tabpanel" aria-labelledby="all-tasks-tab">
                        {loadingAllTasks && (
                            <div className="d-flex justify-content-center align-items-center text-secondary py-5">
                                Loading all tasks...
                            </div>
                        )}
                        {errorAllTasks && (
                            <div className="alert alert-danger text-center" role="alert">
                                {errorAllTasks}
                            </div>
                        )}
                        {!loadingAllTasks && !errorAllTasks && (
                            <>
                                <button 
                                    className="btn btn-primary mb-4"
                                    onClick={handleCreateTask}
                                >
                                    + Create Task
                                </button>
                                <ul className="list-unstyled">
                                    {allTasks.length === 0 ? (
                                        <li className="bg-secondary bg-opacity-25 rounded p-5 text-center text-light">
                                            No tasks found in the system.
                                        </li>
                                    ) : (
                                        allTasks.map(task => (
                                            <li 
                                                key={task.id} 
                                                className="bg-secondary bg-opacity-75 rounded p-4 mb-3 border border-dark-subtle task-hover"
                                                onClick={() => handleTaskClick(task)}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h3 className="text-white fw-semibold mb-0">{task.title}</h3>
                                                    <span className={`badge ${task.is_complete ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {task.is_complete ? 'Completed' : 'Not completed'}
                                                    </span>
                                                </div>
                                                {task.description && (
                                                    <p className="text-light mb-2">Description: {task.description}</p>
                                                )}
                                                <div className="mt-2">
                                                    <small className="text-light">
                                                        {task.assignee ? `Assigned to: ${task.assignee.name}(${task.assignee.email})` : 'Unassigned'}
                                                    </small>
                                                </div>
                                                
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={handleTaskUpdated}
            />

            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
                onTaskUpdated={handleTaskUpdated}
            />
        </div>
    );
} 