let isMoreVisible = true;
let arraysForMore = [];
let isPlaying = false;
let isMute = false;
let volume = 100;
let isRepeat = false;
let isRandom = false;
let isFormVisible = false;
let selectedPlaylist = "";
let selectedPlaylistId = "";

const playBtn = document.querySelector(".js__music-control__icon-play");
const thumbPlayerBox = document.querySelector(".music-control__left");
const volumeIcon = document.querySelector(".music-control__right-volume-icon");
const volumeProgress = document.querySelector("#progress1");
const repeatBtn = document.querySelector(".js__music-control__icon5");

const remainTime = document.querySelector(
  ".js__music-control__progress-time-start"
);
const progress = document.querySelector("#progress");

const sideBarTabs = document.querySelectorAll(".js__sidebar-tabs");
const tabs = document.querySelectorAll(".tabs-item");
const songName = document.querySelector(".music-control__left-content-song");
const singerName = document.querySelector(
  ".music-control__left-content-singer"
);
const cdThumb = document.querySelector(".music-control__left-img");
const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
  duration: 10000,
  iterations: Infinity,
});
cdThumbAnimate.pause();

const cdThumbAnimateMobile = document
  .querySelector(".mobile-player__body-thumb")
  .animate([{ transform: "rotate(360deg)" }], {
    duration: 10000,
    iterations: Infinity,
  });
cdThumbAnimateMobile.pause();

const start = async () => {
  try {
    const [result1, result2, result3, result4] = await Promise.all([
      fetch("http://localhost:8090/Home").then((response) => response.json()),
      fetch("http://localhost:8090/podcast").then((response) =>
        response.json()
      ),
      fetch("http://localhost:8090/chart").then((response) => response.json()),
      fetch("http://localhost:8090/playlist").then((response) =>
        response.json()
      ),
    ]);

    renderUserPlaylist(result4[0]);
    renderSelected(result4[0]);
    renderPlaylist1(result1[2].content.items);
    renderPlaylist2(result1[3].content.items);
    renderTop100(result1[6].content.items);
    renderArtists(result1[5].content.items);
    renderPodcast(result2[0].programs);

    arraysForMore = result3[0].content;

    const weekChart = {
      korea: result3[1].content.korea.items,
      vn: result3[1].content.vn.items,
      us: result3[1].content.us.items,
    };

    renderZingChart(arraysForMore.slice(0, 10));
    renderWeekChart(weekChart.vn, ".week_vn");
    renderWeekChart(weekChart.us, ".week_uk");
    renderWeekChart(weekChart.korea, ".week_kr");
  } catch (error) {
    console.error("Error:", error);
  }
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

sideBarTabs.forEach((tab, index) => {
  tab.onclick = function () {
    $(".js__sidebar-tabs.sidebar__item--active").classList.remove(
      "sidebar__item--active"
    );
    tab.classList.add("sidebar__item--active");
    containerPanes[0].style.display = "none";
    containerPanes[1].style.display = "none";
    containerPanes[2].style.display = "none";
    containerPanes[index].style.display = "block";
  };
});

tabs.forEach((tab, index) => {
  const pane = panes[index];
  document.querySelector(
    ".panes-item:not(.music__option-item--active)"
  ).style.backgroundColor = "transparent";
  themeItems[backgroundIndex].click();
  tab.onclick = function () {
    document
      .querySelector(".music__option-item.music__option-item--active")
      .classList.remove("music__option-item--active");
    tab.classList.add("music__option-item--active");
    document.querySelector(".panes-item.active").classList.remove("active");
    tabs[0].style.backgroundColor = "transparent";
    tabs[1].style.backgroundColor = "transparent";
    tabs[2].style.backgroundColor = "transparent";
    tabs[3].style.backgroundColor = "transparent";
    tab.style.backgroundColor = `var(--option-color-${backgroundIndex})`;
    pane.classList.add("active");
    document
      .querySelector(".music__option-item.music__option-item--active")
      .classList.remove("js__main-color");
  };
});

document.querySelectorAll(".js__mobile-tab__item").forEach((tab, index) => {
  tab.onclick = function () {
    document
      .querySelector(".mobile-tab__item.active")
      .classList.remove("active");
    tab.classList.add("active");
    containerPanes[0].style.display = "none";
    containerPanes[1].style.display = "none";
    containerPanes[2].style.display = "none";
    containerPanes[index].style.display = "block";
  };
});

const renderUserPlaylist = (arrays) => {
  const containers = document.querySelectorAll(".row_playlist_user");
  containers.forEach((container) => {
    arrays.forEach((array, i) => {
      const playlistItem = document.createElement("div");
      playlistItem.classList.add(
        "col",
        "l-2-4",
        "m-3",
        "s-6",
        "mobile-margin-bot-10px"
      );
      playlistItem.innerHTML = `
        <li class="option-all__playlist-item">
            <div class="option-all__playlist-item-img-wrapper">
                <div class="option-all__playlist-item-img-wrapper-action">
                    <i class="fas fa-times option-all__playlist-item-img-wrapper-action-icon1" onclick="deletePlaylist(${array.PlaylistID})"></i>
                    <i class="fas fa-play option-all__playlist-item-img-wrapper-action-icon2" onclick="renderSongsFromPlaylist(${array.PlaylistID})"></i>
                    <i class="fas fa-ellipsis-h option-all__playlist-item-img-wrapper-action-icon3"></i>
                </div>
                <div class="option-all__playlist-item-img" style="background-image: url(./assets/img/playlist/Zing-MP3.jpg);"></div>
            </div>
            <div class="option-all__playlist-item-content">
                <div class="option-all__playlist-item-content-name1 js__main-color">${array.PlaylistName}</div>
                <div class="option-all__playlist-item-content-name2 js__sub-color">User</div>
            </div>
        </li>
      `;
      container.appendChild(playlistItem);
    });
  });
};

const renderPlaylist1 = (arrays) => {
  let html = arrays.map((array, i) => {
    return `<div class="col l-2-4 m-3 s-6 mobile-margin-bot-30px" key=${array.encodeId}>
                <li class="option-all__playlist-item">
                    <div class="option-all__playlist-item-img-wrapper">
                        <div class="option-all__playlist-item-img-wrapper-action">
                            <i
                                class="white-color fas fa-times option-all__playlist-item-img-wrapper-action-icon1"></i>
                            <i
                                class="white-color fas fa-play option-all__playlist-item-img-wrapper-action-icon2"></i>
                            <i
                                class="white-color fas fa-ellipsis-h option-all__playlist-item-img-wrapper-action-icon3"></i>
                        </div>
                        <div class="option-all__playlist-item-img"
                            style="background-image: url(${array.thumbnail});"></div>
                        </div>
                        <div class="option-all__playlist-item-content">
                            <div
                                class="option-all__playlist-item-content-name1 js__main-color white-color">
                                    ${array.title}</div>
                            <div class="option-all__playlist-item-content-name2 js__sub-color">Nhiều ca sĩ</div>
                        </div>
                 </li>
            </div>`;
  });
  document.querySelector(".chill").innerHTML = html.join("");
};

const renderPlaylist2 = (arrays) => {
  let html = arrays.map((array, i) => {
    return `<div class="col l-2-4 m-3 s-6 mobile-margin-bot-30px" key=${array.encodeId}>
                <li class="option-all__playlist-item">
                    <div class="option-all__playlist-item-img-wrapper">
                        <div class="option-all__playlist-item-img-wrapper-action">
                            <i
                                class="white-color fas fa-times option-all__playlist-item-img-wrapper-action-icon1"></i>
                            <i
                                class="white-color fas fa-play option-all__playlist-item-img-wrapper-action-icon2"></i>
                            <i
                                class="white-color fas fa-ellipsis-h option-all__playlist-item-img-wrapper-action-icon3"></i>
                        </div>
                        <div class="option-all__playlist-item-img"
                            style="background-image: url(${array.thumbnail});"></div>
                        </div>
                        <div class="option-all__playlist-item-content">
                            <div
                                class="option-all__playlist-item-content-name1 js__main-color white-color">
                                    ${array.title}</div>
                            <div class="option-all__playlist-item-content-name2 js__sub-color">Nhiều ca sĩ</div>
                        </div>
                 </li>
            </div>`;
  });
  document.querySelector(".life").innerHTML = html.join("");
};

const renderTop100 = (arrays) => {
  let html = arrays.map((array, i) => {
    return `<div class="col l-2-4 m-3 s-6 mobile-margin-bot-30px" key=${array.encodeId}>
                <li class="option-all__playlist-item">
                    <div class="option-all__playlist-item-img-wrapper">
                        <div class="option-all__playlist-item-img-wrapper-action">
                            <i
                                class="white-color fas fa-times option-all__playlist-item-img-wrapper-action-icon1"></i>
                            <i
                                class="white-color fas fa-play option-all__playlist-item-img-wrapper-action-icon2"></i>
                            <i
                                class="white-color fas fa-ellipsis-h option-all__playlist-item-img-wrapper-action-icon3"></i>
                        </div>
                        <div class="option-all__playlist-item-img"
                            style="background-image: url(${array.thumbnail});"></div>
                        </div>
                        <div class="option-all__playlist-item-content">
                            <div
                                class="option-all__playlist-item-content-name1 js__main-color white-color">
                                    ${array.title}</div>
                            <div class="option-all__playlist-item-content-name2 js__sub-color">Nhiều ca sĩ</div>
                        </div>
                 </li>
            </div>`;
  });
  document.querySelector(".top100").innerHTML = html.join("");
};

const renderArtists = (arrays) => {
  let html = arrays.map((array, i) => {
    return `<div class="col l-2-4 m-4 s-6 mobile-margin-bot-30px" key=${array.artists[0].id}>
                <li class="option-all__playlist-item option-all__playlist-item-margin_top">
                    <div
                        class="option-all__playlist-item-img-wrapper option-all__playlist-item-img-wrapper-mv">
                        <div class="option-all__playlist-item-img-wrapper-action">
                            <i
                                class="fas fa-play option-all__playlist-item-img-wrapper-action-icon2"></i>    
                        </div>
                        <div class="option-all__playlist-item-img option-all__playlist-item-img-singer"
                            style="background-image: url(${array.artists[0].thumbnail});"></div>
                    </div>
                    <div class="option-all__playlist-item-content-singer">
                        <div class="option-all__playlist-item-content-singer-name1 js__main-color">
                            ${array.artists[0].name}</div>
                        <div class="option-all__playlist-item-content-singer-name2 js__sub-color">
                            ${array.artists[0].totalFollow} quan tâm</div>
                        <div class="option-all__playlist-item-content-singer-profile">
                            <i class="fas fa-random js__main-color"></i>
                            <span class="js__main-color">Góc nhạc</span>
                        </div>
                    </div>
                </li>
            </div>`;
  });
  document.querySelector(".artists").innerHTML = html.join("");
};

const renderPodcast = (arrays) => {
  let html = arrays.map((array, i) => {
    return `
  <div class="col l-4 m-4 s-12 mobile-margin-bot-30px" key=${array.id}>
    <li class="option-all__playlist-item">
      <div class="option-all__playlist-item-img-wrapper">
        <div class="option-all__playlist-item-img-wrapper-action">
          <i class="fas fa-play option-all__playlist-item-img-wrapper-action-icon2"></i>
        </div>
        <div class="option-all__playlist-item-img option-all__playlist-item-img-mv" style="background-image: url(${array.thumbnail});"></div>
      </div>
      <div class="option-all__playlist-item-content-mv">
        <div class="option-all__playlist-item-content-name">
          <div class="option-all__playlist-item-content-name1 js__main-color">${array.title}</div>
        </div>
      </div>
    </li>
  </div>
`;
  });
  document.querySelector(".podcast").innerHTML = html.join("");
};

const renderZingChart = (arrays) => {
  let html = arrays.map((array, i) => {
    const encodeId = array.encodeId;
    return `
                <li class="songs-item">
                    <div class="songs-item-left" onclick="handleSong('${encodeId}')">
                        <span class="zingchart__item-left-stt ${
                          i == 0
                            ? "zingchart__item-first"
                            : i == 1
                            ? "zingchart__item-second"
                            : i == 2
                            ? "zingchart__item-third"
                            : ""
                        }">${i + 1}</span>
                        <span class="zingchart__item-left-line js__main-color">-</span>
                        <div style="background-image: url(${
                          array.thumbnail
                        });" class="songs-item-left-img">
                            <div class="songs-item-left-img-playbtn"><i class="fas fa-play"></i></div>
                            <div class="songs-item-left-img-playing-box">
                                <img class = "songs-item-left-img-playing" src="./assets/img/songs/icon-playing.gif" alt="playing">
                            </div>
                        </div>

                        <div class="songs-item-left-body">
                            <h3 class="songs-item-left-body-name js__main-color">${
                              array.title
                            }</h3>
                            <span class="songs-item-left-body-singer js__sub-color">${
                              array.artistsNames
                            }</span>
                        </div>
                    </div>
                    <div class="songs-item-center tablet-hiden mobile-hiden js__sub-color">
                        <span>${array.name} (Remix)</span>
                    </div>
                    <div class="songs-item-right mobile-hiden">
                        <span class="songs-item-right-mv ipad-air-hiden"><i class="fas fa-photo-video js__main-color"></i></span>
                        <span class="songs-item-right-lyric ipad-air-hiden"><i class="fas fa-microphone js__main-color"></i></span>
                        <span class="songs-item-right-tym">
                            <i class="fas fa-heart songs-item-right-tym-first"></i>
                            <i class="far fa-heart songs-item-right-tym-last"></i>
                        </span>
                        <span class="songs-item-right-duration js__sub-color">${formatTime(
                          array.duration
                        )}</span>
                        <div class="songs-item-right hoverable"> <!-- Thêm class "hoverable" -->
                            <span class="songs-item-right-more js__main-color add_Song"><i class="fas fa-ellipsis-h"></i></span>
                            <div class="dropdown">
                              <div class="dropdown-options">
                                <button class="btn_add" onclick="toggleFormSong('${encodeId}')">Add to playlist</button>
                              </div>
                            </div>
                        </div>
                    </div>
                </li>`;
  });
  document.querySelector(".js__zingchart__list").innerHTML = html.join("");
};

const renderZingChartMore = (arrays) => {
  renderZingChart(arrays);
};

const moreButton = document.querySelector(".zingchart__100more-body");
moreButton.addEventListener("click", () => {
  if (isMoreVisible) {
    isMoreVisible = false;
    moreButton.textContent = "Ẩn đi";
    renderZingChartMore(arraysForMore);
  } else {
    isMoreVisible = true;
    moreButton.textContent = "Xem thêm";
    renderZingChart(arraysForMore.slice(0, 10));
  }
});

const renderWeekChart = (arrays, containerSelector) => {
  const container = document.querySelector(containerSelector);
  let html = arrays.map((array, index) => {
    const encodeId = array.encodeId;
    return `
        <li class="zingchart-week__item" key=${index} onclick="handleSong('${encodeId}')">
          <div class="zingchart-week__item-left">
            <span class="zingchart__item-left-stt zingchart-week__item-left-stt">${
              index + 1
            }</span>
            <span class="zingchart__item-left-line zingchart-week__item-left-line">-</span>
          </div>
          <div class="zingchart-week__item-center">
            <img src="${
              array.thumbnail
            }" alt="anh" class="zingchart-week__item-center-img">
            <div class="zingchart-week__item-center-content">
              <span class="js__main-color zingchart-week__item-center-content-name">${
                array.title
              }</span>
              <span class="js__main-color zingchart-week__item-center-content-singer">${
                array.artistsNames
              }</span>
            </div>
          </div>
          <div class="zingchart-week__item-right mobile-hiden js__main-color">${formatTime(
            array.duration
          )}</div>
        </li>
      `;
  });
  container.innerHTML = html.join("");
};

const renderSelected = (arrays) => {
  const selectedContainer = document.querySelector(".selected");
  selectedContainer.removeEventListener("click", handleRadioClick);

  const html = arrays.map((arr) => {
    return `
    <div class="selected_content">
      <input type="radio" value="${arr.PlaylistName}" name="playlist" id="${arr.PlaylistID}"/>
      <label for="${arr.PlaylistName}">${arr.PlaylistName}</label>
    </div>`;
  });

  selectedContainer.innerHTML = html.join("");
  const radioButtons = selectedContainer.querySelectorAll(
    'input[type="radio"]'
  );
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", handleRadioClick);
  });
};

function handleRadioClick(event) {
  const selectedValue = event.target.value;
  const playlistId = event.target.id;
  selectedPlaylist = selectedValue;
  selectedPlaylistId = playlistId;
  console.log("Selected Playlist:", selectedPlaylist);
}

// Function Handler for song events

document.querySelector(".music-control__left").onclick = function () {
  document.querySelector(".mobile-player").classList.add("active");
};

document.querySelector(".mobile-player__headding-close").onclick = function () {
  document.querySelector(".mobile-player").classList.remove("active");
};

const handleSong = async (encodeId) => {
  const response = await fetch(`http://localhost:8090/song/${encodeId}`);
  const results = await response.json();

  const lyrics = results.mergedData;
  const details = results.details;
  const url = results.url;

  loadSong(details, url);

  const lyricElement = document.querySelector(".lyric");

  lyricElement.innerHTML = "";

  lyrics.forEach((lyric) => {
    const p = document.createElement("p");
    p.textContent = lyric.data;
    lyricElement.appendChild(p);
  });
};

const displayTime = (time) => {
  const duration = formatTime(time);
  document.querySelector(
    ".mobile-player__ctrl-progress-time-duration"
  ).textContent = duration;
  document.querySelector(
    ".js__music-control__progress-time-duration"
  ).textContent = duration;
};

const displayRemainTime = () => {
  remainTime.textContent = formatTime(audio.currentTime);

  document.querySelector(
    ".mobile-player__ctrl-progress-time-start"
  ).textContent = formatTime(audio.currentTime);
};

const loadSong = async (details, url) => {
  audio.src = url;
  displayTime(details.duration);
  songName.textContent = details.title;
  document.querySelector(".mobile-player__body-now-name").textContent =
    details.title;
  singerName.textContent = details.artistsName;
  document.querySelector(".mobile-player__body-now-singer").textContent =
    details.artistsName;
  document.querySelector(
    ".mobile-player__body-thumb"
  ).style.backgroundImage = `url('${details.thumbnail}')`;
  document.querySelector(
    ".music-control__left-img"
  ).style.backgroundImage = `url('${details.thumbnail}')`;

  audio.play();
};

const handleAudio = () => {
  audio.addEventListener("play", () => {
    isPlaying = true;
    cdThumbAnimate.play();
    cdThumbAnimateMobile.play();

    playBtn.classList.add("music-control__icon-play--active");
    document
      .querySelector(".js__mobile-player__ctrl-icon")
      .classList.add("music-control__icon-play--active");
    thumbPlayerBox.style.transform = "translateX(20px)";
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    cdThumbAnimate.pause();
    cdThumbAnimateMobile.pause();

    playBtn.classList.remove("music-control__icon-play--active");
    document
      .querySelector(".js__mobile-player__ctrl-icon")
      .classList.remove("music-control__icon-play--active");
    thumbPlayerBox.style.transform = "translateX(0)";
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
      document.querySelector("#progress2").value = progressPercent;
    }
    displayRemainTime();
  });

  audio.addEventListener("change", (e) => {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
  });

  audio.addEventListener("ended", () => {
    if (isRepeat) {
      audio.currentTime = 0;
      audio.play();
    }
  });

  document.querySelector("#progress").addEventListener("change", (e) => {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
  });

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  });

  document
    .querySelector(".js__mobile-player__ctrl-icon")
    .addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

  volumeIcon.addEventListener("click", () => {
    isMute = !isMute;
    volumeIcon.classList.toggle("music-control__right--active", isMute);
    if (isMute) {
      audio.volume = 0;
      volumeProgress.value = 0;
    } else {
      audio.volume = volume / 100;
      volumeProgress.value = volume;
    }
  });

  volumeProgress.addEventListener("change", (e) => {
    volume = e.target.value;
    audio.volume = e.target.value / 100;
    if (e.target.value == 0) {
      volumeIcon.classList.add("music-control__right--active");
      isMute = true;
    } else {
      volumeIcon.classList.remove("music-control__right--active");
      isMute = false;
    }
  });

  repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    isRandom = false;

    repeatBtn.classList.toggle("music-control__icon-repeat--active", isRepeat);

    if (isRepeat) {
      repeatBtn.style.color = "var(--primary-color)";
    } else {
      repeatBtn.style.color = "";
    }
    // randomBtn.classList.toggle(
    //   "music-control__icon-random--active",
    //   isRandom
    // );
  });

  document
    .querySelector(".js__mobile-player__ctrl-icon5")
    .addEventListener("click", () => {
      isRepeat = !isRepeat;
      isRandom = false;

      document
        .querySelector(".js__mobile-player__ctrl-icon5")
        .classList.toggle("music-control__icon-repeat--active", isRepeat);

      // document.querySelector(".js__mobile-player__ctrl-icon1").classList.toggle(
      //   "music-control__icon-random--active",
      //   isRandom
      // );
    });
};

const handleCRUD = () => {
  document
    .querySelector(".btn_create_playlist")
    .addEventListener("click", async () => {
      const playlistName = document.querySelector(".playlistName").value;

      if (playlistName.trim() !== "") {
        const request = await fetch("http://localhost:8090/playlist", {
          method: "POST",
          body: JSON.stringify({ playlistName }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      }
    });
};

const toggleFormSong = (encodeId) => {
  const form = document.querySelector(".hidden-form");
  // const encodeId = element.getAttribute("data-encode-id");
  if (form) {
    if (!isFormVisible) {
      form.style.display = "block";
      isFormVisible = true;
    } else {
      form.style.display = "none";
      isFormVisible = false;
    }

    currentEncodeId = encodeId;

    const submitBtn = form.querySelector(".submit_btn");
    if (!submitBtn.hasEventListener) {
      submitBtn.addEventListener("click", () => {
        handleSubmit(currentEncodeId);
      });
      submitBtn.hasEventListener = true;
    }
  }
};

const handleSubmit = async (id) => {
  console.log(id);
  const response = await fetch(`http://localhost:8090/song/${id}`);
  const results = await response.json();

  const body = {
    playlistId: selectedPlaylistId,
    songName: results.details.title,
    thumbnail: results.details.thumbnail,
    url: results.url,
    duration: formatTime(results.details.duration),
    artist: results.details.artistsName,
    encodeId: id,
  };

  console.log(body);

  if (Object.keys(body).length > 0) {
    const request = await fetch("http://localhost:8090/song", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const form = document.querySelector(".hidden-form");
        form.style.display = "none";
      });
  }
};

const toggleFormClose = () => {
  const form = document.querySelector(".hidden-form");
  if (!isFormVisible) {
    form.style.display = "block";
    isFormVisible = true;
  } else {
    form.style.display = "none";
    isFormVisible = false;
  }
};

const renderSongsFromPlaylist = async (id) => {
  const response = await fetch(`http://localhost:8090/playlist/${id}`);
  const result = await response.json();
  console.log(result[0]);
  await renderSong(result[0]);
};

const renderSong = (arrays) => {
  let html = arrays.map((array, index) => {
    return `
     <li class="nextsong__last-item nextsong__item" data-index="${index}" onclick="handleSong('${array.EncodeID}')">
        <div class="nextsong__item-img" style="background-image: url(${array.Thumbnail});">
            <div class="nextsong__item-playbtn"><i class="fas fa-play"></i></div>
        </div>
        <div class="nextsong__item-body">
            <span class="nextsong__item-body-heading js__main-color">${array.SongName}</span>
            <span class="nextsong__item-body-depsc js__sub-color">${array.Artists}</span>
        </div>
        <div class="nextsong__item-action">
            <span class="nextsong__item-action-heart">
                <i class="fas fa-heart nextsong__item-action-heart-icon1"></i>
                <i class="far fa-heart nextsong__item-action-heart-icon2"></i>
            </span>
            <span class="nextsong__item-action-dot js__main-color">
                <i class="fas fa-ellipsis-h "></i>
            </span>
        </div>
    </li>`;
  })

  document.querySelector(".nextsong__last-list").innerHTML = html.join("");
}

handleCRUD();
handleAudio();
start();
