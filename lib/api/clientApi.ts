// lib/api/clientApi.ts
import type { User } from "@/types/user";
import type { Note, NotesResponse } from "@/types/note";

const API_URL = "/api";

export const register = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return await response.json();
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
};

export const logout = async (): Promise<void> => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const checkSession = async (): Promise<User | null> => {
  const response = await fetch(`${API_URL}/auth/session`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (data.success) {
    const userResponse = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      credentials: "include",
    });
    if (userResponse.ok) {
      return await userResponse.json();
    }
  }
  return null;
};

export const getMe = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};

export const updateMe = async (username: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
};

// ===== NOTES =====
export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
  page?: number;
}): Promise<NotesResponse> => {
  const url = new URL(`${API_URL}/notes`);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.tag) url.searchParams.set("tag", params.tag);
  if (params?.page) url.searchParams.set("page", params.page.toString());
  url.searchParams.set("perPage", "12"); // Завжди 12, як у ДЗ

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return await response.json();
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch note");
  }

  return await response.json();
};

export const createNote = async (
  title: string,
  content: string,
  tag: string
): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, tag }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return await response.json();
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  return await response.json();
};
