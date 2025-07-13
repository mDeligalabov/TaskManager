import { useState } from "react";

export function useCompleteTask() {
    const [isCompleting, setIsCompleting] = useState(false);

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

    return {
        completeTask,
        isCompleting
    };
} 