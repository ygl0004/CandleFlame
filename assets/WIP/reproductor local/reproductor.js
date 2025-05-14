// REPRODUCTOR DE MÚSICA MEJORADO
const musicPlayer = {
    player: document.getElementById("music-player"),
    playPauseBtn: document.getElementById("play-pause"),
    prevTrackBtn: document.getElementById("prev-track"),
    nextTrackBtn: document.getElementById("next-track"),
    nowPlaying: document.getElementById("now-playing"),
    audioElement: document.getElementById("audio-element"),
    progressBar: document.querySelector(".progress-bar"),
    progressContainer: document.querySelector(".progress-container"),

    playlist: [
      {
        name: "All Eyes On Us",
        artist: "Lenno",
        src: "assets/media/audio/All-Eyes-On-Us.mp3",
      },
    ],

    currentTrackIndex: 0,
    isPlaying: false,
    audioEnabled: false,
    interactionTimeout: null,
    isHovering: false,

    init() {
      // Configuración inicial
      this.audioElement.volume = 0.5;
      this.audioElement.muted = true;
      this.loadTrack(this.currentTrackIndex);
      this.minimizePlayer(); // Empieza minimizado

      // Detectar si es móvil
      this.isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

      // Mostrar botón de activación en móviles
      if (this.isMobile) {
        this.showMobileActivation();
      }

      // Event listeners
      this.playPauseBtn.addEventListener("click", (e) => this.handlePlayPause(e));
      this.prevTrackBtn.addEventListener("click", () => this.prevTrack());
      this.nextTrackBtn.addEventListener("click", () => this.nextTrack());
      this.audioElement.addEventListener("timeupdate", () => this.updateProgress());
      this.audioElement.addEventListener("ended", () => this.nextTrack());
      this.progressContainer.addEventListener("click", (e) => this.seek(e));

      // Eventos para mostrar/ocultar el reproductor
      this.player.addEventListener("mouseenter", () => {
        this.isHovering = true;
        this.showPlayer();
        this.resetInteractionTimeout();
      });
      
      this.player.addEventListener("mouseleave", () => {
        this.isHovering = false;
        if (this.isPlaying) {
          this.startInteractionTimeout();
        }
      });

      // Permitir activación con cualquier click en la página
      document.addEventListener("click", () => this.enableAudio(), { once: true });
    },

    showMobileActivation() {
      this.player.classList.add("requires-activation");
      const activateBtn = document.createElement("button");
      activateBtn.className = "activate-audio-btn";
      activateBtn.innerHTML = "🔊 Activar audio";
      activateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.enableAudio();
        activateBtn.remove();
        this.player.classList.remove("requires-activation");
      });
      this.player.appendChild(activateBtn);
    },

    enableAudio() {
      this.audioElement.muted = false;
      this.audioEnabled = true;
      this.showPlayerTemporarily();
      
      // Mostrar notificación de audio activado
      const notification = document.createElement("div");
      notification.className = "notification show";
      notification.innerHTML = '<i class="fas fa-volume-up"></i> Audio activado';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    },

    handlePlayPause(e) {
      e.stopPropagation();

      if (!this.audioEnabled && this.isMobile) {
        this.showActivationMessage();
        return;
      }

      this.togglePlay();
      this.showPlayerTemporarily();
    },

    showActivationMessage() {
      const notification = document.createElement("div");
      notification.className = "notification show";
      notification.innerHTML = '<i class="fas fa-info-circle"></i> Activa el audio primero';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 2000);
    },

    loadTrack(index) {
      const track = this.playlist[index];
      this.audioElement.src = track.src;
      this.nowPlaying.textContent = `${track.name} • ${track.artist}`;
      this.audioElement.load();

      if (this.isPlaying) {
        this.playAudio();
      }
    },

    togglePlay() {
      if (this.isPlaying) {
        this.pauseAudio();
      } else {
        this.playAudio();
      }
    },

    playAudio() {
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.updateButton();
          this.startInteractionTimeout();
          this.playPauseBtn.classList.add("playing");
        })
        .catch(e => {
          console.error("Error de reproducción:", e);
          if (!this.audioEnabled) {
            this.showActivationMessage();
          }
        });
    },

    pauseAudio() {
      this.audioElement.pause();
      this.isPlaying = false;
      this.updateButton();
      this.playPauseBtn.classList.remove("playing");
    },

    updateButton() {
      const icon = this.playPauseBtn.querySelector("i");
      icon.className = this.isPlaying ? "fas fa-pause" : "fas fa-play";
    },

    prevTrack() {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(this.currentTrackIndex);
      this.showPlayerTemporarily();
    },

    nextTrack() {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
      this.loadTrack(this.currentTrackIndex);
      this.showPlayerTemporarily();
    },

    updateProgress() {
      if (this.audioElement.duration) {
        const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
      }
    },

    seek(e) {
      const width = this.progressContainer.clientWidth;
      const clickX = e.offsetX;
      const duration = this.audioElement.duration;
      this.audioElement.currentTime = (clickX / width) * duration;
    },

    showPlayer() {
      this.player.style.animation = 'none';
      this.player.style.transition = 'none';
      this.player.classList.remove("minimized");
      this.resetInteractionTimeout();
    },

    minimizePlayer() {
      if (!this.isHovering) {
        this.player.style.transition = 
          'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), ' +
          'opacity 0.3s ease';
        this.player.classList.add("minimized");
      }
    },

    showPlayerTemporarily() {
      this.showPlayer();
      if (this.isPlaying) {
        this.startInteractionTimeout();
      }
    },

    startInteractionTimeout() {
      this.resetInteractionTimeout();
      this.interactionTimeout = setTimeout(() => {
        if (this.isPlaying && !this.isHovering) {
          this.minimizePlayer();
        }
      }, 5000);
    },

    resetInteractionTimeout() {
      if (this.interactionTimeout) {
        clearTimeout(this.interactionTimeout);
        this.interactionTimeout = null;
      }
    }
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("music-player")) {
    musicPlayer.init();
  }
});