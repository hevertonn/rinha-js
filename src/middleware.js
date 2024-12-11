import sql from "./db"

async function fetchNickname(nickname) {
  const hasNickname = sql`
    SELECT (nickname) FROM people
    WHERE nickname = ${nickname}
  `
  return hasNickname[0].nickname
}

function validateStack(stack) {
  if (Array.isArray(stack)) {
    stack.forEach((value) => {
      if (typeof (value) != 'string' || value.length > 32) return true
    })
  } else {
    return stack != null
  }
}

async function validateBody(body) {
  if (!body.apelido || !body.nome || !body.nascimento ||
    body.apelido.length > 32 || body.nome.length > 100 ||
    body.nascimento.length > 10 || Number.isNaN(Date.parse(body.nascimento))) {
    return new Response(null, { status: 422 })
  }

  if (typeof (body.apelido) != 'string' || typeof (body.nome) != 'string' ||
    typeof (body.data) != 'string' || validateStack(body.stack)) {
    return new Response(null, { status: 400 })
  }

  if (await fetchNickname(body.apelido)) return new Response(null, { status: 422 })
}

function validateSearchParam(searchParam) {
  if (!searchParam.startsWith('?t=')) {
    return new Response(null, { status: 400 })
  }
}

export {
  validateBody,
  validateSearchParam
}

