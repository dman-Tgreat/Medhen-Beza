"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Copy, Check, ExternalLink, ShieldAlert } from "lucide-react";

interface HospitalMapProps {
  title?: string;
  subtitle?: string;
  address?: string;
  plusCode?: string;
  latitude?: number;
  longitude?: number;
  variant?: "standard" | "emergency";
  className?: string;
}

// Default GPS Coordinates for Medhen Beza Hospital, Adama, Ethiopia
const DEFAULT_LAT = 8.5395;
const DEFAULT_LON = 39.2731;
const DEFAULT_PLUS_CODE = "H73F+R49, Adama";
const DEFAULT_ADDRESS = "H73F+R49, Adama, Ethiopia";

export function HospitalMap({
  title,
  subtitle,
  address = DEFAULT_ADDRESS,
  plusCode = DEFAULT_PLUS_CODE,
  latitude = DEFAULT_LAT,
  longitude = DEFAULT_LON,
  variant = "standard",
  className = "",
}: HospitalMapProps) {
  const [copied, setCopied] = useState(false);

  // Compute bounding box around the coordinate for OpenStreetMap embed
  const deltaLat = 0.009;
  const deltaLon = 0.012;
  const bbox = `${(longitude - deltaLon).toFixed(4)}%2C${(latitude - deltaLat).toFixed(4)}%2C${(longitude + deltaLon).toFixed(4)}%2C${(latitude + deltaLat).toFixed(4)}`;

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const osmDirectUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  const geoUri = `geo:${latitude},${longitude}?q=${encodeURIComponent("Medhen Beza Hospital")}`;

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  const isEmergency = variant === "emergency";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
              isEmergency ? "text-emergency" : "text-primary"
            }`}
          >
            {isEmergency ? <ShieldAlert className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            {isEmergency ? "Emergency Entrance & Trauma Access" : "Hospital Campus Location"}
          </div>

          <h3 className="text-h3 font-bold text-text">
            {title || (isEmergency ? "Emergency Gate & Trauma Navigation" : "Campus Location & Interactive Map")}
          </h3>

          <p className="text-small text-text-muted">
            {subtitle || (
              <>
                Location Plus Code: <span className="font-semibold text-text font-mono">{plusCode}</span> ·{" "}
                {address}
              </>
            )}
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyCoords}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text-muted hover:text-text hover:bg-background transition-colors min-h-[38px]"
            title="Copy GPS coordinates"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-secondary" />
                <span>Copied GPS</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
              </>
            )}
          </button>

          <a
            href={osmDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-colors min-h-[38px] ${
              isEmergency
                ? "bg-emergency hover:bg-emergency-dark"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Open in OpenStreetMap</span>
            <ExternalLink className="h-3 w-3 opacity-80" />
          </a>

          {/* Universal Mobile Maps URI */}
          <a
            href={geoUri}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-xs font-semibold text-text hover:bg-background transition-colors min-h-[38px]"
            title="Open in your device's default map app"
          >
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            <span>Device Maps</span>
          </a>
        </div>
      </div>

      {/* Interactive OpenStreetMap Container */}
      <div className="relative aspect-[16/9] md:aspect-[21/8] rounded-2xl overflow-hidden border border-border bg-background shadow-xs">
        <iframe
          title={title || "Medhen Beza Hospital Campus Map"}
          src={osmEmbedUrl}
          className="w-full h-full border-0 absolute inset-0"
          loading="lazy"
        />

        {/* Small Open-Source Attribution Pill */}
        <div className="absolute bottom-2 right-2 bg-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-text-muted border border-border pointer-events-auto">
          Map data ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary font-medium"
          >
            OpenStreetMap
          </a>{" "}
          contributors (Open Source)
        </div>
      </div>
    </div>
  );
}
