import { cookies } from "next/headers";
import axios from "axios";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const getServerApiInstance = async () => {
  const cookieStore = await cookies();
  const cookieEntries = cookieStore.getAll();
  const cookiesString = cookieEntries
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL,
    headers: {
      Cookie: cookiesString,
    },
    withCredentials: true,
  });
};

export const checkSession = async () => {
  const api = await getServerApiInstance();
  try {
    const response = await api.get<User | null>("/auth/session");
    return response;
  } catch (error) {
    return error;
  }
};

export const getMe = async () => {
  const api = await getServerApiInstance();
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
  page?: number;
}) => {
  const api = await getServerApiInstance();
  const response = await api.get("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const api = await getServerApiInstance();
  const response = await api.get(`/notes/${id}`);
  return response.data;
};
