// slugify etc.

export function genFirstNameAndSurnameInitial(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]

  const firstName = parts[0]
  const surnameInitial = parts[parts.length - 1][0]
  return `${firstName} ${surnameInitial}.`
}
