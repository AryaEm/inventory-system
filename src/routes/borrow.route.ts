import express from "express";
import { AnalyzeItemUsage, CreateBorrowRequest, GetBorrowedItems, ItemUsageReport, ReturnItem } from "../controllers/transaksi.controller";
import { verifyRole, verifyToken } from "../middlewares/authorization";
import { analysisValidation, borrowValidation, reportValidation, returnValidation } from "../middlewares/borrow.validation";

const app = express();
app.use(express.json());

app.get('/', [verifyToken, verifyRole(['Admin', 'Siswa'])], GetBorrowedItems)
app.post('/', [verifyToken, verifyRole(['Admin', 'Siswa']), borrowValidation], CreateBorrowRequest)
app.post('/return', [verifyToken, verifyRole(['Admin', 'Siswa']), returnValidation], ReturnItem)
app.post('/report', [verifyToken, verifyRole(['Admin']), reportValidation], ItemUsageReport)
app.post('/analysis', [verifyToken, verifyRole(['Admin']), analysisValidation], AnalyzeItemUsage)

export default app;
