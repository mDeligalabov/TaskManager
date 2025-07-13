import { useEffect, useState } from "react";
import api from "../utils/api";

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_complete: boolean;
  assignee_id?: number;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  created_by?: {
    id: number;
    name: string;
    email: string;
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tasks/my');
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refetchTasks = () => {
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, refetchTasks };
}
