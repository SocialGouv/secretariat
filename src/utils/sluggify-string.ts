const sluggifyString = (input: string) =>
  input
    .normalize("NFKD") // break down characters and diacritics
    .replace(/\p{Diacritic}/gu, "") // remove diacritics
    .replace(/\s+/g, "-") // remove whitespaces
    .toLowerCase()

export default sluggifyString
