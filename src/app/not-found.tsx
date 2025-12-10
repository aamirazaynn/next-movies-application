import Link from "next/link";
import Header from "@/components/server/Header";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.message}>
            The page you're looking for doesn't exist.
          </p>
          <Link href="/" className={styles.link}>
            Go back home
          </Link>
        </div>
      </main>
    </>
  );
}
