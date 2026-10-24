/** Turn stored snapshot text into readable copy for executives (no raw DOM/HTML). */
export function formatEvidenceState(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";

  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

  return htmlSnapshotToReadable(trimmed);
}

function htmlSnapshotToReadable(html: string): string {
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, " — ")
    .replace(/<td[^>]*>/gi, "")
    .replace(/<tr[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ — \n/g, "\n")
    .trim();

  return text;
}
