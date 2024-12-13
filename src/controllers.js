import sql from "./db"
import { validateBody, validateSearchParam } from "./middleware"

async function postPerson(req) {
  const body = await req.json()

  const result = await validateBody(body)
  if (result) return result

  const person = await sql`
     INSERT INTO pessoas(id, apelido, nome, nascimento, stack)
     VALUES (${crypto.randomUUID()}, ${body.apelido}, ${body.nome}, ${body.nascimento}, ${body.stack})
     returning id
    `

  return new Response(null, {
    status: 201,
    headers: {
      Location: req.url + '/' + person[0].id
    }
  })
}

async function getPersonById(url) {
  const id = url.href.replace(url.origin + '/pessoas/', '');

  const person = await sql`
      SELECT id, apelido, nome, nascimento, stack FROM pessoas
      WHERE id = ${id};
    `

  return Response.json(person[0])
}

async function getPersonByQuery(url) {
  let searchTerm = url.href.replace(url.origin + '/pessoas?', '')

  const result = validateSearchParam(searchTerm)
  if (result) return result

  searchTerm = searchTerm.replace('t=', '')

  const people = await sql`
    SELECT id, apelido, nome, nascimento, stack FROM pessoas
    WHERE apelido_nome_stack ILIKE ${'%' + searchTerm + '%'}
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
