import { Request, Response } from "express";
import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // Return false jika invalid
};

export const CreateBorrowRequest = async (req: Request, res: Response) => {
    try {
        const { user_id, item_id, borrow_date, return_date, quantity } = req.body;

        // Validasi: Pastikan quantity tidak negatif
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity tidak boleh kurang dari atau sama dengan nol"
            });
        }

        // Validasi: Pastikan tanggal valid
        if (!isValidDate(borrow_date) || !isValidDate(return_date)) {
            return res.status(400).json({
                success: false,
                message: "Tanggal yang dimasukkan tidak valid. Gunakan format YYYY-MM-DD"
            });
        }

        const borrowDate = new Date(borrow_date);
        const returnDate = new Date(return_date);

        // Validasi: Periksa apakah user_id ada di tabel User
        const user = await prisma.user.findUnique({
            where: { id: user_id },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User dengan id ${user_id} tidak ditemukan`
            });
        }

        // Validasi: Periksa apakah item_id ada di tabel Item
        const item = await prisma.item.findUnique({
            where: { id: item_id },
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: `Item dengan id ${item_id} tidak ditemukan`
            });
        }

        // Validasi: Cek apakah quantity yang diminta tidak melebihi jumlah yang tersedia
        if (quantity > item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Jumlah yang diminta melebihi stok yang tersedia (Stok tersedia: ${item.quantity})`
            });
        }

        // Validasi: Tanggal pengembalian tidak boleh sebelum tanggal peminjaman
        if (returnDate < borrowDate) {
            return res.status(400).json({
                success: false,
                message: "Tanggal pengembalian tidak boleh sebelum tanggal peminjaman"
            });
        }

        // Validasi: Tanggal pengembalian maksimal 7 hari setelah tanggal peminjaman
        const maxReturnDate = new Date(borrowDate);
        maxReturnDate.setDate(maxReturnDate.getDate() + 7);

        if (returnDate > maxReturnDate) {
            return res.status(400).json({
                success: false,
                message: `Tanggal pengembalian maksimal adalah ${maxReturnDate.toISOString().split('T')[0]}`
            });
        }

        // Buat catatan peminjaman
        const request = await prisma.peminjaman.create({
            data: {
                user_id,
                item_id,
                borrow_date: borrowDate,
                return_date: returnDate,
                quantity: quantity
            }
        });

        // Update quantity item dan status
        const updatedItem = await prisma.item.update({
            where: { id: item_id },
            data: {
                quantity: item.quantity - quantity,
                status: item.quantity - quantity <= 0 ? 'Kosong' : item.status,
            }
        });

        // Respons berhasil
        res.status(201).json({
            success: true,
            message: "Peminjaman berhasil dicatat",
            data: {
                borrowId: request.id,
                itemId: request.item_id.toString(),
                userId: request.user_id.toString(),
                borrowDate: request.borrow_date.toISOString().split('T')[0],
                returnDate: request.return_date.toISOString().split('T')[0],
                quantity: quantity,
                updatedQuantity: updatedItem.quantity,
                itemStatus: updatedItem.status,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mencatat peminjaman",
            error: error
        });
    }
}


export const ReturnItem = async (req: Request, res: Response) => {
    try {
        const { borrowId: id, return_date } = req.body;

        // Validasi: Pastikan borrowId dan return_date ada
        if (!id || !return_date) {
            return res.status(400).json({
                success: false,
                message: "borrowId dan return_date diperlukan",
            });
        }

        // Validasi: Format tanggal
        if (!isValidDate(return_date)) {
            return res.status(400).json({
                success: false,
                message: "Tanggal return_date tidak valid. Gunakan format YYYY-MM-DD.",
            });
        }

        const returnDate = new Date(return_date);

        // Cari data peminjaman berdasarkan borrowId
        const borrowRecord = await prisma.peminjaman.findFirst({
            where: { id: id },
            include: { item: true }, // Ambil data item terkait
        });

        if (!borrowRecord) {
            return res.status(404).json({
                success: false,
                message: `Peminjaman dengan ID ${id} tidak ditemukan`,
            });
        }

        // Validasi: Periksa jika barang sudah dikembalikan sebelumnya
        if (borrowRecord.actual_return_date) {
            return res.status(400).json({
                success: false,
                message: "Barang sudah dikembalikan sebelumnya.",
            });
        }

        // Validasi: Periksa jika kuantitas barang valid
        const returnedQuantity = borrowRecord.quantity ?? 0;
        if (returnedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Jumlah barang yang dipinjam tidak valid.",
            });
        }

        // Periksa keterlambatan pengembalian
        const isLate = returnDate > new Date(borrowRecord.return_date);

        // Hitung kuantitas yang diperbarui
        const updatedQuantity = borrowRecord.item.quantity + returnedQuantity;

        // Perbarui barang di database
        const updatedItem = await prisma.item.update({
            where: { id: borrowRecord.item_id },
            data: {
                quantity: updatedQuantity,
                status: updatedQuantity > 0 ? "Tersedia" : "Kosong",
            },
        });

        // Update tanggal pengembalian aktual
        const updatedBorrowRecord = await prisma.peminjaman.update({
            where: { id: id },
            data: {
                actual_return_date: returnDate,
            },
        });

        // Respons berhasil
        res.status(200).json({
            success: true,
            message: isLate
                ? "Barang berhasil dikembalikan, namun terlambat."
                : "Barang berhasil dikembalikan.",
            data: {
                borrowId: updatedBorrowRecord.id,
                itemId: borrowRecord.item_id,
                userId: borrowRecord.user_id,
                borrowDate: borrowRecord.borrow_date.toISOString().split("T")[0],
                returnDate: borrowRecord.return_date.toISOString().split("T")[0],
                actualReturnDate: updatedBorrowRecord.actual_return_date?.toISOString().split("T")[0],
                isLate,
                updatedQuantity,
                itemStatus: updatedItem.status,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengembalikan barang.",
            error: error
        });
    }
};



export const ItemUsageReport = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date, group_by } = req.body;

        // Validasi input
        if (!start_date || !end_date || !group_by) {
            return res.status(400).json({
                status: "error",
                message: "start_date, end_date, dan group_by diperlukan",
            });
        }

        // Validasi format tanggal
        if (!isValidDate(start_date) || !isValidDate(end_date)) {
            return res.status(400).json({
                status: "error",
                message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
            });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Validasi range tanggal
        if (startDate > endDate) {
            return res.status(400).json({
                status: "error",
                message: "start_date tidak bisa lebih besar dari end_date",
            });
        }

        // Validasi field untuk group_by
        let groupField: keyof Item;
        if (group_by === "Category") {
            groupField = "category";
        } else if (group_by === "Location") {
            groupField = "location";
        } else {
            return res.status(400).json({
                status: "error",
                message: "group_by harus 'Category' atau 'Location'",
            });
        }

        // Ambil data penggunaan barang dengan pengelompokan
        const usageAnalysis = await prisma.peminjaman.findMany({
            where: {
                borrow_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                item: true,
            },
        });

        // Kumpulkan data untuk semua grup yang ada
        const groupedUsage = usageAnalysis.reduce((acc, curr) => {
            const groupValue = String(curr.item[groupField] ?? "Unknown");

            if (!acc[groupValue]) {
                acc[groupValue] = {
                    total_borrowed: 0,
                    total_returned: 0,
                    items_in_use: 0,
                };
            }

            const quantity = curr.quantity ?? 0;

            acc[groupValue].total_borrowed += quantity;

            if (!curr.actual_return_date) {
                acc[groupValue].items_in_use += quantity;
            } else {
                acc[groupValue].total_returned += quantity;
            }

            return acc;
        }, {} as Record<string, { total_borrowed: number; total_returned: number; items_in_use: number }>);

        // Ambil semua grup yang unik (termasuk jika tidak ada transaksi)
        const allGroups = await prisma.item.findMany({
            select: {
                [groupField]: true,
            },
            distinct: [groupField],
        });

        const uniqueGroups = allGroups.map((g) => String(g[groupField] ?? "Unknown"));

        // Pastikan semua grup terwakili
        const usageAnalysisResult = uniqueGroups.map((group) => {
            return {
                group,
                total_borrowed: groupedUsage[group]?.total_borrowed || 0,
                total_returned: groupedUsage[group]?.total_returned || 0,
                items_in_use: groupedUsage[group]?.items_in_use || 0,
            };
        });

        // Kirim respons
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date: start_date,
                    end_date: end_date,
                },
                usage_analysis: usageAnalysisResult,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Gagal mendapatkan laporan penggunaan barang.",
            error: error
        });
    }
};



export const AnalyzeItemUsage = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date } = req.body;

        // Validasi input
        if (!start_date || !end_date) {
            return res.status(400).json({
                status: "error",
                message: "start_date dan end_date diperlukan",
            });
        }

        // Validasi format tanggal
        if (!isValidDate(start_date) || !isValidDate(end_date)) {
            return res.status(400).json({
                status: "error",
                message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
            });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Validasi tanggal
        if (startDate > endDate) {
            return res.status(400).json({
                status: "error",
                message: "start_date tidak bisa lebih besar dari end_date",
            });
        }

        // Analisis barang yang paling sering dipinjam
        const frequentlyBorrowedItems = await prisma.peminjaman.groupBy({
            by: ["item_id"],
            where: {
                borrow_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
        });

        // Mendapatkan detail barang yang sering dipinjam
        const frequentlyBorrowedDetails = await Promise.all(
            frequentlyBorrowedItems.map(async (borrowed) => {
                const item = await prisma.item.findUnique({
                    where: { id: borrowed.item_id },
                });
                return {
                    item_id: borrowed.item_id,
                    name: item?.name || "Unknown",
                    category: item?.category || "Unknown",
                    total_borrowed: borrowed._sum.quantity || 0,
                };
            })
        );

        // Analisis barang dengan pengembalian terlambat
        const lateReturns = await prisma.peminjaman.findMany({
            where: {
                borrow_date: {
                    gte: startDate,
                    lte: endDate,
                },
                actual_return_date: {
                    not: null, // Hanya yang sudah dikembalikan
                },
            },
            select: {
                item_id: true, // Ambil ID barang
                return_date: true,
                actual_return_date: true,
            },
        });

        // Filter pengembalian terlambat dengan memeriksa bahwa actual_return_date tidak null
        const lateReturnsFiltered = lateReturns.filter((returnItem) => {
            // Pastikan actual_return_date tidak null sebelum melakukan perbandingan
            return returnItem.actual_return_date && returnItem.return_date < returnItem.actual_return_date;
        });

        // Mendapatkan detail barang dengan pengembalian terlambat
        const inefficientItemDetails = await Promise.all(
            lateReturnsFiltered.map(async (returnItem) => {
                const item = await prisma.item.findUnique({
                    where: { id: returnItem.item_id },
                });

                // Hitung total pengembalian terlambat
                const totalLateReturns = lateReturnsFiltered.filter(
                    (item) => item.item_id === returnItem.item_id
                ).length;

                // Hitung total peminjaman
                const totalBorrowed = await prisma.peminjaman.count({
                    where: {
                        item_id: returnItem.item_id,
                        borrow_date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });

                return {
                    item_id: returnItem.item_id,
                    name: item?.name || "Unknown",
                    category: item?.category || "Unknown",
                    total_borrowed: totalBorrowed,
                    total_late_returns: totalLateReturns,
                };
            })
        );

        // Response
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date: start_date,
                    end_date: end_date,
                },
                frequently_borrowed_items: frequentlyBorrowedDetails,
                inefficient_items: inefficientItemDetails,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Gagal melakukan analisis penggunaan barang",
            error: error
        });
    }
}



export const GetBorrowedItems = async (req: Request, res: Response) => {
    try {
        const borrowedItems = await prisma.peminjaman.findMany({
            where: {
                actual_return_date: null, // Barang yang belum dikembalikan
            },
            include: {
                item: true, // Sertakan data barang
                user: true, // Sertakan data pengguna (opsional, jika ada relasi user)
            },
        });

        if (borrowedItems.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Tidak ada barang yang sedang dipinjam",
                data: [],
            });
        }

        const result = borrowedItems.map((borrow) => ({
            borrowId: borrow.id,
            itemId: borrow.item_id,
            itemName: borrow.item?.name || "Unknown",
            userId: borrow.user_id,
            userName: borrow.user?.username || "Unknown",
            borrowDate: borrow.borrow_date.toISOString().split("T")[0],
            expectedReturnDate: borrow.return_date.toISOString().split("T")[0],
        }));

        return res.status(200).json({
            success: true,
            message: "Daftar barang yang sedang dipinjam",
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal mendapatkan daftar barang yang sedang dipinjam",
            error: error
        });
    }
};