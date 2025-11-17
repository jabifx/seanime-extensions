function init() {
    $ui.register((ctx) => {
        const STORAGE_KEYS = {
            START_MINIMIZED: "anime-player.startMinimized",
            AUTOPLAY: "anime-player.autoplay",
            PROVIDER: "anime-player.provider",
            VOLUME: "anime-player.volume",
            MANUAL_MATCHES: "anime-player.manualMatches" // nuevo
        };

        const SELECTORS = {
            PLAYER: "#anime-theme-player",
            SCRIPT: "script[data-anime-player]"
        };

        const state = {
            startMinimized: $storage.get(STORAGE_KEYS.START_MINIMIZED) ?? false,
            autoplay: $storage.get(STORAGE_KEYS.AUTOPLAY) ?? true,
            provider: $storage.get(STORAGE_KEYS.PROVIDER) ?? "animethemes",
            volume: $storage.get(STORAGE_KEYS.VOLUME) ?? 0.7,
            manualMatches: $storage.get(STORAGE_KEYS.MANUAL_MATCHES) ?? {},
            isPlayerInjected: false,
            lastAnilistId: null
        };

        const refs = {
            startMinimized: ctx.fieldRef(state.startMinimized),
            autoplay: ctx.fieldRef(state.autoplay),
            provider: ctx.fieldRef(state.provider),
            volume: ctx.fieldRef(state.volume)
        };

        const startMinimizedState = ctx.state(state.startMinimized);

        const tray = ctx.newTray({
            tooltipText: "Anime Themes",
            iconUrl: "https://raw.githubusercontent.com/jabifx/seanime-extensions/master/src/AnimeThemes/icon.ico",
            withContent: true,
        });

        ctx.registerEventHandler("save-player-settings", () => {
            $storage.set(STORAGE_KEYS.START_MINIMIZED, refs.startMinimized.current);
            $storage.set(STORAGE_KEYS.AUTOPLAY, refs.autoplay.current);
            $storage.set(STORAGE_KEYS.PROVIDER, refs.provider.current);
            $storage.set(STORAGE_KEYS.VOLUME, refs.volume.current);
            ctx.toast.success("Settings saved successfully!");
        });

        tray.render(() => {
            const isMinimized = startMinimizedState.get();

            const items = [
                tray.text("AnimeThemes Settings", {
                    style: { fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }
                }),
                tray.select("Provider", {
                    fieldRef: refs.provider,
                    options: [
                        { label: "AnimeThemes", value: "animethemes" },
                        { label: "AniSongDB", value: "anisongdb" }
                    ],
                    help: "Choose the theme provider"
                }),
                tray.select("Initial Volume", {
                    fieldRef: refs.volume,
                    options: [
                        { label: "0%", value: 0.0 },
                        { label: "25%", value: 0.25 },
                        { label: "50%", value: 0.5 },
                        { label: "75%", value: 0.75 },
                        { label: "100%", value: 1 },
                    ]
                }),
                tray.switch("Start Minimized", {
                    fieldRef: refs.startMinimized,
                }),
                isMinimized
                    ? tray.text("Autoplay is disabled when starting minimized", {
                        style: { fontSize: "11px", color: "#9ca3af", fontStyle: "italic" }
                    })
                    : tray.switch("Autoplay", {
                        fieldRef: refs.autoplay,
                    }),
                tray.button("Save Settings", {
                    onClick: "save-player-settings",
                    intent: "primary-subtle"
                })
            ];

            return tray.stack({ items, style: { gap: "12px", padding: "8px" } });
        });

        const cleanupPlayer = async () => {
            const existingPlayer = await ctx.dom.queryOne(SELECTORS.PLAYER);
            if (existingPlayer) await existingPlayer.remove();
            const existingScripts = await ctx.dom.query(SELECTORS.SCRIPT);
            for (const script of existingScripts) await script.remove();
            state.isPlayerInjected = false;
            state.lastAnilistId = null;
        };

        const getSettings = () => ({
            startMinimized: $storage.get(STORAGE_KEYS.START_MINIMIZED) ?? false,
            autoplay: $storage.get(STORAGE_KEYS.AUTOPLAY) ?? true,
            provider: $storage.get(STORAGE_KEYS.PROVIDER) ?? "animethemes",
            volume: $storage.get(STORAGE_KEYS.VOLUME) ?? 0.7,
            manualMatches: $storage.get(STORAGE_KEYS.MANUAL_MATCHES) ?? {}
        });

        const createPlayerScript = (anilistId, settings) => {
            const effectiveAutoplay = settings.startMinimized ? false : settings.autoplay;

            return `
                (function() {
                    const ANILIST_ID = "${anilistId}";
                    const START_MINIMIZED = ${settings.startMinimized};
                    const AUTOPLAY = ${effectiveAutoplay};
                    const PROVIDER = "${settings.provider}";
                    const INITIAL_VOLUME = ${settings.volume};
                    const MANUAL_MATCHES = ${JSON.stringify(settings.manualMatches)};
                    const existingPlayer = document.getElementById("anime-theme-player");
                    if (existingPlayer) existingPlayer.remove();
                
                    const style = document.createElement("style");
                    style.textContent = \`@keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } @keyframes slideDown { from { max-height: 0; opacity: 0; } to { max-height: 180px; opacity: 1; } } @keyframes slideUp { from { max-height: 180px; opacity: 1; } to { max-height: 0; opacity: 0; } } .anime-theme-player { position: fixed; bottom: 20px; right: 20px; width: 380px; background: linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(20, 20, 20, 0.98)); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 0; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); z-index: 40; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #fff; max-height: 700px; display: flex; flex-direction: column; animation: slideIn 0.3s ease-out; overflow: hidden; user-select: none; } .anime-theme-player.minimized { width: 200px; height: 50px; padding: 0; cursor: pointer; border-radius: 12px; animation: none; } .anime-theme-player.dragging { cursor: grabbing; transition: none; } .player-header-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(0, 0, 0, 0.4); border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: move; user-select: none; } .player-title { font-size: 15px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 8px; user-select: none; } .header-controls { display: flex; gap: 8px; } .header-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .header-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .restore-btn { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 700; display: none; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; user-select: none; } .restore-btn:hover { background: rgba(0, 0, 0, 0.6); border-color: rgba(255, 255, 255, 0.3); } .anime-theme-player.minimized .restore-btn { display: flex; } .anime-theme-player.minimized .player-content { display: none; } .player-content { display: flex; flex-direction: column; height: 100%; overflow: hidden; } .themes-list { max-height: 180px; overflow-y: auto; padding: 10px; background: rgba(0, 0, 0, 0.2); user-select: none; transition: all 0.3s ease; } .themes-list.hidden { max-height: 0; padding: 0; opacity: 0; overflow: hidden; } .themes-list::-webkit-scrollbar { width: 6px; } .themes-list::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 3px; } .themes-list::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); } .theme-item { padding: 10px; background: rgba(20, 20, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; font-size: 12px; user-select: none; } .theme-item:hover { background: rgba(40, 40, 40, 0.8); border-color: rgba(255, 255, 255, 0.2); transform: translateX(4px); } .theme-item.active { background: rgba(60, 60, 60, 0.8); border-color: rgba(255, 255, 255, 0.4); border-left: 4px solid #ffffff; } .theme-type { color: #ffffff; font-weight: 700; font-size: 10px; margin-right: 6px; padding: 2px 6px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; display: inline-block; user-select: none; } .video-container { width: 100%; height: 220px; background: rgba(0, 0, 0, 0.8); overflow: hidden; display: none; align-items: center; justify-content: center; position: relative; } .video-container.active { display: flex; } .video-container.hidden-video { height: 0; min-height: 0; } .video-container.hidden-video video { display: none; } .video-container video { width: 100%; height: 100%; object-fit: contain; } .video-placeholder { color: #9ca3af; font-size: 13px; text-align: center; animation: pulse 2s infinite; user-select: none; } .video-controls-overlay {position: relative;background: rgba(0, 0, 0, 0.6);padding: 12px;border-top: 1px solid rgba(255, 255, 255, 0.1);opacity: 1;pointer-events: all;}.video-container:hover .video-controls-overlay { opacity: 1; pointer-events: all; } .video-container.hidden-video .video-controls-overlay { opacity: 1; pointer-events: all; background: rgba(0, 0, 0, 0.9); position: relative; padding: 14px; } .progress-container { margin-bottom: 10px; } .progress-bar { height: 6px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; position: relative; cursor: pointer; overflow: hidden; } .progress-fill { height: 100%; background: #ffffff; border-radius: 2px; transition: width 0.1s; position: relative; } .progress-fill::after { content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; background: white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); opacity: 0; } .progress-bar:hover .progress-fill::after { opacity: 1; } .time-display { display: flex; justify-content: space-between; font-size: 10px; color: #e5e7eb; margin-top: 4px; user-select: none; } .controls-row { display: flex; align-items: center; gap: 6px; } .control-btn { background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 12px; font-weight: bold; user-select: none; } .control-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.4); } .control-btn.play-btn { width: 34px; height: 34px; background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.4); } .volume-section {display: flex;align-items: center;gap: 6px;flex: 0 0 60px;} .volume-control {flex: 0 0 60px;height: 6px;background: rgba(255, 255, 255, 0.3);border-radius: 2px;position: relative;cursor: pointer;} .volume-bar {height: 100%;background: #ffffff;border-radius: 2px;transition: width 0.1s;} .fullscreen-btn {position: absolute;top: 10px;right: 10px;background: rgba(0, 0, 0, 0.7);border: 1px solid rgba(255, 255, 255, 0.3);color: white;width: 32px;height: 32px;border-radius: 6px;cursor: pointer;display: flex;align-items: center;justify-content: center;font-size: 14px;transition: all 0.2s;opacity: 0;user-select: none;} .video-container:hover .fullscreen-btn { opacity: 1; } .video-container.hidden-video .fullscreen-btn { display: none; } .fullscreen-btn:hover { background: rgba(0, 0, 0, 0.9); transform: scale(1.05); } .toggle-list-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .toggle-list-btn.visible { display: flex; } .toggle-list-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .hide-video-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s; user-select: none; } .hide-video-btn.visible { display: flex; } .hide-video-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); border-color: rgba(255, 255, 255, 0.3); } .loading { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; user-select: none; } .error { color: #ef4444; font-size: 11px; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; margin: 10px; user-select: none; }.manual-match-section {padding: 12px;background: rgba(0, 0, 0, 0.3);border-top: 1px solid rgba(255, 255, 255, 0.1);display: none;}.manual-match-section.visible {display: block;}.manual-match-form {display: flex;flex-direction: column;gap: 8px;}.manual-match-input {background: rgba(255, 255, 255, 0.1);border: 1px solid rgba(255, 255, 255, 0.2);border-radius: 6px;padding: 8px;color: white;font-size: 12px;outline: none;}.manual-match-input:focus {border-color: rgba(255, 255, 255, 0.4);background: rgba(255, 255, 255, 0.15);}.manual-match-input::placeholder {color: rgba(255, 255, 255, 0.5);}.manual-match-buttons {display: flex;gap: 8px;}.manual-match-btn {flex: 1;background: rgba(255, 255, 255, 0.15);border: 1px solid rgba(255, 255, 255, 0.3);color: white;padding: 8px;border-radius: 6px;cursor: pointer;font-size: 12px;font-weight: 600;transition: all 0.2s;}.manual-match-btn:hover {background: rgba(255, 255, 255, 0.2);border-color: rgba(255, 255, 255, 0.4);}.manual-match-btn.clear {background: rgba(239, 68, 68, 0.2);border-color: rgba(239, 68, 68, 0.4); }.manual-match-btn.clear:hover { background: rgba(239, 68, 68, 0.3); }.manual-match-select {background: rgba(255, 255, 255, 0.1);border: 1px solid rgba(255, 255, 255, 0.2);border-radius: 6px;padding: 8px;color: white;font-size: 12px;outline: none;cursor: pointer;}.manual-match-select:focus {border-color: rgba(255, 255, 255, 0.4);background: rgba(255, 255, 255, 0.15);}.manual-match-select option {background: #1a1a1a;color: white;}.manual-match-indicator {background: rgba(34, 197, 94, 0.2);border: 1px solid rgba(34, 197, 94, 0.4);color: #4ade80;padding: 4px 8px;border-radius: 4px;font-size: 10px;font-weight: 600;margin-left: 8px;}.anime-results-list {max-height: 200px;overflow-y: auto;margin-top: 8px;display: none;}.anime-results-list.visible {display: block;}.anime-result-item {padding: 10px;background: rgba(20, 20, 20, 0.6);border: 1px solid rgba(255, 255, 255, 0.1);border-radius: 6px;margin-bottom: 6px;cursor: pointer;transition: all 0.2s;font-size: 12px;}.anime-result-item:hover {background: rgba(40, 40, 40, 0.8);border-color: rgba(255, 255, 255, 0.2);transform: translateX(4px);}.anime-result-title {font-weight: 600;color: #ffffff;margin-bottom: 4px;}.anime-result-meta {font-size: 10px;color: #9ca3af;}.anime-results-list::-webkit-scrollbar {width: 6px;}.anime-results-list::-webkit-scrollbar-track {background: rgba(0, 0, 0, 0.3);border-radius: 3px;}.anime-results-list::-webkit-scrollbar-thumb {background: rgba(255, 255, 255, 0.3);border-radius: 3px;}\`;
                    document.head.appendChild(style);
                
                    const player = document.createElement("div");
                    player.className = START_MINIMIZED ? "anime-theme-player minimized" : "anime-theme-player";
                    player.id = "anime-theme-player";
                
                    player.innerHTML = \`<button class="restore-btn" id="restore-btn">♪ Anime Themes</button> <div class="player-content"> <div class="player-header-bar"> <div class="player-title"> <span>♪</span> <span id="anime-title">Anime Themes</span> <span class="manual-match-indicator" id="manual-match-indicator" style="display: none;">Manual</span> </div> <div class="header-controls"> <button class="header-btn" id="manual-match-btn" title="Manual Match">🔧</button> <button class="header-btn hide-video-btn" id="hide-video-btn" title="Ocultar/Mostrar video">👁</button> <button class="header-btn toggle-list-btn" id="toggle-list-btn" title="Ocultar/Mostrar lista">☰</button> <button class="header-btn" id="minimize-btn" title="Minimize">−</button> </div> </div> <div class="manual-match-section" id="manual-match-section"> <div class="manual-match-form"> <input type="text" class="manual-match-input" id="manual-search-input" placeholder="Search anime by title..."> <select class="manual-match-select" id="manual-provider-select"> <option value="anisongdb">AniSongDB</option> </select> <div class="manual-match-buttons"> <button class="manual-match-btn" id="manual-search-btn">Search Anime</button> <button class="manual-match-btn clear" id="manual-clear-btn">Clear Match</button> </div> <div class="anime-results-list" id="anime-results-list"></div> </div> </div> <div class="themes-list" id="themes-list"> <div class="loading">Loading...</div> </div> <div class="video-container" id="video-container"> <button class="fullscreen-btn" id="fullscreen-btn" title="Fullscreen">⛶</button> </div> <div class="video-controls-overlay" id="video-controls"> <div class="progress-container"> <div class="progress-bar" id="progress-bar"> <div class="progress-fill" id="progress-fill"></div> </div> <div class="time-display"> <span id="current-time">0:00</span> <span id="duration">0:00</span> </div> </div> <div class="controls-row"> <button class="control-btn" id="skip-back-btn" title="10s">⏪</button> <button class="control-btn play-btn" id="play-btn" title="Play/Pause">▶</button> <button class="control-btn" id="skip-forward-btn" title="10s">⏩</button> <div class="volume-section"> <button class="control-btn" id="mute-btn" title="Mute">🔇</button> <div class="volume-control" id="volume-control"> <div class="volume-bar" id="volume-bar"></div> </div> </div> </div> </div> </div>\`;

                    document.body.appendChild(player);
                
                    const els = {
                        themesList: document.getElementById("themes-list"),
                        videoContainer: document.getElementById("video-container"),
                        playBtn: document.getElementById("play-btn"),
                        skipBackBtn: document.getElementById("skip-back-btn"),
                        skipForwardBtn: document.getElementById("skip-forward-btn"),
                        volumeControl: document.getElementById("volume-control"),
                        volumeBar: document.getElementById("volume-bar"),
                        muteBtn: document.getElementById("mute-btn"),
                        minimizeBtn: document.getElementById("minimize-btn"),
                        restoreBtn: document.getElementById("restore-btn"),
                        progressBar: document.getElementById("progress-bar"),
                        progressFill: document.getElementById("progress-fill"),
                        currentTime: document.getElementById("current-time"),
                        duration: document.getElementById("duration"),
                        fullscreenBtn: document.getElementById("fullscreen-btn"),
                        headerBar: document.querySelector(".player-header-bar"),
                        animeTitle: document.getElementById("anime-title"),
                        toggleListBtn: document.getElementById("toggle-list-btn"),
                        hideVideoBtn: document.getElementById("hide-video-btn"),
                        manualMatchBtn: document.getElementById("manual-match-btn"),
                        manualMatchSection: document.getElementById("manual-match-section"),
                        manualSearchInput: document.getElementById("manual-search-input"),
                        manualProviderSelect: document.getElementById("manual-provider-select"),
                        manualSearchBtn: document.getElementById("manual-search-btn"),
                        manualClearBtn: document.getElementById("manual-clear-btn"),
                        manualMatchIndicator: document.getElementById("manual-match-indicator"),
                        animeResultsList: document.getElementById("anime-results-list")
                    };
                
                    let video = null;
                    let currentVolume = INITIAL_VOLUME;
                    const playerState = {
                        isMuted: false,
                        isDragging: false,
                        dragOffset: { x: 0, y: 0 },
                        isListVisible: true,
                        isVideoVisible: true,
                        animeTitle: "",
                        isManualMatchVisible: false
                    };
                
                    const formatTime = (seconds) => {
                        if (isNaN(seconds)) return "0:00";
                        const mins = Math.floor(seconds / 60);
                        const secs = Math.floor(seconds % 60);
                        return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
                    };
                
                    const showError = (message, fallbackProvider = null) => {
                        els.themesList.innerHTML = \`<div class="error">\${message}</div>\`;
                        if (fallbackProvider) { setTimeout(() => fetchThemes(fallbackProvider), 1200) }
                    };
                
                    const updateManualMatchIndicator = () => {
                        if (MANUAL_MATCHES[ANILIST_ID]) { els.manualMatchIndicator.style.display = 'inline-block' } 
                        else { els.manualMatchIndicator.style.display = 'none' }
                    };
                
                    // Drag functionality
                    const setupDragHandlers = () => {
                        els.headerBar.addEventListener("mousedown", (e) => {
                            playerState.isDragging = true;
                            player.classList.add("dragging");
                            const rect = player.getBoundingClientRect();
                            playerState.dragOffset = {
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top
                            };
                        });
                
                        document.addEventListener("mousemove", (e) => {
                            if (!playerState.isDragging) return;
                            let newX = Math.max(0, Math.min(e.clientX - playerState.dragOffset.x, window.innerWidth - player.offsetWidth));
                            let newY = Math.max(0, Math.min(e.clientY - playerState.dragOffset.y, window.innerHeight - player.offsetHeight));
                            player.style.left = newX + "px";
                            player.style.top = newY + "px";
                            player.style.right = "auto";
                            player.style.bottom = "auto";
                        });
                
                        document.addEventListener("mouseup", () => {
                            if (!playerState.isDragging) { return }
                            playerState.isDragging = false;
                            player.classList.remove("dragging");
                        });
                    };
                    const searchAnimeThemes = async (query) => {
                        const res = await fetch(\`https://api.animethemes.moe/search?q=\${encodeURIComponent(query)}&include=anime.resources\`);
                        const data = await res.json();
                        
                        return data.search?.anime?.map(anime => {
                            const anilistResource = anime.resources?.find(r => r.site === "AniList");
                            return {
                                name: anime.name,
                                year: anime.year,
                                season: anime.season,
                                anilistId: anilistResource?.external_id || null
                            };
                        }).filter(a => a.anilistId) || [];
                    };
                
                    const searchAniSongDB = async (query) => {
                        const res = await fetch("https://anisongdb.com/api/search_request", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                anime_search_filter: { search: query, partial_match: true },
                                and_logic: false,
                                ignore_duplicate: false,
                                opening_filter: true,
                                ending_filter: true,
                                insert_filter: true
                            })
                        });
                        const data = await res.json();
                        
                        const animeMap = new Map();
                        data.forEach(r => {
                            const ids = r.linked_ids?.anilist;
                            const anilistIds = Array.isArray(ids) ? ids : (ids ? [ids] : []);
                            
                            anilistIds.forEach(id => {
                                if (!animeMap.has(id)) {
                                    animeMap.set(id, {
                                        name: r.animeENName || r.animeJPName,
                                        anilistId: id
                                    });
                                }
                            });
                        });
                        
                        return Array.from(animeMap.values());
                    };
                
                    const displayAnimeResults = (results, provider) => {
                        if (!results.length) {
                            els.animeResultsList.innerHTML = '<div class="error">No anime found</div>';
                            els.animeResultsList.classList.add("visible");
                            return;
                        }
                
                        const html = results.map(anime => \`
                            <div class="anime-result-item" data-anilist-id="\${anime.anilistId}" data-provider="\${provider}" data-anime-name="\${anime.name.replace(/"/g, '&quot;')}"">
                                <div class="anime-result-title">\${anime.name}</div>
                                <div class="anime-result-meta">
                                    AniList ID: \${anime.anilistId}
                                    \${anime.year ? \` • \${anime.season || ''} \${anime.year}\` : ''}
                                </div>
                            </div>
                        \`).join('');
                
                        els.animeResultsList.innerHTML = html;
                        els.animeResultsList.classList.add("visible");
                        els.animeResultsList.querySelectorAll('.anime-result-item').forEach(item => {
                            item.addEventListener('click', async () => {
                                const targetName = item.getAttribute('data-anime-name');
                                const targetId = item.getAttribute('data-anilist-id');
                                updateManualMatchIndicator();
                                
                                playerState.isManualMatchVisible = false;
                                els.manualMatchSection.classList.remove("visible");
                                els.animeResultsList.classList.remove("visible");
                                els.animeResultsList.innerHTML = '';
                                els.themesList.classList.remove("hidden");
                                
                                els.themesList.innerHTML = '<div class="loading">Loading themes...</div>';
                                await fetchThemesByName(targetId, targetName);
                            });
                        });
                    };
                
                    const fetchAnimeThemes = async () => {
                        const res = await fetch(\`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=AniList&filter[external_id]=\${ANILIST_ID}&include=animethemes.animethemeentries.videos,animethemes.song.artists\`);
                        const data = await res.json();
                        const anime = data.anime?.[0];
                
                        if (!anime || !anime.animethemes?.length) { throw new Error("No themes found") }
                        playerState.animeTitle = anime.name;
                        if (els.animeTitle) els.animeTitle.textContent = anime.name;
                
                        return anime.animethemes
                            .map(theme => {
                                const videoUrl = theme.animethemeentries?.[0]?.videos?.[0]?.link;
                                if (!videoUrl) return null;
                
                                return {
                                    anime: anime.name,
                                    type: \`\${theme.type}\${theme.sequence || ""}\`,
                                    song: theme.song?.title || "Unknown",
                                    artist: theme.song?.artists?.map(a => a.name).join(", ") || "",
                                    videoUrl
                                };
                            })
                            .filter(Boolean);
                    };
                
                    const fetchThemesByName = async (anilistId, name) => {
                        try {
                            let themes;
                            let results = await searchAniSongDBDirect(name);
            
                            const parsedId = Number(anilistId);
                            const hasCurrentId = results?.some(r => {
                                const ids = r.linked_ids?.anilist;
                                return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                            });
                    
                            if (!results?.length || !hasCurrentId) {
                                throw new Error("No themes found");
                            }
                    
                            if (els.animeTitle) els.animeTitle.textContent = name;
                    
                            const filtered = results.filter(r => {
                                const ids = r.linked_ids?.anilist;
                                return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                            });
                    
                            const songMap = new Map();
                            filtered.forEach(r => {
                                const videoUrl = r.MQ || r.HQ;
                                if (!videoUrl) return;
                    
                                const type = r.songType
                                    .replace("Opening", "OP")
                                    .replace("Ending", "ED")
                                    .replace("Insert Song", "IN");
                                const key = \`\${type}-\${r.songName}\`;
                    
                                if (!songMap.has(key)) {
                                    songMap.set(key, {
                                        anime: r.animeENName || r.animeJPName,
                                        type,
                                        song: r.songName,
                                        artist: r.songArtist,
                                        videoUrl: \`https://naedist.animemusicquiz.com/\${videoUrl}\`
                                    });
                                }
                            });
                    
                            themes =  Array.from(songMap.values()).sort((a, b) => {
                                const order = { OP: 1, ED: 2, IN: 3 };
                                const typeA = a.type.match(/[A-Z]+/)[0];
                                const typeB = b.type.match(/[A-Z]+/)[0];
                                const numA = parseInt(a.type.match(/\\d+/)?.[0] || "0");
                                const numB = parseInt(b.type.match(/\\d+/)?.[0] || "0");
                                return (order[typeA] - order[typeB]) || (numA - numB);
                            });
                
                            renderThemes(themes);
                        } catch (err) {
                            console.error("Failed to fetch themes:", err);
                            showError("Failed to load themes for selected anime");
                        }
                    };
                
                    const fetchAnilistData = async (id) => {
                        const query = \`
                            query ($id: Int) {
                                Media(id: $id, type: ANIME) {
                                    id
                                    title { romaji english native }
                                    synonyms
                                    startDate { year }
                                    relations {
                                        edges {
                                            relationType
                                            node {
                                                id
                                                title { romaji english native }
                                                startDate { year }
                                                format
                                                type
                                            }
                                        }
                                    }
                                }
                            }
                        \`;
                
                        const res = await fetch("https://graphql.anilist.co", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ query, variables: { id } })
                        });
                
                        const json = await res.json();
                        return json.data?.Media;
                    };
                
                    const getOldestPrequel = async (media) => {
                        const visited = new Set();
                        let oldest = media;
                
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
                
                            const next = await fetchAnilistData(prequels[0].id);
                            if (!next) break;
                            oldest = next;
                        }
                
                        return oldest;
                    };
                
                    const searchAniSongDBDirect = async (searchTerm) => {
                        const res = await fetch("https://anisongdb.com/api/search_request", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({anime_search_filter: { search: searchTerm, partial_match: true },and_logic: false,ignore_duplicate: false,opening_filter: true,ending_filter: true,insert_filter: true,normal_broadcast: true,rebroadcast: true,standard: true,instrumental: true,chanting: true,character: true})
                        });
                        return res.json();
                    };
                
                    const fetchAniSongDB = async () => {
                        const media = await fetchAnilistData(Number(ANILIST_ID));
                        if (!media) throw new Error("Anime not found on AniList");
                
                        playerState.animeTitle = media.title.romaji || media.title.english || media.title.native;
                        const oldestMedia = await getOldestPrequel(media);
                        let results = await searchAniSongDBDirect(playerState.animeTitle);
                
                        if (!results?.length && oldestMedia?.title) {
                            const altTitle = oldestMedia.title.romaji || oldestMedia.title.english || oldestMedia.title.native;
                            await new Promise(r => setTimeout(r, 150));
                            results = await searchAniSongDBDirect(altTitle);
                        }
                
                        if (!results?.length && media.synonyms?.length) {
                            for (const alt of media.synonyms) {
                                await new Promise(r => setTimeout(r, 150));
                                const altResults = await searchAniSongDBDirect(alt);
                                if (altResults?.length) {
                                    results = altResults;
                                    break;
                                }
                            }
                        }
                
                        const parsedId = Number(ANILIST_ID);
                        const hasCurrentId = results?.some(r => {
                            const ids = r.linked_ids?.anilist;
                            return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                        });
                
                        if (!results?.length || !hasCurrentId) {
                            throw new Error("No themes found");
                        }
                
                        if (els.animeTitle) els.animeTitle.textContent = playerState.animeTitle;
                
                        const filtered = results.filter(r => {
                            const ids = r.linked_ids?.anilist;
                            return Array.isArray(ids) ? ids.includes(parsedId) : ids === parsedId;
                        });
                
                        const songMap = new Map();
                        filtered.forEach(r => {
                            const videoUrl = r.MQ || r.HQ;
                            if (!videoUrl) return;
                
                            const type = r.songType
                                .replace("Opening", "OP")
                                .replace("Ending", "ED")
                                .replace("Insert Song", "IN");
                            const key = \`\${type}-\${r.songName}\`;
                
                            if (!songMap.has(key)) {
                                songMap.set(key, {
                                    anime: r.animeENName || r.animeJPName,
                                    type,
                                    song: r.songName,
                                    artist: r.songArtist,
                                    videoUrl: \`https://naedist.animemusicquiz.com/\${videoUrl}\`
                                });
                            }
                        });
                
                        return Array.from(songMap.values()).sort((a, b) => {
                            const order = { OP: 1, ED: 2, IN: 3 };
                            const typeA = a.type.match(/[A-Z]+/)[0];
                            const typeB = b.type.match(/[A-Z]+/)[0];
                            const numA = parseInt(a.type.match(/\\d+/)?.[0] || "0");
                            const numB = parseInt(b.type.match(/\\d+/)?.[0] || "0");
                            return (order[typeA] - order[typeB]) || (numA - numB);
                        });
                    };
                
                    const fetchThemes = async (providerOverride) => {
                        try {
                            const provider = providerOverride || PROVIDER;
                            const themes = provider === "animethemes" ? await fetchAnimeThemes() : await fetchAniSongDB("");
                            renderThemes(themes);
                        } catch (err) {
                            console.error("Failed to fetch themes:", err);
                            const fallback = PROVIDER === "animethemes" ? "anisongdb" : "animethemes";
                            const message = \`Not found on \${PROVIDER === "animethemes" ? "AnimeThemes" : "AniSongDB"}, searching on \${fallback}...\`;
                            showError(message, fallback);
                        }
                    };
                
                    const renderThemes = (themes) => {
                        if (!themes.length) {
                            els.themesList.innerHTML = '<div class="error">No themes</div>';
                            return;
                        }
                
                        const html = themes
                            .map(t => \`
                                <div class="theme-item" 
                                     data-anime="\${t.anime}" 
                                     data-type="\${t.type}" 
                                     data-song="\${t.song}" 
                                     data-video="\${t.videoUrl}">
                                    <span class="theme-type">\${t.type}</span>
                                    <span>\${t.song}</span>
                                    \${t.artist ? \`<div class="artist">\${t.artist}</div>\` : ""}
                                </div>
                            \`)
                            .join("");
                
                        els.themesList.innerHTML = html;
                        setupThemeClickHandlers();
                    };
                
                    const createVideo = () => {
                        video = document.createElement("video");
                        video.controls = false;
                        video.volume = currentVolume;
                        els.videoContainer.insertBefore(video, els.videoContainer.firstChild);
                
                        video.addEventListener("timeupdate", () => {
                            const progress = (video.currentTime / video.duration) * 100;
                            els.progressFill.style.width = progress + "%";
                            els.currentTime.textContent = formatTime(video.currentTime);
                        });
                        
                        video.addEventListener("loadedmetadata", () => { els.duration.textContent = formatTime(video.duration) });
                        video.addEventListener("ended", () => { els.playBtn.textContent = "▶" });
                
                        return video;
                    };
                
                    const playTheme = (item, shouldAutoplay) => {
                        const videoLink = item.getAttribute("data-video");
                        if (!videoLink) return;
                        const animeName = item.getAttribute("data-anime");
                        const songName = item.getAttribute("data-song");
                
                        document.querySelectorAll(".theme-item").forEach(i => i.classList.remove("active"));
                        item.classList.add("active");
                        els.videoContainer.classList.add("active");
                        els.toggleListBtn.classList.add("visible");
                        els.hideVideoBtn.classList.add("visible");
                        if (els.animeTitle) { els.animeTitle.textContent = \`\${animeName} - \${songName}\` }
                
                        if (!video) { createVideo() } 
                        else {
                            video.pause();
                            video.currentTime = 0;
                        }
                        video.src = videoLink;
                
                        if (shouldAutoplay) {
                            video.play();
                            els.playBtn.textContent = "⏸";
                        } 
                        else { els.playBtn.textContent = "▶"; }
                    };
                
                    const setupThemeClickHandlers = () => {
                        const themeItems = els.themesList.querySelectorAll(".theme-item");
                        themeItems.forEach(item => {
                            item.addEventListener("click", () => playTheme(item, true));
                        });
                
                        if (AUTOPLAY && themeItems.length > 0) {
                            const firstOP = Array.from(themeItems).find(item => {
                                const type = item.getAttribute("data-type");
                                return type?.startsWith("OP");
                            });
                
                            if (!firstOP) { return }
                            els.themesList.classList.add("hidden");
                            playerState.isListVisible = false;
                            playTheme(firstOP, true);
                        }
                    };
                
                    // Manual match handlers
                    const setupManualMatchHandlers = () => {
                        els.manualMatchBtn.addEventListener("click", () => {
                            playerState.isManualMatchVisible = !playerState.isManualMatchVisible;
                            if (playerState.isManualMatchVisible) {
                                els.manualMatchSection.classList.add("visible");
                                els.themesList.classList.add("hidden");
                                playerState.isListVisible = false;
                            } else {
                                els.manualMatchSection.classList.remove("visible");
                                els.animeResultsList.classList.remove("visible");
                                els.animeResultsList.innerHTML = '';
                                els.themesList.classList.remove("hidden");
                            }
                        });
                    
                        els.manualSearchBtn.addEventListener("click", async () => {
                            const query = els.manualSearchInput.value.trim();
                            const provider = els.manualProviderSelect.value;
                    
                            if (!query) {
                                alert("Please enter a search query");
                                return;
                            }
                            els.animeResultsList.innerHTML = '<div class="loading">Searching anime...</div>';
                            els.animeResultsList.classList.add("visible");
                            
                            try {
                                const results = provider === "animethemes" ? await searchAnimeThemes(query) : await searchAniSongDB(query);
                                displayAnimeResults(results, provider);
                            } catch (err) {
                                console.error("Anime search failed:", err);
                                els.animeResultsList.innerHTML = '<div class="error">Search failed</div>';
                            }
                        });
                    
                        els.manualClearBtn.addEventListener("click", async () => {
                            els.manualSearchInput.value = "";
                            els.animeResultsList.classList.remove("visible");
                            els.animeResultsList.innerHTML = '';
                            
                            if (video) {
                                video.pause();
                                video.removeAttribute("src");
                                video.load();
                                video = null;
                            }
                            
                            els.videoContainer.classList.remove("active");
                            els.hideVideoBtn.classList.remove("visible");
                            els.toggleListBtn.classList.remove("visible");
                            els.progressFill.style.width = "0%";
                            els.currentTime.textContent = "0:00";
                            els.duration.textContent = "0:00";
                            els.playBtn.textContent = "▶";
                    
                            document.querySelectorAll(".theme-item").forEach(i => i.classList.remove("active"));
                    
                            els.themesList.innerHTML = '<div class="loading">Reloading themes...</div>';
                            els.themesList.classList.remove("hidden");
                            playerState.isListVisible = true;
                    
                            await fetchThemes();
                            playerState.isManualMatchVisible = false;
                            els.manualMatchSection.classList.remove("visible");
                            els.manualMatchIndicator.style.display = 'none';
                        });
                    
                        els.manualSearchInput.addEventListener("keypress", (e) => {
                            if (e.key === "Enter") { els.manualSearchBtn.click() }
                        });
                    };
                    // Control handlers
                    const setupControls = () => {
                        els.playBtn.addEventListener("click", () => {
                            if (video?.src) {
                                if (video.paused) {
                                    playerState.isVideoVisible = true;
                                    video.play();
                                    els.playBtn.textContent = "⏸";
                                } else {
                                    video.pause();
                                    els.playBtn.textContent = "▶";
                                }
                            }
                        });
                
                        els.skipBackBtn.addEventListener("click", () => { if (video?.src) video.currentTime = Math.max(0, video.currentTime - 10) });
                
                        els.skipForwardBtn.addEventListener("click", () => { if (video?.src) video.currentTime = Math.min(video.duration, video.currentTime + 10) });
                
                        els.progressBar.addEventListener("click", (e) => {
                            if (video?.src) {
                                const rect = els.progressBar.getBoundingClientRect();
                                const percentage = (e.clientX - rect.left) / rect.width;
                                video.currentTime = percentage * video.duration;
                            }
                        });
                
                        els.volumeControl.addEventListener("click", (e) => {
                            const rect = els.volumeControl.getBoundingClientRect();
                            const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                
                            currentVolume = percentage;
                            if (!video) { return }
                            
                            video.volume = currentVolume;
                            if (currentVolume > 0) {
                                playerState.isMuted = false;
                                els.muteBtn.textContent = currentVolume > 0.5 ? "🔊" : "🔉";
                            }
                            els.volumeBar.style.width = \`\${percentage * 100}%\`;
                        });
                
                        els.muteBtn.addEventListener("click", () => {
                            if (!video) { return }
                            playerState.isMuted = !playerState.isMuted;
                            video.muted = playerState.isMuted;
                            els.muteBtn.textContent = playerState.isMuted ? "🔇" : "🔊";
                        });
                
                        els.fullscreenBtn.addEventListener("click", () => {
                            if (!video) { return }
                            if (video.requestFullscreen) { video.requestFullscreen() } 
                            else if (video.webkitRequestFullscreen) { video.webkitRequestFullscreen();}
                        });
                
                        els.toggleListBtn.addEventListener("click", () => {
                            playerState.isListVisible = !playerState.isListVisible;
                            els.themesList.classList.toggle("hidden", !playerState.isListVisible);
                        });
                
                        els.hideVideoBtn.addEventListener("click", () => {
                            playerState.isVideoVisible = !playerState.isVideoVisible;
                            els.videoContainer.classList.toggle("hidden-video", !playerState.isVideoVisible);
                        });
                
                        els.minimizeBtn.addEventListener("click", () => {
                            player.classList.add("minimized");
                            player.style.cssText = "";
                            if (video && !video.paused) {
                                video.pause();
                                els.playBtn.textContent = "▶";
                            }
                        });
                
                        els.restoreBtn.addEventListener("click", () => { player.classList.remove("minimized") });
                    };
                    setupDragHandlers();
                    setupControls();
                    setupManualMatchHandlers();
                    updateManualMatchIndicator();
                    fetchThemes()
                    
                    els.volumeBar.style.width = \`\${INITIAL_VOLUME * 100}%\`;
                })();
            `;
        };

        ctx.dom.onReady(async () => {
            ctx.screen.onNavigate(async (e) => {
                const isEntry = e.pathname === "/entry";
                if (!isEntry) {
                    await cleanupPlayer();
                    return;
                }
                const anilistId = e.searchParams?.id;
                if (!anilistId) return;

                if (state.isPlayerInjected && anilistId === state.lastAnilistId) {
                    console.log("Anime Player already injected, skipping...");
                    return;
                }
                state.isPlayerInjected = true;
                state.lastAnilistId = anilistId;

                try {
                    const body = await ctx.dom.queryOne("body");
                    if (!body) return;

                    const settings = getSettings();
                    await cleanupPlayer();

                    const script = await ctx.dom.createElement("script");
                    script.setAttribute("data-anime-player", "true");
                    script.setText(createPlayerScript(anilistId, settings));
                    body.append(script);
                } catch (error) {
                    console.error("Error in plugin:", error);
                }
            });

            ctx.screen.loadCurrent();
        });
    });
}