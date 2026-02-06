import 'dotenv/config'
import connectDB from "./src/config/connectDB.js"
import app from './src/app.js'

const PORT = process.env.PORT ;

await connectDB();

app.listen(PORT, () => {
    console.log(`Port is listening in http://localhost:${PORT}`)
})
