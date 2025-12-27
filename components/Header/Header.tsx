import Link from "next/link";
import Image from "next/image";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logoLink}>
        <Image
          src="/logo.svg"
          width={40}
          height={40}
          alt=""
          aria-hidden="true"
        />
        <span>NoteHub</span>
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes/filter/all">Notes</Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
