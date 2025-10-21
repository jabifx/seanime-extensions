/// <reference path="../online-streaming-provider.d.ts" />


class Provider {

    api = "https://www3.animeflv.net/api"

    getSettings(): Settings {
        return {
            episodeServers: ["yu"],
            supportsDub: false,
        }
    }

    async search(query: SearchOptions): Promise<SearchResult[]> {
        const res = await fetch(`${this.api}/animes/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
            body: `value=${encodeURIComponent(query.query.replace(/\s+/g, "+"))}`,
        });


        if (!res.ok) {
            return [];
        }

        const data = await res.json();


        return data.map((anime: any) => ({
            id: anime.slug,
            title: anime.title,
            url: `https://www3.animeflv.net/anime/${anime.slug}`,
            subOrDub: "sub",
        }));
    }

    async findEpisodes(id: string): Promise<EpisodeDetails[]> {
        const res = await fetch(`https://www3.animeflv.net/anime/${id}`);
        const html = await res.text();

        // Extrae el array de episodes del <script>
        const match = html.match(/var episodes = (\[\[.*?\]\]);/);
        if (!match) return [];

        const episodes = JSON.parse(match[1]) as [number, number][];

        const results = episodes.map(([episodeNum]) => ({
            id: episodeNum.toString(),
            number: episodeNum,
            url: `https://www3.animeflv.net/ver/${id}-${episodeNum}`,
            title: `Episode ${episodeNum}`,
        }));

        return results;
    }

    async findEpisodeServer(episode: EpisodeDetails, _server: string): Promise<EpisodeServer> {
        const res = await fetch(episode.url);
        const html = await res.text();

        const match = html.match(/var videos = (\{.*?\});/);
        if (!match) throw new Error("No se encontró el objeto 'videos' en el HTML.");

        const videos = JSON.parse(match[1]) as Record<string, any[]>;
        const servers: Record<string, { server: string; url: string }[]> = {};
        const orderedTypes = Object.keys(videos).sort((a, b) => (a === "SUB" ? -1 : 1));

        for (const type of orderedTypes) {
            servers[type] = videos[type].map(v => ({
                server: v.server,
                url: v.code || v.url,
            }));
        }

        const targetServer = "yu"
        const selected = Object.values(servers)
            .flat()
            .find(s => s.server.toLowerCase() === targetServer);

        if (!selected) throw new Error(`No se encontró el servidor ${_server}.`);

        // Headers comunes
        const headers = {
            "Accept": "*/*",
            "Accept-Encoding": "identity;q=1, *;q=0",
            "Accept-Language": "es-ES,es;q=0.9",
            "Connection": "keep-alive",
            "Range": "bytes=0-",
            "Referer": "https://www.yourupload.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        };

        // YourUpload
        const yuRes = await fetch(selected.url);
        const yuHtml = await yuRes.text();


        let videoMatch = yuHtml.match(/<video[^>]+src=["']([^"']+)["']/i);
        let usedFallback = false;

        if (!videoMatch) {
            videoMatch = yuHtml.match(/file:\s*['"]([^'"]+\.mp4)['"]/i);
            if (videoMatch) usedFallback = true;
        }

        if (!videoMatch || !videoMatch[1])
            throw new Error("No se encontró la URL del video en YourUpload.");

        const videoUrl = videoMatch[1];

        if (usedFallback) {
            return {
                server: "yourupload",
                headers,
                videoSources: [{
                    url: videoUrl,
                    type: "mp4",
                    quality: "unknown",
                    subtitles: [],
                }],
            };
        }

        const finalReq = await fetch(videoUrl, { method: "GET", redirect: "manual", headers });
        const finalUrl = finalReq.headers.get("location") || videoUrl;

        return {
            server: "yourupload",
            headers,
            videoSources: [{
                url: finalUrl,
                type: "mp4",
                quality: "unknown",
                subtitles: [],
            }],
        };
    }

}