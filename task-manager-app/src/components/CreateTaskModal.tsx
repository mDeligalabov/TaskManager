import React, { useState, useEffect } from 'react';
import { useCreateTask } from '../hooks/useCreateTask';
import api from '../utils/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated?: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
    const { createTask, isCreating } = useCreateTask();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<number>(-1);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/users/all');
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        // Convert -1 to null for the API call
        const assigneeId = assignedTo === -1 ? null : assignedTo;

        try {
            await createTask({ 
                title: title.trim(), 
                description: description.trim(), 
                assignedTo: assigneeId
            }, () => {
                handleClose();
                onTaskCreated?.();
            });
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Failed to create task. Please try again.');
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setAssignedTo(0);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} onClick={handleClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content bg-dark border border-secondary">
                    <div className="modal-header border-bottom border-secondary">
                        <h5 className="modal-title text-white fw-bold">Create New Task</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label text-light fw-medium">Task Title *</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Enter task title"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label text-light fw-medium">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Enter task description"
                                rows={4}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="assignedTo" className="form-label text-light fw-medium">Assign To *</label>
                            <select
                                id="assignedTo"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(Number(e.target.value))}
                                className="form-select bg-dark text-white border-secondary"
                            >
                                <option value={-1}>Unassigned</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {loading && <div className="text-light text-center mt-2">Loading users...</div>}
                        </div>

                        {error && <div className="alert alert-danger" role="alert">{error}</div>}

                        <div className="modal-footer border-top border-secondary">
                            <button 
                                type="button"
                                className="btn btn-outline-light"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className={`btn ${isCreating ? 'btn-secondary' : 'btn-primary'}`}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 