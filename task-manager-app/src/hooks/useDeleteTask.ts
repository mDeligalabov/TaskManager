import { useState } from "react";
import api from "../utils/api";

export function useDeleteTask() {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteTask = async (taskId: number, onSuccess?: () => void) => {
        setIsDeleting(true);
        try {
            await api.delete(`/tasks/${taskId}`);
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