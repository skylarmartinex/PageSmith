import { Redis } from "@upstash/redis";

// Redis client — reads from env vars at runtime
// Required: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
let redis: Redis | null = null;

function getRedis(): Redis {
    if (!redis) {
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            throw new Error(
                "Missing Upstash env vars. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local"
            );
        }
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function saveEbook(data: object): Promise<string> {
    const id = generateId();
    const r = getRedis();
    await r.set(`ebook:${id}`, JSON.stringify(data), { ex: THIRTY_DAYS });
    return id;
}

export async function loadEbook(id: string): Promise<object | null> {
    const r = getRedis();
    const raw = await r.get<string>(`ebook:${id}`);
    if (!raw) return null;
    try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
        return null;
    }
}

function generateId(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
