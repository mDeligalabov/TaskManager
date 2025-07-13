import { useState } from "react";

export function useTaskOperations() {
    const [isCompleting, setIsCompleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const deleteTask = async (taskId: number, onSuccess?: () => void) => {
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
            
            onSuccess?.();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        } finally {
            setIsDeleting(false);
        }
    };

    const completeTask = async (taskId: number, onSuccess?: () => void) => {
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
            
            onSuccess?.();
        } catch (error) {
            console.error('Error completing task:', error);
            throw error;
        } finally {
            setIsCompleting(false);
        }
    };

    const updateTask = async (taskId: number, updates: { title?: string; description?: string; assignee_id?: number }, onSuccess?: () => void) => {
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
            
            onSuccess?.();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const createTask = async (taskData: { title: string; description: string; assignedTo: number | null }, onSuccess?: () => void) => {
        setIsCreating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: taskData.title, 
                    description: taskData.description, 
                    assignee_id: taskData.assignedTo
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            
            onSuccess?.();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        } finally {
            setIsCreating(false);
        }
    };

    return {
        deleteTask,
        completeTask,
        updateTask,
        createTask,
        isDeleting,
        isCompleting,
        isUpdating,
        isCreating
    };
} 