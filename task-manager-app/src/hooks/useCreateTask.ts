import { useState } from "react";
import api from "../utils/api";

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
            await api.post('/tasks', {
                title: taskData.title, 
                description: taskData.description, 
                assignee_id: taskData.assignedTo
            });
            
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