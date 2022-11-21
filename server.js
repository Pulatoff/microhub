require('dotenv').config({})
const sequlize = require('./configs/db')
const app = require('./middlewares/app')

const PORT = process.env.PORT || 8000

sequlize.sync()

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
