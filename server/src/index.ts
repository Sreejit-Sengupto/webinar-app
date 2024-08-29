import express from 'express'
import path from 'path'

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, '../client/dist')))

app.listen(3000, () => console.log('Server running on port 3000'))