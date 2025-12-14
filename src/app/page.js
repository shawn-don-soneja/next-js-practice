import Image from "next/image";
import styles from "./styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Shawn wuz here</h1>
        <ol>
          <li><a href="/macro-dashboard">/macro-dashboard</a></li>
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
