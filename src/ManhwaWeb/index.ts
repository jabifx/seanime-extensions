/// <reference path="./manga-provider.d.ts" />

class Provider {
    private api = "https://manhwawebbackend-production.up.railway.app"

    getSettings(): Settings {
        return {
            supportsMultiLanguage: false,
            supportsMultiScanlator: false,
        }
    }

    async search(opts: QueryOptions): Promise<SearchResult[]> {
        const requestRes = await fetch(`${this.api}/manhwa/library?buscar=${encodeURIComponent(opts.query)}&estado=&tipo=&erotico=&demografia=&order_item=alfabetico&order_dir=desc&page=0&generes=`, {
            method: "get",
        });

        const json = await requestRes.json();

        if (!json?.data) return [];

        return json.data.map((item: any) => ({
            id: item._id || item.real_id,
            title: item.the_real_name || "Sin título",
            synonyms: [item.real_id].filter(Boolean),
            year: null, // No viene en los datos
            image: item._imagen || "",
        }));
    }


    async findChapters(mangaId: string): Promise<ChapterDetails[]> {
        const requestRes = await fetch(`${this.api}/manhwa/see/${mangaId}`, {
            method: "get",
        });

        const json = await requestRes.json();

        if (!json?.chapters) return [];

        return json.chapters.map((ch: any, index: number) => ({
            id: `${json._id || mangaId}-${ch.chapter}`,
            url: ch.link || "",
            title: `Capítulo ${ch.chapter}`,
            chapter: String(ch.chapter),
            index,
        }));
    }


    async findChapterPages(chapterId: string): Promise<ChapterPage[]> {
        console.log(chapterId)
        const requestRes = await fetch(`${this.api}/chapters/see/${chapterId}`, {
            method: "get",
        });

        const json = await requestRes.json();

        if (!json?.chapter?.img) return [];

        return json.chapter.img.map((url: string, index: number) => ({
            url,
            index,
            headers: {
                Referer: "https://manhwaweb.com/",
            },
        }));
    }

}