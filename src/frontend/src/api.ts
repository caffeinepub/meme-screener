import type { FiltersMemeDto, MemeTablesResponseDto } from "./types";

export async function fetchMemeTables(
  filters: FiltersMemeDto,
): Promise<MemeTablesResponseDto> {
  const response = await fetch("https://api2.yodao.io/api/v2/meme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-socket-id": "memetracker_dashboard",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
