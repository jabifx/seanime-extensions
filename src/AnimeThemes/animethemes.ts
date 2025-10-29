function init() {
    $ui.register((ctx) => {
        ctx.dom.onReady(async () => {
            ctx.screen.onNavigate(async (e) => {
                if (e.pathname !== "/entry") {const existingPlayer = await ctx.dom.queryOne("#anime-theme-player")
                    if (existingPlayer) existingPlayer.remove()
                    return
                }

                const anilistId = e.searchParams?.id
                if (!anilistId) {
                    console.log("No AniList ID found in params")
                    return
                }

                try {
                    const body = await ctx.dom.queryOne("body")
                    const script = await ctx.dom.createElement("script")

                    script.setText(`
                      (function() {
                        const ANILIST_ID = "${anilistId}";
                
                        const existingPlayer = document.getElementById("anime-theme-player");
                        if (existingPlayer) existingPlayer.remove();
                
                        const style = document.createElement("style");
                        style.textContent = \`@keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } @keyframes slideDown { from { max-height: 0; opacity: 0; } to { max-height: 180px; opacity: 1; } } @keyframes slideUp { from { max-height: 180px; opacity: 1; } to { max-height: 0; opacity: 0; } } .anime-theme-player { position: fixed; bottom: 20px; right: 20px; width: 380px; background: linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(20, 20, 20, 0.98)); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 0; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; max-height: 700px; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; overflow: hidden; user-select: none; } .anime-theme-player.minimized { width: 200px; height: 50px; padding: 0; cursor: pointer; border-radius: 12px; animation: none; } .anime-theme-player.dragging { cursor: grabbing; transition: none; } .player-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(0, 0, 0, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: move; user-select: none; } .player-title { font-size: 15px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 8px; user-select: none; } .header-controls { display: flex; gap: 8px; } .header-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .header-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .restore-btn { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 700; display: none; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; user-select: none; } .restore-btn:hover { background: rgba(0, 0, 0, 0.6); border-color: rgba(255, 255, 255, 0.3); } .anime-theme-player.minimized .restore-btn { display: flex; } .anime-theme-player.minimized .player-content { display: none; } .player-content { display: flex; flex-direction: column; height: 100%; overflow: hidden; } .themes-list { max-height: 180px; overflow-y: auto; padding: 10px; background: rgba(0, 0, 0, 0.2); user-select: none; transition: all 0.3s ease; } .themes-list.hidden { max-height: 0; padding: 0; opacity: 0; overflow: hidden; } .themes-list::-webkit-scrollbar { width: 6px; } .themes-list::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); } .theme-item { padding: 10px; background: rgba(20, 20, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; font-size: 12px; user-select: none; } .theme-item:hover { background: rgba(40, 40, 40, 0.8); border-color: rgba(255, 255, 255, 0.2); transform: translateX(4px); } .theme-item.active { background: rgba(60, 60, 60, 0.8); border-color: rgba(255, 255, 255, 0.4); border-left: 4px solid #ffffff; } .theme-type { color: #ffffff; font-weight: 700; font-size: 10px; margin-right: 6px; padding: 2px 6px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; display: inline-block; user-select: none; } .video-container { width: 100%; height: 220px; background: rgba(0, 0, 0, 0.8); overflow: hidden; display: none; align-items: center; justify-content: center; position: relative; } .video-container.active { display: flex; } .video-container video { width: 100%; height: 100%; object-fit: contain; } .video-placeholder { color: #9ca3af; font-size: 13px; text-align: center; animation: pulse 2s infinite; user-select: none; } .video-controls-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent); padding: 16px 14px 14px; opacity: 0; transition: opacity 0.3s; pointer-events: none; } .video-container:hover .video-controls-overlay { opacity: 1; pointer-events: all; } .now-playing { font-size: 12px; margin-bottom: 10px; color: #ffffff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; user-select: none; } .progress-container { margin-bottom: 10px; } .progress-bar { height: 6px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; position: relative; cursor: pointer; overflow: hidden; } .progress-fill { height: 100%; background: #ffffff; border-radius: 2px; transition: width 0.1s; position: relative; } .progress-fill::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); opacity: 0; } .progress-bar:hover .progress-fill::after { opacity: 1; } .time-display { display: flex; justify-content: space-between; font-size: 10px; color: #e5e7eb; margin-top: 4px; user-select: none; } .controls-row { display: flex; align-items: center; gap: 6px; } .control-btn { background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 12px; font-weight: bold; user-select: none; } .control-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.4); } .control-btn.play-btn { width: 34px; height: 34px; background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.4); } .volume-section {display: flex;align-items: center;gap: 6px;flex: 0 0 60px;} .volume-control {flex: 0 0 60px;height: 6px;background: rgba(255, 255, 255, 0.3);border-radius: 2px;position: relative;cursor: pointer;} .volume-bar {height: 100%;background: #ffffff;border-radius: 2px;transition: width 0.1s;} .fullscreen-btn {position: absolute;top: 10px;right: 10px;background: rgba(0, 0, 0, 0.7);border: 1px solid rgba(255, 255, 255, 0.3);color: white;width: 32px;height: 32px;border-radius: 6px;cursor: pointer;display: flex;align-items: center;justify-content: center;font-size: 14px;transition: all 0.2s;opacity: 0;user-select: none;} .fullscreen-btn { position: absolute; top: 10px; right: 10px; background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 255, 255, 0.3); color: white; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: all 0.2s; opacity: 0; user-select: none; } .video-container:hover .fullscreen-btn { opacity: 1; } .fullscreen-btn:hover { background: rgba(0, 0, 0, 0.9); transform: scale(1.05); } .toggle-list-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .toggle-list-btn.visible { display: flex; } .toggle-list-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .loading { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; user-select: none; } .error { color: #ef4444; font-size: 11px; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; margin: 10px; user-select: none; }\`;
                        document.head.appendChild(style);
                                        
                        const player = document.createElement("div");
                        player.className = "anime-theme-player minimized";
                        player.id = "anime-theme-player";
                
                        player.innerHTML = \`<button class="restore-btn" id="restore-btn">♪ Anime Themes</button> <div class="player-content"> <div class="player-header-bar"> <div class="player-title"> <span>♪</span> <span id="anime-title">Anime Themes</span> </div> <div class="header-controls"> <button class="header-btn toggle-list-btn" id="toggle-list-btn" title="Ocultar/Mostrar lista">☰</button> <button class="header-btn" id="minimize-btn" title="Minimize">−</button> </div> </div> <div class="themes-list" id="themes-list"> <div class="loading">Loading...</div> </div> <div class="video-container" id="video-container"> <button class="fullscreen-btn" id="fullscreen-btn" title="Fullscreen">⛶</button> <div class="video-controls-overlay"> <div class="now-playing" id="now-playing">Ningún tema seleccionado</div> <div class="progress-container"> <div class="progress-bar" id="progress-bar"> <div class="progress-fill" id="progress-fill"></div> </div> <div class="time-display"> <span id="current-time">0:00</span> <span id="duration">0:00</span> </div> </div> <div class="controls-row"> <button class="control-btn" id="skip-back-btn" title="10s">⏪</button> <button class="control-btn play-btn" id="play-btn" title="Reproducir/Pausar">▶</button> <button class="control-btn" id="skip-forward-btn" title="10s">⏩</button> <div class="volume-section"> <button class="control-btn" id="mute-btn" title="Mute">🔇</button> <div class="volume-control" id="volume-control"> <div class="volume-bar" id="volume-bar" style="width: 70%"></div> </div> </div> </div> </div> </div> </div>\`;
                
                        document.body.appendChild(player);
                
                        const themesList = document.getElementById("themes-list");
                        const videoContainer = document.getElementById("video-container");
                        const nowPlaying = document.getElementById("now-playing");
                        const playBtn = document.getElementById("play-btn");
                        const skipBackBtn = document.getElementById("skip-back-btn");
                        const skipForwardBtn = document.getElementById("skip-forward-btn");
                        const volumeControl = document.getElementById("volume-control");
                        const volumeBar = document.getElementById("volume-bar");
                        const muteBtn = document.getElementById("mute-btn");
                        const minimizeBtn = document.getElementById("minimize-btn");
                        const restoreBtn = document.getElementById("restore-btn");
                        const progressBar = document.getElementById("progress-bar");
                        const progressFill = document.getElementById("progress-fill");
                        const currentTimeEl = document.getElementById("current-time");
                        const durationEl = document.getElementById("duration");
                        const fullscreenBtn = document.getElementById("fullscreen-btn");
                        const playerHeaderBar = document.querySelector(".player-header-bar");
                        const animeTitleEl = document.getElementById("anime-title");
                        const toggleListBtn = document.getElementById("toggle-list-btn");
                
                        let video = null;
                        let currentVolume = 0.7;
                        let isMuted = false;
                        let isDragging = false;
                        let dragOffset = { x: 0, y: 0 };
                        let isListVisible = true;
                
                        function formatTime(seconds) {
                          if (isNaN(seconds)) return "0:00";
                          const mins = Math.floor(seconds / 60);
                          const secs = Math.floor(seconds % 60);
                          return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
                        }
                
                        playerHeaderBar.addEventListener("mousedown", (e) => {
                          isDragging = true;
                          player.classList.add("dragging");
                          const rect = player.getBoundingClientRect();
                          dragOffset.x = e.clientX - rect.left;
                          dragOffset.y = e.clientY - rect.top;
                        });
                
                        document.addEventListener("mousemove", (e) => {
                          if (!isDragging) return;
                          
                          let newX = e.clientX - dragOffset.x;
                          let newY = e.clientY - dragOffset.y;
                          
                          const maxX = window.innerWidth - player.offsetWidth;
                          const maxY = window.innerHeight - player.offsetHeight;
                          
                          newX = Math.max(0, Math.min(newX, maxX));
                          newY = Math.max(0, Math.min(newY, maxY));
                          
                          player.style.left = newX + "px";
                          player.style.top = newY + "px";
                          player.style.right = "auto";
                          player.style.bottom = "auto";
                        });
                
                        document.addEventListener("mouseup", () => {
                          if (isDragging) {
                            isDragging = false;
                            player.classList.remove("dragging");
                          }
                        });
                
                        async function fetchThemes() {
                          try {
                
                            const response = await fetch(
                              \`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=\${ANILIST_ID}&include=animethemes.animethemeentries.videos,animethemes.song.artists\`
                            );
                
                            const data = await response.json();
                
                            if (data.anime && data.anime.length > 0) {
                              const animeData = data.anime[0];
                              
                              if (animeTitleEl) {
                                animeTitleEl.textContent = animeData.name;
                              }
                
                              if (animeData.animethemes && animeData.animethemes.length > 0) {
                                let html = "";
                                animeData.animethemes.forEach(theme => {
                                  const themeType = \`\${theme.type}\${theme.sequence || ""}\`;
                                  const songTitle = theme.song?.title || "Unknown";
                                  const artists = theme.song?.artists?.map(artist => artist.name).join(", ") || "";
                                  const videoLink = theme.animethemeentries?.[0]?.videos?.[0]?.link || "";
                                  const themeName = theme.slug || songTitle;
                
                                  if (videoLink) {
                                    html += \`
                                      <div class="theme-item" data-anime="\${animeData.name}" data-type="\${themeType}" data-song="\${songTitle}" data-video="\${videoLink}">
                                        <span class="theme-type">\${themeType}</span>
                                        <span>\${songTitle}</span>
                                        \${artists ? \`<div style="font-size: 10px; color: #9ca3af; margin-top: 3px;">\${artists}</div>\` : ""}
                                      </div>
                                    \`;
                                  }
                                });
                
                                themesList.innerHTML = html || '<div class="error">No hay temas disponibles</div>';
                
                                const themeItems = themesList.querySelectorAll(".theme-item");
                                themeItems.forEach(item => {
                                  item.addEventListener("click", () => {
                                    const animeName = item.getAttribute("data-anime");
                                    const themeType = item.getAttribute("data-type");
                                    const videoLink = item.getAttribute("data-video");
                                    const songName = item.getAttribute("data-song");
                
                                    themeItems.forEach(i => i.classList.remove("active"));
                                    item.classList.add("active");
                
                                    if (videoLink) {
                                      videoContainer.classList.add("active");
                                      toggleListBtn.classList.add("visible");
                
                                      if (animeTitleEl) {
                                        animeTitleEl.textContent = \`\${animeName} - \${songName}\`;
                                      }
                
                                      if (!video) {
                                        video = document.createElement("video");
                                        video.controls = false;
                                        video.volume = currentVolume;
                                        videoContainer.insertBefore(video, videoContainer.firstChild);
                
                                        video.addEventListener("timeupdate", () => {
                                          const progress = (video.currentTime / video.duration) * 100;
                                          progressFill.style.width = progress + "%";
                                          currentTimeEl.textContent = formatTime(video.currentTime);
                                        });
                
                                        video.addEventListener("loadedmetadata", () => {
                                          durationEl.textContent = formatTime(video.duration);
                                        });
                
                                        video.addEventListener("ended", () => {
                                          playBtn.textContent = "▶";
                                        });
                                      }
                
                                      video.src = videoLink;
                                      video.play();
                                      playBtn.textContent = "⏸";
                                      nowPlaying.textContent = \`\${themeType} - \${songName}\`;
                                    }
                                  });
                                });
                              } else themesList.innerHTML = '<div class="error">No se encontraron temas para este anime</div>';
                            } else themesList.innerHTML = '<div class="error">Anime no encontrado en AnimeThemes</div>';
                          } catch (error) {
                            console.error("✗ Failed to fetch themes:", error);
                            themesList.innerHTML = '<div class="error">Error al cargar los temas</div>';
                          }
                        }
                        fetchThemes();
                
                        toggleListBtn.addEventListener("click", () => {
                          isListVisible = !isListVisible;
                          if (isListVisible) {
                            themesList.classList.remove("hidden");
                            toggleListBtn.textContent = "☰";
                          } else {
                            themesList.classList.add("hidden");
                            toggleListBtn.textContent = "☰";
                          }
                        });
                
                        playBtn.addEventListener("click", () => {
                          if (video && video.src) {
                            if (video.paused) {
                              video.play();
                              playBtn.textContent = "⏸";
                            } else {
                              video.pause();
                              playBtn.textContent = "▶";
                            }
                          }
                        });
                
                        skipBackBtn.addEventListener("click", () => {
                          if (video && video.src) video.currentTime = Math.max(0, video.currentTime - 10);
                        });
                
                        skipForwardBtn.addEventListener("click", () => {
                          if (video && video.src) video.currentTime = Math.min(video.duration, video.currentTime + 10);
                        });
                
                        progressBar.addEventListener("click", (event) => {
                          if (video && video.src) {
                            const rect = progressBar.getBoundingClientRect();
                            const x = event.clientX - rect.left;
                            const percentage = x / rect.width;
                            video.currentTime = percentage * video.duration;
                          }
                        });
                
                        volumeControl.addEventListener("click", (event) => {
                          const rect = volumeControl.getBoundingClientRect();
                          const x = event.clientX - rect.left;
                          const percentage = Math.max(0, Math.min(1, x / rect.width));
                
                          currentVolume = percentage;
                          if (video) {
                            video.volume = currentVolume;
                            if (currentVolume > 0) {
                              isMuted = false;
                              muteBtn.textContent = currentVolume > 0.5 ? "🔊" : "🔉";
                            }
                          }
                          volumeBar.style.width = \`\${percentage * 100}%\`;
                        });
                
                        muteBtn.addEventListener("click", () => {
                          if (video) {
                            isMuted = !isMuted;
                            video.muted = isMuted;
                            muteBtn.textContent = isMuted ? "🔇" : "🔊";
                          }
                        });
                
                        fullscreenBtn.addEventListener("click", () => {
                          if (video) {
                            if (video.requestFullscreen) {
                              video.requestFullscreen();
                            } else if (video.webkitRequestFullscreen) {
                              video.webkitRequestFullscreen();
                            }
                          }
                        });
                
                        minimizeBtn.addEventListener("click", () => {
                          player.classList.add("minimized");
                          player.style.left = "";
                          player.style.top = "";
                          player.style.right = "";
                          player.style.bottom = "";
                          if (video && !video.paused) {
                            video.pause();
                            playBtn.textContent = "▶";
                          }
                        });
                
                        restoreBtn.addEventListener("click", () => {
                          player.classList.remove("minimized");
                        });
                
                      })();
                    `)

                    body.append(script)
                } catch (error) {
                    console.error("Error in plugin:", error)
                }
            })

            ctx.screen.loadCurrent()
        })
    })
}