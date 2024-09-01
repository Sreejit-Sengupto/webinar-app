import { app } from "./app"
import connectDb from "./db"


(
    async () => {
        const PORT = process.env.PORT
        await connectDb()
        try {
            app.listen(PORT, () => {
                console.log(`App listening on PORT: ${PORT}`);
            })
        } catch (error) {
            console.error(error);
        }
    }
)()