"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
    key: string;
    value: T;
    enabled?: boolean;
    debounceMs?: number;
    onSaved?: () => void;
}

/**
 * useAutoSave — persists `value` to localStorage with debounce.
 * Returns { status, lastSaved, restore, clear }.
 */
export function useAutoSave<T>({
    key,
    value,
    enabled = true,
    debounceMs = 5000,
    onSaved,
}: UseAutoSaveOptions<T>) {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (!enabled) return;

        // Skip first render (don't trigger save on mount)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        setStatus("saving");

        timerRef.current = setTimeout(() => {
            try {
                const serialized = JSON.stringify({ data: value, savedAt: Date.now() });
                localStorage.setItem(key, serialized);
                setStatus("saved");
                setLastSaved(new Date());
                onSaved?.();

                // Reset to idle after 2s
                setTimeout(() => setStatus("idle"), 2000);
            } catch (err) {
                console.error("Auto-save failed:", err);
                setStatus("error");
            }
        }, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, value, enabled, debounceMs]);

    const restore = useCallback((): T | null => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed.data as T;
        } catch {
            return null;
        }
    }, [key]);

    const getSavedAt = useCallback((): Date | null => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed.savedAt ? new Date(parsed.savedAt) : null;
        } catch {
            return null;
        }
    }, [key]);

    const clear = useCallback(() => {
        localStorage.removeItem(key);
        setStatus("idle");
        setLastSaved(null);
    }, [key]);

    return { status, lastSaved, restore, getSavedAt, clear };
}

// ─── Auto-save Status Indicator ───────────────────────────────────────────
interface AutoSaveIndicatorProps {
    status: SaveStatus;
    lastSaved: Date | null;
}

export function AutoSaveIndicator({ status, lastSaved }: AutoSaveIndicatorProps) {
    if (status === "idle" && !lastSaved) return null;

    const config = {
        saving: { icon: "⏳", text: "Saving...", color: "#6b7280" },
        saved: { icon: "✓", text: "Saved", color: "#16a34a" },
        error: { icon: "✕", text: "Save failed", color: "#dc2626" },
        idle: {
            icon: "💾",
            text: lastSaved
                ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "",
            color: "#9ca3af",
        },
    }[status];

    return (
        <div
            className="flex items-center gap-1.5 text-xs transition-all duration-300"
            style={{ color: config.color }}
        >
            <span>{config.icon}</span>
            <span>{config.text}</span>
        </div>
    );
}
