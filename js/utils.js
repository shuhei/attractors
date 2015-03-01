const CODE_OF_LOWER_A = 97;

export function toAlphabet(index) {
  return String.fromCharCode(CODE_OF_LOWER_A + index);
}

export function toIndex(alphabet) {
  return alphabet.charCodeAt(0) - CODE_OF_LOWER_A;
}
