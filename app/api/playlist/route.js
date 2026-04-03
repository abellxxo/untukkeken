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
      return Response.json({ error: "Not authenticated", session }, { status: 401 });
    }

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const playlist = await playlistRes.json();
    return Response.json({ debug: playlist });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}