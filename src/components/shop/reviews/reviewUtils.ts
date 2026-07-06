export function deriveReviewTitle(comment: string): string {
  const firstLine = comment.trim().split(/\n/)[0]?.trim() ?? "";
  if (!firstLine) return "Evaluación";
  if (firstLine.length <= 60) return firstLine;
  return `${firstLine.slice(0, 57)}…`;
}

export function formatProductPrice(price: number): string {
  return `$ ${price.toLocaleString("es-CO")}`;
}
