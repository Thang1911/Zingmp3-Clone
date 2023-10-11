const express = require("express");
const router = express.Router();
const sql = require("mssql");
var config = require("./connect");

const pool = new sql.ConnectionPool(config);

const { Nuxtify } = require("nuxtify-api");

router.route("/Home").get(async (request, response) => {
  const Home = [];

  try {
    const results = await Nuxtify.getHome();
    const data = results.data;
    
    Home.push({ content: data.items[0], title: "slider" });
    Home.push({ content: data.items[2], title: "new_release" });
    Home.push({ content: data.items[3], title: "Chill" });
    Home.push({ content: data.items[4], title: "Một chút yêu đời" });
    Home.push({ content: data.items[5], title: "Remix là Dance luôn" });
    Home.push({ content: data.items[7], title: "artist" });
    Home.push({ content: data.items[11], title: "top100" });
    Home.push({ content: data.items[13], title: "album" });

    // console.log(Home);
    response.json(Home);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Nuxtify:", error);
    response.status(500).json({ error: "Có lỗi xảy ra" });
  }
});

router.route("/podcast").get(async (req, res) => {
  try {
    const results = await Nuxtify.podcast.getPodcast();
    const data = results.data?.items[1]?.items;

    res.json(data);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Nuxtify:", error);
    res.status(500).json({ error: "Có lỗi xảy ra" });
  }
});

router.route("/chart").get(async (req, res) => {
  const chart = [];
  try {
    const results = await Nuxtify.chart.getHomeChart();
    const data = results.data;

    chart.push({ content: data?.RTChart?.items, title: "zingchart" });
    chart.push({ content: data?.weekChart, title: "weekchart" });

    res.json(chart);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Nuxtify:", error);
    res.status(500).json({ error: "Có lỗi xảy ra" });
  }
});

router.route("/song/:id").get(async (req, res) => {
  const id = req.params.id;

  try {
    const lyric = await Nuxtify.song.getLyrics(id);
    const songUrl = await Nuxtify.song.getSongUrl(id);
    const songDetails = await Nuxtify.song.getSongDetail(id);

    const url =
      songUrl.data && songUrl.data.hasOwnProperty("128")
        ? songUrl.data["128"]
        : null;

    const data = lyric.data.sentences;

    const mergedData = data.map((item) => ({
      data: item.words.map((word) => word.data).join(" "),
    }));

    const details = {
      title: songDetails.data.title,
      thumbnail: songDetails.data.thumbnail,
      artistsName: songDetails.data.artistsNames,
      duration: songDetails.data.duration,
    };

    res.json({ mergedData, url, details });
  } catch (error) {
    console.error("Lỗi trong quá trình lấy dữ liệu:", error);
    res.status(500).json({ error: "Lỗi trong quá trình xử lý yêu cầu" });
  }
});

router.route("/playlist").post(async (req, res) => {
  try {
    const playlist = {...req.body};

    const result = await addPlaylist(playlist);
    res.status(201).json(result);
    // res.json(playlist)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm danh sách." });
  }
});

router.route("/playlist").get(async (req, res) => {
  try {
    const result = await getPlaylist();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi." });
  }
});

async function getPlaylist() {
  try {
    await pool.connect();

    const query = `
      SELECT * FROM Playlists
    `;

    const getPlaylist = await pool
      .request()
      .query(query);

    return getPlaylist.recordsets;
  } catch (err) {
    console.log(err);
  } finally {
    pool.close();
  }
}

async function addPlaylist(playlist) {
  try {
    await pool.connect();

    const query = `
      INSERT INTO Playlists (PlaylistName, UserID)
      VALUES (@playlistName, 1)
    `;

    const insertPlaylist = await pool
      .request()
      .input("playlistName", sql.NVarChar, playlist.playlistName)
      .query(query);

    return insertPlaylist.recordsets;
  } catch (err) {
    console.log(err);
  } finally {
    pool.close();
  }
}

router.route("/song").post(async (req, res) => {
  try {
    const body = { ...req.body };

    const result = await addSongToPlaylist(body);
    res.status(201).json(result);
    // res.json(playlist)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm danh sách." });
  }
});

router.route("/playlist/:id").get(async (req, res) => {
  try {
    const playlistId = req.params.id;
    const result = await getSongFromPlaylist(playlistId);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi." });
  }
});

async function addSongToPlaylist(song) {
try {
  await pool.connect();

  const query = `
      INSERT INTO PlaylistSongs (PlaylistID, SongName, Artists, Thumbnail, Url, Duration, EncodeID)
      VALUES (@playlistID, @songName, @artist, @thumbnail, @url, @duration, @encodeId)
    `;

  const insertSong = await pool
    .request()
    .input("playlistId", sql.NVarChar, song.playlistId)
    .input("songName", sql.NVarChar, song.songName)
    .input("artist", sql.NVarChar, song.artist)
    .input("thumbnail", sql.NVarChar, song.thumbnail)
    .input("url", sql.NVarChar, song.url)
    .input("duration", sql.NVarChar, song.duration)
    .input("encodeId", sql.NVarChar, song.encodeId)
    .query(query);

  return insertSong.recordsets;
} catch (err) {
  console.log(err);
} finally {
  pool.close();
}
}

async function getSongFromPlaylist(id) {
  try {
    await pool.connect();

    const query = `
      SELECT * FROM PlaylistSongs WHERE PlaylistID = ${id}
    `;

    const getPlaylistSongs = await pool.request().query(query);

    return getPlaylistSongs.recordsets;
  } catch (err) {
    console.log(err);
  } finally {
    pool.close();
  }
}

module.exports = router;
