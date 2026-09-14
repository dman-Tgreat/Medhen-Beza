"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/admin/role-guard";
import {
  FolderArchive,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  Filter,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface MediaAsset {
  id: string;
  name: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  uploadedBy: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: "med-1",
    name: "cardiology-cath-lab.jpg",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    size: "1.4 MB",
    dimensions: "1920x1080",
    uploadedAt: "Sep 10, 2026",
    uploadedBy: "Abel Girma",
  },
  {
    id: "med-2",
    name: "mri-scanner-room.jpg",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    size: "2.1 MB",
    dimensions: "2400x1600",
    uploadedAt: "Sep 08, 2026",
    uploadedBy: "Abel Girma",
  },
  {
    id: "med-3",
    name: "dr-samuel-bekele-portrait.jpg",
    type: "IMAGE",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    size: "850 KB",
    dimensions: "1200x1200",
    uploadedAt: "Sep 05, 2026",
    uploadedBy: "Dr. Bethlehem Tadesse",
  },
  {
    id: "med-4",
    name: "hospital-tour-intro.mp4",
    type: "VIDEO",
    url: "https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-medical-procedure-41804-large.mp4",
    size: "14.8 MB",
    dimensions: "1080p HD",
    uploadedAt: "Sep 02, 2026",
    uploadedBy: "Abel Girma",
  },
  {
    id: "med-5",
    name: "hospital-annual-report-2025.pdf",
    type: "DOCUMENT",
    url: "https://example.com/report.pdf",
    size: "3.2 MB",
    uploadedAt: "Aug 28, 2026",
    uploadedBy: "Dawit Abebe",
  },
];

export default function MediaAdminPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState<"IMAGE" | "VIDEO" | "DOCUMENT">("IMAGE");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMedia = mediaList.filter((item) => {
    const matchesType = filterType === "ALL" || item.type === filterType;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media file?")) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl) return;

    const newMedia: MediaAsset = {
      id: `med-${Date.now()}`,
      name: newAssetName || "uploaded-asset.jpg",
      type: newAssetType,
      url: newAssetUrl,
      size: "1.2 MB",
      uploadedAt: "Today",
      uploadedBy: "Current User",
    };

    setMediaList((prev) => [newMedia, ...prev]);
    setUploadModalOpen(false);
    setNewAssetUrl("");
    setNewAssetName("");
  };

  return (
    <RoleGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-h3 font-bold text-text tracking-tight">Central Media Library</h1>
            <p className="text-small text-text-muted mt-1">
              Store, organize, and reuse hospital photography, physician headshots, and video assets.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setUploadModalOpen(true)}
            className="shrink-0"
          >
            <Upload className="h-4 w-4" />
            Upload New Media
          </Button>
        </div>

        {/* Storage Health Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center border border-primary/20">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-text">Storage Usage</span>
              <p className="text-xs text-text-muted">2.4 GB of 20 GB used (Cloudinary CDN)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary-light text-secondary-dark flex items-center justify-center border border-secondary/20">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-text">Total Photos</span>
              <p className="text-xs text-text-muted">{mediaList.filter((m) => m.type === "IMAGE").length} images stored</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-text">Video Files</span>
              <p className="text-xs text-text-muted">{mediaList.filter((m) => m.type === "VIDEO").length} videos hosted</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3.5 rounded-lg border border-border">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by filename..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-text-light shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-text"
            >
              <option value="ALL">All Asset Types</option>
              <option value="IMAGE">Photos Only</option>
              <option value="VIDEO">Videos Only</option>
              <option value="DOCUMENT">Documents (PDF)</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((asset) => (
            <div
              key={asset.id}
              className="group rounded-lg border border-border bg-surface overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all flex flex-col"
            >
              {/* Preview Thumbnail */}
              <div className="relative h-40 bg-background flex items-center justify-center overflow-hidden border-b border-border">
                {asset.type === "IMAGE" && (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {asset.type === "VIDEO" && (
                  <div className="flex flex-col items-center justify-center text-text-muted">
                    <Video className="h-10 w-10 text-primary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-text-light">Video File</span>
                  </div>
                )}
                {asset.type === "DOCUMENT" && (
                  <div className="flex flex-col items-center justify-center text-text-muted">
                    <FileText className="h-10 w-10 text-secondary mb-1" />
                    <span className="text-[10px] uppercase font-bold text-text-light">Document</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="p-1.5 rounded-md bg-surface/90 text-text hover:text-primary shadow-sm"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 rounded-md bg-surface/90 text-text hover:text-emergency shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                <p className="text-xs font-semibold text-text truncate" title={asset.name}>
                  {asset.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>{asset.size}</span>
                  <span>{asset.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent className="max-w-md bg-surface p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-text">Upload Media Asset</DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Add an image, video, or clinical publication to the hospital media library.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUploadSubmit} className="space-y-4 my-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Asset Name</label>
                <Input
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="e.g. pediatric-icu-ward.jpg"
                  required
                  className="text-xs h-9 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Asset Type</label>
                <select
                  value={newAssetType}
                  onChange={(e) => setNewAssetType(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-text"
                >
                  <option value="IMAGE">Photo / Graphic</option>
                  <option value="VIDEO">Video Tour / Guide</option>
                  <option value="DOCUMENT">Document / PDF</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Asset URL or Upload</label>
                <Input
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="text-xs h-9 bg-background"
                />
                <p className="text-[11px] text-text-light">
                  Files are automatically compressed & optimized through the media CDN.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" className="shadow-cta">
                  Save Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
