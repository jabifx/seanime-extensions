/// <reference path="./manga-provider.d.ts" />

class Provider implements CustomSource {
    getSettings(): Settings {
        return {
            supportsAnime: true,
            supportsManga: true,
        }
    }

    async getAnime(ids: number[]): Promise<$app.AL_BaseAnime[]> {
        const ret: $app.AL_BaseAnime[] = [];

        for (const id of ids) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
                if (!res.ok) continue;

                const data = await res.json();
                const a = data.data;

                const anime: $app.AL_BaseAnime = {
                    id: a.mal_id,
                    siteUrl: a.url,
                    status: a.status,
                    season: a.season,
                    seasonYear: a.year,
                    type: a.type,
                    format: a.type,
                    bannerImage: a.images?.jpg?.large_image_url ?? a.images?.webp?.large_image_url,
                    coverImage: {
                        extraLarge: a.images?.jpg?.large_image_url,
                        large: a.images?.jpg?.image_url,
                        medium: a.images?.jpg?.small_image_url,
                        color: ""
                    },
                    title: {
                        userPreferred: a.title,
                        romaji: a.title_japanese,
                        english: a.title_english,
                        native: a.title_japanese
                    },
                    episodes: a.episodes,
                    duration: 24,
                    description: a.synopsis,
                    genres: a.genres?.map((g: any) => g.name),
                    meanScore: Math.round(a.score * 10),
                    startDate: this.parseDate(a.aired?.from),
                    endDate: this.parseDate(a.aired?.to),
                    isAdult: a.explicit_genres?.length > 0,
                    countryOfOrigin: "JP"
                };
                ret.push(anime);
            } catch {

            }
        }

        return ret;
    }

    async getAnimeDetails(id: number): Promise<$app.AL_AnimeDetailsById_Media | null> {
        return null
    }

    async getAnimeMetadata(id: number): Promise<$app.Metadata_AnimeMetadata | null> {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const json = await res.json();
        const animeData = json.data;

        const epsRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
        const epsJson = await epsRes.json();

        const episodes: Record<string, $app.Metadata_EpisodeMetadata> = {};
        let episodeNumber = 1;

        for (const ep of epsJson.data) {
            episodes[String(episodeNumber)] = {
                anidbId: 0,
                tvdbId: 0,
                title: ep.title,
                image: "",
                airDate: ep.aired,
                length: 24,
                summary: "",
                overview: "",
                episodeNumber: episodeNumber,
                episode: episodeNumber,
                seasonNumber: 1,
                absoluteEpisodeNumber: episodeNumber,
                anidbEid: 0,
                hasImage: false,
            };
            episodeNumber += 1;
        }

        return {
            titles: { en: animeData.title_english },
            episodes: episodes,
            episodeCount: animeData.episodes,
            specialCount: 0,
        };
    }

    async getAnimeWithRelations(id: number): Promise<AL_CompleteAnime> {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        if (!res.ok) throw new Error("Error fetching anime data");
        const data = await res.json();

        const anime = data.data;
        if (!anime) throw new Error("Anime not found");

        const relationsRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
        const relationsData = await relationsRes.json();

        const relations = {
            edges: relationsData.data?.map((rel: any) => ({
                relationType: rel.relation,
                node: {
                    id: rel.entry?.[0]?.mal_id,
                    title: { userPreferred: rel.entry?.[0]?.name },
                    siteUrl: rel.entry?.[0]?.url,
                },
            })),
        };

        const result: AL_CompleteAnime = {
            id,
            idMal: id,
            siteUrl: anime.url,
            status: anime.status,
            season: anime.season,
            seasonYear: anime.year,
            type: anime.type,
            format: anime.type,
            bannerImage: anime.images?.jpg?.large_image_url,
            episodes: anime.episodes,
            synonyms: anime.titles?.map((t: any) => t.title),
            isAdult: anime.rating?.includes("R") || anime.rating?.includes("Rx") || false,
            countryOfOrigin: anime.source,
            meanScore: Math.round(anime.score * 10),
            description: anime.synopsis,
            genres: anime.genres?.map((g: any) => g.name),
            duration: anime.duration,
            title: {
                userPreferred: anime.title,
                romaji: anime.title,
                english: anime.title_english,
                native: anime.title_japanese,
            },
            coverImage: {
                extraLarge: anime.images?.jpg?.large_image_url,
                large: anime.images?.jpg?.image_url,
                medium: anime.images?.jpg?.small_image_url,
            },
            startDate: this.parseDate(anime.aired?.from),
            endDate: this.parseDate(anime.aired?.to),
            relations,
        };

        return result;
    }

    async getManga(ids: number[]): Promise<$app.AL_BaseManga[]> {
        const ret: $app.AL_BaseManga[] = [];

        for (const id of ids) {
            try {
                const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
                if (!res.ok) continue;

                const data = await res.json();
                const m = data.data;

                const manga: $app.AL_BaseManga = {
                    id: m.mal_id,
                    idMal: m.mal_id,
                    siteUrl: m.url,
                    status: m.status,
                    chapters: m.chapters,
                    volumes: m.volumes,
                    title: {
                        userPreferred: m.title,
                        romaji: m.title,
                        english: m.title_english,
                        native: m.title_japanese,
                    },
                    coverImage: {
                        extraLarge: m.images?.jpg?.large_image_url,
                        large: m.images?.jpg?.image_url,
                        medium: m.images?.jpg?.small_image_url,
                        color: "",
                    },
                    bannerImage: m.images?.jpg?.large_image_url,
                    description: m.synopsis,
                    genres: m.genres?.map((g: any) => g.name),
                    meanScore: m.score ? Math.round(m.score * 10) : undefined,
                    isAdult: m.explicit_genres?.length > 0,
                    countryOfOrigin: "JP",
                    startDate: this.parseDate(m.published?.from),
                    endDate: this.parseDate(m.published?.to),
                };

                ret.push(manga);
            } catch {

            }
        }

        return ret;
    }

    async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
        return null;
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

    async listAnime(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseAnime>> {
        const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(search)}&page=${page}&limit=20&order_by=members&sort=desc`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);

        const json = await res.json();

        const data = (json.data).map((a: any) => ({
            id: a.mal_id,
            siteUrl: a.url,
            title: {
                userPreferred: a.title,
                romaji: a.title,
                english: a.title_english,
                native: a.title_japanese,
            },
            coverImage: {
                extraLarge: a.images?.jpg?.large_image_url,
                large: a.images?.jpg?.image_url,
                medium: a.images?.jpg?.small_image_url,
            },
            bannerImage: a.trailer?.images?.maximum_image_url,
            episodes: a.episodes,
            synonyms: a.titles?.map((t: any) => t.title),
            isAdult: a.rating?.includes("R+") || a.rating?.includes("Rx"),
            meanScore: a.score ? Math.round(a.score * 10) : undefined,
            description: a.synopsis,
            genres: a.genres?.map((g: any) => g.name),
            startDate: this.parseDate(a.aired?.from),
            endDate: this.parseDate(a.aired?.to),
        })) as $app.AL_BaseAnime[];

        return {
            media: data,
            total: data.length,
            page: page,
            totalPages: Math.ceil(data.length / perPage),
        };
    }

    async listManga(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseManga>> {
        const url = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(search)}&page=${page}&limit=20&order_by=members&sort=desc`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);

        const json = await res.json();

        const data = (json.data).map((m: any) => ({
            id: m.mal_id,
            idMal: m.mal_id,
            siteUrl: m.url,
            status: m.status,
            chapters: m.chapters,
            volumes: m.volumes,
            title: {
                userPreferred: m.title,
                romaji: m.title,
                english: m.title_english,
                native: m.title_japanese,
            },
            coverImage: {
                extraLarge: m.images?.jpg?.large_image_url,
                large: m.images?.jpg?.image_url,
                medium: m.images?.jpg?.small_image_url,
                color: "",
            },
            bannerImage: m.images?.jpg?.large_image_url,
            description: m.synopsis,
            genres: m.genres?.map((g: any) => g.name),
            meanScore: Math.round(m.score * 10),
            isAdult: m.explicit_genres?.length > 0,
            countryOfOrigin: "JP",
            startDate: this.parseDate(m.published?.from),
            endDate: this.parseDate(m.published?.to),
        }));

        return {
            media: data,
            total: data.length,
            page: page,
            totalPages: Math.ceil(data.length / perPage),
        };
    }
}