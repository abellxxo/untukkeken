export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get("id");

  if (!playlistId) {
    return Response.json({ error: "No playlist ID" }, { status: 400 });
  }

  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.json({ error: "Failed to get token" }, { status: 500 });
    }

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,description,images,tracks.items(track(id,name,artists,duration_ms,preview_url,album(images)))`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const playlist = await playlistRes.json();
    console.log("Spotify response:", JSON.stringify(playlist));
    const tracks = playlist.tracks.items
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