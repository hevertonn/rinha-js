import sql from "./db"

async function fetchNickname(nickname) {
  const hasNickname = await sql`
    SELECT apelido FROM pessoas
    WHERE apelido = ${nickname}
  `
  return hasNickname[0]
}

function validateStack(stack) {
  if (Array.isArray(stack)) {
    for (let e of stack) {
      if (typeof (e) != 'string' || e.length > 32) return true
    }
  } else return stack != null
}

async function validateBody(body) {
  if (!body.apelido || !body.nome || body.apelido.length > 32 || body.nome.length > 100 ||
    Number.isNaN(Date.parse(body.nascimento)) || body.nascimento.length > 10)
    return new Response(null, { status: 422 })

  if (typeof (body.apelido) != 'string' || typeof (body.nome) != 'string' ||
    typeof (body.nascimento) != 'string' || validateStack(body.stack))
    return new Response(null, { status: 400 })

  if (await fetchNickname(body.apelido)) return new Response(null, { status: 422 })
}

function validateSearchParam(searchParam) {
  if (!searchParam.startsWith('t='))
    return new Response(null, { status: 400 })
}

export {
  validateBody,
  validateSearchParam
}

