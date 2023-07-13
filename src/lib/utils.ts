export function formatChoice(filename: string): string {
  const words = filename.split('+').map(word => capitalize(word));
  return words.join(' / ');
}

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function randomizeArray(arr: any[]): any[] {
  return [...arr].sort(() => 0.5 - Math.random());
}