const cards = document.querySelector(".right-box-big-box");
const library_card = document.querySelector(".left-box-playlist-item");
const lower_bar_image = document.querySelector(".song-img");
const lower_bar_title = document.querySelector(".songname");
const audio = document.querySelector("#audio-player");
const start = document.querySelector(".start");
const progressbar = document.querySelector(".line");
const progresscircle = document.querySelector(".circle");
const progressgreenbar = document.querySelector(".green-bg");
const backwardBtn = document.querySelector(".svg-img-class");
const forwardBtn = document.querySelector(".forword");
const currentTimeSpan = document.querySelector(".current");
const totalTimeSpan = document.querySelector(".total");
const library_btn = document.querySelector(".back-svg");
const down_info = document.querySelector(".down-info");
const rightBox = document.querySelector(".right-box");
const librarySection = document.querySelector(".left-box");
const librarySectionTitle = document.querySelector(".library-title");
const singercardbox = document.querySelector(".right-singer-box");
const search_bar = document.querySelector(".search-bar");
const playlist = document.querySelector(".hamburger");
let query = "";

search_bar.addEventListener("click", (e) => {
  cards.classList.add("hidden");
  librarySection.classList.add("hidden");
  rightBox.classList.add("full-width");
  lower_bar_image.classList.add("hidden");
  rendercard();
});
playlist.addEventListener("click", () => {
  librarySection.classList.toggle("hidden");
});

window.addEventListener("DOMContentLoaded", () => {
  rendercard(); // ✅ First load par singers show honge
});

function rendercard() {
  singercardbox.innerHTML = ` <div class="right-singer-small-box  full-w">
            <div class="singer-heading1">Top Indian Singers</div>
            <div class="singer-heading2">All</div>
          </div>
          <div class="right-singers-box-card full-width" id="right-singers-box-card">
          </div>`;
  indianSingers60.forEach((singer) => {
    // console.log(singer);
    const singercardbox1 = document.getElementById("right-singers-box-card");
    singercardbox1.innerHTML += `
    <div class="right-singer-box-inner">
              <img
                src="${singer.image}"
                alt=""
                class="singer-img"
              />
              <div class="singer-name">${singer.name}</div>
            </div>
  `;
    // singercardbox.appendChild(singercardbox1);
  });

  singercardbox.querySelectorAll(".right-singer-box-inner").forEach((card) => {
    card.addEventListener("click", () => {
      const singerName = card.querySelector(".singer-name").textContent;
      query = singerName;
      cards.classList.remove("hidden");
      librarySection.classList.remove("hidden");
      rightBox.classList.remove("full-width");
      lower_bar_image.classList.remove("hidden");
      singercardbox.innerHTML = "";

      // ✅ Now call getdata() to load songs
      getdata();
    });
  });
}

let ispalying = false;
let currentIndex = 0;
let uniqueSongs = [];

// ⏱ Format Time
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

// ✅ Update Music Bar UI
function updateBottomCard(title, img, audiosrc) {
  lower_bar_image.src = img;
  lower_bar_title.textContent = title;
  audio.src = audiosrc;
  audio.play();
  ispalying = true;
  start.src = "pause.svg";
}
// ✅ Highlight playing song in library
function highlightCurrentLibraryCard(index) {
  document.querySelectorAll(".librayry-card").forEach((card, i) => {
    if (i === index) {
      card.classList.add("active-song");
    } else {
      card.classList.remove("active-song");
    }
  });
}

// ✅ Update via Index
function updateBottomCardByIndex(index) {
  const song = uniqueSongs[index];
  if (!song) return;
  updateBottomCard(song.trackName, song.artworkUrl100, song.previewUrl);
  currentIndex = index;
  highlightCurrentLibraryCard(index); // 🔥
}

// ▶️ Play / Pause Button
start.addEventListener("click", () => {
  if (!ispalying) {
    audio.play();
    ispalying = true;
    start.src = "pause.svg";
  } else {
    audio.pause();
    ispalying = false;
    start.src = "start.svg";
  }
});

// 🟢 Progressbar Update
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progresscircle.style.left = `calc(${percent}% - 8px)`;
  progressgreenbar.style.width = `${percent}%`;
  currentTimeSpan.textContent = formatTime(audio.currentTime);
});

// Total duration
audio.addEventListener("loadedmetadata", () => {
  totalTimeSpan.textContent = formatTime(audio.duration);
});

// ⏩ Seekbar click
progressbar.addEventListener("click", (e) => {
  const rect = progressbar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percent = clickX / rect.width;
  audio.currentTime = percent * audio.duration;
});

// ⏮ Back Button
backwardBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    updateBottomCardByIndex(currentIndex - 1);
  }
});

// ⏭ Forward Button
forwardBtn.addEventListener("click", () => {
  if (currentIndex < uniqueSongs.length - 1) {
    updateBottomCardByIndex(currentIndex + 1);
  }
});
function full_width() {
  search_bar.addEventListener("click", () => {
    rightBox.style.width = "100%";
  });
}
library_btn.addEventListener("click", () => {
  const isCollapsed = librarySection.style.width === "3vw";

  if (isCollapsed) {
    // Expand to original layout
    librarySection.style.width = "24%";
    rightBox.style.width = "75%";

    // Show elements
    library_card.style.display = "";
    down_info.style.display = "flex";
    librarySectionTitle.style.display = "block";
  } else {
    // Collapse layout
    librarySection.style.width = "3vw";
    rightBox.style.width = "95vw";

    // Hide elements
    library_card.style.display = "none";
    down_info.style.display = "none";
    librarySectionTitle.style.display = "none";
  }
  full_width();
  // Smooth transitions
  rightBox.style.transition = "width 0.3s ease";
  librarySection.style.transition = "width 0.3s ease";
});
async function getdata() {
  const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
    query.toLowerCase()
  )}&entity=song&country=IN&limit=100`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  // ✅ Remove duplicates
  const seen = new Set();
  uniqueSongs = data.results.filter((song) => {
    if (!song.previewUrl || seen.has(song.previewUrl)) return false;
    seen.add(song.previewUrl);
    return true;
  });

  // 🔳 UI Layout
  cards.innerHTML = `
    <div class="right-box-small-box1 fixed">
      <div class="right-box-1-heading">${query} songs</div>
      <div class="right-box-2-heading">Show all</div>
    </div>
    <div class="right-box-small-box2" id="song-cards"></div>
  `;
  const songCardsContainer = document.getElementById("song-cards");

  // 🎴 Cards
  uniqueSongs.forEach((song, i) => {
    const cardHTML = `
      <div class="card" data-index="${i}" data-audio="${song.previewUrl}">
        <div class="animation-box1">
          <img src="play-button.png" alt="" class="animation-svg" />
        </div>
        <img src="${song.artworkUrl100}" alt="" class="card-img" />
        <p class="heading1">${song.trackName}</p>
        <p class="heading2">${song.artistName} - ${song.collectionName}</p>
      </div>
    `;
    songCardsContainer.innerHTML += cardHTML;
  });

  // 🖱 Card click
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.index);
      updateBottomCardByIndex(index);
    });
  });

  // 📚 Library Sidebar
  let libraryHTML = "";
  uniqueSongs.forEach((song, i) => {
    libraryHTML += `
      <div class="librayry-card" data-index="${i}" data-audio="${
      song.previewUrl
    }">
        <div>${i + 1}</div>
        <img src="${song.artworkUrl100}" class="library-img" />
        <div class="title-track">${song.trackName}</div>
      </div>
    `;
  });
  library_card.innerHTML = libraryHTML;

  // 🖱 Library click
  document.querySelectorAll(".librayry-card").forEach((libCard) => {
    libCard.addEventListener("click", () => {
      const index = Number(libCard.dataset.index);
      updateBottomCardByIndex(index);
    });
  });
}

getdata();
