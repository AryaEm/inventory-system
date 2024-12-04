import express from "express";
import cors from "cors";

const PORT: number = 8000
const app = express();

// app.use(express.json());
app.use(cors());
import items from "./routes/item.route"
import user from "./routes/user.route"
import borrow from "./routes/borrow.route"

app.use('/item', items)
app.use('/user', user)
app.use('/borrow', borrow)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
