/**
 * Video helpers for YouTube, Vimeo, and Cloudinary/direct video files
 */

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function getVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }

  return null;
}

export function getVideoThumbnailUrl(url: string): string | null {
  if (!url) return null;

  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  if (url.includes("res.cloudinary.com") && url.endsWith(".mp4")) {
    return url.replace(/\.mp4(\?.*)?$/, ".jpg");
  }

  return null;
}

export function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
}
