-- CreateTable
CREATE TABLE `Role` (
    `idRole` INTEGER NOT NULL,
    `TenNguoiDung` VARCHAR(45) NULL,

    PRIMARY KEY (`idRole`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `idUsers` INTEGER NOT NULL AUTO_INCREMENT,
    `Tentaikhoan` VARCHAR(225) NULL,
    `Matkhau` VARCHAR(225) NULL,
    `Hoten` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Diachi` LONGTEXT NULL,
    `Email` VARCHAR(45) NULL,
    `idRole` INTEGER NULL,
    `Ngaydangky` DATE NULL,
    `resetToken` VARCHAR(500) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `Avatar` VARCHAR(1000) NULL,

    UNIQUE INDEX `Users_Email_key`(`Email`),
    PRIMARY KEY (`idUsers`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DanhGiaTraiNghiem` (
    `idDanhGia` INTEGER NOT NULL AUTO_INCREMENT,
    `idLichHen` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `idXe` INTEGER NOT NULL,
    `SoSao` INTEGER NULL,
    `NoiDung` LONGTEXT NULL,
    `NgayDanhGia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idDanhGia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoaiXe` (
    `idLoaiXe` INTEGER NOT NULL AUTO_INCREMENT,
    `TenLoai` VARCHAR(225) NULL,
    `NhanHieu` VARCHAR(45) NULL,
    `HinhAnh` VARCHAR(255) NULL,

    PRIMARY KEY (`idLoaiXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Xe` (
    `idXe` INTEGER NOT NULL AUTO_INCREMENT,
    `TenXe` VARCHAR(225) NULL,
    `idLoaiXe` INTEGER NULL,
    `GiaXe` DECIMAL(19, 4) NULL,
    `MauSac` VARCHAR(50) NULL,
    `DongCo` VARCHAR(225) NULL,
    `TrangThai` VARCHAR(50) NULL,
    `HinhAnh` VARCHAR(10000) NULL,
    `NamSanXuat` VARCHAR(45) NULL,
    `ThongSoKyThuat` LONGTEXT NULL,
    `MoTa` LONGTEXT NULL,
    `idNhaCungCap` INTEGER NULL,

    PRIMARY KEY (`idXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `data` LONGTEXT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NhaCungCap` (
    `idNhaCungCap` INTEGER NOT NULL AUTO_INCREMENT,
    `TenNhaCungCap` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Email` VARCHAR(225) NULL,

    UNIQUE INDEX `NhaCungCap_Email_key`(`Email`),
    PRIMARY KEY (`idNhaCungCap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichLamViec` (
    `idLichLamViec` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhanVienTuVan` INTEGER NULL,
    `NgayLam` DATE NULL,
    `CaLam` VARCHAR(50) NULL,
    `GioLam` TIME(0) NULL,
    `GioKetThuc` TIME(0) NULL,

    PRIMARY KEY (`idLichLamViec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThanhToan` (
    `idThanhToan` INTEGER NOT NULL AUTO_INCREMENT,
    `idDatCoc` INTEGER NULL,
    `PhuongThuc` VARCHAR(50) NULL,
    `NgayThanhToan` DATE NULL,
    `TrangThai` VARCHAR(50) NULL,

    PRIMARY KEY (`idThanhToan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatCoc` (
    `idDatCoc` INTEGER NOT NULL AUTO_INCREMENT,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayDat` DATE NULL,
    `SotienDat` DECIMAL(19, 4) NULL,
    `TrangThaiDat` VARCHAR(225) NULL,

    PRIMARY KEY (`idDatCoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChiTietDatCoc` (
    `idChiTietDatCoc` INTEGER NOT NULL AUTO_INCREMENT,
    `idDatCoc` INTEGER NULL,
    `idXe` INTEGER NULL,
    `SoLuong` INTEGER NULL,
    `DonGia` DECIMAL(19, 4) NULL,

    UNIQUE INDEX `ChiTietDatCoc_idDatCoc_key`(`idDatCoc`),
    UNIQUE INDEX `ChiTietDatCoc_idXe_key`(`idXe`),
    PRIMARY KEY (`idChiTietDatCoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHenTraiNghiem` (
    `idLichHen` INTEGER NOT NULL AUTO_INCREMENT,
    `TenKhachHang` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Email` VARCHAR(225) NULL,
    `idXe` INTEGER NULL,
    `idUser` INTEGER NULL,
    `idLoaiXe` INTEGER NULL,
    `GioHen` DATETIME(3) NULL,
    `NgayHen` DATETIME(3) NULL,
    `DiaDiem` VARCHAR(225) NULL,
    `NoiDung` LONGTEXT NULL,
    `trangThai` VARCHAR(225) NULL,

    PRIMARY KEY (`idLichHen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHenLayXe` (
    `idLichHenLayXe` INTEGER NOT NULL AUTO_INCREMENT,
    `idDatCoc` INTEGER NULL,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayLayXe` DATETIME(3) NULL,
    `GioHenLayXe` VARCHAR(191) NULL,
    `DiaDiem` VARCHAR(225) NULL,

    PRIMARY KEY (`idLichHenLayXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idRole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idLichHen_fkey` FOREIGN KEY (`idLichHen`) REFERENCES `LichHenTraiNghiem`(`idLichHen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Xe` ADD CONSTRAINT `Xe_idLoaiXe_fkey` FOREIGN KEY (`idLoaiXe`) REFERENCES `LoaiXe`(`idLoaiXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Xe` ADD CONSTRAINT `Xe_idNhaCungCap_fkey` FOREIGN KEY (`idNhaCungCap`) REFERENCES `NhaCungCap`(`idNhaCungCap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichLamViec` ADD CONSTRAINT `LichLamViec_idNhanVienTuVan_fkey` FOREIGN KEY (`idNhanVienTuVan`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThanhToan` ADD CONSTRAINT `ThanhToan_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatCoc` ADD CONSTRAINT `DatCoc_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatCoc` ADD CONSTRAINT `DatCoc_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDatCoc` ADD CONSTRAINT `ChiTietDatCoc_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDatCoc` ADD CONSTRAINT `ChiTietDatCoc_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenTraiNghiem` ADD CONSTRAINT `LichHenTraiNghiem_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenTraiNghiem` ADD CONSTRAINT `LichHenTraiNghiem_idLoaiXe_fkey` FOREIGN KEY (`idLoaiXe`) REFERENCES `LoaiXe`(`idLoaiXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenTraiNghiem` ADD CONSTRAINT `LichHenTraiNghiem_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
