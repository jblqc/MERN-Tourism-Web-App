// src/pages/ErrorPage.jsx
export default function ErrorPage({ message = 'Something went wrong!' }) {
  return (
    <main className="main">
      <div className="error">
        <div className="error__title" />
        <h2 className="heading-secondary heading-secondary--error">
          Uh oh! Something went wrong!
        </h2>
        <h2 className="error__emoji">😢 🤯</h2>
        <div className="error__msg">{message}</div>
      </div>
    </main>
  );
}
