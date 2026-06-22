// slugify etc.

export function genFirstNameAndSurnameInitial(
  firstName: string | null | undefined,
  surname: string | null | undefined,
) {
  const surnameInitial = surname?.charAt(0)
  return `${firstName} ${surnameInitial}.`
}
