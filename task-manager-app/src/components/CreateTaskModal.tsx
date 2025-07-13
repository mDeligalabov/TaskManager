import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: { title: string; description: string; assignedTo: number }) => void;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<number>(0);
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to load users');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (assignedTo === 0) {
            setError('Please select a user');
            return;
        }
        onSubmit({ title: title.trim(), description: description.trim(), assignedTo });
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setAssignedTo(0);
        setError('');
        onClose();
    };

    const styles = {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        },
        modal: {
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto' as const,
            border: '1px solid #404040',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        title: {
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '600',
            margin: 0
        },
        closeButton: {
            backgroundColor: 'transparent',
            border: 'none',
            color: '#b0b0b0',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
        },
        closeButtonHover: {
            backgroundColor: '#404040',
            color: '#ffffff'
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px'
        },
        label: {
            color: '#e0e0e0',
            fontSize: '14px',
            fontWeight: '500'
        },
        input: {
            padding: '12px 16px',
            backgroundColor: '#404040',
            border: '1px solid #555555',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            outline: 'none'
        },
        inputFocus: {
            borderColor: '#007acc',
            boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.2)'
        },
        textarea: {
            padding: '12px 16px',
            backgroundColor: '#404040',
            border: '1px solid #555555',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            outline: 'none',
            resize: 'vertical' as const,
            minHeight: '100px',
            fontFamily: 'inherit'
        },
        select: {
            padding: '12px 16px',
            backgroundColor: '#404040',
            border: '1px solid #555555',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            outline: 'none',
            cursor: 'pointer'
        },
        selectFocus: {
            borderColor: '#007acc',
            boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.2)'
        },
        error: {
            color: '#ff6b6b',
            fontSize: '14px',
            padding: '8px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 107, 107, 0.3)'
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px',
            marginTop: '8px'
        },
        submitButton: {
            padding: '12px 24px',
            backgroundColor: '#007acc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        submitButtonHover: {
            backgroundColor: '#005a9e'
        },
        cancelButton: {
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#b0b0b0',
            border: '1px solid #404040',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        cancelButtonHover: {
            backgroundColor: '#404040',
            color: '#ffffff'
        },
        loadingText: {
            color: '#b0b0b0',
            fontSize: '14px',
            textAlign: 'center' as const,
            padding: '20px'
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Create New Task</h2>
                    <button 
                        style={styles.closeButton}
                        onClick={handleClose}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = styles.closeButtonHover.backgroundColor;
                            e.currentTarget.style.color = styles.closeButtonHover.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#b0b0b0';
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="title" style={styles.label}>Task Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                            onFocus={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = styles.inputFocus.borderColor;
                                (e.target as HTMLInputElement).style.boxShadow = styles.inputFocus.boxShadow;
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = '#555555';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                            }}
                            placeholder="Enter task title"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label htmlFor="description" style={styles.label}>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={styles.textarea}
                            onFocus={(e) => {
                                (e.target as HTMLTextAreaElement).style.borderColor = styles.inputFocus.borderColor;
                                (e.target as HTMLTextAreaElement).style.boxShadow = styles.inputFocus.boxShadow;
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLTextAreaElement).style.borderColor = '#555555';
                                (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                            }}
                            placeholder="Enter task description"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label htmlFor="assignedTo" style={styles.label}>Assign To *</label>
                        <select
                            id="assignedTo"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(Number(e.target.value))}
                            style={styles.select}
                            onFocus={(e) => {
                                (e.target as HTMLSelectElement).style.borderColor = styles.selectFocus.borderColor;
                                (e.target as HTMLSelectElement).style.boxShadow = styles.selectFocus.boxShadow;
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLSelectElement).style.borderColor = '#555555';
                                (e.target as HTMLSelectElement).style.boxShadow = 'none';
                            }}
                        >
                            <option value={0}>Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {loading && <div style={styles.loadingText}>Loading users...</div>}
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.buttonGroup}>
                        <button 
                            type="button"
                            style={styles.cancelButton}
                            onClick={handleClose}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
                                e.currentTarget.style.color = styles.cancelButtonHover.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#b0b0b0';
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            style={styles.submitButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor;
                            }}
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 