import { getApiUrl, getAuthHeaders } from "../api";
import { extractGoogleDriveFileId } from "./googleDrive";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  modifiedTime?: string;
  isFolder: boolean;
  videoDurationMillis?: string;
  imageWidth?: number;
  imageHeight?: number;
};

export const DEFAULT_DRIVE_FOLDER_ID = "15qfWHVlpLwV3nnUD7YWybEfUPKrhh8NT";

export function driveFileShareUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

export function driveFilePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getDriveContentUrl(fileId: string): string {
  return getApiUrl(`/api/drive/files/${fileId}/content`);
}

export function getDriveMetadataUrl(fileId: string): string {
  return getApiUrl(`/api/drive/files/${fileId}/metadata`);
}

/** URL para mostrar imagen: API de Drive si hay fileId, si no el proxy legacy. */
export function getDriveImageDisplayUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return getDriveContentUrl(fileId);
  }

  if (
    trimmed.includes("drive.google.com") ||
    trimmed.includes("lh3.googleusercontent.com")
  ) {
    return getApiUrl(`/api/images/proxy?url=${encodeURIComponent(trimmed)}`);
  }

  return trimmed;
}

async function driveFetch<T>(path: string): Promise<T> {
  const res = await fetch(getApiUrl(path), {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data as T;
}

export async function fetchDriveStatus(): Promise<{
  configured: boolean;
  folderId: string;
}> {
  return driveFetch("/api/drive/status");
}

export async function fetchDriveRootFolder(): Promise<{ folderId: string }> {
  return driveFetch("/api/drive/folder");
}

export async function fetchDriveFiles(options?: {
  folderId?: string;
  imagesOnly?: boolean;
  videosOnly?: boolean;
  foldersOnly?: boolean;
}): Promise<{ folderId: string; files: DriveFile[] }> {
  const params = new URLSearchParams();
  if (options?.folderId) params.set("folderId", options.folderId);
  if (options?.imagesOnly) params.set("imagesOnly", "true");
  if (options?.videosOnly) params.set("videosOnly", "true");
  if (options?.foldersOnly) params.set("foldersOnly", "true");

  const query = params.toString();
  return driveFetch(`/api/drive/files${query ? `?${query}` : ""}`);
}

export async function fetchDriveFileMetadata(
  fileId: string,
): Promise<{ file: DriveFile }> {
  const res = await fetch(getDriveMetadataUrl(fileId));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data as { file: DriveFile };
}
