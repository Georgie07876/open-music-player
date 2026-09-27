export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  cover: string;
}

export const mockAlbums: Album[] = [
  {
    id: "a1",
    title: "Midnight Frequencies",
    artist: "Nova Line",
    year: 2023,
    cover: "#1e1b4b",
  },
  {
    id: "a2",
    title: "Amber Hours",
    artist: "Amber Room",
    year: 2022,
    cover: "#b45309",
  },
  {
    id: "a3",
    title: "Field Notes",
    artist: "Field Notes",
    year: 2024,
    cover: "#166534",
  },
  {
    id: "a4",
    title: "Static",
    artist: "Circuit",
    year: 2021,
    cover: "#7f1d1d",
  },
  {
    id: "a5",
    title: "Weekend Sessions",
    artist: "The Weekend",
    year: 2020,
    cover: "#0e7490",
  },
];

export const mockTracks: Track[] = [
  { id: "1", title: "Night Drive", artist: "Nova Line", duration: 214 },
  { id: "2", title: "Soft Signal", artist: "Amber Room", duration: 198 },
  { id: "3", title: "Open Window", artist: "Field Notes", duration: 241 },
  { id: "4", title: "Low Battery", artist: "Circuit", duration: 176 },
  { id: "5", title: "Second Cup", artist: "Amber Room", duration: 203 },
  { id: "6", title: "After Rain", artist: "Field Notes", duration: 228 },
  { id: "7", title: "City Lights", artist: "The Weekend", duration: 190 },
];

export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
