import { getPersonById, getPersonByQuery, personCount, postPerson } from './controllers'

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname == '/pessoas' && req.method == 'POST') return await postPerson(req)
    if (url.pathname.startsWith('/pessoas/') == true) return await getPersonById(url)
    if (url.href.includes('/pessoas?') == true) return await getPersonByQuery(url)
    if (url.pathname == '/contagem-pessoas') return await personCount()
  }
})

console.log(`Server running on ${server.url}`)
