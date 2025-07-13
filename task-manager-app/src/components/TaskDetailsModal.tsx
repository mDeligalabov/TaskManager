import { useState, useEffect } from 'react';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { useCompleteTask } from '../hooks/useCompleteTask';
import api from '../utils/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    title: string;
    description?: string;
    is_complete: boolean;
    assignee_id?: number;
    assignee?: User;
    created_by?: User;
}

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onTaskUpdated?: () => void;
}

export default function TaskDetailsModal({ isOpen, onClose, task, onTaskUpdated }: TaskDetailsModalProps) {
    const { updateTask, isUpdating } = useUpdateTask();
    const { deleteTask, isDeleting } = useDeleteTask();
    const { completeTask, isCompleting } = useCompleteTask();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editAssigneeId, setEditAssigneeId] = useState<number>(0);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description || '');
            setEditAssigneeId(task.assignee_id || 0);
        }
    }, [task]);

    useEffect(() => {
        if (isOpen && isEditing) {
            fetchUsers();
        }
    }, [isOpen, isEditing]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await api.get('/users/all');
            setUsers(response.data);
        } catch (err: any) {
            console.error('Failed to load users:', err.response?.data?.detail || err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description || '');
            setEditAssigneeId(task.assignee_id || 0);
        }
    };

    const handleSave = async () => {
        if (!task) return;
        
        const updates: { title?: string; description?: string; assignee_id?: number } = {};
        
        if (editTitle !== task.title) {
            updates.title = editTitle;
        }
        if (editDescription !== (task.description || '')) {
            updates.description = editDescription;
        }
        if (editAssigneeId !== (task.assignee_id || 0)) {
            updates.assignee_id = editAssigneeId;
        }
        
        if (Object.keys(updates).length > 0) {
            try {
                await updateTask(task.id, updates, () => {
                    onTaskUpdated?.();
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (task) {
            try {
                await deleteTask(task.id, () => {
                    setShowDeleteConfirm(false);
                    onClose();
                    onTaskUpdated?.();
                });
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (!isOpen || !task) return null;

    const getStatusBadge = (isCompleted: boolean) => {
        return isCompleted ? 'badge bg-success' : 'badge bg-warning text-dark';
    };

    const handleComplete = async () => {
        try {
            await completeTask(task.id, () => {
                onClose();
                onTaskUpdated?.();
            });
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const hasChanges = () => {
        return editTitle !== task.title || 
               editDescription !== (task.description || '') || 
               editAssigneeId !== (task.assignee_id || 0);
    };

    return (
        <>
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={onClose}>
                <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content bg-dark border border-secondary">
                        <div className="modal-header border-bottom border-secondary">
                            <h5 className="modal-title text-white fw-bold">{isEditing ? 'Edit Task' : 'Task Details'}</h5>
                            <button 
                                type="button" 
                                className="btn-close btn-close-white" 
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-light fw-medium text-uppercase small">Title</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="form-control bg-dark text-white border-secondary"
                                    />
                                ) : (
                                    <div className="text-white">{task.title}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light fw-medium text-uppercase small">Description</label>
                                {isEditing ? (
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Enter task description"
                                        rows={4}
                                    />
                                ) : (
                                    task.description ? (
                                        <div className="bg-dark p-3 rounded border border-secondary text-light">{task.description}</div>
                                    ) : (
                                        <div className="text-muted">No description</div>
                                    )
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light fw-medium text-uppercase small">Status</label>
                                <div>
                                    <span className={getStatusBadge(task.is_complete)}>
                                        {task.is_complete ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light fw-medium text-uppercase small">Assigned To</label>
                                {isEditing ? (
                                    <select
                                        value={editAssigneeId}
                                        onChange={(e) => setEditAssigneeId(Number(e.target.value))}
                                        className="form-select bg-dark text-white border-secondary"
                                    >
                                        <option value={-1}>Unassigned</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    task.assignee ? (
                                        <div>
                                            <div className="text-white fw-medium">{task.assignee.name}</div>
                                            <div className="text-light small">{task.assignee.email}</div>
                                        </div>
                                    ) : (
                                        <div className="text-muted">Unassigned</div>
                                    )
                                )}
                                {isEditing && loadingUsers && <div className="text-light text-center mt-2">Loading users...</div>}
                            </div>

                            {task.created_by && (
                                <div className="mb-3">
                                    <label className="form-label text-light fw-medium text-uppercase small">Created By</label>
                                    <div>
                                        <div className="text-white fw-medium">{task.created_by.name}</div>
                                        <div className="text-light small">{task.created_by.email}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer border-top border-secondary">
                            {isEditing ? (
                                <>
                                    <button 
                                        className={`btn ${isUpdating || !hasChanges() ? 'btn-secondary' : 'btn-success'}`}
                                        onClick={handleSave}
                                        disabled={isUpdating || !hasChanges()}
                                    >
                                        {isUpdating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button 
                                        className="btn btn-outline-light"
                                        onClick={handleCancelEdit}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={handleEdit}
                                    >
                                        Edit Task
                                    </button>
                                    {!task.is_complete && (
                                        <button 
                                            className={`btn ${isCompleting ? 'btn-secondary' : 'btn-success'}`}
                                            onClick={handleComplete}
                                            disabled={isCompleting}
                                        >
                                            {isCompleting ? 'Completing...' : 'Complete Task'}
                                        </button>
                                    )}
                                    <button 
                                        className={`btn ${isDeleting ? 'btn-secondary' : 'btn-danger'}`}
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Task'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} onClick={handleCancelDelete}>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content bg-dark border border-secondary">
                            <div className="modal-header border-bottom border-secondary">
                                <h5 className="modal-title text-white fw-bold">Delete Task</h5>
                            </div>
                            <div className="modal-body">
                                <p className="text-light">
                                    Are you sure you want to delete "{task?.title}"? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer border-top border-secondary">
                                <button 
                                    className="btn btn-danger"
                                    onClick={handleConfirmDelete}
                                >
                                    Delete
                                </button>
                                <button 
                                    className="btn btn-outline-light"
                                    onClick={handleCancelDelete}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 