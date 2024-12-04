import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { SECRET } from "../global"
import md5 from "md5";
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Start Code here
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allUsers = await prisma.user.findMany({
            where: { username: { contains: search?.toString() || "" } }
        })
        return res.json({
            status: true,
            massege: 'Berhasil menampilkan semua user',
            data: allUsers
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: error
            })
            .status(400)
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body
        const uuid = uuidv4()

        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Username sudah digunakan, silakan gunakan username lain",
            });
        }

        const newUser = await prisma.user.create({
            data: { uuid, username, password: md5(password), role }
        })

        return res.json({
            status: true,
            message: 'Berhasil menambahkan user',
            data: newUser
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `error bang ${error}`
            })
            .status(400)
    }
}

export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { username, password, role } = req.body

        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Username sudah digunakan, silakan gunakan username lain",
            });
        }

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return res
            .status(200)
            .json({
                status: false,
                message: "User tidak ada"
            })

        const editedUser = await prisma.user.update({
            data: {
                username: username || findUser.username,
                password: password ? md5(password) : findUser.password,
                role: role || findUser.role,
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: true,
            message: 'User sudah diupdate',
            data: editedUser,
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: error
            })
            .status(400)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "User tidak ditemukan"
            });
        }

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: true,
            message: 'User telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: error
            })
            .status(400);
    }
}

export const authentication = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const findUSer = await prisma.user.findFirst({
            where: { username, password: md5(password) }
        })

        if (!findUSer)
            return res
                .status(200)
                .json({
                    status: false,
                    logged: false,
                    message: 'username atau password salah'
                })

        let data = {
            id: findUSer.id,
            username: findUSer.username,
            role: findUSer.role
        }

        let playload = JSON.stringify(data)

        let token = sign(playload, SECRET || "token")

        return res
            .status(200)
            .json({
                status: 'success',
                logged: true,
                data: data,
                message: "Login Successfull",
                token
            })

    } catch (error) {
        return res
            .json({
                status: 'fals',
                message: `error ${error}`
            })
            .status(400)
    }
}