import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), "storage", "audio");

/** Enregistre le fichier audio d'une histoire sur le disque et renvoie son nom de fichier. */
export async function saveStoryAudio(storyId: string, audio: Buffer) {
  await mkdir(AUDIO_DIR, { recursive: true });
  const fileName = `${storyId}.mp3`;
  await writeFile(path.join(AUDIO_DIR, fileName), audio);
  return fileName;
}

export async function readStoryAudio(fileName: string) {
  return readFile(path.join(AUDIO_DIR, fileName));
}

export async function deleteStoryAudio(fileName: string) {
  const { unlink } = await import("fs/promises");
  await unlink(path.join(AUDIO_DIR, fileName)).catch(() => {});
}
