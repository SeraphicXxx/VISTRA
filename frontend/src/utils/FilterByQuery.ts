export function filterByQuery<T>(
  items: T[],
  query: string | null | undefined,
  fields: (keyof T)[]
): T[] {
  const normalized = (query ?? "").trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) =>
    fields.some((field) =>
      String(item[field] ?? "").toLowerCase().includes(normalized)
    )
  );
}