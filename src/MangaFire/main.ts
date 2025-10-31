/// <reference path="./manga-provider.d.ts" />

class Provider {
    private api = "https://mangafire.to";

    getSettings(): Settings {
        return {
            supportsMultiLanguage: true,
            supportsMultiScanlator: false,
        };
    }

    async search(opts: { query: string }): Promise<SearchResult[]> {
        const res = await fetch(`${this.api}/ajax/manga/search?keyword=${opts.query.replace(" ", "+")}&vrf=${this.generate(opts.query.trim())}`);
        const data = await res.json();

        if (!data?.result?.html) return [];
        console.log(data.result?.html);

        const $ = LoadDoc(data.result.html);

        return $("a.unit").map((i, e) => {
            const id = e.attr("href")?.replace("/manga/", "")
            const title = e.find("h6").text().trim()
            const image = e.find("img").attr("src")

            return {
                id,
                title,
                synonyms: [],
                year: 1,
                image
            };
        }).get();

    }

    async findChapters(mangaId: string): Promise<ChapterDetails[]> {
        const reslangs = await fetch(`${this.api}/manga/${mangaId}`);
        const htmlLang = await reslangs.text();

        const dataCodes = this.extractLanguageCodes(htmlLang);
        const allChapters: ChapterDetails[] = [];

        for (const lang of dataCodes) {
            const chapters = await this.fetchChaptersForLanguage(mangaId, lang);
            allChapters.push(...chapters);
        }

        return allChapters;
    }

    async findChapterPages(chapterId: string): Promise<ChapterPage[]> {
        const res = await fetch(`${this.api}/ajax/read/chapter/${chapterId}?vrf=${this.generate("chapter%40" + chapterId)}`);
        const data = await res.json();
        const images = data.result?.images;

        if (!images?.length) return [];

        return images.map((img: any[], i: number) => ({
            url: img[0],
            index: i,
            headers: {
                Referer: `${this.api}`,
            },
        }));
    }

    // ------------------------
    // AUXILIAR FUNCTIONS
    // ------------------------

    private extractLanguageCodes(html: string): string[] {
        const $ = LoadDoc(html);
        const langMap = new Map<string, string>();

        $("[data-code][data-title]").each((i, e) => {
            let code = e.attr("data-code")?.toLowerCase() || "";
            const title = e.attr("data-title") || "";

            if (code === 'es' && title.includes('LATAM')) code = 'es-la';
            else if (code === 'pt' && title.includes('Br')) code = 'pt-br';

            langMap.set(code, code);
        });

        return Array.from(langMap.values());
    }

    private async fetchChaptersForLanguage(mangaId: string, lang: string): Promise<ChapterDetails[]> {
        const mangaIdShort = mangaId.split(".").pop() || "";
        const res = await fetch(
            `${this.api}/ajax/read/${mangaIdShort}/chapter/${lang}?vrf=${this.generate(mangaIdShort + "%40chapter%40" + lang)}`
        );

        const data = await res.json();
        const html = data.result?.html || "";

        if (!html) return [];

        const $ = LoadDoc(html);
        const langChapters: ChapterDetails[] = [];

        $("a[data-number][data-id]").each((i, e) => {
            const url = e.attr("href") || "";
            const chapter = e.attr("data-number") || "";
            const id = e.attr("data-id") || "";
            const title = e.attr("title") || "";
            const language = this.normalizeLanguageCode(lang)

            langChapters.push({
                id: id,
                url: `${this.api}${url}`,
                title: title,
                chapter: chapter,
                index: 0,
                language: language,
            });
        });

        // Assing indexes
        langChapters.reverse();
        langChapters.forEach((ch, i) => (ch.index = i));

        console.log("[Chapters]", JSON.stringify(langChapters, null, 2))

        return langChapters;
    }

    private normalizeLanguageCode(lang: string): string {
        const langToISO: Record<string, string> = {
            'en': 'en',
            'fr': 'fr',
            'es': 'es',
            'es-la': 'es-419',
            'pt': 'pt',
            'pt-br': 'pt-BR',
            'ja': 'ja',
            'de': 'de',
            'it': 'it',
            'ru': 'ru',
            'ko': 'ko',
            'zh': 'zh',
            'zh-cn': 'zh-CN',
            'zh-tw': 'zh-TW',
            'ar': 'ar',
            'tr': 'tr',
        };

        return langToISO[lang] || lang;
    }

    // ------------------------
    // VRF FUNCTIONS
    // ------------------------

    // Polyfill TextEncoder/TextDecoder
    private textEncode(str: string): Uint8Array {
        return Uint8Array.from(Buffer.from(str, "utf-8"));
    }

    private textDecode(bytes: Uint8Array): string {
        return Buffer.from(bytes).toString("utf-8");
    }

    private atob(data: string): Uint8Array {
        return Uint8Array.from(Buffer.from(data, 'base64'));
    }

    private btoa(data: Uint8Array): string {
        return Buffer.from(data).toString('base64');
    }

    private rc4(key: Uint8Array, input: Uint8Array): Uint8Array {
        const s = new Uint8Array(256);
        for (let i = 0; i < 256; i++) s[i] = i;

        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + s[i] + key[i % key.length]) & 0xff;
            [s[i], s[j]] = [s[j], s[i]];
        }

        const output = new Uint8Array(input.length);
        let i = 0;
        j = 0;
        for (let y = 0; y < input.length; y++) {
            i = (i + 1) & 0xff;
            j = (j + s[i]) & 0xff;
            [s[i], s[j]] = [s[j], s[i]];
            const k = s[(s[i] + s[j]) & 0xff];
            output[y] = input[y] ^ k;
        }

        return output;
    }

    private transform(
        input: Uint8Array,
        initSeedBytes: Uint8Array,
        prefixKeyBytes: Uint8Array,
        prefixLen: number,
        schedule: ((c: number) => number)[]
    ): Uint8Array {
        const out: number[] = [];
        for (let i = 0; i < input.length; i++) {
            if (i < prefixLen) {
                out.push(prefixKeyBytes[i]);
            }
            const transformed =
                schedule[i % 10]((input[i] ^ initSeedBytes[i % 32]) & 0xff) & 0xff;
            out.push(transformed);
        }
        return new Uint8Array(out);
    }


    private scheduleC = [
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c ^ 241) & 0xff,
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c ^ 8) & 0xff,
    ];

    private scheduleY = [
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
        (c: number) => (c ^ 163) & 0xff,
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c ^ 83) & 0xff,
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
    ];

    private scheduleB = [
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
        (c: number) => (c - 48 + 256) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => (c ^ 8) & 0xff,
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c ^ 163) & 0xff,
    ];

    private scheduleJ = [
        (c: number) => (c + 223) & 0xff,
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => (c ^ 83) & 0xff,
        (c: number) => (c - 19 + 256) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => (c + 223) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => (c ^ 83) & 0xff,
    ];

    private scheduleE = [
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c ^ 83) & 0xff,
        (c: number) => (c ^ 163) & 0xff,
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c - 170 + 256) & 0xff,
        (c: number) => (c ^ 8) & 0xff,
        (c: number) => (c ^ 241) & 0xff,
        (c: number) => (c + 82) & 0xff,
        (c: number) => (c + 176) & 0xff,
        (c: number) => ((c << 4) | (c >>> 4)) & 0xff,
    ];

    private rc4Keys: Record<string, string> = {
        l: "u8cBwTi1CM4XE3BkwG5Ble3AxWgnhKiXD9Cr279yNW0=",
        g: "t00NOJ/Fl3wZtez1xU6/YvcWDoXzjrDHJLL2r/IWgcY=",
        B: "S7I+968ZY4Fo3sLVNH/ExCNq7gjuOHjSRgSqh6SsPJc=",
        m: "7D4Q8i8dApRj6UWxXbIBEa1UqvjI+8W0UvPH9talJK8=",
        F: "0JsmfWZA1kwZeWLk5gfV5g41lwLL72wHbam5ZPfnOVE=",
    };

    private seeds32: Record<string, string> = {
        A: "pGjzSCtS4izckNAOhrY5unJnO2E1VbrU+tXRYG24vTo=",
        V: "dFcKX9Qpu7mt/AD6mb1QF4w+KqHTKmdiqp7penubAKI=",
        N: "owp1QIY/kBiRWrRn9TLN2CdZsLeejzHhfJwdiQMjg3w=",
        P: "H1XbRvXOvZAhyyPaO68vgIUgdAHn68Y6mrwkpIpEue8=",
        k: "2Nmobf/mpQ7+Dxq1/olPSDj3xV8PZkPbKaucJvVckL0=",
    };

    private prefixKeys: Record<string, string> = {
        O: "Rowe+rg/0g==",
        v: "8cULcnOMJVY8AA==",
        L: "n2+Og2Gth8Hh",
        p: "aRpvzH+yoA==",
        W: "ZB4oBi0=",
    };

    // ------------------------
    // FUNCION GENERAR
    // ------------------------
    generate(input: string): string {
        let bytes = this.textEncode(input);

        // RC4 1
        bytes = this.rc4(this.atob(this.rc4Keys["l"]), bytes);

        // Step C1
        bytes = this.transform(bytes, this.atob(this.seeds32["A"]), this.atob(this.prefixKeys["O"]), 7, this.scheduleC);

        // RC4 2
        bytes = this.rc4(this.atob(this.rc4Keys["g"]), bytes);

        // Step Y
        bytes = this.transform(bytes, this.atob(this.seeds32["V"]), this.atob(this.prefixKeys["v"]), 10, this.scheduleY);

        // RC4 3
        bytes = this.rc4(this.atob(this.rc4Keys["B"]), bytes);

        // Step B
        bytes = this.transform(bytes, this.atob(this.seeds32["N"]), this.atob(this.prefixKeys["L"]), 9, this.scheduleB);

        // RC4 4
        bytes = this.rc4(this.atob(this.rc4Keys["m"]), bytes);

        // Step J
        bytes = this.transform(bytes, this.atob(this.seeds32["P"]), this.atob(this.prefixKeys["p"]), 7, this.scheduleJ);

        // RC4 5
        bytes = this.rc4(this.atob(this.rc4Keys["F"]), bytes);

        // Step E
        bytes = this.transform(bytes, this.atob(this.seeds32["k"]), this.atob(this.prefixKeys["W"]), 5, this.scheduleE);

        // Base64URL encode
        return this.btoa(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
}
