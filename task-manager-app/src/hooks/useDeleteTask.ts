import { useState } from "react";

export function useDeleteTask() {
    const [isDeleting, setIsDeleting] = useState(false);

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

    return {
        deleteTask,
        isDeleting
    };
} 