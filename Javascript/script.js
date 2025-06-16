let currentSong = new Audio();
let songs;
let currFolder;
let div = document.createElement("div");
let Anchors = div.getElementsByTagName("a");
let cardContainer = document.querySelector(".cardContainer");

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    
    let songUl = document.querySelector(".songList ul");
    songUl.innerHTML = "";
    
    for (const song of songs) {
        songUl.innerHTML += `<li>
            <img src="IMG/music.svg" alt=""/>
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Harry</div>
            </div>
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="IMG/play.svg" alt=""/>
            </div>
        </li>`;
    }
    
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + encodeURIComponent(track);
    if (!pause) {
        currentSong.play();
        document.querySelector("#play").src = "IMG/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURIComponent(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    
    // Reset seek bar when new song starts
    document.querySelector(".seekbar").style.setProperty('--seek-before-width', '0%');
    document.querySelector(".circle").style.left = '0%';
};

async function displayAlbums() {
    let a = await fetch(`/Songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let Anchors = div.getElementsByTagName("a");
    let array = Array.from(Anchors);
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs/") && !e.href.endsWith("/Songs/")) {
            let folder = e.href.split("/").slice(-2, -1)[0];
            try {
                let a = await fetch(`/Songs/${folder}/info.json`);
                let response = await a.json();
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45">
                            <circle cx="12" cy="12" r="12" fill="#1fdf64"/>
                            <path d="M9 7l8 5-8 5z" fill="#000000"/>
                        </svg>
                    </div>
                    <img src="/Songs/${folder}/cover.jpeg" alt="${response.title}"/>
                    <h2>${response.title}</h2>
                    <p>${response.description || response.Discription || ""}</p>
                </div>`;
            } catch (error) {
                console.error(`Error loading info.json for ${folder}:`, error);
            }
        }
    }
    
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
        });
    });
}

async function main() {
    // Initialize seek bar
    document.querySelector(".seekbar").style.setProperty('--seek-before-width', '0%');
    document.querySelector(".circle").style.left = '0%';
    
    await getSongs("Songs/ncs");
    playMusic(songs[0], true);
    
    // Display all albums on the page
    await displayAlbums();
    
    // Play/Pause button
    document.querySelector("#play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "IMG/pause.svg";
            document.querySelector(".circle").style.opacity = "1";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "IMG/play.svg";
            document.querySelector(".circle").style.opacity = "0";
        }
    });
    
    // Time update handler
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = 
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        
        // Calculate percentage and update seek bar
        if (currentSong.duration) {
            const percentage = (currentSong.currentTime / currentSong.duration) * 100;
            document.querySelector(".seekbar").style.setProperty('--seek-before-width', `${percentage}%`);
            document.querySelector(".circle").style.left = `${percentage}%`;
        }
    });
    
    // Seek bar click handler
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        if (!currentSong.duration) return;
        
        const seekbar = e.currentTarget;
        const rect = seekbar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        const seekTime = (currentSong.duration * percentage) / 100;
        
        // Update UI immediately
        document.querySelector(".seekbar").style.setProperty('--seek-before-width', `${percentage}%`);
        document.querySelector(".circle").style.left = `${percentage}%`;
        
        // Update song time
        currentSong.currentTime = seekTime;
    });
    
    // Make circle visible when interacting with seekbar
    document.querySelector(".seekbar").addEventListener("mouseenter", () => {
        document.querySelector(".circle").style.opacity = "1";
    });
    
    document.querySelector(".seekbar").addEventListener("mouseleave", () => {
        if (!currentSong.paused) {
            document.querySelector(".circle").style.opacity = "0";
        }
    });
    
    // Song ended handler
    currentSong.addEventListener("ended", () => {
        document.querySelector("#play").src = "IMG/play.svg";
        document.querySelector(".circle").style.opacity = "1";
    });
}

// Navigation controls
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

document.querySelector("#previous").addEventListener("click", () => {
    if (!songs) return;
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
        playMusic(songs[index - 1]);
    }
});

document.querySelector("#next").addEventListener("click", () => {
    if (!songs) return;
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
    }
});

// Volume controls
document.querySelector(".volume img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg", "mute.svg");
        currentSong.volume = 0;
        document.querySelector(".volume input").value = 0;
    } else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg");
        currentSong.volume = 0.1;
        document.querySelector(".volume input").value = 10;
    }
});

document.querySelector(".volume input").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
    if (e.target.value == 0) {
        document.querySelector(".volume img").src = "IMG/mute.svg";
    } else {
        document.querySelector(".volume img").src = "IMG/volume.svg";
    }
});

// Initialize the app
main();