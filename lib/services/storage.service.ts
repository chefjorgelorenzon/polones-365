import { createClient } from "@/lib/supabase/server";

const VIDEO_BUCKET = "lesson-videos";
const MATERIAL_BUCKET = "lesson-materials";

type StorageErrorDetails = {
  name?: string;
  message?: string;
  status?: number;
  statusCode?: string | number;
  error?: string;
};

export async function getLessonVideoUrl(
  videoPath: string | null
): Promise<string | null> {
  if (!videoPath) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(videoPath, 3600);

  if (error) {
    const storageError = error as StorageErrorDetails;

    console.error(
      "Erro ao gerar URL assinada do vídeo:",
      storageError.message ?? storageError
    );

    return null;
  }

  return data.signedUrl;
}

export async function getLessonMaterialUrl(
  materialPath: string | null
): Promise<string | null> {
  if (!materialPath) {
    return null;
  }

  const supabase = await createClient();

  const { data } = supabase.storage
    .from(MATERIAL_BUCKET)
    .getPublicUrl(materialPath);

  return data.publicUrl;
}