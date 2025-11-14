// Minimal JS model (no DB) — memory store to keep references while process runs.


const files = new Map();


export function saveFile(meta) {
// meta: { id, originalName, mimeType, size, path }
files.set(meta.id, meta);
return meta;
}


export function getFile(id) {
return files.get(id);
}


export function listFiles() {
return Array.from(files.values()).reverse();
}