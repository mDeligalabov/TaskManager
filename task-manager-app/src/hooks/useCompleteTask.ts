import { useState } from "react";
import api from "../utils/api";

export function useCompleteTask() {
    const [isCompleting, setIsCompleting] = useState(false);

    const completeTask = async (taskId: number, onSuccess?: () => void) => {
        setIsCompleting(true);
        try {
            await api.patch(`/tasks/${taskId}`, {is_complete: true});
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