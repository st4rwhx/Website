import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";

interface AudioStorage {
  save(fileName: string, audio: Buffer): Promise<void>;
  read(fileName: string): Promise<Buffer>;
  delete(fileName: string): Promise<void>;
}

const LOCAL_AUDIO_DIR = path.join(process.cwd(), "storage", "audio");

/**
 * Stockage sur le disque local. Simple et suffisant en développement, mais
 * ne persiste pas sur une plateforme à filesystem éphémère (Vercel...).
 */
class LocalAudioStorage implements AudioStorage {
  async save(fileName: string, audio: Buffer) {
    await mkdir(LOCAL_AUDIO_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_AUDIO_DIR, fileName), audio);
  }

  async read(fileName: string) {
    return readFile(path.join(LOCAL_AUDIO_DIR, fileName));
  }

  async delete(fileName: string) {
    await unlink(path.join(LOCAL_AUDIO_DIR, fileName)).catch(() => {});
  }
}

/**
 * Stockage objet compatible S3 (AWS S3, Cloudflare R2, MinIO...).
 * Activé automatiquement dès que S3_BUCKET est défini (voir .env.example).
 */
class S3AudioStorage implements AudioStorage {
  private bucket: string;
  private prefix = "audio/";

  constructor(bucket: string) {
    this.bucket = bucket;
  }

  private async client() {
    const { S3Client } = await import("@aws-sdk/client-s3");
    return new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: Boolean(process.env.S3_ENDPOINT),
      credentials:
        process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            }
          : undefined,
    });
  }

  async save(fileName: string, audio: Buffer) {
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.client();
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.prefix + fileName,
        Body: audio,
        ContentType: "audio/mpeg",
      }),
    );
  }

  async read(fileName: string) {
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.client();
    const res = await client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: this.prefix + fileName }),
    );
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) throw new Error("Fichier audio introuvable dans le stockage objet.");
    return Buffer.from(bytes);
  }

  async delete(fileName: string) {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.client();
    await client
      .send(new DeleteObjectCommand({ Bucket: this.bucket, Key: this.prefix + fileName }))
      .catch(() => {});
  }
}

let storage: AudioStorage | null = null;

function getStorage(): AudioStorage {
  if (!storage) {
    storage = process.env.S3_BUCKET ? new S3AudioStorage(process.env.S3_BUCKET) : new LocalAudioStorage();
  }
  return storage;
}

/** Enregistre le fichier audio d'une histoire et renvoie son nom de fichier. */
export async function saveStoryAudio(storyId: string, audio: Buffer) {
  const fileName = `${storyId}.mp3`;
  await getStorage().save(fileName, audio);
  return fileName;
}

export async function readStoryAudio(fileName: string) {
  return getStorage().read(fileName);
}

export async function deleteStoryAudio(fileName: string) {
  await getStorage().delete(fileName);
}
