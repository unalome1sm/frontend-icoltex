"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, Folder, ImageIcon, Film, FileIcon } from "lucide-react";
import {
  DEFAULT_DRIVE_FOLDER_ID,
  driveFileShareUrl,
  fetchDriveFiles,
  fetchDriveRootFolder,
  type DriveFile,
} from "@/lib/drive";

type DriveFileBrowserProps = {
  onSelect: (file: DriveFile, shareUrl: string) => void;
  imagesOnly?: boolean;
  videosOnly?: boolean;
  className?: string;
};

type BreadcrumbItem = {
  id: string;
  name: string;
};

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4 shrink-0 text-emerald-600" />;
  }
  if (mimeType.startsWith("video/")) {
    return <Film className="h-4 w-4 shrink-0 text-violet-600" />;
  }
  return <FileIcon className="h-4 w-4 shrink-0 text-slate-500" />;
}

export function DriveFileBrowser({
  onSelect,
  imagesOnly = false,
  videosOnly = false,
  className = "",
}: DriveFileBrowserProps) {
  const [rootFolderId, setRootFolderId] = useState(DEFAULT_DRIVE_FOLDER_ID);
  const [currentFolderId, setCurrentFolderId] = useState(DEFAULT_DRIVE_FOLDER_ID);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: DEFAULT_DRIVE_FOLDER_ID, name: "PAGINA ICOLTEX" },
  ]);
  const [folders, setFolders] = useState<DriveFile[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFolder = useCallback(
    async (folderId: string) => {
      setLoading(true);
      setError("");
      try {
        const [foldersRes, filesRes] = await Promise.all([
          fetchDriveFiles({ folderId, foldersOnly: true }),
          fetchDriveFiles({ folderId, imagesOnly, videosOnly }),
        ]);
        setFolders(foldersRes.files);
        setFiles(filesRes.files);
        setCurrentFolderId(folderId);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar Google Drive",
        );
        setFolders([]);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    },
    [imagesOnly, videosOnly],
  );

  useEffect(() => {
    fetchDriveRootFolder()
      .then((data) => {
        setRootFolderId(data.folderId);
        setCurrentFolderId(data.folderId);
        setBreadcrumb([{ id: data.folderId, name: "PAGINA ICOLTEX" }]);
        return loadFolder(data.folderId);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Google Drive no configurado",
        );
        setLoading(false);
      });
  }, [loadFolder]);

  function openFolder(folder: DriveFile) {
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
    void loadFolder(folder.id);
  }

  function goToBreadcrumb(index: number) {
    const item = breadcrumb[index];
    setBreadcrumb((prev) => prev.slice(0, index + 1));
    void loadFolder(item.id);
  }

  function goUp() {
    if (breadcrumb.length <= 1) return;
    goToBreadcrumb(breadcrumb.length - 2);
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        {currentFolderId !== rootFolderId && (
          <button
            type="button"
            onClick={goUp}
            className="rounded p-1 text-slate-600 hover:bg-slate-100"
            aria-label="Carpeta anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-xs text-slate-600">
          {breadcrumb.map((item, index) => (
            <span key={item.id} className="flex items-center gap-1">
              {index > 0 && <span className="text-slate-300">/</span>}
              <button
                type="button"
                onClick={() => goToBreadcrumb(index)}
                className="truncate hover:text-slate-900 hover:underline"
              >
                {item.name}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto p-2">
        {loading && (
          <p className="px-2 py-6 text-center text-sm text-slate-500">
            Cargando archivos…
          </p>
        )}

        {!loading && error && (
          <p className="px-2 py-6 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && folders.length === 0 && files.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-slate-500">
            Esta carpeta está vacía.
          </p>
        )}

        {!loading && !error && (
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id}>
                <button
                  type="button"
                  onClick={() => openFolder(folder)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <Folder className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="truncate">{folder.name}</span>
                </button>
              </li>
            ))}

            {files.map((file) => (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => onSelect(file, driveFileShareUrl(file.id))}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                >
                  {file.thumbnailLink ? (
                    <img
                      src={file.thumbnailLink}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <FileTypeIcon mimeType={file.mimeType} />
                  )}
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  {file.size && (
                    <span className="shrink-0 text-xs text-slate-400">
                      {(Number(file.size) / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
