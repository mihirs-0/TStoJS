import styles from './HomePageClient.module.css';

export default function HomePageClient(): React.ReactNode {
  return (
    <div>
      <div className={styles['title-container']}>
        <h1>Home</h1>
      </div>
      <section>
        <h2>Hello!</h2>
        <br />
        <p>
          Welcome to the <i>JSON Agent</i> task. Please proceed to the
          implementation page via the "Agent" link in the sidenav.
        </p>
        <br />
        <p>Happy coding 🙂.</p>
      </section>
    </div>
  );
}
