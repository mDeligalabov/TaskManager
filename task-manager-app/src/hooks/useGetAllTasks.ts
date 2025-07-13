import { useEffect, useState } from "react";

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

export function useGetAllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch all tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refetchAllTasks = () => {
    fetchAllTasks();
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return { tasks, loading, error, refetchAllTasks };
} 