import type { User } from "@/types/user";
import type { Note, NotesResponse } from "@/types/note";
import { instance } from "./api";

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await instance.post<{ user: User }>("/auth/register", {
    email,
    password,
  });
  return response.data.user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await instance.post<{ user: User }>("/auth/login", {
    email,
    password,
  });
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await instance.get<string>("/auth/session", {
      responseType: "text",
    });
    const text = response.data.trim();
    if (text === "") {
      return null;
    }
    return JSON.parse(text) as User;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await instance.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (username: string): Promise<User> => {
  const response = await instance.patch<User>("/users/me", { username });
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
  page?: number;
}): Promise<NotesResponse> => {
  const response = await instance.get<NotesResponse>("/notes", {
    params: {
      ...params,
      perPage: 12,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await instance.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (
  title: string,
  content: string,
  tag: string
): Promise<Note> => {
  const response = await instance.post<Note>("/notes", {
    title,
    content,
    tag,
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};
