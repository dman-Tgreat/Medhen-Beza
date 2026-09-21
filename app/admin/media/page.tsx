"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, FileText, Search, Trash2 } from "lucide-react";
import { RoleGuard } from "@/components/admin/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaUploadField } from "@/components/admin/media-upload-field";
import { deleteMediaAction, getMediaLibraryAction, type MediaLibraryItem } from "@/lib/actions/media";

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export default function MediaAdminPage() {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [uploadKind, setUploadKind] = useState<"image" | "video">("image");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadMedia = async () => {
    const result = await getMediaLibraryAction();
    if (result.error) setError(result.error);
    else setItems(result.data || []);
  };

  useEffect(() => { void loadMedia(); }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesType = filter === "ALL" || item.type === filter;
    const matchesSearch = `${item.filename} ${item.originalName}`.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesSearch;
  }), [items, filter, query]);

  const handleDelete = async (item: MediaLibraryItem) => {
    const warning = item.usage.length
      ? `This asset is used by ${item.usage.map((usage) => `${usage.contentType}: ${usage.title}`).join(", ")}. It cannot be deleted until those references are removed.`
      : `Delete ${item.originalName}? This also removes the Cloudinary asset.`;
    if (item.usage.length || !window.confirm(warning)) return;
    const result = await deleteMediaAction(item.id);
    if (result.error) setError(result.error);
    else await loadMedia();
  };

  const handleCopy = async (item: MediaLibraryItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopied(item.id);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <RoleGuard allowedRoles={["HOSPITAL_DIRECTOR", "CONTENT_STAFF", "MEDICAL_DIRECTOR", "HR_STAFF"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-text">Media Library</h1>
          <p className="mt-1 text-sm text-text-muted">Upload, reuse, and safely manage Cloudinary-backed hospital assets.</p>
        </div>
        {error && <div className="rounded-lg border border-emergency/30 bg-emergency-light p-3 text-sm text-emergency">{error}</div>}
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div><h2 className="text-sm font-semibold text-text">Upload an asset</h2><p className="text-xs text-text-muted">Files are stored in Cloudinary and recorded in the media table.</p></div>
            <select value={uploadKind} onChange={(event) => setUploadKind(event.target.value as "image" | "video")} className="h-9 rounded-md border border-border bg-background px-2 text-xs"><option value="image">Image</option><option value="video">Video</option></select>
          </div>
          <MediaUploadField kind={uploadKind} folder="library" value={uploadedUrl} onChange={(url) => { setUploadedUrl(url); void loadMedia(); }} aspectRatio={uploadKind === "image" ? 16 / 9 : undefined} aspectLabel="16:9 landscape" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-text-light" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search filenames..." className="pl-9" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-md border border-border bg-surface px-3 text-sm"><option value="ALL">All types</option><option value="IMAGE">Images</option><option value="VIDEO">Videos</option><option value="DOCUMENT">Documents</option></select></div>
        {filteredItems.length === 0 ? <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-text-muted">No uploaded assets found.</div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filteredItems.map((item) => <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface"><div className="relative flex h-44 items-center justify-center bg-background">{item.type === "IMAGE" ? <img src={item.url} alt={item.originalName} className="h-full w-full object-cover" /> : item.type === "VIDEO" ? <video src={item.url} controls className="h-full w-full object-contain" /> : <FileText className="h-12 w-12 text-secondary" />}<span className="absolute left-2 top-2 rounded bg-surface/90 px-2 py-1 text-[10px] font-semibold">{item.type}</span></div><div className="space-y-2 p-3"><p className="truncate text-sm font-semibold" title={item.originalName}>{item.originalName}</p><p className="text-[11px] text-text-muted">{formatBytes(item.sizeBytes)}{item.width && item.height ? ` • ${item.width}×${item.height}` : ""}</p><p className="text-[11px] text-text-muted">{new Date(item.uploadedAt).toLocaleDateString()} • {item.uploadedBy}</p><p className="text-[11px] text-text-muted">{item.usage.length ? `Used by ${item.usage.length} content item${item.usage.length === 1 ? "" : "s"}` : "Not currently referenced"}</p><div className="flex gap-2 pt-1"><Button type="button" variant="outline" size="sm" onClick={() => void handleCopy(item)} className="flex-1 text-xs"><Copy className="mr-1 h-3.5 w-3.5" />{copied === item.id ? "Copied" : "Copy URL"}</Button><Button type="button" variant="outline" size="sm" onClick={() => void handleDelete(item)} className="text-xs text-emergency"><Trash2 className="h-3.5 w-3.5" /></Button></div></div></div>)}</div>}
      </div>
    </RoleGuard>
  );
}
