"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TemplateConfig } from "@/lib/templates/types";

// ─── Types ──────────────────────────────────────────────────────────────────
interface CanvasObject {
    id: string;
    type: "text" | "heading" | "image" | "rect" | "stat";
    x: number;
    y: number;
    width: number;
    height: number;
    content?: string;
    src?: string;
    fill?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    italic?: boolean;
    align?: "left" | "center" | "right";
    rotation?: number;
    locked?: boolean;
    opacity?: number;
}

interface CanvasEditorProps {
    /** Existing page HTML string to render in view mode */
    pageHtml?: string;
    /** Template config for colors/fonts */
    config: TemplateConfig;
    /** Child content to show in view mode */
    children: React.ReactNode;
    /** Called with serialized canvas state on change */
    onCanvasChange?: (objects: CanvasObject[]) => void;
}

interface SelectionState {
    id: string | null;
    obj: CanvasObject | null;
}

// ─── History stack for undo/redo ──────────────────────────────────────────
function useHistory<T>(initial: T) {
    const [stack, setStack] = useState<T[]>([initial]);
    const [cursor, setCursor] = useState(0);

    const push = useCallback((value: T) => {
        setStack(prev => {
            const next = prev.slice(0, cursor + 1);
            return [...next, value];
        });
        setCursor(c => c + 1);
    }, [cursor]);

    const undo = useCallback(() => {
        setCursor(c => Math.max(0, c - 1));
    }, []);

    const redo = useCallback(() => {
        setCursor(c => Math.min(stack.length - 1, c + 1));
    }, [stack.length]);

    return { current: stack[cursor], push, undo, redo, canUndo: cursor > 0, canRedo: cursor < stack.length - 1 };
}

// ─── Mini toolbar for selected object ────────────────────────────────────
function ObjectToolbar({
    obj,
    config,
    onUpdate,
    onDelete,
    onDuplicate,
    onLock,
}: {
    obj: CanvasObject;
    config: TemplateConfig;
    onUpdate: (updates: Partial<CanvasObject>) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onLock: () => void;
}) {
    return (
        <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-50 mb-2"
            style={{ top: Math.max(0, obj.y - 48), left: obj.x + obj.width / 2 }}
        >
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-xl border border-white/20 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(15,15,20,0.92)" }}>

                {/* Bold / Italic — text only */}
                {(obj.type === "text" || obj.type === "heading") && (
                    <>
                        <ToolBtn
                            active={obj.fontWeight === "bold"}
                            onClick={() => onUpdate({ fontWeight: obj.fontWeight === "bold" ? "normal" : "bold" })}
                            title="Bold"
                        >B</ToolBtn>
                        <ToolBtn
                            active={!!obj.italic}
                            onClick={() => onUpdate({ italic: !obj.italic })}
                            title="Italic"
                        ><i>I</i></ToolBtn>
                        <Sep />
                        {/* Font size */}
                        <select
                            value={obj.fontSize ?? 16}
                            onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
                            className="bg-transparent text-white text-xs rounded px-1 py-0.5 border border-white/20 focus:outline-none"
                        >
                            {[10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72].map(s => (
                                <option key={s} value={s} className="text-black">{s}</option>
                            ))}
                        </select>
                        <Sep />
                        {/* Alignment */}
                        <ToolBtn active={obj.align === "left"} onClick={() => onUpdate({ align: "left" })} title="Align Left">⬅</ToolBtn>
                        <ToolBtn active={obj.align === "center" || !obj.align} onClick={() => onUpdate({ align: "center" })} title="Center">≡</ToolBtn>
                        <ToolBtn active={obj.align === "right"} onClick={() => onUpdate({ align: "right" })} title="Align Right">➡</ToolBtn>
                        <Sep />
                        {/* Color */}
                        <label className="cursor-pointer relative" title="Text Color">
                            <div className="w-5 h-5 rounded border border-white/30" style={{ backgroundColor: obj.fill || "#000" }} />
                            <input
                                type="color"
                                value={obj.fill || "#000000"}
                                onChange={e => onUpdate({ fill: e.target.value })}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                        </label>
                        <Sep />
                    </>
                )}

                {/* Opacity */}
                <div className="flex items-center gap-1">
                    <span className="text-white/50 text-[10px]">α</span>
                    <input
                        type="range" min={10} max={100} value={Math.round((obj.opacity ?? 1) * 100)}
                        onChange={e => onUpdate({ opacity: Number(e.target.value) / 100 })}
                        className="w-16 accent-blue-400"
                    />
                </div>
                <Sep />

                {/* Lock */}
                <ToolBtn onClick={onLock} title={obj.locked ? "Unlock" : "Lock"}>
                    {obj.locked ? "🔒" : "🔓"}
                </ToolBtn>
                {/* Duplicate */}
                <ToolBtn onClick={onDuplicate} title="Duplicate (⌘D)">⧉</ToolBtn>
                {/* Delete */}
                <ToolBtn onClick={onDelete} title="Delete (⌫)" danger>✕</ToolBtn>
            </div>
        </div>
    );
}

function ToolBtn({ children, active, onClick, title, danger }: {
    children: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    title?: string;
    danger?: boolean;
}) {
    return (
        <button
            onMouseDown={e => { e.preventDefault(); onClick(); }}
            title={title}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:scale-110"
            style={{
                backgroundColor: danger ? "rgba(239,68,68,0.2)" : active ? "rgba(99,102,241,0.35)" : "transparent",
                color: danger ? "#fca5a5" : active ? "#a5b4fc" : "white",
            }}
        >
            {children}
        </button>
    );
}

function Sep() {
    return <div className="w-px h-5 bg-white/20 mx-0.5 flex-shrink-0" />;
}

// ─── Draggable / Resizable Canvas Object ─────────────────────────────────
function CanvasObjectEl({
    obj,
    isSelected,
    config,
    onSelect,
    onUpdate,
}: {
    obj: CanvasObject;
    isSelected: boolean;
    config: TemplateConfig;
    onSelect: () => void;
    onUpdate: (updates: Partial<CanvasObject>) => void;
}) {
    const elRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
    const resizeStart = useRef<{ mx: number; my: number; w: number; h: number } | null>(null);
    const [editing, setEditing] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (obj.locked) return;
        e.stopPropagation();
        onSelect();
        dragStart.current = { mx: e.clientX, my: e.clientY, ox: obj.x, oy: obj.y };

        const onMove = (ev: MouseEvent) => {
            if (!dragStart.current) return;
            const dx = ev.clientX - dragStart.current.mx;
            const dy = ev.clientY - dragStart.current.my;
            onUpdate({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
        };
        const onUp = () => {
            dragStart.current = null;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        resizeStart.current = { mx: e.clientX, my: e.clientY, w: obj.width, h: obj.height };

        const onMove = (ev: MouseEvent) => {
            if (!resizeStart.current) return;
            const dw = ev.clientX - resizeStart.current.mx;
            const dh = ev.clientY - resizeStart.current.my;
            onUpdate({
                width: Math.max(80, resizeStart.current.w + dw),
                height: Math.max(24, resizeStart.current.h + dh),
            });
        };
        const onUp = () => {
            resizeStart.current = null;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const fontSizePx = obj.fontSize ? `${obj.fontSize}px` : obj.type === "heading" ? "28px" : "16px";

    return (
        <div
            ref={elRef}
            onMouseDown={handleMouseDown}
            onDoubleClick={() => {
                if (obj.type === "text" || obj.type === "heading") setEditing(true);
            }}
            className="absolute group"
            style={{
                left: obj.x,
                top: obj.y,
                width: obj.width,
                minHeight: obj.height,
                opacity: obj.opacity ?? 1,
                transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
                cursor: obj.locked ? "not-allowed" : "grab",
                outline: isSelected
                    ? `2px solid ${config.colors.accent}`
                    : "2px solid transparent",
                outlineOffset: "3px",
                borderRadius: 4,
            }}
        >
            {/* Content */}
            {obj.type === "image" ? (
                <img
                    src={obj.src}
                    alt=""
                    className="w-full h-full object-cover rounded-lg pointer-events-none"
                />
            ) : (
                <>
                    {editing ? (
                        <textarea
                            autoFocus
                            value={obj.content}
                            onChange={e => onUpdate({ content: e.target.value })}
                            onBlur={() => setEditing(false)}
                            onKeyDown={e => { if (e.key === "Escape") setEditing(false); }}
                            className="w-full h-full border-none outline-none resize-none bg-transparent p-0"
                            style={{
                                fontSize: fontSizePx,
                                fontFamily: obj.fontFamily || config.fontFamily,
                                fontWeight: obj.fontWeight || (obj.type === "heading" ? "bold" : "normal"),
                                fontStyle: obj.italic ? "italic" : "normal",
                                textAlign: obj.align || "left",
                                color: obj.fill || config.colors.text,
                                lineHeight: 1.4,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                fontSize: fontSizePx,
                                fontFamily: obj.fontFamily || config.fontFamily,
                                fontWeight: obj.fontWeight || (obj.type === "heading" ? "bold" : "normal"),
                                fontStyle: obj.italic ? "italic" : "normal",
                                textAlign: obj.align || "left",
                                color: obj.fill || config.colors.text,
                                lineHeight: 1.4,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {obj.content || <span className="opacity-30">Double-click to edit</span>}
                        </div>
                    )}
                </>
            )}

            {/* Resize handle */}
            {isSelected && !obj.locked && (
                <div
                    onMouseDown={handleResizeMouseDown}
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-sm cursor-se-resize"
                    style={{ backgroundColor: config.colors.accent, marginBottom: -6, marginRight: -6 }}
                />
            )}

            {/* Lock indicator */}
            {obj.locked && (
                <div className="absolute top-0 right-0 text-[10px] opacity-50">🔒</div>
            )}
        </div>
    );
}

// ─── Main CanvasEditor ────────────────────────────────────────────────────
export function CanvasEditor({ children, config, onCanvasChange }: CanvasEditorProps) {
    const [editMode, setEditMode] = useState(false);
    const [zoom, setZoom] = useState(1);
    const history = useHistory<CanvasObject[]>([]);
    const [objects, setObjects] = useState<CanvasObject[]>(history.current);
    const [selection, setSelection] = useState<SelectionState>({ id: null, obj: null });
    const canvasRef = useRef<HTMLDivElement>(null);

    // Keep history in sync
    const setAndPush = useCallback((newObjs: CanvasObject[]) => {
        setObjects(newObjs);
        history.push(newObjs);
        onCanvasChange?.(newObjs);
    }, [history, onCanvasChange]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!editMode) return;

        const handler = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;

            if (meta && e.key === "z" && !e.shiftKey) {
                history.undo();
                setObjects(history.current);
                e.preventDefault();
                return;
            }
            if (meta && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                history.redo();
                setObjects(history.current);
                e.preventDefault();
                return;
            }
            if (meta && e.key === "d" && selection.id) {
                e.preventDefault();
                duplicate(selection.id);
                return;
            }
            if ((e.key === "Delete" || e.key === "Backspace") && selection.id) {
                // Don't delete while typing
                if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
                deleteObj(selection.id);
                return;
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [editMode, selection.id, history]);

    const updateObj = useCallback((id: string, updates: Partial<CanvasObject>) => {
        const newObjs = objects.map(o => o.id === id ? { ...o, ...updates } : o);
        setAndPush(newObjs);
        setSelection(s => s.id === id ? { id, obj: newObjs.find(o => o.id === id)! } : s);
    }, [objects, setAndPush]);

    const deleteObj = useCallback((id: string) => {
        setAndPush(objects.filter(o => o.id !== id));
        setSelection({ id: null, obj: null });
    }, [objects, setAndPush]);

    const duplicate = useCallback((id: string) => {
        const src = objects.find(o => o.id === id);
        if (!src) return;
        const copy: CanvasObject = { ...src, id: `obj_${Date.now()}`, x: src.x + 20, y: src.y + 20 };
        setAndPush([...objects, copy]);
        setSelection({ id: copy.id, obj: copy });
    }, [objects, setAndPush]);

    const addObject = useCallback((type: CanvasObject["type"]) => {
        const id = `obj_${Date.now()}`;
        const defaults: Record<CanvasObject["type"], Partial<CanvasObject>> = {
            text: { content: "New text block", width: 300, height: 80, fontSize: 16, fill: config.colors.text },
            heading: { content: "New Heading", width: 400, height: 60, fontSize: 28, fontWeight: "bold", fill: config.colors.primary },
            image: { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop", width: 300, height: 200 },
            rect: { fill: config.colors.accent + "40", width: 200, height: 100 },
            stat: { content: "87%\nConversion Rate", width: 180, height: 100, align: "center", fill: config.colors.primary, fontWeight: "bold", fontSize: 28 },
        };
        const newObj: CanvasObject = {
            id, type, x: 80, y: 80, width: 200, height: 80,
            ...defaults[type],
        };
        setAndPush([...objects, newObj]);
        setSelection({ id, obj: newObj });
    }, [objects, setAndPush, config]);

    const selectedObj = objects.find(o => o.id === selection.id) ?? null;
    const canvasWidth = Math.round((canvasRef.current?.offsetWidth ?? 800));

    return (
        <div className="relative">
            {/* ── Mode toggle toolbar ─────────────────────────────────────── */}
            <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 border-b"
                style={{ backgroundColor: editMode ? "#0f0f14" : "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderColor: editMode ? "#2d2d3a" : "#e5e7eb" }}>

                <div className="flex items-center gap-2">
                    {/* Mode toggle */}
                    <button
                        onClick={() => { setEditMode(e => !e); setSelection({ id: null, obj: null }); }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                        style={{
                            backgroundColor: editMode ? config.colors.accent : "#f3f4f6",
                            color: editMode ? "white" : "#374151",
                        }}
                    >
                        {editMode ? "✓ Edit Mode" : "✏️ Edit Mode"}
                    </button>

                    {editMode && (
                        <>
                            {/* Undo / Redo */}
                            <button disabled={!history.canUndo} onClick={() => { history.undo(); setObjects(history.current); }}
                                className="px-2 py-1.5 rounded text-sm disabled:opacity-30 text-white hover:bg-white/10 transition-all" title="Undo (⌘Z)">
                                ↩
                            </button>
                            <button disabled={!history.canRedo} onClick={() => { history.redo(); setObjects(history.current); }}
                                className="px-2 py-1.5 rounded text-sm disabled:opacity-30 text-white hover:bg-white/10 transition-all" title="Redo (⌘Y)">
                                ↪
                            </button>
                            <div className="w-px h-5 bg-white/20 mx-1" />
                            {/* Zoom */}
                            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="text-white/70 hover:text-white px-1" title="Zoom out">−</button>
                            <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="text-white/70 hover:text-white px-1" title="Zoom in">+</button>
                            <button onClick={() => setZoom(1)} className="text-white/40 hover:text-white/80 text-xs px-1" title="Reset zoom">⊙</button>
                        </>
                    )}
                </div>

                {editMode && (
                    /* Add-object toolbar */
                    <div className="flex items-center gap-1">
                        <span className="text-white/40 text-xs mr-1">Add:</span>
                        {([
                            { type: "heading", label: "H", title: "Heading" },
                            { type: "text", label: "T", title: "Text" },
                            { type: "stat", label: "📊", title: "Stat Card" },
                            { type: "image", label: "🖼", title: "Image" },
                            { type: "rect", label: "▭", title: "Rectangle" },
                        ] as const).map(item => (
                            <button
                                key={item.type}
                                onClick={() => addObject(item.type)}
                                title={`Add ${item.title}`}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all hover:scale-110"
                                style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                {!editMode && (
                    <span className="text-xs text-gray-400">Click Edit Mode to add/rearrange elements</span>
                )}
            </div>

            {/* ── View mode: render children normally ─────────────────────── */}
            {!editMode && <div>{children}</div>}

            {/* ── Edit mode: canvas overlay ─────────────────────────────────── */}
            {editMode && (
                <div
                    ref={canvasRef}
                    className="relative overflow-auto"
                    style={{
                        minHeight: 600,
                        backgroundColor: "#1a1a24",
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                    onClick={() => setSelection({ id: null, obj: null })}
                >
                    <div
                        className="relative origin-top-left"
                        style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: canvasWidth / zoom }}
                    >
                        {/* Hint when empty */}
                        {objects.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 select-none">
                                <div className="text-5xl mb-4 opacity-40">✏️</div>
                                <p className="text-lg font-medium">Canvas is empty</p>
                                <p className="text-sm mt-1">Use the toolbar above to add elements</p>
                            </div>
                        )}

                        {/* Canvas objects */}
                        {objects.map(obj => (
                            <CanvasObjectEl
                                key={obj.id}
                                obj={obj}
                                isSelected={selection.id === obj.id}
                                config={config}
                                onSelect={() => setSelection({ id: obj.id, obj })}
                                onUpdate={(updates) => updateObj(obj.id, updates)}
                            />
                        ))}

                        {/* Per-object floating toolbar */}
                        {selectedObj && selection.id && (
                            <ObjectToolbar
                                obj={selectedObj}
                                config={config}
                                onUpdate={(updates) => updateObj(selection.id!, updates)}
                                onDelete={() => deleteObj(selection.id!)}
                                onDuplicate={() => duplicate(selection.id!)}
                                onLock={() => updateObj(selection.id!, { locked: !selectedObj.locked })}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
