import express from "express";
import { createItems, deleteItem, editItems, getAllItems, getItemById } from "../controllers/item.controller";
import { verifyAddItem, verifyeditItem } from "../middlewares/verifyItem";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get('/', [verifyToken, verifyRole(['Admin', 'Siswa'])], getAllItems)
app.get('/:id', [verifyToken, verifyRole(['Admin', 'Siswa'])], getItemById)
app.post('/', [verifyToken, verifyRole(['Admin']), verifyAddItem], createItems)
app.put('/:id', [verifyToken, verifyRole(['Admin']), verifyeditItem], editItems)
app.delete('/:id', [verifyToken, verifyRole(['Admin'])], deleteItem)

export default app;
