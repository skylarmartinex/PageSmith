import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error("Upstash Redis credentials not configured");
    }

    redis = new Redis({
      url,
      token,
    });
  }

  return redis;
}

export interface SavedProject {
  id: string;
  name: string;
  content: any;
  template: string;
  brand?: any;
  createdAt: string;
  updatedAt: string;
}

export async function saveProject(project: SavedProject): Promise<void> {
  const redis = getRedis();
  const key = `project:${project.id}`;
  await redis.set(key, JSON.stringify(project));
  
  // Add to user's project list (for now, global list)
  await redis.sadd("projects:all", project.id);
}

export async function getProject(id: string): Promise<SavedProject | null> {
  const redis = getRedis();
  const key = `project:${id}`;
  const data = await redis.get(key);
  
  if (!data) return null;
  
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function listProjects(): Promise<SavedProject[]> {
  const redis = getRedis();
  const ids = await redis.smembers("projects:all");
  
  if (!ids || ids.length === 0) return [];
  
  const projects = await Promise.all(
    ids.map((id) => getProject(id as string))
  );
  
  return projects
    .filter((p): p is SavedProject => p !== null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteProject(id: string): Promise<void> {
  const redis = getRedis();
  const key = `project:${id}`;
  
  await redis.del(key);
  await redis.srem("projects:all", id);
}
