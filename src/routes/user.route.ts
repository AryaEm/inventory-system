import express from "express";
import { authentication, createUser, deleteUser, editUser, getAllUsers } from "../controllers/user.controller";
import { verifyAddUser, verifyeditUser } from "../middlewares/verifyUser";
import { verifyAuthtentication } from "../middlewares/userValidation";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

// Login
app.post('/login', [verifyAuthtentication], authentication)

app.get('/', [verifyToken, verifyRole(['Admin', 'Siswa'])], getAllUsers)
app.post('/', [verifyAddUser], createUser)
app.put('/:id', [verifyToken, verifyRole(['Admin']), verifyeditUser], editUser)
app.delete('/:id', [verifyToken, verifyRole(['Admin', 'Siswa'])], deleteUser)

export default app;
