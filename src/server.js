import { createPerson, getPersonById, getPersonByQuery, personCount } from './controllers'

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname == '/pessoas' && req.method == 'POST') return await createPerson(req)
    if (url.pathname.startsWith('/pessoas/') == true) return await getPersonById(url)
    if (url.pathname == '/pessoas' && req.method == 'GET') return await getPersonByQuery(url)
    if (url.pathname == '/contagem-pessoas') return await personCount()
  }
})

console.log(`Server running on ${server.url}`)
