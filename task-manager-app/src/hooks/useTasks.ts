import { useEffect, useState } from "react";

export interface Task {
  id: number;
  title: string;
  description?: string;
  // Add other fields as needed
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/my`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
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
