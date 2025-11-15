
class Provider implements CustomSource {

    getSettings(): Settings {
        return {
            supportsAnime: false,
            supportsManga: true,
        };
    }

    async getManga(ids: number[]): Promise<AL_BaseManga[]> {
        const ret: AL_BaseManga[] = [];
        console.log(ids)

        for (const id of ids) {
            const res = await fetch(`https://api.mangabaka.dev/v1/series/${id}/full`);
            if (!res.ok) continue;

            const json = await res.json();
            const m = json.data;
            if (!m) continue;

            const item: AL_BaseManga = {
                id: m.id,
                siteUrl: m.links?.find((l: string) => l.includes("mangabaka.dev")),
                status: m.status,
                season: "",
                type: "MANGA",
                format: m.type,
                bannerImage: m.source?.kitsu?.response?.bannerImage?.original?.url ?? m.source?.kitsu?.response?.bannerImage?.views?.[0]?.url ?? "",
                chapters: Number(m.total_chapters),
                volumes: Number(m.final_volume),
                synonyms: [...(m.secondary_titles?.en?.map((t: any) => t.title) ?? [])],
                isAdult: m.content_rating === "adult",
                countryOfOrigin: m.source?.anilist?.response?.countryOfOrigin ?? "JP",
                meanScore: m.rating != null ? Math.round(m.rating) : 1,
                description: m.description ?? "",
                genres: m.genres ?? [],
                title: {
                    userPreferred: m.title,
                    romaji: m.romanized_title,
                    english: "",
                    native: m.native_title
                },
                coverImage: {
                    extraLarge: m.cover?.raw?.url ?? "",
                    large: m.cover?.x350?.x1 ?? "",
                    medium: m.cover?.x150?.x1 ?? "",
                    color: ""
                },
                startDate: { year: m.year, month: 1, day: 1 },
                endDate: { year: m.year, month: 1, day: 1 },
            };

            ret.push(item);
        }

        console.log(ret);

        return ret;
    }

    // Optionally returns the manga details.
    // Similarly to getAnimeDetails, not all fields will be used by the client.
    async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
        return null
    }


    async  listManga(search: string, page: number, perPage: number): Promise<ListResponse<AL_BaseManga>> {
        const res = await fetch(`https://api.mangabaka.dev/v1/series/search?q=${encodeURIComponent(search)}&page=${page}&limit=${50}`);
        const json = await res.json();

        const media: AL_BaseManga[] = json.data.map((m: any): AL_BaseManga => {
            return {
                id: m.id,
                idMal: m.source?.my_anime_list?.id ?? null,
                siteUrl: m.links?.find((l: string) => l.includes("mangabaka.dev")),
                status: m.status,
                season: "",
                type: "MANGA",
                format: m.type,
                bannerImage: m.cover?.x350?.x1,
                chapters: Number(m.total_chapters),
                volumes: Number(m.final_volume),
                synonyms: [...m.secondary_titles?.en?.map((t: any) => t.title) ?? []],
                isAdult: m.content_rating === "adult",
                countryOfOrigin: "",
                meanScore: m.rating != null ? Math.round(m.rating) : 1,
                description: m.description ?? "",
                genres: m.genres ?? [],
                title: {
                    userPreferred: m.title,
                    romaji: m.romanized_title,
                    english: m.romanized_title,
                    native: m.native_title
                },
                coverImage: {
                    extraLarge: m.cover?.raw?.url ?? "",
                    large: m.cover?.x350?.x1 ?? "",
                    medium: m.cover?.x150?.x1 ?? "",
                    color: ""
                },
                startDate: { year: m.year, month: 1, day: 1 },
                endDate: { year: m.year, month: 1, day: 1 },
            };
        });

        return {
            media: media,
            total: media.length,
            page: page,
            totalPages: 1,
        };
    }
}
