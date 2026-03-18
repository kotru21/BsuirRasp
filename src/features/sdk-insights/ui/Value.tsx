interface ValueProps {
  value: number | null | boolean;
}

export function Value({ value }: ValueProps) {
  if (typeof value === "boolean") return <span>{value ? "Да" : "Нет"}</span>;
  if (value === null) return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}
