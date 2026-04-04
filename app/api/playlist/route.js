import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get("id");

  if (!playlistId) {
    return Response.json({ error: "No playlist ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const playlist = await playlistRes.json();

    const tracks = playlist.items.items
      .filter((item) => item.item)
      .map((item) => ({
        id: item.item.id,
        name: item.item.name,
        artists: item.item.artists.map((a) => a.name).join(", "),
        duration: formatDuration(item.item.duration_ms),
        preview_url: item.item.preview_url,
        cover: item.item.album?.images?.[1]?.url || item.item.album?.images?.[0]?.url || null,
      }));

    const info = {
      name: playlist.name,
      description: playlist.description,
      cover: playlist.images?.[0]?.url || null,
    };

    return Response.json({ tracks, info });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

function formatDuration(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}