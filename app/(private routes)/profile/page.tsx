// app/(private routes)/profile/page.tsx
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Profile | NoteHub",
  description: "View and edit your profile information.",
};

export default async function Profile() {
  const res = await fetch("/api/users/me", {
    credentials: "include",
  });

  if (!res.ok) {
    return (
      <main>
        <p>
          Not authorized. Please <Link href="/sign-in">log in</Link>.
        </p>
      </main>
    );
  }

  const user = await res.json();

  return (
    <main>
      <div>
        <h1>Profile Page</h1>
        <Link href="/profile/edit">Edit Profile</Link>
      </div>
      <div>
        <div>
          <Image
            src={
              user.avatar ||
              "https://ac.goit.global/assets/images/default-avatar.png"
            }
            alt="User Avatar"
            width={120}
            height={120}
            style={{ borderRadius: "50%" }}
          />
        </div>
        <div>
          <p>Username: {user.username || "—"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
