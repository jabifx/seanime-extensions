/// <reference path="./manga-provider.d.ts" />

class Provider implements CustomSource {
    getSettings(): Settings {
        return {
            supportsAnime: false,
            supportsManga: true,
        };
    }

    private uuidToNumber(uuid: string): number {
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
        }
        return hash % 268435456;
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

    async getManga(ids: number[]): Promise<$app.AL_BaseManga[]> {
        const idMap: Record<number, string> = $store.get("mangaIdMap") || {};
        const result: $app.AL_BaseManga[] = [];

        for (const id of ids) {
            const uuid = idMap[id];
            if (!uuid) continue;

            const res = await fetch(`https://api.mangadex.org/manga/${uuid}?includes[]=cover_art`);
            if (!res.ok) continue;
            const data = await res.json();
            const m = data.data;
            const attrs = m.attributes;

            const title = Object.values(attrs.title)[0];
            const desc = attrs.description?.en;
            const coverRel = m.relationships?.find((r: any) => r.type === "cover_art");
            const fileName = coverRel?.attributes?.fileName;
            const coverBase = `https://uploads.mangadex.org/covers/${m.id}/${fileName}`;

            result.push({
                id,
                siteUrl: `https://mangadex.org/title/${m.id}`,
                title: {
                    userPreferred: title,
                    romaji: title,
                    english: title,
                    native: m.altTitles?.find((t: any) => t.ja),
                },
                description: desc,
                type: "MANGA",
                format: "MANGA",
                isAdult: ["pornographic", "erotica"].includes(attrs.contentRating),
                genres: attrs.tags?.map((t: any) => t.attributes.name.en).filter(Boolean) || [],
                coverImage: {
                    large: `${coverBase}.512.jpg`,
                    extraLarge: `${coverBase}.512.jpg`,
                    medium: `${coverBase}.256.jpg`,
                    color: "",
                },
                startDate: this.parseDate(attrs.createdAt),
                endDate: this.parseDate(attrs.updatedAt),
            });
        }

        return result;
    }

    async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
        return null;
    }

    async listManga(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseManga>> {
        const res = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(search)}&limit=${perPage}&offset=${(page - 1) * perPage}&includes[]=cover_art`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();

        const idMap: Record<number, string> = $store.get("mangaIdMap") || {};

        const media: $app.AL_BaseManga[] = data.data.map((m: any) => {
            const attrs = m.attributes;
            const title = Object.values(attrs.title)[0];
            const desc = attrs.description?.en;
            const coverRel = m.relationships?.find((r: any) => r.type === "cover_art");
            const fileName = coverRel?.attributes?.fileName;
            const coverBase = `https://uploads.mangadex.org/covers/${m.id}/${fileName}`;

            const numericId = this.uuidToNumber(m.id);
            idMap[numericId] = m.id;

            return {
                id: numericId,
                siteUrl: `https://mangadex.org/title/${m.id}`,
                title: {
                    userPreferred: title,
                    romaji: title,
                    english: title,
                    native: m.altTitles?.find((t: any) => t.ja),
                },
                description: desc,
                type: "MANGA",
                format: "MANGA",
                isAdult: ["pornographic", "erotica"].includes(attrs.contentRating),
                genres: attrs.tags?.map((t: any) => t.attributes.name.en).filter(Boolean) || [],
                coverImage: {
                    large: `${coverBase}.512.jpg`,
                    extraLarge: `${coverBase}.512.jpg`,
                    medium: `${coverBase}.256.jpg`,
                    color: "",
                },
            };
        });

        $store.set("mangaIdMap", idMap);

        return {
            media: media,
            total: media.length,
            page: page,
            totalPages: Math.ceil(media.length / perPage),
        };
    }
}
