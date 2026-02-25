import Exa from "exa-js";

let exa: Exa | null = null;

function getExa(): Exa {
    if (!exa) {
        const key = process.env.EXA_API_KEY;
        if (!key) throw new Error("Missing EXA_API_KEY env var");
        exa = new Exa(key);
    }
    return exa;
}

export interface ResearchFact {
    fact: string;
    source: string;
    url: string;
}

/**
 * Fetches 6-10 real facts/statistics about a topic from the web.
 * Returns a list of fact + source pairs for Claude to cite in the ebook.
 */
export async function researchTopic(topic: string): Promise<ResearchFact[]> {
    const client = getExa();

    const queries = [
        `${topic} statistics data 2024 2025`,
        `${topic} research findings trends`,
    ];

    const allFacts: ResearchFact[] = [];

    for (const query of queries) {
        try {
            const result = await client.searchAndContents(query, {
                numResults: 3,
                type: "neural",
                useAutoprompt: true,
                highlights: {
                    numSentences: 2,
                    highlightsPerUrl: 2,
                },
            });

            for (const item of result.results) {
                const highlights = item.highlights || [];
                for (const highlight of highlights) {
                    if (highlight && highlight.length > 40) {
                        allFacts.push({
                            fact: highlight.trim(),
                            source: item.title || item.url,
                            url: item.url,
                        });
                    }
                }
            }
        } catch {
            // silently skip failed queries — research is best-effort
        }
    }

    // Deduplicate and cap at 10
    const seen = new Set<string>();
    return allFacts.filter((f) => {
        if (seen.has(f.url)) return false;
        seen.add(f.url);
        return true;
    }).slice(0, 10);
}

/**
 * Formats research facts into a concise context block for Claude's system prompt.
 */
export function formatResearchContext(facts: ResearchFact[]): string {
    if (!facts.length) return "";
    return [
        "REAL RESEARCH CONTEXT (use these facts and cite the source in your content where relevant):",
        ...facts.map((f, i) => `${i + 1}. "${f.fact}" — Source: ${f.source} (${f.url})`),
    ].join("\n");
}
