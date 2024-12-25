import sql from "./db"

async function validateUniqueNickname(nickname) {
  const hasNickname = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM pessoas
      WHERE apelido = ${nickname}
    )
  `

  return hasNickname[0].exists
}

function validateStack(stack) {
  if (Array.isArray(stack)) {
    for (let e of stack) {
      if (typeof (e) != 'string' || e.length > 32) return true
    }
  } else return stack != null
}

function validateBirthDate(birthDate) {
  if (birthDate.length == 10) {
    const splitedDate = birthDate.split('-')

    const [year, month, day] = splitedDate

    if (year > 1900 && year < 2021 && month > 0 &&
      month <= 12 && day > 0 && day <= 31)
      return false
  }
  return true
}

async function validateBody(body) {
  if (!body.apelido || !body.nome || body.apelido.length > 32 ||
    body.nome.length > 100 || validateBirthDate(body.nascimento) ||
    await validateUniqueNickname(body.apelido))
    return new Response(null, { status: 422 })

  if (typeof (body.nome) != 'string' || validateStack(body.stack))
    return new Response(null, { status: 400 })
}

function validateSearchParam(searchParam) {
  if (!searchParam.startsWith('t='))
    return new Response(null, { status: 400 })
}

export {
  validateBody,
  validateSearchParam
}
