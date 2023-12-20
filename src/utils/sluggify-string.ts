const sluggifyString = (input: string) =>
  input
    .normalize("NFKD") // break down characters and diacritics
    .replace(/\p{Diacritic}/gu, "") // remove diacritics
    .replace(/\s+/g, "-") // remove whitespaces
    .replace(/[^a-zA-Z-]/g, "") // remove everything else
    .toLowerCase()

export default sluggifyString
