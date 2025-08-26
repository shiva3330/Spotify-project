console.log("Lets get started");

let songs
let currentSong = new Audio();
let currFolder;

function sectomin(seconds) {
  if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }
  const minutes = Math.floor(seconds / 60)
  const remainingseconds = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(1, '0')
  const formattedSeconds = String(remainingseconds).padStart(2, '0')
  
  return `${formattedMinutes}:${formattedSeconds}`
}

async function getsongs(folder) {
  currFolder = folder
  let response = await fetch(`${folder}`);
  let data = await response.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
  songs = []
  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  }
  
  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUl.innerHTML = ""
  let a = await fetch(`${folder}/info.json`)
  let ab = await a.json()
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li>
    <div class = "info">
    <div style = "display:none">${decodeURI(song)}</div>
    <div>${decodeURI(song).replaceAll(".mp3","")}</div>
    <span class ="artist">${ab.title}</span>
    </div>
    <img src="assets/play.png"></li>`
    partist.innerHTML = ab.title
    document.getElementById("ppartist").innerHTML = ab.title
    playimg.src = `${folder}/cover.jpg`
    playingimg.src = `${folder}/cover.jpg`
  } 
  
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).
    forEach(e => {e.addEventListener("click",() => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    })
  
  return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track
  if (!pause) {
    currentSong.play()
    playbutton.src = "assets/pause.png"
    playb.src = "assets/pause.png"
  }
  document.querySelector("#psong").innerHTML = decodeURI(track).replace(".mp3","")
  document.querySelector("#ppsong").innerHTML = decodeURI(track).replace(".mp3", "")
  
}


async function displayAlbums() {
  
  let section = document.querySelector(".section")
  let a = await fetch("songs/")
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index]; 
    if (e.href.includes("songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`songs/${folder}/info.json`)
      let response = await a.json()
      section.innerHTML = section.innerHTML + `<div data-folder="${folder}" class="album">
      <img src="songs/${folder}/cover.jpg" alt="" id="song-img" />
      <img src="assets/play.png" alt="" id="play-butt" />
      <span id="albumname">${response.title}</span>
      <span id="albuminfo">${response.description}</span>
      </div>`
    }
  }

  Array.from(document.getElementsByClassName("album")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      document.querySelector(".left").style.left = "5px"
      playMusic(songs[0])
    })
  })
}

async function main() {
  await getsongs("songs/1-Melodies");
  playMusic(songs[0], true)
  await displayAlbums()
  
  playbutton.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        playbutton.src = "assets/pause.png"
    }
    else {
      currentSong.pause()
      playbutton.src = "assets/play.png"
    }
  })

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index+1])
      playbutton.src = "assets/pause.png"
    }
  })
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) { 
      playMusic(songs[index - 1]);
      playbutton.src = "assets/pause.png"
    }
  })
  
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector("#songtime").innerHTML = `${sectomin(currentSong.currentTime)}`
    document.querySelector("#songtime1").innerHTML = `${sectomin(currentSong.duration)}`
  })
  currentSong.addEventListener("timeupdate", () => {
    seeker.value = (currentSong.currentTime / currentSong.duration) * 100;
  })
  seeker.addEventListener("change", () => {
    currentSong.currentTime = seeker.value * currentSong.duration / 100;
  })
  volumec.addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100
    if (volumec.value == 0) {
      volume.src = "assets/mute.png"
    }
    else {
      volume.src = "assets/volume.png"
    }
  })
  volume.addEventListener("click", (e) => {
    if (e.target.src.includes("assets/volume.png")) {
      e.target.src = e.target.src.replace("assets/volume.png", "assets/mute.png")
      currentSong.volume = 0;
      volumec.value = 0;
    }
    else {
      e.target.src = e.target.src.replace("assets/mute.png","assets/volume.png")
      volumec.value = 10;
      currentSong.volume = .10;
    }
  })
  expand.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
    else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  })
  shuffle.addEventListener("click", () => {
    shuffle.style.backgroundColor = "gray"
  })
  repeat.addEventListener("click", () => {
    repeat.style.backgroundColor = "gray"
  })

  
  // for mobile player
  playb.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      playb.src = "assets/pause.png"
    }
    else {
      currentSong.pause()
      playb.src = "assets/play.png"
    }
  })
  nextb.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index+1])
      playb.src = "assets/pause.png"
    }
  })
  previousb.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) { 
      playMusic(songs[index - 1]);
      playb.src = "assets/pause.png"
    }
  })
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector("#psongtime").innerHTML = `${sectomin(currentSong.currentTime)}`
    document.querySelector("#psongtime1").innerHTML = `${sectomin(currentSong.duration)}`
  })
  currentSong.addEventListener("timeupdate", () => {
    pseeker.value = (currentSong.currentTime / currentSong.duration) * 100;
  })
  pseeker.addEventListener("change", () => {
    currentSong.currentTime = pseeker.value * currentSong.duration / 100;
  })
  document.getElementById("spotify").addEventListener("click", () => {
    document.querySelector(".left").style.left = "5px"
  })
  document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%"
  })
  home.addEventListener("click", () => {
    document.querySelector(".phoneplayer").style.visibility = "hidden"
  })
  document.querySelector(".songinfo").addEventListener("click", () => {
    document.querySelector(".phoneplayer").style.visibility = "visible"
  })
}

main();