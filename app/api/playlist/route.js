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

    const [playlistRes, tracksRes] = await Promise.all([
      fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const playlist = await playlistRes.json();
    const tracksData = await tracksRes.json();

    const tracks = tracksData.items
      .filter((item) => item.track)
      .map((item) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a) => a.name).join(", "),
        duration: formatDuration(item.track.duration_ms),
        preview_url: item.track.preview_url,
        cover: item.track.album?.images?.[1]?.url || item.track.album?.images?.[0]?.url || null,
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