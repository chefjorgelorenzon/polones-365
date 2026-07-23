"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  Camera,
  CircleAlert,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AvatarUploadProps = {
  userId: string;
  fullName: string | null;
  initialAvatarUrl: string | null;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function AvatarUpload({
  userId,
  fullName,
  initialAvatarUrl,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [previewUrl, setPreviewUrl] = useState(initialAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const initials = getInitials(fullName);

  function handleOpenFilePicker() {
    if (isUploading || isRemoving) return;

    inputRef.current?.click();
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setMessage(null);

    if (!acceptedFileTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Envie uma imagem em JPG, PNG ou WebP.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({
        type: "error",
        text: "A imagem deve ter no máximo 2 MB.",
      });
      return;
    }

    const temporaryPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(temporaryPreviewUrl);
    setIsUploading(true);

    try {
      const extension = getFileExtension(file);
      const filePath = `${userId}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrlWithVersion = `${publicUrl}?v=${Date.now()}`;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrlWithVersion,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(avatarUrlWithVersion);
      setPreviewUrl(avatarUrlWithVersion);

      setMessage({
        type: "success",
        text: "Foto de perfil atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);

      setPreviewUrl(avatarUrl);

      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      URL.revokeObjectURL(temporaryPreviewUrl);
      setIsUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!avatarUrl || isUploading || isRemoving) return;

    setIsRemoving(true);
    setMessage(null);

    try {
      const storagePath = getStoragePathFromAvatarUrl(avatarUrl);

      if (storagePath) {
        const { error: removeStorageError } =
          await supabase.storage
            .from("avatars")
            .remove([storagePath]);

        if (removeStorageError) {
          console.error(
            "Não foi possível remover o arquivo do Storage:",
            removeStorageError,
          );
        }
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(null);
      setPreviewUrl(null);

      setMessage({
        type: "success",
        text: "Foto de perfil removida.",
      });
    } catch (error) {
      console.error("Erro ao remover avatar:", error);

      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
          Foto de perfil
        </p>

        <h2 className="mt-2 text-xl font-black text-zinc-950">
          Personalize sua conta
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Envie uma foto em formato JPG, PNG ou WebP, com no
          máximo 2 MB.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-zinc-950 shadow-lg ring-1 ring-zinc-200">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={`Foto de perfil de ${
                fullName ?? "aluno"
              }`}
              fill
              sizes="112px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">
              {initials}
            </div>
          )}

          {(isUploading || isRemoving) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <LoaderCircle
                size={28}
                className="animate-spin text-white"
              />
            </div>
          )}

          {!isUploading && !isRemoving && (
            <button
              type="button"
              onClick={handleOpenFilePicker}
              aria-label="Alterar foto de perfil"
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-red-700 text-white shadow-md transition hover:bg-red-800"
            >
              <Camera size={17} />
            </button>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleOpenFilePicker}
              disabled={isUploading || isRemoving}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Escolher foto
                </>
              )}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isUploading || isRemoving}
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-black text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRemoving ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Removendo...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Remover foto
                  </>
                )}
              </button>
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Para um melhor resultado, utilize uma imagem quadrada
            e com o rosto centralizado.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {message && (
        <div
          role="status"
          className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.type === "error" && (
            <CircleAlert
              size={19}
              className="mt-0.5 shrink-0"
            />
          )}

          <p>{message.text}</p>
        </div>
      )}
    </section>
  );
}

function getInitials(fullName: string | null) {
  if (!fullName?.trim()) {
    return "MP";
  }

  const names = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 1) {
    return names[0].slice(0, 2).toUpperCase();
  }

  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
}

function getFileExtension(file: File) {
  const extensionsByMimeType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionsByMimeType[file.type] ?? "jpg";
}

function getStoragePathFromAvatarUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const marker = "/storage/v1/object/public/avatars/";
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      parsedUrl.pathname.slice(
        markerIndex + marker.length,
      ),
    );
  } catch {
    return null;
  }
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Não foi possível atualizar a foto de perfil.";
}