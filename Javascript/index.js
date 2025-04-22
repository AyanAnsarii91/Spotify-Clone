// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio("Assets/Music/1.mp3");
let masterPlay = document.getElementById("masterPlay");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let masterSongName = document.getElementById("masterSongName");
let songItems = Array.from(document.getElementsByClassName("songItem"));

let songs = [
  {
    songName: "Let Me Love You",
    filePath: "Assets/Music/1.mp3",
    coverPath: "Assets/Images/1.jpg",
  },
  {
    songName: "On My Way",
    filePath: "Assets/Music/2.mp3",
    coverPath: "Assets/Images/2.jpg",
  },
  {
    songName: "Faded",
    filePath: "Assets/Music/3.mp3",
    coverPath: "Assets/Images/3.jpg",
  },
  {
    songName: "Darkside",
    filePath: "Assets/Music/4.mp3",
    coverPath: "Assets/Images/4.jpg",
  },
  {
    songName: "Spectre",
    filePath: "Assets/Music/5.mp3",
    coverPath: "Assets/Images/5.jpg",
  },
  {
    songName: "Alone",
    filePath: "Assets/Music/6.mp3",
    coverPath: "Assets/Images/6.jpg",
  },
  {
    songName: "Ignite",
    filePath: "Assets/Music/7.mp3",
    coverPath: "Assets/Images/7.jpg",
  },
  {
    songName: "On & On",
    filePath: "Assets/Music/8.mp3",
    coverPath: "Assets/Images/8.jpg",
  },
];

// Update song items (cover images and names)
songItems.forEach((element, i) => {
  element.getElementsByTagName("img")[0].src = songs[i].coverPath;
  element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Handle Pause and Play
masterPlay.addEventListener("click", () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    masterPlay.src = "Assets/svgs/pause.svg"; // Change to pause icon
    gif.style.opacity = 1;
  } else {
    audioElement.pause();
    masterPlay.src = "Assets/svgs/play.svg"; // Change back to play icon
    gif.style.opacity = 0;
  }
});

// Handle Progress Bar
audioElement.addEventListener("timeupdate", () => {
  let progress = parseInt(
    (audioElement.currentTime / audioElement.duration) * 100
  );
  myProgressBar.value = progress;
});

myProgressBar.addEventListener("change", () => {
  audioElement.currentTime =
    (myProgressBar.value * audioElement.duration) / 100;
});

// Reset all play buttons to play
const makeAllPlays = () => {
  Array.from(document.getElementsByClassName("songItemPlay")).forEach(
    (element) => {
      element.src = "Assets/svgs/play.svg"; // Set all play icons to play
    }
  );
  gif.style.opacity = 0;
};

// Add event listeners to each play button
Array.from(document.getElementsByClassName("songItemPlay")).forEach(
  (element, i) => {
    element.addEventListener("click", (e) => {
      // If the current song is playing, pause it
      if (!audioElement.paused && songIndex === i) {
        // Pause the audio
        audioElement.pause();
        // Change the button icon to play
        e.target.src = "Assets/svgs/play.svg";
        masterPlay.src = "Assets/svgs/play.svg"; // Change master button icon to play
        gif.style.opacity = 0; // Hide the gif
      } else {
        // Otherwise, play the selected song
        makeAllPlays(); // Reset all play icons to play
        songIndex = i; // Update songIndex when a song is clicked
        e.target.src = "Assets/svgs/pause.svg"; // Change clicked button to pause icon
        masterSongName.innerText = songs[songIndex].songName; // Set master song name
        audioElement.src = songs[songIndex].filePath; // Update audio source
        audioElement.currentTime = 0; // Reset audio to the beginning
        audioElement.play(); // Play the selected song
        masterPlay.src = "Assets/svgs/pause.svg"; // Change master play button to pause icon
        gif.style.opacity = 1; // Show the gif
      }
    });
  }
);

// Previous Button functionality
document.getElementsByClassName("previous")[0].addEventListener("click", () => {
  songIndex -= 1;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  masterPlay.src = "Assets/svgs/pause.svg";
  gif.style.opacity = 1;
});

// Next Button functionality
document.getElementsByClassName("next")[0].addEventListener("click", () => {
  songIndex += 1;
  if (songIndex >= songs.length) {
    songIndex = 0;
  }
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  masterPlay.src = "Assets/svgs/pause.svg";
  gif.style.opacity = 1;
});
