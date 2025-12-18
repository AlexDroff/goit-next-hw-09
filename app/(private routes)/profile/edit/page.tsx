"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import css from "./EditProfilePage.module.css";

export default function EditProfile() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setUserName(user.username || "");
        setEmail(user.email);
        setAvatar(
          user.avatar ||
            "https://ac.goit.global/assets/images/default-avatar.png"
        );
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMe(userName);
      setUser(updatedUser);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <p>Email: {email}</p>
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
