import { useState } from "react";

interface CreateTaskData {
    title: string;
    description: string;
    assignedTo: number | null;
}

export function useCreateTask() {
    const [isCreating, setIsCreating] = useState(false);

    const createTask = async (taskData: CreateTaskData, onSuccess?: () => void) => {
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
        createTask,
        isCreating
    };
} 