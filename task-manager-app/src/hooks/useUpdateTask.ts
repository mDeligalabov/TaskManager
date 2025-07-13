import { useState } from "react";
import api from "../utils/api";

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
            await api.patch(`/tasks/${taskId}`, updates);
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