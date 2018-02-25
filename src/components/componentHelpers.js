export function getTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds %= 60;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;

  return `${hours} hrs ${minutes} min ${seconds} s`;
}

export const keys = [
  'Average Key: C',
  'Average Key: C#',
  'Average Key: D',
  'Average Key: D#',
  'Average Key: E',
  'Average Key: F',
  'Average Key: F#',
  'Average Key: G',
  'Average Key: G#',
  'Average Key: A',
  'Average Key: A#',
  'Average Key: B',
];
