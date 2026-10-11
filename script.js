(function () {
    var root = document.documentElement;
    var btn = document.getElementById('toggle');
    if (!btn) return;
    function isLight() { return root.getAttribute('data-theme') === 'light'; }
    btn.setAttribute('aria-pressed', isLight());
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var next = isLight() ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        btn.setAttribute('aria-pressed', next === 'light');
        try { localStorage.setItem('theme', next); } catch (err) { }
    });
})();


    (() => {
  const root = document.getElementById('personalPlayer');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const audio = root.querySelector('#playerAudio');
  const play = root.querySelector('#ppPlay');
  const seek = root.querySelector('#ppSeek');
  const current = root.querySelector('#ppCurrent');
  const duration = root.querySelector('#ppDuration');
  const volume = root.querySelector('#ppVolume');
  const mute = root.querySelector('#ppMute');
  const status = root.querySelector('#ppStatus');
  const playIcon = root.querySelector('#ppPlayIcon');

  const format = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  };

  const updatePlay = () => {
    const playing = !audio.paused;
    root.classList.toggle('is-playing', playing);
    play.setAttribute('aria-label',
      playing ? 'توقف موقت موسیقی' : 'پخش موسیقی');

    playIcon.innerHTML = playing
      ? '<path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor"/>'
      : '<path d="M8 5v14l11-7z" fill="currentColor"/>';

    status.textContent = playing ? 'در حال پخش' :
      (audio.ended ? 'پخش به پایان رسید' : 'آماده‌ی پخش');
  };

  play.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch (e) {
        status.textContent = 'لینک موسیقی را بررسی کن';
      }
    } else {
      audio.pause();
    }
    updatePlay();
  });

  audio.addEventListener('play', updatePlay);
  audio.addEventListener('pause', updatePlay);
  audio.addEventListener('ended', updatePlay);

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = format(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    current.textContent = format(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      seek.value = Math.round(audio.currentTime / audio.duration * 1000);
    }
  });

  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Number(seek.value) / 1000 * audio.duration;
    }
  });

  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    audio.muted = audio.volume === 0;
    mute.textContent = audio.muted ? '×' : '◖';
  });

  let previousVolume = Number(volume.value);

  mute.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolume || 0.75;
      volume.value = audio.volume;
    } else {
      previousVolume = audio.volume;
      audio.muted = true;
    }
    mute.textContent = audio.muted ? '×' : '◖';
  });

  audio.volume = Number(volume.value);

  audio.addEventListener('error', () => {
    status.textContent = 'فایل موسیقی در دسترس نیست';
  });
})();
