import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Start Code here
export const getAllItems = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allItems = await prisma.item.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })

        return res.json({
            status: true,
            data: allItems,
            message: 'Data berhasil ditampilkan'
        }).status(200)
    } catch (error) {
        return res.json({
            status: false,
            error: error
        })
    }
}

export const getItemById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const item = await prisma.item.findFirst({
            where: { id: Number(id) },
        });

        if (!item) {
            return res.status(404).json({
                status: false,
                message: "Barang tidak ditemukan",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Berhasil menampilkan barang",
            data: item,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: `Terjadi kesalahan: ${error}`,
        });
    }
}

export const createItems = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, category, status, location, quantity } = req.body

        //proses save data
        const newItems = await prisma.item.create({
            data: { name, category, location, status, quantity: Number(quantity) }
        })

        return res.json({
            status: true,
            message: 'Barang berhasil ditambahkan',
            data: newItems
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                error: error
            })
            .status(400)
    }
}

export const editItems = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, category, location, quantity } = req.body

        const findItem = await prisma.item.findFirst({ where: { id: Number(id) } })
        if (!findItem) return res
            .status(200)
            .json({
                status: false,
                message: "Barang tidak ada"
            })

        const editedItem = await prisma.item.update({
            data: {
                name: name || findItem.name,
                category: category || findItem.category,
                location: location || findItem.location,
                quantity: quantity ? Number(quantity) : findItem.quantity
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: true,
            message: 'Barang berhasil update',
            data: editedItem
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

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findItem = await prisma.item.findFirst({ where: { id: Number(id) } });
        if (!findItem) {
            return res.status(404).json({
                status: false,
                message: "barang tidak ditemukan"
            });
        }

        await prisma.item.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: true,
            message: 'Barang telah dihapus'
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