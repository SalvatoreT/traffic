import type { LoadProgress } from '../data';

const mb = (n: number) => (n / 1048576).toFixed(1);

export function Loading({ label, progress }: { label: string; progress?: LoadProgress | null }) {
  const known = progress && progress.total ? Math.min(1, progress.loaded / progress.total) : null;
  return (
    <div className="loading" role="status">
      <p className="loading-text">{label}</p>
      {known !== null && progress ? (
        <>
          <progress value={Math.round(known * 100)} max={100} aria-label={label} />
          <p className="muted small" aria-hidden="true">{Math.round(known * 100)}% ({mb(progress.loaded)} of {mb(progress.total as number)} MB)</p>
        </>
      ) : (
        <span className="spinner" aria-hidden="true" />
      )}
    </div>
  );
}

export function LoadError({ title, message, onRetry }: { title: string; message: string; onRetry(): void }) {
  return (
    <div className="loading" role="alert">
      <p className="loading-text"><strong>{title}</strong></p>
      <p>{message}</p>
      <button type="button" className="btn primary" onClick={onRetry}>Try again</button>
    </div>
  );
}
