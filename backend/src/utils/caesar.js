const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function caesarCipher(text, shift) {
  const len = ALPHABET.length;
  // Normaliza passos positivos, negativos ou maiores que o tamanho do alfabeto
  const normalizedShift = ((shift % len) + len) % len;

  return text
    .split('')
    .map((char) => {
      const index = ALPHABET.indexOf(char);
      if (index === -1) return char; // Mantém espaços e acentuação/pontuação
      const newIndex = (index + normalizedShift) % len;
      return ALPHABET[newIndex];
    })
    .join('');
}

module.exports = { caesarCipher };
