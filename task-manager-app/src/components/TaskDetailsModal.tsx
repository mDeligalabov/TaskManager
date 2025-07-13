import { useState, useEffect } from 'react';

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
    onCompleteTask: (taskId: number) => void;
    onUpdateTask: (taskId: number, updates: { title?: string; description?: string; assignee_id?: number }) => void;
    onDeleteTask: (taskId: number) => void;
    isCompleting: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export default function TaskDetailsModal({ isOpen, onClose, task, onCompleteTask, onUpdateTask, onDeleteTask, isCompleting, isUpdating, isDeleting }: TaskDetailsModalProps) {
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
                console.error(err.message);
            } else {
                console.error('Failed to load users');
            }
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

    const handleSave = () => {
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
            onUpdateTask(task.id, updates);
        }
        
        setIsEditing(false);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (task) {
            onDeleteTask(task.id);
            setShowDeleteConfirm(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    if (!isOpen || !task) return null;

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
            maxWidth: '600px',
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
        content: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px'
        },
        section: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '8px'
        },
        label: {
            color: '#b0b0b0',
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
        },
        value: {
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.5'
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
        description: {
            color: '#e0e0e0',
            fontSize: '16px',
            lineHeight: '1.6',
            backgroundColor: '#404040',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #555555'
        },
        status: {
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            textTransform: 'uppercase' as const
        },
        statusPending: {
            backgroundColor: '#ffd43b',
            color: '#000000'
        },
        statusCompleted: {
            backgroundColor: '#51cf66',
            color: '#ffffff'
        },
        userInfo: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '4px'
        },
        userName: {
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '500'
        },
        userEmail: {
            color: '#b0b0b0',
            fontSize: '14px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px',
            marginTop: '24px'
        },
        editButton: {
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
        editButtonHover: {
            backgroundColor: '#005a9e'
        },
        completeButton: {
            padding: '12px 24px',
            backgroundColor: '#51cf66',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        completeButtonHover: {
            backgroundColor: '#40c057'
        },
        completeButtonDisabled: {
            backgroundColor: '#555555',
            cursor: 'not-allowed'
        },
        saveButton: {
            padding: '12px 24px',
            backgroundColor: '#51cf66',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        saveButtonHover: {
            backgroundColor: '#40c057'
        },
        saveButtonDisabled: {
            backgroundColor: '#555555',
            cursor: 'not-allowed'
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
            padding: '10px'
        },
        deleteButton: {
            padding: '12px 24px',
            backgroundColor: '#ff6b6b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        deleteButtonHover: {
            backgroundColor: '#e55555'
        },
        deleteButtonDisabled: {
            backgroundColor: '#555555',
            cursor: 'not-allowed'
        },
        confirmOverlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        },
        confirmModal: {
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid #404040',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        },
        confirmTitle: {
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '16px',
            textAlign: 'center' as const
        },
        confirmMessage: {
            color: '#b0b0b0',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '24px',
            textAlign: 'center' as const
        },
        confirmButtonGroup: {
            display: 'flex',
            gap: '12px'
        },
        confirmDeleteButton: {
            padding: '12px 24px',
            backgroundColor: '#ff6b6b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
        },
        confirmDeleteButtonHover: {
            backgroundColor: '#e55555'
        },
        confirmCancelButton: {
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
        confirmCancelButtonHover: {
            backgroundColor: '#404040',
            color: '#ffffff'
        }
    };

    const getStatusStyle = (isCompleted: boolean) => {
        return isCompleted ? styles.statusCompleted : styles.statusPending;
    };

    const handleComplete = () => {
        onCompleteTask(task.id);
    };

    const hasChanges = () => {
        return editTitle !== task.title || 
               editDescription !== (task.description || '') || 
               editAssigneeId !== (task.assignee_id || 0);
    };

    return (
        <>
            <div style={styles.overlay} onClick={onClose}>
                <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Task Details</h2>
                        <button 
                            style={styles.closeButton}
                            onClick={onClose}
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

                    <div style={styles.content}>
                        <div style={styles.section}>
                            <span style={styles.label}>Title</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={styles.input}
                                    onFocus={(e) => {
                                        (e.target as HTMLInputElement).style.borderColor = styles.inputFocus.borderColor;
                                        (e.target as HTMLInputElement).style.boxShadow = styles.inputFocus.boxShadow;
                                    }}
                                    onBlur={(e) => {
                                        (e.target as HTMLInputElement).style.borderColor = '#555555';
                                        (e.target as HTMLInputElement).style.boxShadow = 'none';
                                    }}
                                />
                            ) : (
                                <span style={styles.value}>{task.title}</span>
                            )}
                        </div>

                        <div style={styles.section}>
                            <span style={styles.label}>Description</span>
                            {isEditing ? (
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
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
                            ) : (
                                task.description ? (
                                    <div style={styles.description}>{task.description}</div>
                                ) : (
                                    <span style={{...styles.value, color: '#666666'}}>No description</span>
                                )
                            )}
                        </div>

                        <div style={styles.section}>
                            <span style={styles.label}>Status</span>
                            <span style={{...styles.status, ...getStatusStyle(task.is_complete)}}>
                                {task.is_complete ? 'Completed' : 'Pending'}
                            </span>
                        </div>

                        <div style={styles.section}>
                            <span style={styles.label}>Assigned To</span>
                            {isEditing ? (
                                <select
                                    value={editAssigneeId}
                                    onChange={(e) => setEditAssigneeId(Number(e.target.value))}
                                    style={styles.select}
                                    onFocus={(e) => {
                                        (e.target as HTMLSelectElement).style.borderColor = styles.inputFocus.borderColor;
                                        (e.target as HTMLSelectElement).style.boxShadow = styles.inputFocus.boxShadow;
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
                            ) : (
                                task.assignee ? (
                                    <div style={styles.userInfo}>
                                        <span style={styles.userName}>{task.assignee.name}</span>
                                        <span style={styles.userEmail}>{task.assignee.email}</span>
                                    </div>
                                ) : (
                                    <span style={{...styles.value, color: '#666666'}}>Unassigned</span>
                                )
                            )}
                            {isEditing && loadingUsers && <div style={styles.loadingText}>Loading users...</div>}
                        </div>

                        {task.created_by && (
                            <div style={styles.section}>
                                <span style={styles.label}>Created By</span>
                                <div style={styles.userInfo}>
                                    <span style={styles.userName}>{task.created_by.name}</span>
                                    <span style={styles.userEmail}>{task.created_by.email}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={styles.buttonGroup}>
                        {isEditing ? (
                            <>
                                <button 
                                    style={isUpdating || !hasChanges() ? {...styles.saveButton, ...styles.saveButtonDisabled} : styles.saveButton}
                                    onClick={handleSave}
                                    disabled={isUpdating || !hasChanges()}
                                    onMouseEnter={(e) => {
                                        if (!isUpdating && hasChanges()) {
                                            e.currentTarget.style.backgroundColor = styles.saveButtonHover.backgroundColor;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isUpdating && hasChanges()) {
                                            e.currentTarget.style.backgroundColor = styles.saveButton.backgroundColor;
                                        }
                                    }}
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    style={styles.cancelButton}
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                    onMouseEnter={(e) => {
                                        if (!isUpdating) {
                                            e.currentTarget.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
                                            e.currentTarget.style.color = styles.cancelButtonHover.color;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isUpdating) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#b0b0b0';
                                        }
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    style={styles.editButton}
                                    onClick={handleEdit}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.editButtonHover.backgroundColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.editButton.backgroundColor;
                                    }}
                                >
                                    Edit Task
                                </button>
                                {!task.is_complete && (
                                    <button 
                                        style={isCompleting ? {...styles.completeButton, ...styles.completeButtonDisabled} : styles.completeButton}
                                        onClick={handleComplete}
                                        disabled={isCompleting}
                                        onMouseEnter={(e) => {
                                            if (!isCompleting) {
                                                e.currentTarget.style.backgroundColor = styles.completeButtonHover.backgroundColor;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCompleting) {
                                                e.currentTarget.style.backgroundColor = styles.completeButton.backgroundColor;
                                            }
                                        }}
                                    >
                                        {isCompleting ? 'Completing...' : 'Complete Task'}
                                    </button>
                                )}
                                <button 
                                    style={isDeleting ? {...styles.deleteButton, ...styles.deleteButtonDisabled} : styles.deleteButton}
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    onMouseEnter={(e) => {
                                        if (!isDeleting) {
                                            e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isDeleting) {
                                            e.currentTarget.style.backgroundColor = styles.deleteButton.backgroundColor;
                                        }
                                    }}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Task'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteConfirm && (
                <div style={styles.confirmOverlay} onClick={handleCancelDelete}>
                    <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.confirmTitle}>Delete Task</h3>
                        <p style={styles.confirmMessage}>
                            Are you sure you want to delete "{task?.title}"? This action cannot be undone.
                        </p>
                        <div style={styles.confirmButtonGroup}>
                            <button 
                                style={styles.confirmDeleteButton}
                                onClick={handleConfirmDelete}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = styles.confirmDeleteButtonHover.backgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = styles.confirmDeleteButton.backgroundColor;
                                }}
                            >
                                Delete
                            </button>
                            <button 
                                style={styles.confirmCancelButton}
                                onClick={handleCancelDelete}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = styles.confirmCancelButtonHover.backgroundColor;
                                    e.currentTarget.style.color = styles.confirmCancelButtonHover.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#b0b0b0';
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 