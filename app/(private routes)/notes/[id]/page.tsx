import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import { notFound } from "next/navigation";
import NoteDetailsClient from "./NoteDetails.client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

  if (!noteId || typeof noteId !== "string") {
    return {
      title: "Note Not Found | NoteHub",
      description: "The requested note could not be found.",
      openGraph: {
        title: "Note Not Found | NoteHub",
        description: "The requested note could not be found.",
        url: `https://notehub.com/notes/${noteId}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "Note not found",
          },
        ],
        type: "article",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: "Note Not Found | NoteHub",
        description: "The requested note could not be found.",
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }

  let note;
  try {
    note = await fetchNoteById(noteId);
  } catch {
    return {
      title: "Note Not Found | NoteHub",
      description: "The requested note could not be found.",
      openGraph: {
        title: "Note Not Found | NoteHub",
        description: "The requested note could not be found.",
        url: `https://notehub.com/notes/${noteId}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: "Note not found",
          },
        ],
        type: "article",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: "Note Not Found | NoteHub",
        description: "The requested note could not be found.",
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }

  const title = `Note: ${note.title}`;
  const description = note.content.slice(0, 100) || "No content available";
  const url = `https://notehub.com/notes/${noteId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: note.content.slice(0, 100) || "No content",
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const noteId = resolvedParams.id;

  if (!noteId || typeof noteId !== "string") {
    notFound();
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", noteId],
      queryFn: () => fetchNoteById(noteId),
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}