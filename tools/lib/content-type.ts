/** The content type each published data file is stored with. */
export function contentType(file: string): string {
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".csv")) return "text/csv; charset=utf-8";
  if (file.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (file.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (file.endsWith(".jpg")) return "image/jpeg";
  return "application/octet-stream";
}
