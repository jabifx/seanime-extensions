class Provider implements CustomSource {

    api = "https://api.kagane.org/api/v1"

    getSettings(): Settings {
        return {
            supportsAnime: false,
            supportsManga: true,
        }
    }

    async getManga(ids: number[]): Promise<$app.AL_BaseManga[]> {

        function decodeEntities(str: string): string {
            return str
                .replace(/&quot;/g, `"`)
                .replace(/&#x27;/g, `'`)
                .replace(/&apos;/g, `'`)
                .replace(/&amp;/g, `&`)
                .replace(/&lt;/g, `<`)
                .replace(/&gt;/g, `>`)
                .replace(/&nbsp;/g, ' ')
                .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
                .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
        }

        const map = $store.get("kagane") ?? {};
        let out: $app.AL_BaseManga[] = [];

        for (const numericId of ids) {
            const realId = map[numericId];
            if (!realId) continue;

            const res = await fetch(`https://kagane.org/series/${realId}`);
            if (!res.ok) continue;

            const html = await res.text();

            // ---------- TITLE ----------
            const rawTitle =
                html.match(/<h1[^>]*class="[^"]*font-bold[^"]*"[^>]*>(.*?)<\/h1>/is)?.[1]
                    ?.replace(/<[^>]+>/g, "")
                    .trim()
                || "Unknown";
            const title = decodeEntities(rawTitle);

            // ---------- SYNONYMS ----------
            const synonyms: string[] = [];
            const synBlock = html.match(/<p[^>]*class="text-muted-foreground"[^>]*>([\s\S]*?)<\/p>/i)?.[1];

            if (synBlock) {
                const synRegex = /<span[^>]*>(.*?)<\/span>/gi;
                let m;
                while ((m = synRegex.exec(synBlock))) {
                    const t = decodeEntities(m[1].replace(/<[^>]+>/g, "").trim());
                    if (t) synonyms.push(t);
                }
            }

            // ---------- STATUS & CHAPTERS ----------
            let status = "";
            let chapters: number | undefined;

            const statBlock = html.match(/<div[^>]*md:hidden[^>]*>([\s\S]*?)<\/div>/i)?.[1];

            if (statBlock) {
                const spanRegex = /<span[^>]*>(.*?)<\/span>/gi;
                let m;
                while ((m = spanRegex.exec(statBlock))) {
                    const t = m[1].replace(/<[^>]+>/g, "").trim();

                    if (/ongoing|hiatus|completed/i.test(t)) {
                        status = t.toUpperCase();
                    }
                    if (/ch\./i.test(t)) {
                        const c = parseInt(t.replace(/[^0-9]/g, ""));
                        if (!isNaN(c)) chapters = c;
                    }
                }
            }

            // ---------- DESCRIPTION ----------
            let description = "";
            const descBlock = html.match(
                /<div[^>]*class="[^"]*hidden[^"]*md:block[^"]*text-muted-foreground[^"]*"[^>]*>([\s\S]*?)<\/div>/i
            )?.[1];

            if (descBlock) {
                const pRegex = /<p[^>]*>(.*?)<\/p>/gis;
                let m;
                let text = [];
                while ((m = pRegex.exec(descBlock))) {
                    const cleaned = decodeEntities(
                        m[1].replace(/<[^>]+>/g, "").trim()
                    );
                    if (cleaned) text.push(cleaned);
                }
                description = text.join("\n").trim();
            }

            // ---------- GENRES ----------
            const genres: string[] = [];
            const genreBlock = html.match(/<div[^>]*class="[^"]*hidden[^"]*md:flex[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];

            if (genreBlock) {
                const gRegex = /<span[^>]*>(.*?)<\/span>/gi;
                let m;
                while ((m = gRegex.exec(genreBlock))) {
                    const g = m[1].replace(/<[^>]+>/g, "").trim();
                    if (g) genres.push(g);
                }
            }

            // ---------- ADULT FLAG ----------
            let isAdult = false;
            if (/erotic|pornographic|adult|18\+/i.test(html)) {
                isAdult = true;
            }

            // ---------- COVER ----------
            const cover = `https://api.kagane.org/api/v1/series/${realId}/thumbnail`;
            const now = new Date();

            // ---------- PUSH ----------
            out.push({
                id: numericId,
                siteUrl: `https://kagane.org/series/${realId}`,
                status,
                chapters,
                volumes: 1,
                genres,
                synonyms,
                title: {
                    userPreferred: title,
                    romaji: title,
                    english: "",
                    native: synonyms[0] ?? ""
                },
                coverImage: {
                    large: cover,
                    medium: cover,
                    extraLarge: cover,
                    color: ""
                },
                description,
                isAdult,
                startDate: {
                    year: now.getUTCFullYear(),
                    month: now.getUTCMonth() + 1,
                    day: now.getUTCDate()
                },
                endDate: {
                    year: now.getUTCFullYear(),
                    month: now.getUTCMonth() + 1,
                    day: now.getUTCDate()
                }
            });
        }

        return out;
    }

    async getMangaDetails(id: number): Promise<$app.AL_MangaDetailsById_Media | null> {
        return null
    }

    private hashID(str: string): number {
        let h = 5381;

        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) + h) + str.charCodeAt(i); // h * 33 + c
            h = h >>> 0; // fuerza uint32
        }

        return Math.floor((h / 0xFFFFFFFF) * 1_000_000_000_000);
    }

    async listManga(search: string, page: number, perPage: number): Promise<ListResponse<$app.AL_BaseManga>> {
        const res = await fetch(`${this.api}/search?page=${page - 1}&size=${perPage}&name=${encodeURIComponent(search)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "{}"
            }
            );
        const json = await res.json();

        const idMap: Record<number, string> = $store.get("kagane") ?? {};

        const media: $app.AL_BaseManga[] = json.content.map((m: any) => {
            const now = new Date();
            const start = m.release_date ? new Date(m.release_date) : now;

            const hashed = this.hashID(m.id);
            idMap[hashed] = m.id;

            return {
                id: hashed,
                siteUrl: m.links?.[0]?.url,
                status: m.status,
                chapters: m.books_count,
                volumes: m.total_book_count,
                genres: m.genres ?? [],
                synonyms: m.alternate_titles?.map((t: any) => t.title) ?? [],
                title: {
                    userPreferred: m.name,
                    romaji: m.name,
                    english: undefined,
                    native: m.alternate_titles?.find((t: any) =>
                        /native|kor|jp|cn|han|中|日|韩/i.test(t.label)
                    )?.title
                },

                coverImage: {
                    large: `https://api.kagane.org/api/v1/series/${m.id}/thumbnail`,
                    medium: `https://api.kagane.org/api/v1/series/${m.id}/thumbnail`,
                    extraLarge: `https://api.kagane.org/api/v1/series/${m.id}/thumbnail`,
                    color: undefined
                },

                description: m.summary,
                isAdult: m.age_rating ? m.age_rating >= 18 : false,

                startDate: {
                    year: start.getUTCFullYear(),
                    month: start.getUTCMonth() + 1,
                    day: start.getUTCDate()
                },

                endDate: {
                    year: now.getUTCFullYear(),
                    month: now.getUTCMonth() + 1,
                    day: now.getUTCDate()
                }
            };
        });

        $store.set("kagane", idMap);

        return {
            media,
            total: media.length,
            page: json.page ?? page,
            totalPages: json.totalPages ?? 1
        };
    }
}