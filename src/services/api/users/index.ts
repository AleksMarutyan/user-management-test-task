import { IUser } from "@/schemas/users";
import apiClient from "../client";

export const getUsers = async () => {
  const response = await apiClient.get("/users");

  if (response.status !== 200) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};

export const getUsersById = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);

  if (response.status !== 200) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};

export const createUser = async (data: any) => {
  const response = await apiClient.post("/users", data);
  if (response.status !== 201) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};

export const updateUser = async (data: IUser) => {
  const response = await apiClient.put(`/users/${data.id}`, data);
  if (response.status !== 200) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  if (response.status !== 200) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};
