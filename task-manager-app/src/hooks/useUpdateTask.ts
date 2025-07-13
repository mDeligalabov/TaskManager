import { useState } from "react";

interface TaskUpdates {
    title?: string;
    description?: string;
    assignee_id?: number;
}

export function useUpdateTask() {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateTask = async (taskId: number, updates: TaskUpdates, onSuccess?: () => void) => {
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

    return {
        updateTask,
        isUpdating
    };
} 