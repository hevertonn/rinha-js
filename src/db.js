import postgres from 'postgres'

const sql = postgres('postgres://postgres:1234@db:5432/rinha')

export default sql
