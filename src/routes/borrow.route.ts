import express from "express";
import { AnalyzeItemUsage, CreateBorrowRequest, GetBorrowedItems, ItemUsageReport, ReturnItem } from "../controllers/transaksi.controller";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get('/', [verifyToken, verifyRole(['Admin', 'Siswa'])], GetBorrowedItems)
app.post('/', [verifyToken, verifyRole(['Admin', 'Siswa'])], CreateBorrowRequest)
app.post('/return', [verifyToken, verifyRole(['Admin', 'Siswa'])], ReturnItem)
app.post('/report', [verifyToken, verifyRole(['Admin'])], ItemUsageReport)
app.post('/analysis', [verifyToken, verifyRole(['Admin'])], AnalyzeItemUsage)

export default app;
