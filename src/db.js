import postgres from 'postgres'

const sql = postgres('postgres://postgres:1234@localhost:5432/rinha')

export default sql
