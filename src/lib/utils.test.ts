import { formatChoice, capitalize, randomizeArray } from './utils';
import { describe, it, expect } from 'vitest'

describe('formatChoice function', () => {
  it('should format the choice correctly', () => {
    const filename = 'apple+banana+cherry';
    const formattedChoice = formatChoice(filename);
    expect(formattedChoice).toEqual('Apple / Banana / Cherry');
  });

  it('should handle an empty string', () => {
    const filename = '';
    const formattedChoice = formatChoice(filename);
    expect(formattedChoice).toEqual('');
  });

  it('should handle single-word choices', () => {
    const filename = 'pear';
    const formattedChoice = formatChoice(filename);
    expect(formattedChoice).toEqual('Pear');
  });

  it('should trim leading and trailing spaces', () => {
    const filename = '  watermelon+kiwi  ';
    const formattedChoice = formatChoice(filename);
    expect(formattedChoice).toEqual('Watermelon / Kiwi');
  });
});

describe('capitalize function', () => {
  it('should capitalize the first letter of a word', () => {
    const word = 'apple';
    const capitalizedWord = capitalize(word);
    expect(capitalizedWord).toEqual('Apple');
  });

  it('should capitalize a word with only one letter', () => {
    const word = 'a';
    const capitalizedWord = capitalize(word);
    expect(capitalizedWord).toEqual('A');
  });

  it('should handle an empty string', () => {
    const word = '';
    const capitalizedWord = capitalize(word);
    expect(capitalizedWord).toEqual('');
  });

  it('should handle a word with leading spaces', () => {
    const word = '  hello';
    const capitalizedWord = capitalize(word);
    expect(capitalizedWord).toEqual('  hello'); // The first space should not be removed
  });
});

describe('randomizeArray function', () => {
  it('should return a shuffled array', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const randomizedArray = randomizeArray(inputArray);
    expect(randomizedArray).not.toEqual(inputArray);
    expect(randomizedArray).toHaveLength(inputArray.length);
    expect(randomizedArray.sort()).toEqual(inputArray.sort()); // Checks if all elements are preserved
  });

  it('should handle an empty array', () => {
    const inputArray: any[] = [];
    const randomizedArray = randomizeArray(inputArray);
    expect(randomizedArray).toHaveLength(0);
  });

  it('should handle an array with a single element', () => {
    const inputArray = [42];
    const randomizedArray = randomizeArray(inputArray);
    expect(randomizedArray).toEqual(inputArray);
  });
});
