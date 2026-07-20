// slugify etc.
const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
