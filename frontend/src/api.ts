import axios from "axios";
const API_BASE_URL = "http://localhost:5001/api";

// Fetch all units from the database
export const fetchUnits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/units`);
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    return [];
  }
};

// Fetch all tasks from the database
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Assign a task to a unit
export const assignTask = async (unitId: number, task: string) => {
  try {
    await axios.post(`${API_BASE_URL}/tasks`, { unit_id: unitId, task });
  } catch (error) {
    console.error("Error assigning task:", error);
  }
};
