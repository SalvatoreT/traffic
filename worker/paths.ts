/** Names served under `/data/`: one file, or files under `results/<area>/` or `redistribution/<area>/`. Each segment is plain word characters, dots and dashes, never `.` or `..`. */
export function isServableName(name: string): boolean {
  if (name.length === 0 || name.length > 200) return false;
  const parts = name.split("/");
  if (parts.length > 3) return false;
  if (parts.length > 1 && parts[0] !== "results" && parts[0] !== "redistribution") return false;
  return parts.every((p) => /^[\w.-]+$/.test(p) && p !== "." && p !== "..");
}
