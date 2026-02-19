import axios from "axios";
import { Event } from "../types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const eventService = {
  async getEvents(): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  async getEvent(id: number): Promise<Event> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data.status === "ok";
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};
