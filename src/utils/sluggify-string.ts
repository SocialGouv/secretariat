const sluggifyString = (input: string) =>
  input
    .normalize("NFKD") // break down characters and diacritics
    .replace(/\p{Diacritic}/gu, "") // remove diacritics
    .replace(/\s+/g, "-") // remove whitespaces
    .replace(/'+/g, "")
    .toLowerCase()

export default sluggifyString
