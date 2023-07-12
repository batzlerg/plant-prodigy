import fs from 'fs';
import { join } from 'path';
import { json } from '@sveltejs/kit';

const STATIC_DIR = 'static';
const GAME_ASSET_DIR = 'plants';
const GAME_ASSET_DIR_ABSOLUTE = join(process.cwd(), STATIC_DIR, GAME_ASSET_DIR);

export async function GET() {
  try {
    const directories = await getDirectories(GAME_ASSET_DIR_ABSOLUTE);
    const gameLength = directories.length;
    const currentPrompt = getRandomDirectory(directories);
    const photoUrl = await getRandomPhotoUrl(currentPrompt);
    return json({
      directories,
      gameLength,
      currentPrompt,
      photoUrl
    });
  } catch (error) {
    throw error;
  }
}

async function getDirectories(directoryPath: string) {
  const subdirectories = await fs.promises.readdir(directoryPath, { withFileTypes: true });
  return subdirectories
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getRandomDirectory(directories: string[]) {
  const randomIndex = Math.floor(Math.random() * directories.length);
  return directories[randomIndex];
}

async function getRandomPhotoUrl(subdir: string) {
  const photos = await fs.promises.readdir(join(GAME_ASSET_DIR_ABSOLUTE, subdir));
  const randomIndex = Math.floor(Math.random() * photos.length);
  return join(GAME_ASSET_DIR, subdir, `${photos[randomIndex]}`);
}
