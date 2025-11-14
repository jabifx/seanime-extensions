/// <reference path="./manga-provider.d.ts" />

class Provider implements CustomSource {
    api_key = "{{api-key}}"

    getSettings(): Settings {
        return {
            supportsAnime: true,
            supportsManga: false,
        }
    }

    async getAnime(ids: number[]): Promise<AL_BaseAnime[]> {
        const media = $store.get("simkl.media") as Record<number, AL_BaseAnime>;
        const ret: AL_BaseAnime[] = [];

        for (const id of ids) {
            const found = media?.[id];
            if (found) ret.push(found);
        }

        return ret;
    }

    async getAnimeDetails(id: number): Promise<$app.AL_AnimeDetailsById_Media | null> {
        return null
    }

    private parseDate(dateStr?: string) {
        if (!dateStr) return undefined;
        const d = new Date(dateStr);
        return {
            year: d.getUTCFullYear(),
            month: d.getUTCMonth() + 1,
            day: d.getUTCDate(),
        };
    }

    async getAnimeMetadata(id: number): Promise<Metadata_AnimeMetadata | null> {
        const typeMap = $store.get('simkl.typeMap') as Record<number, 'anime' | 'tv' | 'movie'> | undefined;
        const mediaCache = $store.get('simkl.media') as Record<number, AL_BaseAnime> | undefined;

        const typeSimkl = typeMap?.[id] ?? 'anime';

        if (typeSimkl === 'movie') {
            const cachedTitle = mediaCache?.[id]?.title;
            return {
                titles: { en: cachedTitle?.english ?? cachedTitle?.native ?? 'Movie' },
                episodes: {
                    '1': {
                        anidbId: 0,
                        tvdbId: 0,
                        anidbEid: 0,
                        title: cachedTitle?.english ?? cachedTitle?.native ?? 'Movie',
                        image: '',
                        airDate: null,
                        length: 90,
                        summary: '',
                        overview: '',
                        episodeNumber: 1,
                        episode: '1',
                        seasonNumber: 1,
                        absoluteEpisodeNumber: 1,
                        hasImage: false,
                    },
                },
                episodeCount: 1,
                specialCount: 0,
            };
        }

        const endpoint = `https://api.simkl.com/${typeSimkl}/episodes/${id}?client_id=${this.api_key}`;

        try {
            const res = await fetch(endpoint, { headers: { 'Content-Type': 'application/json' } });
            if (!res.ok) return null;

            const data = await res.json();
            if (!Array.isArray(data)) return null;

            const episodes: Record<string, Metadata_EpisodeMetadata> = {};
            let specialCount = 0;

            for (const ep of data) {
                const episodeNumber = Number(ep.episode) || Object.keys(episodes).length + 1;
                const isSpecial = ep.type === 'special';
                if (isSpecial) specialCount++;

                const image = ep.img ? `https://simkl.in/episodes/${ep.img}_w.jpg` : '';

                episodes[episodeNumber.toString()] = {
                    anidbId: 0,
                    tvdbId: 0,
                    anidbEid: 0,
                    title: ep.title ?? `Episode ${episodeNumber}`,
                    image: image,
                    airDate: this.parseDate(ep.date),
                    length: 24,
                    summary: ep.description ?? '',
                    overview: ep.description ?? '',
                    episodeNumber: episodeNumber,
                    episode: episodeNumber.toString(),
                    seasonNumber: 1,
                    absoluteEpisodeNumber: episodeNumber,
                    hasImage: !!ep.img,
                };
            }

            const cachedTitle = mediaCache?.[id]?.title;

            const orderedEpisodes = Object.fromEntries(
                Object.entries(episodes).sort(([, a], [, b]) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0))
            );

            return {
                titles: { en: cachedTitle?.english ?? cachedTitle?.native },
                episodes: orderedEpisodes,
                episodeCount: Object.values(orderedEpisodes)
                    .filter(e => e && e.title && !e.title.toLowerCase().includes('special')).length,
                specialCount,
            };
        } catch (err) {
            console.error(`Error fetching metadata for ${id}:`, err);
            return null;
        }
    }

    async getAnimeWithRelations(id: number): Promise<$app.AL_CompleteAnime> {
        const media = $store.get("simkl.media") as Record<number, $app.AL_CompleteAnime>;
        const cached = media?.[id];
        if (!cached) throw new Error("not found.");

        return {
            ...cached,
            relations: { edges: [] },
        };
    }

    async listAnime(search: string, page: number, perPage: number): Promise<ListResponse<AL_BaseAnime>> {
        const offset = (page - 1) * perPage;

        const headers = {
            "Content-Type": "application/json",
            "simkl-api-key": this.api_key,
        };

        const endpoints =
            search.trim() === ""
                ? [
                    {
                        url: `https://api.simkl.com/anime/trending/?extended=overview,metadata,tmdb,genres,trailer&client_id=${this.api_key}`,
                        typeSimkl: "anime",
                    },
                ]
                :[
                    {
                        url: `https://api.simkl.com/search/anime?q=${encodeURIComponent(search)}&page=${page}&limit=${perPage}&extended=full&client_id=${this.api_key}`,
                        typeSimkl: "anime",
                    },
                    {
                        url: `https://api.simkl.com/search/tv?q=${encodeURIComponent(search)}&page=${page}&limit=${perPage}&extended=full&client_id=${this.api_key}`,
                        typeSimkl: "tv",
                    },
                    {
                        url: `https://api.simkl.com/search/movie?q=${encodeURIComponent(search)}&page=${page}&limit=${perPage}&extended=full&client_id=${this.api_key}`,
                        typeSimkl: "movie",
                    },
                ];

        const responses = await Promise.all(
            endpoints.map(async (entry) => {
                try {
                    const r = await fetch(entry.url, { headers });
                    if (!r.ok) return [];
                    const json = await r.json();
                    if (!Array.isArray(json)) return [];
                    return json.map((j: any) => ({ ...j, _typeSimkl: entry.typeSimkl }));
                } catch {
                    return [];
                }
            })
        );

        const allResults = responses.flat().filter((x: any) => x && x.ids);

        const typeStore: Record<number, "anime" | "tv" | "movie"> = {};
        const media: AL_BaseAnime[] = allResults.map((item: any) => {
            const posterPath = item.poster ? `https://simkl.in/posters/${item.poster}_` : "";
            const title = item.title ?? item.show_title ?? item.movie_title ?? "";

            const base: AL_BaseAnime = {
                id: item.ids.simkl_id,
                siteUrl: "https://simkl.com/" + item.url,
                title: {
                    userPreferred: title,
                    romaji: title,
                    english: item.english_title ?? title,
                    native: title,
                },
                coverImage: {
                    large: posterPath + "m.jpg",
                    medium: posterPath + "m.jpg",
                    extraLarge: posterPath + "m.jpg",
                    color: "",
                },
                description: item.overview ?? "",
                genres: item.genres ?? [],
                meanScore: item.ratings?.simkl?.rating ? Math.round(item.ratings.simkl.rating * 10) : 0,
                synonyms: item?.all_titles || [],
                status: item.status?.toUpperCase() ?? "FINISHED",
                bannerImage: posterPath + "w.jpg",
                episodes: item.total_episodes || item.ep_count || 1,
                type: "ANIME",
                format: item.anime_type?.toUpperCase() || item.type?.toUpperCase() || "TV",
                seasonYear: item.year,
                isAdult: item.adult ?? false,
                startDate: { year: item.year, month: 1, day: 1 },
                endDate: { year: item.year, month: 1, day: 1 },
            };

            typeStore[base.id] = item._typeSimkl;
            return base;
        });

        $store.set("simkl.media", Object.fromEntries(media.map((m) => [m.id, m])));
        $store.set("simkl.typeMap", typeStore);

        return {
            media: media,
            total: media.length,
            page: page,
            totalPages: Math.ceil(media.length / perPage) || 1,
        };
    }
}