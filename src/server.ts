import { app} from "./app.js";
const port:string = process.env.PORT || "3000"

app.listen(port, async () =>{
    console.log(`Server is working on port ${port}`)
    console.log(`Cache service is working properly`)
})