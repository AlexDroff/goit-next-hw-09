import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { instance } from "./api";

const configureServerInstance = async () => {
  const cookieStore = await cookies();
  const cookiesList = cookieStore.getAll();
  const cookiesString = cookiesList
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  instance.defaults.headers.Cookie = cookiesString;
  instance.defaults.withCredentials = true;
};

export const checkSession = async () => {
  await configureServerInstance();
  try {
    const response = await instance.get<User | null>("/auth/session");
    return response;
  } catch {
    return null;
  }
};

export const getMe = async () => {
  await configureServerInstance();
  const response = await instance.get<User>("/users/me");
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  tag?: string;
  page?: number;
}) => {
  await configureServerInstance();
  const response = await instance.get("/notes", { params });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  await configureServerInstance();
  const response = await instance.get<Note>(`/notes/${id}`);
  return response.data;
};
