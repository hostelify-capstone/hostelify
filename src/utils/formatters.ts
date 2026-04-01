export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

export const toTitleCase = (value: string): string => {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
};