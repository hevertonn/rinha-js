import sql from "./db"
import { validateBody, validateSearchParam } from "./middleware"

async function postPerson(req) {
  const body = await req.json()

  const result = await validateBody(body)
  if (result) return result

  const uuid = crypto.randomUUID()

  await sql`
     INSERT INTO pessoas(id, apelido, nome, nascimento, stack)
     VALUES (${uuid}, ${body.apelido}, ${body.nome}, ${body.nascimento}, ${body.stack})
    `

  return new Response(null, {
    status: 201,
    headers: {
      Location: req.url + '/' + uuid
    }
  })
}

async function getPersonById(url) {
  const id = url.pathname.replace('/pessoas/', '');

  const person = await sql`
       SELECT id, apelido, nome, nascimento, stack FROM pessoas
       WHERE id = ${id};
     `
  if (person[0]) return Response.json(person[0])

  return new Response(null, { status: 404 })
}

async function getPersonByQuery(url) {
  let searchTerm = url.href.replace(url.origin + '/pessoas?', '')

  const result = validateSearchParam(searchTerm)
  if (result) return result

  searchTerm = searchTerm.replace('t=', '').toLowerCase()

  const people = await sql`
    SELECT id, apelido, nome, nascimento, stack FROM pessoas
    WHERE apelido_nome_stack LIKE ${'%' + searchTerm + '%'}
    LIMIT 50;
  `

  return Response.json(people)
}

async function personCount() {
  const count = await sql`
    SELECT COUNT(id) FROM pessoas;
  `

  return new Response(count[0].count)
}

export {
  getPersonById,
  getPersonByQuery,
  personCount, postPerson
}
