import Image from "next/image";
import styles from "./styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1>Shawn wuz here</h1>
        <ol>
          <li><a href="/charts">/charts</a></li>
          <li><a href="/dashboard">/dashboard</a></li>
          <li><a href="/algo-trader">/algo-trader</a></li>
          <li><a href="/health-tracker">/health-tracker</a></li>
          {/*
          <li>Get started by editing <code>src/app/page.js</code>.</li>
          <li>Save and see your changes instantly.</li>
          */}
        </ol>
      </main>
    </div>
  );
}
