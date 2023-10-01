# Nuxtify API

Lightweight music API for client without third-party libraries.

## ⚠️ API from [ZingMP3](https://zingmp3.vn)

## Installation

```bash
npm i nuxtify-api
#or
yarn add nuxtify-api
```

```bash
import { Nuxtify } from "nuxtify-api"
#or
const { Nuxtify } = require("nuxtify-api")
```

## Usage

## **Home**

```javascript
Nuxtify.getHome();
```

## **Top 100**

```javascript
Nuxtify.getTop100();
```

## **Genres**

```javascript
Nuxtify.getGenres();
```

## **Artist**

> alias: string

```javascript
Nuxtify.getArtist('Alan-Walker');
```

## **Song**

### _Lyrics_

> songId: string

```javascript
Nuxtify.song.getLyrics('Z6709W0Z');
```

### _Song URL_

> songId: string

```javascript
Nuxtify.song.getSongUrl('Z6709W0Z');
```

### _Song Detail_

> songId: string

```javascript
Nuxtify.song.getSongDetail('Z6709W0Z');
```

### _Playlist_

> playlistId: string

```javascript
Nuxtify.song.getPlaylist('6B8E67CU');
```

### _New Release Song_

```javascript
Nuxtify.song.getNewReleaseSongs();
```

## **Chart**

### _Home Chart_

```javascript
Nuxtify.chart.getHomeChart();
```

### _New Release Chart_

```javascript
Nuxtify.chart.getNewReleaseChart();
```

### _Week Chart_

> nationalKey: 'vn' | 'kr' | 'us' \
> week: number (option)\
> year: number (option)

```javascript
Nuxtify.chart.getWeekChart('vn');
```

## **Video**

### _Video Detail_

> videoId: string

```javascript
Nuxtify.chart.getVideoDetail('ZWABOA0F');
```

### _Related Videos_

> videoId: string

```javascript
Nuxtify.chart.getRelatedVideos('ZWABOA0F');
```

## **Search**

### _All Result_

> q: string

```javascript
Nuxtify.search.getResult('faded');
```

### _Result by type_

> q: string \
> type: 'video' | 'song' | 'artist' | 'playlist' \
> page: number (option)

```javascript
Nuxtify.search.getResultByType('faded', 'song');
```

### _Suggestion_

```javascript
Nuxtify.search.getSuggestion('faded');
```

### _Recommend Keyword_

```javascript
Nuxtify.search.getRecommendKeyword();
```

## **Podcast**

### _Podcast_

```javascript
Nuxtify.search.getPodcast();
```

### _Newest podcast_

```javascript
Nuxtify.search.getNewestPodcast();
```

### _Top podcast_

```javascript
Nuxtify.search.getTopPodcast();
```

### _Podcast URL_

> podcastId: string

```javascript
Nuxtify.search.getPodcastUrl('Z6AFI0IZ');
```

### _Podcast Playlist_

> podcastPlaylistId: string

```javascript
Nuxtify.search.getPodcastPlaylist('Z6AFI0IZ');
```

### _Podcast Info_

> podcastId: string

```javascript
Nuxtify.search.getPodcastInfo('6AFEIFOA');
```

### _Podcast Detail_

> podcastId: string

```javascript
Nuxtify.search.getPodcastDetail('Z6AFI0IZ');
```

### _Podcast Categories_

```javascript
Nuxtify.search.getPodcastCategories();
```

### _Podcast By Genres_

> genreId: string

```javascript
Nuxtify.search.getPodcastByGenre('IWZ980AI');
```
