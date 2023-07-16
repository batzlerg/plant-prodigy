export function formatChoice(filename: string): string {
  // Split the string by '+', ' ', and '.'
  const words = filename.trim().split(/[+ .]/);

  // Capitalize the first letter of each word
  return words
    .map((word) => capitalize(word))
    .join(' / ');
}

// exported for testing
export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function randomizeArray(arr: any[]): any[] {
  return [...arr].sort(() => 0.5 - Math.random());
}