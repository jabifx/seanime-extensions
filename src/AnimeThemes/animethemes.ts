function init() {
    $ui.register((ctx) => {
        const startMinimized = $storage.get("anime-player.startMinimized") ?? false;
        const autoplay = $storage.get("anime-player.autoplay") ?? true;
        const defaultProvider = $storage.get("anime-player.provider") ?? "animethemes";
        const initialVolume = $storage.get("anime-player.volume") ?? 0.7;
        let isAnimePlayerInjected = false;
        let lastAnilistId = null;

        const tray = ctx.newTray({
            tooltipText: "Anime Themes",
            iconUrl: "https://raw.githubusercontent.com/jabifx/seanime-extensions/master/src/AnimeThemes/icon.ico",
            withContent: true,
        });

        const startMinimizedRef = ctx.fieldRef(startMinimized);
        const autoplayRef = ctx.fieldRef(autoplay);
        const providerRef = ctx.fieldRef(defaultProvider);
        const volumeRef = ctx.fieldRef(initialVolume);

        ctx.registerEventHandler("save-player-settings", () => {
            $storage.set("anime-player.startMinimized", startMinimizedRef.current);
            $storage.set("anime-player.autoplay", autoplayRef.current);
            $storage.set("anime-player.provider", providerRef.current);
            $storage.set("anime-player.volume", volumeRef.current);
            ctx.toast.success("Settings saved successfully!");
        });

        const startMinimizedState = ctx.state(startMinimized);

        tray.render(() => {
            const isMinimized = startMinimizedState.get();

            return tray.stack({
                items: [
                    tray.text("Anime Theme Player Settings", {
                        style: {
                            fontWeight: "bold",
                            fontSize: "14px",
                            marginBottom: "8px",
                        },
                    }),
                    tray.select("Provider", {
                        fieldRef: providerRef,
                        options: [
                            { label: "AnimeThemes", value: "animethemes" },
                            { label: "AniSongDB", value: "anisongdb" },
                        ],
                        help: "Choose the theme provider",
                    }),
                    tray.select("Initial Volume", {
                        fieldRef: volumeRef,
                        options: [
                            { label: "10%", value: 0.1 },
                            { label: "30%", value: 0.3 },
                            { label: "50%", value: 0.5 },
                            { label: "70%", value: 0.7 },
                            { label: "90%", value: 0.9 },
                            { label: "100%", value: 1 },
                        ],
                    }),
                    tray.switch("Start Minimized", {
                        fieldRef: startMinimizedRef,
                        help: "Start the player in minimized mode",
                    }),
                    !isMinimized
                        ? tray.switch("Autoplay", {
                            fieldRef: autoplayRef,
                            help: "Automatically play themes when selected",
                        })
                        : tray.text("Autoplay is disabled when starting minimized", {
                            style: {
                                fontSize: "11px",
                                color: "#9ca3af",
                                fontStyle: "italic",
                            },
                        }),
                    tray.button("Save Settings", {
                        onClick: "save-player-settings",
                        intent: "primary-subtle",
                    }),
                ],
                style: { gap: "12px", padding: "8px" },
            });
        });

        ctx.dom.onReady(async () => {
            ctx.screen.onNavigate(async (e) => {
                const isEntry = e.pathname === "/entry";

                if (!isEntry) {
                    const existingPlayer = await ctx.dom.queryOne("#anime-theme-player");
                    if (existingPlayer) await existingPlayer.remove();
                    const existingScripts = await ctx.dom.query("script[data-anime-player]");
                    for (const s of existingScripts) await s.remove();
                    isAnimePlayerInjected = false;
                    lastAnilistId = null;

                    return;
                }

                const anilistId = e.searchParams?.id;
                if (!anilistId) return;
                if (isAnimePlayerInjected && anilistId === lastAnilistId) {
                    console.log("Anime Player ya inyectado, saltando...");
                    return;
                }
                isAnimePlayerInjected = true;
                lastAnilistId = anilistId;

                try {
                    const body = await ctx.dom.queryOne("body");
                    if (!body) return;

                    const savedStartMinimized = $storage.get("anime-player.startMinimized") ?? false;
                    const savedAutoplay = $storage.get("anime-player.autoplay") ?? true;
                    const savedProvider = $storage.get("anime-player.provider") ?? "animethemes";
                    const savedVolume = $storage.get("anime-player.volume") ?? 0.7;
                    const effectiveAutoplay = savedStartMinimized ? false : savedAutoplay;

                    const oldScripts = await ctx.dom.query("script[data-anime-player]");
                    for (const s of oldScripts) await s.remove();

                    const oldPlayers = await ctx.dom.query("#anime-theme-player");
                    for (const p of oldPlayers) await p.remove();

                    const script = await ctx.dom.createElement("script");
                    script.setAttribute("data-anime-player", "true");
                    script.setText(`
                      (function() {
                        const ANILIST_ID = "${anilistId}";
                        const START_MINIMIZED = ${savedStartMinimized};
                        const AUTOPLAY = ${effectiveAutoplay};
                        const PROVIDER = "${savedProvider}";
                        const INITIAL_VOLUME = "${savedVolume}";
                
                        const existingPlayer = document.getElementById("anime-theme-player");
                        if (existingPlayer) { existingPlayer.remove(); }
                
                        const style = document.createElement("style");
                        style.textContent = \`@keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } @keyframes slideDown { from { max-height: 0; opacity: 0; } to { max-height: 180px; opacity: 1; } } @keyframes slideUp { from { max-height: 180px; opacity: 1; } to { max-height: 0; opacity: 0; } } .anime-theme-player { position: fixed; bottom: 20px; right: 20px; width: 380px; background: linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(20, 20, 20, 0.98)); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 0; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); z-index: 40; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; max-height: 700px; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; overflow: hidden; user-select: none; } .anime-theme-player.minimized { width: 200px; height: 50px; padding: 0; cursor: pointer; border-radius: 12px; animation: none; } .anime-theme-player.dragging { cursor: grabbing; transition: none; } .player-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(0, 0, 0, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: move; user-select: none; } .player-title { font-size: 15px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 8px; user-select: none; } .header-controls { display: flex; gap: 8px; } .header-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .header-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .restore-btn { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 700; display: none; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; user-select: none; } .restore-btn:hover { background: rgba(0, 0, 0, 0.6); border-color: rgba(255, 255, 255, 0.3); } .anime-theme-player.minimized .restore-btn { display: flex; } .anime-theme-player.minimized .player-content { display: none; } .player-content { display: flex; flex-direction: column; height: 100%; overflow: hidden; } .themes-list { max-height: 180px; overflow-y: auto; padding: 10px; background: rgba(0, 0, 0, 0.2); user-select: none; transition: all 0.3s ease; } .themes-list.hidden { max-height: 0; padding: 0; opacity: 0; overflow: hidden; } .themes-list::-webkit-scrollbar { width: 6px; } .themes-list::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); } .theme-item { padding: 10px; background: rgba(20, 20, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; font-size: 12px; user-select: none; } .theme-item:hover { background: rgba(40, 40, 40, 0.8); border-color: rgba(255, 255, 255, 0.2); transform: translateX(4px); } .theme-item.active { background: rgba(60, 60, 60, 0.8); border-color: rgba(255, 255, 255, 0.4); border-left: 4px solid #ffffff; } .theme-type { color: #ffffff; font-weight: 700; font-size: 10px; margin-right: 6px; padding: 2px 6px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; display: inline-block; user-select: none; } .video-container { width: 100%; height: 220px; background: rgba(0, 0, 0, 0.8); overflow: hidden; display: none; align-items: center; justify-content: center; position: relative; } .video-container.active { display: flex; } .video-container.hidden-video { height: 0; min-height: 0; } .video-container.hidden-video video { display: none; } .video-container video { width: 100%; height: 100%; object-fit: contain; } .video-placeholder { color: #9ca3af; font-size: 13px; text-align: center; animation: pulse 2s infinite; user-select: none; } .video-controls-overlay {position: relative;background: rgba(0, 0, 0, 0.6);padding: 12px;border-top: 1px solid rgba(255, 255, 255, 0.1);opacity: 1;pointer-events: all;}.video-container:hover .video-controls-overlay { opacity: 1; pointer-events: all; } .video-container.hidden-video .video-controls-overlay { opacity: 1; pointer-events: all; background: rgba(0, 0, 0, 0.9); position: relative; padding: 14px; } .progress-container { margin-bottom: 10px; } .progress-bar { height: 6px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; position: relative; cursor: pointer; overflow: hidden; } .progress-fill { height: 100%; background: #ffffff; border-radius: 2px; transition: width 0.1s; position: relative; } .progress-fill::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); opacity: 0; } .progress-bar:hover .progress-fill::after { opacity: 1; } .time-display { display: flex; justify-content: space-between; font-size: 10px; color: #e5e7eb; margin-top: 4px; user-select: none; } .controls-row { display: flex; align-items: center; gap: 6px; } .control-btn { background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 12px; font-weight: bold; user-select: none; } .control-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.4); } .control-btn.play-btn { width: 34px; height: 34px; background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.4); } .volume-section {display: flex;align-items: center;gap: 6px;flex: 0 0 60px;} .volume-control {flex: 0 0 60px;height: 6px;background: rgba(255, 255, 255, 0.3);border-radius: 2px;position: relative;cursor: pointer;} .volume-bar {height: 100%;background: #ffffff;border-radius: 2px;transition: width 0.1s;} .fullscreen-btn {position: absolute;top: 10px;right: 10px;background: rgba(0, 0, 0, 0.7);border: 1px solid rgba(255, 255, 255, 0.3);color: white;width: 32px;height: 32px;border-radius: 6px;cursor: pointer;display: flex;align-items: center;justify-content: center;font-size: 14px;transition: all 0.2s;opacity: 0;user-select: none;} .video-container:hover .fullscreen-btn { opacity: 1; } .video-container.hidden-video .fullscreen-btn { display: none; } .fullscreen-btn:hover { background: rgba(0, 0, 0, 0.9); transform: scale(1.05); } .toggle-list-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .toggle-list-btn.visible { display: flex; } .toggle-list-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .hide-video-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .hide-video-btn.visible { display: flex; } .hide-video-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .loading { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; user-select: none; } .error { color: #ef4444; font-size: 11px; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; margin: 10px; user-select: none; }\`;
                        document.head.appendChild(style);
                                        
                        const player = document.createElement("div");
                        player.className = START_MINIMIZED ? "anime-theme-player minimized" : "anime-theme-player";
                        player.id = "anime-theme-player";
                
                        player.innerHTML = \`<button class="restore-btn" id="restore-btn">♪ Anime Themes</button> <div class="player-content"> <div class="player-header-bar"> <div class="player-title"> <span>♪</span> <span id="anime-title">Anime Themes</span> </div> <div class="header-controls"> <button class="header-btn hide-video-btn" id="hide-video-btn" title="Ocultar/Mostrar video">👁</button> <button class="header-btn toggle-list-btn" id="toggle-list-btn" title="Ocultar/Mostrar lista">☰</button> <button class="header-btn" id="minimize-btn" title="Minimize">−</button> </div> </div> <div class="themes-list" id="themes-list"> <div class="loading">Loading...</div> </div> <div class="video-container" id="video-container"> <button class="fullscreen-btn" id="fullscreen-btn" title="Fullscreen">⛶</button></div><div class="video-controls-overlay" id="video-controls"> <div class="progress-container"> <div class="progress-bar" id="progress-bar"> <div class="progress-fill" id="progress-fill"></div> </div> <div class="time-display"> <span id="current-time">0:00</span> <span id="duration">0:00</span> </div> </div> <div class="controls-row"> <button class="control-btn" id="skip-back-btn" title="10s">⏪</button> <button class="control-btn play-btn" id="play-btn" title="Reproducir/Pausar">▶</button> <button class="control-btn" id="skip-forward-btn" title="10s">⏩</button> <div class="volume-section"> <button class="control-btn" id="mute-btn" title="Mute">🔇</button> <div class="volume-control" id="volume-control"> <div class="volume-bar" id="volume-bar" style="width: 70%"></div> </div> </div> </div></div> </div> </div> </div> </div> </div> </div>\`;
                
                        document.body.appendChild(player);
                
                        const themesList = document.getElementById("themes-list");
                        const videoContainer = document.getElementById("video-container");
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
                        const hideVideoBtn = document.getElementById("hide-video-btn");
                
                        let video = null;
                        let currentVolume = INITIAL_VOLUME;
                        let isMuted = false;
                        let isDragging = false;
                        let dragOffset = { x: 0, y: 0 };
                        let isListVisible = true;
                        let isVideoVisible = true;
                        let animeTitle = "";
                
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
                        
                        async function fetchThemes(providerOverride) {
                          try {
                            const provider = providerOverride || PROVIDER; // usa override si se pasa
                            if (provider === "animethemes") {
                              const res = await fetch(\`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=\${ANILIST_ID}&include=animethemes.animethemeentries.videos,animethemes.song.artists\`);
                              const data = await res.json();
                              const animeData = data.anime?.[0];
                        
                              if (!animeData) {
                                themesList.innerHTML = \`
                                  <div class="error">
                                    Not found on AnimeThemes, searching on AnisongDB...
                                  </div>
                                \`;
                                await new Promise(r => setTimeout(r, 1200));
                                await fetchThemes("anisongdb");
                                return;
                              }
                              
                              animeTitle = animeData.name;
                              if (animeTitleEl) animeTitleEl.textContent = animeTitle;
                        
                              const themes = animeData.animethemes || [];
                              if (themes.length === 0) {
                                themesList.innerHTML = \`
                                  <div class="error">
                                   Themes not found, searching on AnisongDB...
                                  </div>
                                \`;
                                await new Promise(r => setTimeout(r, 1200));
                                await fetchThemes("anisongdb");
                                return;
                              }
                        
                              const html = themes
                                .map(theme => {
                                  const video = theme.animethemeentries?.[0]?.videos?.[0]?.link;
                                  if (!video) return "";
                                  
                                  const themeType = \`\${theme.type}\${theme.sequence || ""}\`;
                                  const songTitle = theme.song?.title || "Unknown";
                                  const artists = theme.song?.artists?.map(a => a.name).join(", ") || "";
                                  
                                  return \`
                                    <div class="theme-item" data-anime="\${animeData.name}" data-type="\${themeType}" data-song="\${songTitle}" data-video="\${video}">
                                      <span class="theme-type">\${themeType}</span>
                                      <span>\${songTitle}</span>
                                      \${artists ? \`<div class="artist">\${artists}</div>\` : ""}
                                    </div>\`;
                                })
                                .join("");
                        
                              themesList.innerHTML = html || '<div class="error">No themes</div>';
                              setupThemeClickHandlers();
                              return;
                            }
                        
                            if (provider !== "anisongdb") return;
                        
                            const query = \`
                              query ($id: Int) {
                                Media(id: $id, type: ANIME) {
                                  id title { romaji english native }
                                  synonyms startDate { year }
                                  relations {
                                    edges {
                                      relationType
                                      node { id title { romaji english native } startDate { year } format type }
                                    }
                                  }
                                }
                              }
                            \`;
                            
                            const parsedId = Number(ANILIST_ID);
                            const anilistRes = await fetch("https://graphql.anilist.co", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Accept: "application/json" },
                              body: JSON.stringify({ query, variables: { id: parsedId } }),
                            });
                            
                            const json = await anilistRes.json();
                            let media = json.data?.Media;
                            
                            if (!media) {
                              themesList.innerHTML = '<div class="error">Anime not found on AniList</div>';
                              return;
                            }
                        
                            async function getOldestPrequel(currentMedia) {
                              const visited = new Set();
                              let oldest = currentMedia;
                              
                              while (true) {
                                if (visited.has(oldest.id)) break;
                                visited.add(oldest.id);
                                
                                const prequels = oldest.relations?.edges
                                  ?.filter(e => 
                                    e.relationType === "PREQUEL" && 
                                    e.node.type === "ANIME" && 
                                    ["TV", "TV_SHORT", "ONA"].includes(e.node.format)
                                  )
                                  ?.map(e => e.node)
                                  ?.sort((a, b) => (a.startDate?.year ?? 9999) - (b.startDate?.year ?? 9999));
                                
                                if (!prequels?.length) break;
                        
                                const res = await fetch("https://graphql.anilist.co", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json", Accept: "application/json" },
                                  body: JSON.stringify({ query, variables: { id: prequels[0].id } }),
                                });
                                
                                const next = await res.json();
                                if (!next.data?.Media) break;
                                oldest = next.data.Media;
                              }
                              
                              return oldest;
                            }
                        
                            animeTitle = media.title.romaji || media.title.english || media.title.native;
                            const oldestMedia = await getOldestPrequel(media);
                            
                            if (!animeTitle) {
                              themesList.innerHTML = '<div class="error">Anime not found</div>';
                              return;
                            }
                            
                            if (animeTitleEl) animeTitleEl.textContent = animeTitle;
                        
                            async function searchAniSongDB(searchTerm) {
                              const res = await fetch("https://anisongdb.com/api/search_request", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  anime_search_filter: { search: searchTerm, partial_match: true },
                                  and_logic: false,
                                  ignore_duplicate: false,
                                  opening_filter: true,
                                  ending_filter: true,
                                  insert_filter: true,
                                  normal_broadcast: true,
                                  rebroadcast: true,
                                  standard: true,
                                  instrumental: true,
                                  chanting: true,
                                  character: true
                                })
                              });
                              return res.json();
                            }
                        
                            let results = await searchAniSongDB(animeTitle);
                            
                            if ((!results?.length) && oldestMedia?.title) {
                              const altTitle =
                                oldestMedia.title.romaji ||
                                oldestMedia.title.english ||
                                oldestMedia.title.native;
                              await new Promise(r => setTimeout(r, 150));
                              const fallbackResults = await searchAniSongDB(altTitle);
                              if (fallbackResults?.length) {
                                results = [...results, ...fallbackResults];
                              }
                            }
                            
                            if ((!results?.length) && media.synonyms?.length) {
                              for (const alt of media.synonyms) {
                                await new Promise(r => setTimeout(r, 150));
                                const altResults = await searchAniSongDB(alt);
                                if (altResults?.length) {
                                  results = [...results, ...altResults];
                                  break;
                                }
                              }
                            }
                            
                            const hasCurrentId = results?.some(r => {
                              const ids = r.linked_ids?.anilist;
                              return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                            });
                            
                            if (!results?.length || !hasCurrentId) {
                              themesList.innerHTML = \`
                                <div class="error">
                                  Not found on AniSongDB, searching on AnimeThemes...
                                </div>
                              \`;
                              await new Promise(r => setTimeout(r, 1200));
                              await fetchThemes("animethemes");
                              return;
                            }
                        
                            const songMap = new Map();
                            
                            const filtered = results.filter(r => {
                              const ids = r.linked_ids?.anilist;
                              return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                            });
                            
                            for (const r of filtered) {
                              const video = r.MQ || r.HQ;
                              if (!video) continue;
                              
                              const url = \`https://naedist.animemusicquiz.com/\${video}\`;
                              const themeType = r.songType
                                .replace("Opening", "OP")
                                .replace("Ending", "ED")
                                .replace("Insert Song", "IN");
                              const key = \`\${themeType}-\${r.songName}\`;
                              
                              if (!songMap.has(key)) {
                                songMap.set(key, {
                                  themeType,
                                  songName: r.songName,
                                  artist: r.songArtist,
                                  videoUrl: url,
                                  anime: r.animeENName || r.animeJPName,
                                });
                              }
                            }
                        
                            const sorted = Array.from(songMap.values()).sort((a, b) => {
                              const order = { OP: 1, ED: 2, IN: 3 };
                              const typeA = a.themeType.match(/[A-Z]+/)[0];
                              const typeB = b.themeType.match(/[A-Z]+/)[0];
                              const numA = parseInt(a.themeType.match(/\\d+/)?.[0] || "0");
                              const numB = parseInt(b.themeType.match(/\\d+/)?.[0] || "0");
                              return order[typeA] - order[typeB] || numA - numB;
                            });
                        
                            const html = sorted
                              .map(t => \`
                                <div class="theme-item" data-anime="\${t.anime}" data-type="\${t.themeType}" data-song="\${t.songName}" data-video="\${t.videoUrl}">
                                  <span class="theme-type">\${t.themeType}</span>
                                  <span>\${t.songName}</span>
                                  \${t.artist ? \`<div class="artist">\${t.artist}</div>\` : ""}
                                </div>\`)
                              .join("");
                        
                            themesList.innerHTML = html || '<div class="error">No themes</div>';
                            setupThemeClickHandlers();
                            
                          } catch (err) {
                              console.error("✗ Failed to fetch themes:", err);
                              if (PROVIDER === "anisongdb") {
                                themesList.innerHTML = \`
                                  <div class="error">
                                    Not found on AniSongDB, searching on AnimeThemes...
                                  </div>
                                \`;
                                await new Promise(r => setTimeout(r, 1200));
                                await fetchThemes("animethemes");
                              }
                              else {
                                themesList.innerHTML = \`
                                  <div class="error">
                                    Not found on AnimeThemes, searching on AniSongDB...
                                  </div>
                                \`;
                                await new Promise(r => setTimeout(r, 1200));
                                await fetchThemes("anisongdb");
                              }
                            }
                        }

                        function setupThemeClickHandlers() {
                          const themeItems = themesList.querySelectorAll(".theme-item");
                          
                          function playTheme(item, shouldAutoplay) {
                            const animeName = item.getAttribute("data-anime");
                            const themeType = item.getAttribute("data-type");
                            const videoLink = item.getAttribute("data-video");
                            const songName = item.getAttribute("data-song");
                            console.log("Playing theme:", videoLink)
          
                            themeItems.forEach(i => i.classList.remove("active"));
                            item.classList.add("active");
          
                            if (!videoLink) { return }
                            
                            videoContainer.classList.add("active");
                            toggleListBtn.classList.add("visible");
                            hideVideoBtn.classList.add("visible");
          
                            if (animeTitleEl) { animeTitleEl.textContent = \`\${animeName} - \${songName}\`;}
          
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
                            } else {
                                video.pause();
                                video.currentTime = 0;
                            }
          
                            video.src = videoLink;
                              
                            if (shouldAutoplay) {
                                video.play();
                                playBtn.textContent = "⏸";
                            } else { playBtn.textContent = "▶"; }
                          }
                          
                        themeItems.forEach(item => { item.addEventListener("click", () => { playTheme(item, true); }); });
                        
                        if (AUTOPLAY && themeItems.length > 0) {
                            const firstOP = Array.from(themeItems).find(item => {
                              const themeType = item.getAttribute("data-type");
                              return themeType && themeType.startsWith("OP");
                            });
                              
                            if (firstOP) {
                              themesList.classList.add("hidden");
                              isListVisible = false;
                              playTheme(firstOP, true);
                            }
                          }
                        }
                        
                        fetchThemes();
                
                        toggleListBtn.addEventListener("click", () => {
                          isListVisible = !isListVisible;
                          toggleListBtn.textContent = "☰";
                          if (isListVisible) { themesList.classList.remove("hidden");} 
                          else { themesList.classList.add("hidden");}
                        });

                        hideVideoBtn.addEventListener("click", () => {
                          isVideoVisible = !isVideoVisible;
                          hideVideoBtn.textContent = "👁";

                          if (isVideoVisible) { videoContainer.classList.remove("hidden-video");} 
                          else { videoContainer.classList.add("hidden-video");}
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
                            if (video.requestFullscreen) { video.requestFullscreen();} 
                            else if (video.webkitRequestFullscreen) { video.webkitRequestFullscreen();}
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
                        
                        volumeBar.style.width = \`\${INITIAL_VOLUME * 100}%\`;
                
                      })();
                    `);
                    body.append(script);
                } catch (error) {
                    console.error("Error in plugin:", error);
                }
            });

            ctx.screen.loadCurrent();
        });
    });
}