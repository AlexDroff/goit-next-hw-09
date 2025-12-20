import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { instance } from "./api";

const getHeadersWithCookies = async () => {
  const cookieStore = await cookies();
  const cookiesList = cookieStore.getAll();
  const cookiesString = cookiesList
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  return {
    Cookie: cookiesString,
  };
};

export const checkSession = async () => {
  const headers = await getHeadersWithCookies();
  return instance.get<User | null>("/auth/session", {
    headers,
    withCredentials: true,
  });
};

export const getMe = async () => {
  const headers = await getHeadersWithCookies();
  const response = await instance.get<User>("/users/me", {
    headers,
    withCredentials: true,
  });
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
  page?: number;
}) => {
  const headers = await getHeadersWithCookies();
  const response = await instance.get("/notes", {
    params,
    headers,
    withCredentials: true,
  });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const headers = await getHeadersWithCookies();
  const response = await instance.get<Note>(`/notes/${id}`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};
