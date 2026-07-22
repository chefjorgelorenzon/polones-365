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
    console.log("[VÍDEO] video_path vazio.");
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("[VÍDEO] Usuário:", user?.id ?? "não autenticado");
  console.log("[VÍDEO] Bucket:", VIDEO_BUCKET);
  console.log("[VÍDEO] Caminho:", videoPath);

  const { data, error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(videoPath, 3600);

  if (error) {
    const storageError = error as StorageErrorDetails;

    console.log("[VÍDEO] ERRO REAL:");
    console.log("name:", storageError.name);
    console.log("message:", storageError.message);
    console.log("status:", storageError.status);
    console.log("statusCode:", storageError.statusCode);
    console.log("error:", storageError.error);
    console.log(
      "propriedades:",
      Object.getOwnPropertyNames(error)
    );

    return null;
  }

  console.log("[VÍDEO] URL criada com sucesso.");

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