class song {
  constructor(poster, name, artist, audio_path, href) {
    this.poster = poster;
    this.name = name;
    this.artist = artist;
    this.audio = new Audio(audio_path);
    this.path = audio_path;
    this.href = href;
  }
}

const bshuffle = document.getElementById("b-shuffle");
const cshuffle = document.getElementById("c-shuffle");
const pause = document.getElementById("pause");
const play = document.getElementById("play");
const blike = document.getElementById("b-like");
const clike = document.getElementById("c-like");
const upper_container = document.getElementById("upper-container");
const pbar = document.getElementById("pbar");
const progress = document.querySelector(".progress");
const song_name = document.getElementById("song-name");
const artist = document.getElementById("artist");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");
const download = document.getElementById("download");
const left = document.querySelector("#left");
const share = document.getElementById("share");
const mute = document.getElementById("mute");
const speaker = document.getElementById("speaker");
let prev = 0;

const songs = [
  new song(
    "./img/default.png",
    "Chand Si Mehbooba",
    "Mukesh",
    "./audio/chand_si_mehbooba.mp3",
    'https://youtu.be/D1kvLhr0AW4?si=3o70MtKFje4LaJ8E'
    ),
    new song(
      "./img/kya_khoob_lagti_ho.jpg",
      "Kya Khoob Lagti Ho",
      "Mukesh",
      "./audio/kya_khoob_lagti_ho.mp3",
      'https://youtu.be/47qE1dlDIAg?si=b2xuGL_vmoN_EfCU'
    ),
  new song(
    "./img/legends_never_die.jpg",
    "Legends Never Die",
    "Monkey",
    "./audio/legends_never_die.mp3",
    'https://youtu.be/r6zIGXun57U?si=rXbsCO80MkFrisRi'
  ),
  new song(
    "./img/memories.jpg",
    "Memories",
    "Maroon 5",
    "./audio/memories.mp3",
    'https://youtu.be/SlPhMPnQ58k?si=ytUSWlbsNRee_jkA'
  ),
  new song(
    "./img/see_you_again.jpg",
    "See You Again",
    "Wiz Khalifa",
    "./audio/see_you_again.mp3",
    'https://youtu.be/RgKAFK5djSk?si=yHj-d_D-ilhb_Fc7'
  ),
  new song(
    "./img/sunflower.jpg",
    "Sunflower",
    "Post Malone",
    "./audio/sunflower.mp3",
    'https://youtu.be/ApXoWvfEYVU?si=aPKnub4Z_j4M0nOA'
  ),
  new song(
    "./img/till_i_collapse.jpeg",
    "Till I Collapse",
    "Eminem",
    "./audio/till_i_collapse.mp3",
    'https://youtu.be/ytQ5CYE1VZw?si=HHPBEbwJAQX-iHkJ'
  ),
  new song(
    "./img/valhalla.jpg",
    "Valhalla Calling Me",
    "Miracle Of Sound",
    "./audio/valhalla.mp3",
    'https://youtu.be/jxptIpCYAJA?si=X5db4lkTM5OwWh1Q'
  ),
];

if (localStorage.getItem("currSong") == null) {
  localStorage.setItem("currSong", "0");
}
let currSong = parseInt(localStorage.getItem("currSong")) % songs.length;
songs[currSong].audio.addEventListener("loadedmetadata", () => {
  let max = Math.round(songs[currSong].audio.duration);
  // console.log(max)

  let currentTime = 0,
    playing = false;
  function load() {
    const child = document.createElement("img");
    let min = Math.floor(max / 60);
    let sec = Math.floor(max % 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    child.id = "poster";
    child.src = songs[currSong].poster;
    upper_container.prepend(child);
    song_name.innerText = songs[currSong].name;
    artist.innerText = songs[currSong].artist;
    left.innerText = "0:00";
    document.querySelector("#right").innerText = `${min}:${sec}`;
  }

  function playSong() {
    if (playing) songs[currSong].audio.play().then();
    else songs[currSong].audio.pause();
  }

  function toggleClass(c1, c2) {
    c1.classList.toggle("hidden");
    c2.classList.toggle("hidden");
  }
  function change(pos) {
    playing = false;
    playSong();
    songs[currSong].audio.currentTime = 0;
    currSong = (currSong + pos + songs.length) % songs.length;
    max = songs[currSong].audio.duration;
    localStorage.setItem("currSong", currSong);
    upper_container.removeChild(upper_container.firstChild);
    load();
    playing = true;
    playSong();
    if (!play.classList.contains("hidden")) {
      toggleClass(play, pause);
    }
  }
  function check(ctime) {
    currentTime = songs[currSong].audio.currentTime;
    let percent = (currentTime * 100) / songs[currSong].audio.duration;
    pbar.style.width = percent + "%";
    if ((ctime - prev) / 1000 >= 0.99) {
      let min = Math.floor(currentTime / 60),
        sec = Math.floor(currentTime % 60);
      if (sec < 10) sec = "0" + sec;
      left.innerText = min + ":" + sec;
      prev = ctime;
    }
    if (percent >= 99.99) {
      change(1);
    }
    window.requestAnimationFrame(check);
  }
  window.requestAnimationFrame(check);
  load();

  download.addEventListener("click", () => {
    const anchor = document.createElement("a");
    anchor.href = songs[currSong].path;
    anchor.download = songs[currSong].name.split(" ").join("_") + ".mp3";
    // Trigger `click` event
    anchor.click();
  });

  share.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = songs[currSong].href;
    a.target = '_blank';
    a.click();
  });

  forward.addEventListener("click", () => {
    change(1);
  });

  backward.addEventListener("click", () => {
    change(-1);
  });
  progress.addEventListener("click", (e) => {
    let percent = Math.round(
      ((e.clientX - progress.offsetLeft) / progress.scrollWidth) * 100
    );
    pbar.style.width = percent + "%";
    max = Math.round(songs[currSong].audio.duration);
    songs[currSong].audio.currentTime = (percent * max) / 100;
    if (playing) playSong();
  });
  play.addEventListener("click", () => {
    toggleClass(play, pause);
    playing = true;
    playSong();
  });
  pause.addEventListener("click", () => {
    toggleClass(play, pause);
    playing = false;
    playSong();
  });
  cshuffle.addEventListener("click", () => {
    toggleClass(bshuffle, cshuffle);
    setTimeout(() => {
      toggleClass(bshuffle, cshuffle);
    }, 60);
    change(Math.floor(Math.random() * songs.length + 1));
  });
  blike.addEventListener("click", () => {
    toggleClass(blike, clike);
    songs[currSong].like = "c-like";
  });
  clike.addEventListener("click", () => {
    toggleClass(blike, clike);
    songs[currSong].like = "b-like";
  });

  mute.addEventListener('click', ()=>{
    toggleClass(mute, speaker);
    for(const song of songs)
      song.audio.muted = false;
  });

  speaker.addEventListener('click', ()=>{
    toggleClass(mute, speaker);
    for(const song of songs)
      song.audio.muted = true;
  });
});