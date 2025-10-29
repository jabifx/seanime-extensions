/// <reference path="../online-streaming-provider.d.ts" />

class Provider {
    api = "https://anime.uniquestream.net/api/v1"

    getSettings(): Settings {
        return {
            episodeServers: ["Default", "Zen"],
            supportsDub: true,
        }
    }

    async search(opts: SearchOptions): Promise<SearchResult[]> {
        const headers = {
            "accept": "*/*",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        };

        // Primera request: búsqueda
        const res = await fetch(`${this.api}/search?page=1&query=${encodeURIComponent(opts.query)}&t=all&limit=6`, {
            headers,
        });

        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const json = await res.json();
        const series = json?.series ?? [];

        const results: SearchResult[] = [];

        for (const s of series) {
            try {
                // Segunda request: detalles de la serie
                const detailsRes = await fetch(`${this.api}/series/${s.content_id}`, { headers });
                if (!detailsRes.ok) continue;

                const details = await detailsRes.json();

                const hasSub = Array.isArray(details.subtitle_locales) && details.subtitle_locales.length > 0;
                const hasDub = Array.isArray(details.audio_locales) && details.audio_locales.some((a: string) => a !== "ja-JP");
                const subOrDub = hasSub && hasDub ? "both" : hasDub ? "dub" : "sub";

                const seasons = details.seasons || [];

                // Cada temporada es un SearchResult individual
                for (const season of seasons) {
                    results.push({
                        id: season.content_id,
                        title: season.title,
                        url: `https://anime.uniquestream.net/series/${s.content_id}`,
                        subOrDub: subOrDub,
                    });
                }
            } catch {
                // Ignorar errores en series individuales
            }
        }

        return results;
    }

    async findEpisodes(showId: string): Promise<EpisodeDetails[]> {
        const episodes: EpisodeDetails[] = [];
        let page = 1;

        while (true) {
            const res = await fetch(`${this.api}/season/${showId}/episodes?page=${page}&limit=5&order_by=asc`, {
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "es-ES,es;q=0.9",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                },
            });

            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) break;

            for (const ep of data) {
                episodes.push({
                    id: ep.content_id,
                    number: parseInt(ep.episode_number, 10),
                    title: ep.title,
                    url: `https://anime.uniquestream.net/watch/${ep.content_id}`,
                });
            }

            if (data.length < 5) break;

            page++;
        }

        return episodes;
    }

    async findEpisodeServer(episodeOrId, serverName) {
        const headers = {
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
            "accept": "*/*",
        };

        const res = await fetch(`${this.api}/episode/${episodeOrId.id}/media/hls/ja-JP`, { headers });
        const json = await res.json();

        // Si la respuesta usa DASH → error
        if (json.dash || (json.versions?.dash?.length)) {
            throw new Error("Formato incompatible de streaming (DASH)");
        }

        const videoSources = [];

        // --- fuente principal (sin subtítulos duros)
        if (json.hls?.playlist) {
            videoSources.push({
                url: json.hls.playlist,
                type: "m3u8",
                quality: `${json.hls.locale || "ja-JP"} (No Subs)`,
                subtitles: [],
            });
        }

        // --- versiones hardsub del principal (ja-JP)
        if (json.hls?.hard_subs?.length) {
            for (const hs of json.hls.hard_subs) {
                videoSources.push({
                    url: hs.playlist,
                    type: "m3u8",
                    quality: `${hs.locale} (HardSub)`,
                    subtitles: [],
                });
            }
        }

        // --- versiones dobladas (otros idiomas)
        if (json.versions?.hls?.length) {
            for (const v of json.versions.hls) {
                // versión sin subtítulos duros
                if (v.playlist) {
                    videoSources.push({
                        url: v.playlist,
                        type: "m3u8",
                        quality: v.locale,
                        subtitles: [],
                    });
                }

                // versiones con subtítulos duros dentro de la versión
                if (v.hard_subs?.length) {
                    for (const hs of v.hard_subs) {
                        videoSources.push({
                            url: hs.playlist,
                            type: "m3u8",
                            quality: `${v.locale} (HardSub ${hs.locale})`,
                            subtitles: [],
                        });
                    }
                }
            }
        }

        return {
            server: "Default",
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br, zstd",
                "accept-language": "es-ES,es;q=0.9",
                "origin": "https://anime.uniquestream.net",
                "referer": "https://anime.uniquestream.net/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
            },
            videoSources,
        };
    }
}