export function toAlphabet(index) {
  return String.fromCharCode(97 + index);
}

export function toIndex(alphabet) {
  return alphabet.charCodeAt(0) - 97;
}
