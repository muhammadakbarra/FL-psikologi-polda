-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 04 Apr 2025 pada 16.18
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `psikologi_polda`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'superadmin', '$2b$10$lWM4HDXqfqBkpkMAMrPBBuplYo.ZTep9hcqqm57lprFOIQS/3Vw8.', 'SUPERADMIN', '2025-04-04 05:09:17.327', '2025-04-04 05:09:17.327'),
(2, 'admin', '$2b$10$qy4YlkkXQZlM6UpQXjhhV.l8aSCwylDw8Bo4sjKR6zZlXW3NCCyTi', 'ADMIN', '2025-04-04 05:09:17.398', '2025-04-04 05:09:17.398');

-- --------------------------------------------------------

--
-- Struktur dari tabel `biodata`
--

CREATE TABLE `biodata` (
  `id` int(11) NOT NULL,
  `nama_lengkap` varchar(191) NOT NULL,
  `nrp` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `masterPangkatId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `biodata`
--

INSERT INTO `biodata` (`id`, `nama_lengkap`, `nrp`, `jabatan`, `masterPangkatId`, `createdAt`, `updatedAt`) VALUES
(1, 'dqeqeqw', '213123', 'WEQE', 9, '2025-04-04 11:28:25.615', '2025-04-04 11:28:25.615');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasiltes`
--

CREATE TABLE `hasiltes` (
  `id` int(11) NOT NULL,
  `userTestSessionId` int(11) NOT NULL,
  `status` enum('MENUNGGU','MEMENUHI_SYARAT','TIDAK_MEMENUHI_SYARAT') NOT NULL DEFAULT 'MENUNGGU',
  `keterangan` varchar(191) DEFAULT NULL,
  `adminId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `masa_berlaku` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `hasiltes`
--

INSERT INTO `hasiltes` (`id`, `userTestSessionId`, `status`, `keterangan`, `adminId`, `createdAt`, `updatedAt`, `masa_berlaku`) VALUES
(2, 7, 'MENUNGGU', NULL, NULL, '2025-04-04 12:09:15.818', '2025-04-04 12:09:15.818', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategorites`
--

CREATE TABLE `kategorites` (
  `id` int(11) NOT NULL,
  `nama_kategori_tes` varchar(191) NOT NULL,
  `masterJenisTesId` int(11) NOT NULL,
  `waktu_pengerjaan` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `instruksi_tes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `kategorites`
--

INSERT INTO `kategorites` (`id`, `nama_kategori_tes`, `masterJenisTesId`, `waktu_pengerjaan`, `createdAt`, `updatedAt`, `instruksi_tes`) VALUES
(9, 'COBA', 2, '01:00:00', '2025-04-04 11:20:49.722', '2025-04-04 11:20:49.722', '<ol><li><p>dsadadsad</p></li></ol>'),
(10, 'NAMA', 2, '01:00:00', '2025-04-04 11:58:57.295', '2025-04-04 11:58:57.295', '<ul><li><p>sdsadsadsdsd</p></li><li><p>dsdsdsadsad</p></li><li><p>sd<strong>adsdasdas</strong></p></li></ul>');

-- --------------------------------------------------------

--
-- Struktur dari tabel `masterjenistes`
--

CREATE TABLE `masterjenistes` (
  `id` int(11) NOT NULL,
  `nama_jenis_tes` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `masterjenistes`
--

INSERT INTO `masterjenistes` (`id`, `nama_jenis_tes`, `createdAt`, `updatedAt`) VALUES
(1, 'PILIHAN GANDA', '2025-04-04 05:09:17.242', '2025-04-04 05:09:17.242'),
(2, 'ESSAY', '2025-04-04 05:09:17.247', '2025-04-04 05:09:17.247');

-- --------------------------------------------------------

--
-- Struktur dari tabel `masterkesatuan`
--

CREATE TABLE `masterkesatuan` (
  `id` int(11) NOT NULL,
  `nama_kesatuan` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `masterkesatuan`
--

INSERT INTO `masterkesatuan` (`id`, `nama_kesatuan`, `createdAt`, `updatedAt`) VALUES
(1, 'POLRESTABES MAKASSAR', '2025-04-04 05:09:17.028', '2025-04-04 05:09:17.028'),
(2, 'POLRES PELABUHAN MAKASSAR', '2025-04-04 05:09:17.033', '2025-04-04 05:09:17.033'),
(3, 'POLRES GOWA', '2025-04-04 05:09:17.037', '2025-04-04 05:09:17.037'),
(4, 'POLRES TAKALAR', '2025-04-04 05:09:17.041', '2025-04-04 05:09:17.041'),
(5, 'POLRES JENEPONTO', '2025-04-04 05:09:17.046', '2025-04-04 05:09:17.046'),
(6, 'POLRES BANTAENG', '2025-04-04 05:09:17.050', '2025-04-04 05:09:17.050'),
(7, 'POLRES BULUKUMBA', '2025-04-04 05:09:17.054', '2025-04-04 05:09:17.054'),
(8, 'POLRES KEP. SELAYAR', '2025-04-04 05:09:17.058', '2025-04-04 05:09:17.058'),
(9, 'POLRES SINJAI', '2025-04-04 05:09:17.062', '2025-04-04 05:09:17.062'),
(10, 'POLRES SOPPENG', '2025-04-04 05:09:17.066', '2025-04-04 05:09:17.066'),
(11, 'POLRES BONE', '2025-04-04 05:09:17.070', '2025-04-04 05:09:17.070'),
(12, 'POLRES WAJO', '2025-04-04 05:09:17.074', '2025-04-04 05:09:17.074'),
(13, 'POLRES MAROS', '2025-04-04 05:09:17.078', '2025-04-04 05:09:17.078'),
(14, 'POLRES PANGKEP', '2025-04-04 05:09:17.081', '2025-04-04 05:09:17.081'),
(15, 'POLRES BARRU', '2025-04-04 05:09:17.085', '2025-04-04 05:09:17.085'),
(16, 'POLRES PAREPARE', '2025-04-04 05:09:17.089', '2025-04-04 05:09:17.089'),
(17, 'POLRES PINRANG', '2025-04-04 05:09:17.092', '2025-04-04 05:09:17.092'),
(18, 'POLRES SIDRAP', '2025-04-04 05:09:17.096', '2025-04-04 05:09:17.096'),
(19, 'POLRES ENREKANG', '2025-04-04 05:09:17.100', '2025-04-04 05:09:17.100'),
(20, 'POLRES TANA TORAJA', '2025-04-04 05:09:17.104', '2025-04-04 05:09:17.104'),
(21, 'POLRES TORAJA UTARA', '2025-04-04 05:09:17.109', '2025-04-04 05:09:17.109'),
(22, 'POLRES LUWU', '2025-04-04 05:09:17.112', '2025-04-04 05:09:17.112'),
(23, 'POLRES PALOPO', '2025-04-04 05:09:17.116', '2025-04-04 05:09:17.116'),
(24, 'POLRES LUWU UTARA', '2025-04-04 05:09:17.119', '2025-04-04 05:09:17.119'),
(25, 'POLRES LUWU TIMUR', '2025-04-04 05:09:17.124', '2025-04-04 05:09:17.124'),
(26, 'ITWASDA', '2025-04-04 05:09:17.127', '2025-04-04 05:09:17.127'),
(27, 'BIRO OPS', '2025-04-04 05:09:17.131', '2025-04-04 05:09:17.131'),
(28, 'BIRO RENA', '2025-04-04 05:09:17.135', '2025-04-04 05:09:17.135'),
(29, 'BIRO SDM', '2025-04-04 05:09:17.138', '2025-04-04 05:09:17.138'),
(30, 'BIRO LOGISTIK', '2025-04-04 05:09:17.142', '2025-04-04 05:09:17.142'),
(31, 'DITINTELKAM', '2025-04-04 05:09:17.146', '2025-04-04 05:09:17.146'),
(32, 'DITRESKRIMUM', '2025-04-04 05:09:17.150', '2025-04-04 05:09:17.150'),
(33, 'DITRESKRIMSUS', '2025-04-04 05:09:17.153', '2025-04-04 05:09:17.153'),
(34, 'DITRESNARKOBA', '2025-04-04 05:09:17.158', '2025-04-04 05:09:17.158'),
(35, 'DITSAMAPTA', '2025-04-04 05:09:17.161', '2025-04-04 05:09:17.161'),
(36, 'DITBINMAS', '2025-04-04 05:09:17.165', '2025-04-04 05:09:17.165'),
(37, 'DITPAMOBVIT', '2025-04-04 05:09:17.168', '2025-04-04 05:09:17.168'),
(38, 'DITPOLAIRUD', '2025-04-04 05:09:17.173', '2025-04-04 05:09:17.173'),
(39, 'DITLANTAS', '2025-04-04 05:09:17.179', '2025-04-04 05:09:17.179'),
(40, 'SATBRIMOB', '2025-04-04 05:09:17.183', '2025-04-04 05:09:17.183'),
(41, 'DITTAHTI', '2025-04-04 05:09:17.187', '2025-04-04 05:09:17.187'),
(42, 'BIDPROPAM', '2025-04-04 05:09:17.191', '2025-04-04 05:09:17.191'),
(43, 'BIDKUM', '2025-04-04 05:09:17.194', '2025-04-04 05:09:17.194'),
(44, 'BIDTIK', '2025-04-04 05:09:17.198', '2025-04-04 05:09:17.198'),
(45, 'BIDHUMAS', '2025-04-04 05:09:17.202', '2025-04-04 05:09:17.202'),
(46, 'BIDDOKKES', '2025-04-04 05:09:17.206', '2025-04-04 05:09:17.206'),
(47, 'BIDLABFOR', '2025-04-04 05:09:17.209', '2025-04-04 05:09:17.209'),
(48, 'BIDKEU', '2025-04-04 05:09:17.213', '2025-04-04 05:09:17.213'),
(49, 'SPKT', '2025-04-04 05:09:17.217', '2025-04-04 05:09:17.217'),
(50, 'SETUM', '2025-04-04 05:09:17.222', '2025-04-04 05:09:17.222'),
(51, 'SPRIPIM', '2025-04-04 05:09:17.225', '2025-04-04 05:09:17.225'),
(52, 'YANMA', '2025-04-04 05:09:17.229', '2025-04-04 05:09:17.229'),
(53, 'RUMKIT', '2025-04-04 05:09:17.234', '2025-04-04 05:09:17.234'),
(54, 'SPN', '2025-04-04 05:09:17.237', '2025-04-04 05:09:17.237');

-- --------------------------------------------------------

--
-- Struktur dari tabel `masterpangkat`
--

CREATE TABLE `masterpangkat` (
  `id` int(11) NOT NULL,
  `nama_pangkat` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `masterpangkat`
--

INSERT INTO `masterpangkat` (`id`, `nama_pangkat`, `createdAt`, `updatedAt`) VALUES
(1, 'IRJEN POL', '2025-04-04 05:09:16.957', '2025-04-04 05:09:16.957'),
(2, 'BRIGJEN POL', '2025-04-04 05:09:16.965', '2025-04-04 05:09:16.965'),
(3, 'KOMBES POL', '2025-04-04 05:09:16.973', '2025-04-04 05:09:16.973'),
(4, 'AKBP', '2025-04-04 05:09:16.977', '2025-04-04 05:09:16.977'),
(5, 'KOMPOL', '2025-04-04 05:09:16.983', '2025-04-04 05:09:16.983'),
(6, 'AKP', '2025-04-04 05:09:16.987', '2025-04-04 05:09:16.987'),
(7, 'IPTU', '2025-04-04 05:09:16.992', '2025-04-04 05:09:16.992'),
(8, 'IPDA', '2025-04-04 05:09:16.997', '2025-04-04 05:09:16.997'),
(9, 'AIPTU', '2025-04-04 05:09:17.002', '2025-04-04 05:09:17.002'),
(10, 'AIPDA', '2025-04-04 05:09:17.006', '2025-04-04 05:09:17.006'),
(11, 'BRIPKA', '2025-04-04 05:09:17.010', '2025-04-04 05:09:17.010'),
(12, 'BRIGPOL', '2025-04-04 05:09:17.014', '2025-04-04 05:09:17.014'),
(13, 'BRIPTU', '2025-04-04 05:09:17.018', '2025-04-04 05:09:17.018'),
(14, 'BRIPDA', '2025-04-04 05:09:17.022', '2025-04-04 05:09:17.022');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pilihanjawaban`
--

CREATE TABLE `pilihanjawaban` (
  `id` int(11) NOT NULL,
  `soalId` int(11) NOT NULL,
  `teks_pilihan` text DEFAULT NULL,
  `gambar_pilihan` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `soal`
--

CREATE TABLE `soal` (
  `id` int(11) NOT NULL,
  `kategoriTesId` int(11) NOT NULL,
  `teks_soal` text DEFAULT NULL,
  `gambar_soal` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `soal`
--

INSERT INTO `soal` (`id`, `kategoriTesId`, `teks_soal`, `gambar_soal`, `createdAt`, `updatedAt`) VALUES
(3, 9, 'dsadsadas', NULL, '2025-04-04 12:06:18.455', '2025-04-04 12:06:18.455');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `id_biodata` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `masterKesatuanId` int(11) NOT NULL,
  `nama_kota` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `id_biodata`, `createdAt`, `updatedAt`, `masterKesatuanId`, `nama_kota`) VALUES
(1, 'user', '$2b$10$.lDObXHEkH86KmFxV5DF0.PYYp0iZBP8V9D/Lsy3ZIb4Enha4y8r6', 1, '2025-04-04 05:09:17.468', '2025-04-04 11:28:25.626', 11, 'BONE');

-- --------------------------------------------------------

--
-- Struktur dari tabel `useranswer`
--

CREATE TABLE `useranswer` (
  `id` int(11) NOT NULL,
  `userTestSessionId` int(11) NOT NULL,
  `soalId` int(11) NOT NULL,
  `pilihanJawabanId` int(11) DEFAULT NULL,
  `teks_jawaban` varchar(191) DEFAULT NULL,
  `answeredAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `useranswer`
--

INSERT INTO `useranswer` (`id`, `userTestSessionId`, `soalId`, `pilihanJawabanId`, `teks_jawaban`, `answeredAt`, `createdAt`, `updatedAt`) VALUES
(3, 7, 3, NULL, 'dssadas', '2025-04-04 12:09:15.802', '2025-04-04 12:09:15.802', '2025-04-04 12:09:15.802'),
(4, 7, 3, NULL, 'dssadas', '2025-04-04 12:09:15.804', '2025-04-04 12:09:15.804', '2025-04-04 12:09:15.804');

-- --------------------------------------------------------

--
-- Struktur dari tabel `usertestsession`
--

CREATE TABLE `usertestsession` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `kategoriTesId` int(11) NOT NULL,
  `noTes` varchar(191) DEFAULT NULL,
  `jenisPengajuan` varchar(191) DEFAULT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `finishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `usertestsession`
--

INSERT INTO `usertestsession` (`id`, `userId`, `kategoriTesId`, `noTes`, `jenisPengajuan`, `startedAt`, `finishedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 9, '3314', 'PERMOHONAN BARU', NULL, NULL, '2025-04-04 11:28:32.762', '2025-04-04 11:28:32.762'),
(2, 1, 9, '3243', 'PERMOHONAN BARU', NULL, NULL, '2025-04-04 11:29:42.088', '2025-04-04 11:29:42.088'),
(3, 1, 9, '3243', 'PERMOHONAN BARU', NULL, NULL, '2025-04-04 11:30:31.509', '2025-04-04 11:30:31.509'),
(4, 1, 9, '2213', 'PERMOHONAN BARU', NULL, NULL, '2025-04-04 11:47:47.976', '2025-04-04 11:47:47.976'),
(5, 1, 10, '9043', 'PERMOHONAN BARU', NULL, NULL, '2025-04-04 11:59:08.826', '2025-04-04 11:59:08.826'),
(7, 1, 9, '4234', 'PERMOHONAN BARU', '2025-04-04 12:09:00.803', '2025-04-04 12:09:15.814', '2025-04-04 12:08:59.001', '2025-04-04 12:08:59.001');

-- --------------------------------------------------------

--
-- Struktur dari tabel `websitebackground`
--

CREATE TABLE `websitebackground` (
  `id` int(11) NOT NULL,
  `svg_path` varchar(191) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('141115b4-7efd-4496-a09f-5277adb0eb24', 'e38e2bb09c165ffe936262dfeda83f8239010e4ca4b488bf436489725780bce7', '2025-04-04 05:08:42.643', '20250309154346_fix_relations', NULL, NULL, '2025-04-04 05:08:42.587', 1),
('1844f9db-3102-4fef-9311-b4da8c8b799c', '54fd835ee82cc47d3efac7ea784655896439770c2a11115a6317e5283c952839', '2025-04-04 05:08:42.523', '20250307163823_init', NULL, NULL, '2025-04-04 05:08:42.500', 1),
('377a8ecb-0bca-4497-bab3-d51f3f37fa90', '2589cede6cbc9770dddc3ee58ee5f66818717e333b2014192580a2809139a221', '2025-04-04 05:08:42.916', '20250311035513_add_test_session', NULL, NULL, '2025-04-04 05:08:42.755', 1),
('4d51b201-24ad-41d0-905e-a916cc8a585a', 'e5fdb43cfd52de6472d74d46d4610dd93e836c187f268140c5e8abbb4fe1dcf4', '2025-04-04 05:08:43.264', '20250327045138_add_website_background', NULL, NULL, '2025-04-04 05:08:43.052', 1),
('55a32608-ad6f-4dea-9fda-24fdab2ea1ea', 'd1a33daac1677882e6fc77f2c4b52db4d53fb3c033e6fbedda6d415a849a4c4a', '2025-04-04 05:08:42.943', '20250311050926_revise_started_at', NULL, NULL, '2025-04-04 05:08:42.919', 1),
('6256c359-98af-471e-ae00-bd82b71d5841', '82aae22927fc0a6643be9d0a4d8130a07694f348947ff3bf26f136c42c45e207', '2025-04-04 05:08:43.272', '20250403070925_add_instruksi_tes', NULL, NULL, '2025-04-04 05:08:43.265', 1),
('9b7e7684-b6ec-4127-90e8-3a52431eeffe', '8e23ab92c6b5cb39a07df1b4f0caeac29226f227a231646956a9fbb97d6a7067', '2025-04-04 05:08:43.282', '20250403222813_add_masa_berlaku_field', NULL, NULL, '2025-04-04 05:08:43.274', 1),
('a45a6660-b16a-4afc-a15c-77480129379a', 'f20d224eab415460b23a644c25bb3f13eb3e851eafc6757da7c4bf3900e1e84f', '2025-04-04 05:08:42.585', '20250309130852_add_master_kesatuan_pangkat', NULL, NULL, '2025-04-04 05:08:42.568', 1),
('b46f363c-7b3c-48d4-8f7f-f5e515725196', 'f1e36b33f6407e89984101dd0faa48b2b4f4b7eab03e89a0ab0ac60e639783e2', '2025-04-04 05:08:42.703', '20250310152626_add_soal_tables', NULL, NULL, '2025-04-04 05:08:42.645', 1),
('c63c0699-9736-4100-8f99-667e7939ded1', '5df66d256272f5c9cd23b20e94c6c2cf5f68785e63c4f93049a3366dc3630759', '2025-04-04 05:08:42.995', '20250316012655_', NULL, NULL, '2025-04-04 05:08:42.945', 1),
('ca86c2a0-397d-4e60-b352-9852e2821c30', '2342dc153e69b9fe99d6b36461774df3ee5c7bd02c62a24f926ee27b4eb104b0', '2025-04-04 05:08:43.050', '20250316032302_table_hasil', NULL, NULL, '2025-04-04 05:08:42.997', 1),
('d229c004-d579-453a-9df8-a3aa2e733114', 'b8215392623364305aa28246a031589da8dfd7958e9998bcdd76234b0c84b9e7', '2025-04-04 05:08:42.724', '20250311013807_fix_soal', NULL, NULL, '2025-04-04 05:08:42.705', 1),
('dd68cf85-3b17-4f32-a886-fa3047d01e00', 'bcfe4007cb26c4b24742171429c30121612808b69aeb2486454a866ea3e1bba1', '2025-04-04 05:08:42.566', '20250309053137_add_kategori_tes_relation', NULL, NULL, '2025-04-04 05:08:42.525', 1),
('f9e23f9e-9ce8-4963-bd6e-4f762644cc8d', '8146444a1c6396fad54a458afdd8f54e488e58dc160446b51d74ffc8d0f14d27', '2025-04-04 05:08:42.753', '20250311020931_add_user_relation', NULL, NULL, '2025-04-04 05:08:42.726', 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Admin_username_key` (`username`);

--
-- Indeks untuk tabel `biodata`
--
ALTER TABLE `biodata`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Biodata_masterPangkatId_fkey` (`masterPangkatId`);

--
-- Indeks untuk tabel `hasiltes`
--
ALTER TABLE `hasiltes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HasilTes_userTestSessionId_fkey` (`userTestSessionId`),
  ADD KEY `HasilTes_adminId_fkey` (`adminId`);

--
-- Indeks untuk tabel `kategorites`
--
ALTER TABLE `kategorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `KategoriTes_masterJenisTesId_fkey` (`masterJenisTesId`);

--
-- Indeks untuk tabel `masterjenistes`
--
ALTER TABLE `masterjenistes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MasterJenisTes_nama_jenis_tes_key` (`nama_jenis_tes`);

--
-- Indeks untuk tabel `masterkesatuan`
--
ALTER TABLE `masterkesatuan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MasterKesatuan_nama_kesatuan_key` (`nama_kesatuan`);

--
-- Indeks untuk tabel `masterpangkat`
--
ALTER TABLE `masterpangkat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MasterPangkat_nama_pangkat_key` (`nama_pangkat`);

--
-- Indeks untuk tabel `pilihanjawaban`
--
ALTER TABLE `pilihanjawaban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PilihanJawaban_soalId_fkey` (`soalId`);

--
-- Indeks untuk tabel `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Soal_kategoriTesId_fkey` (`kategoriTesId`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`),
  ADD KEY `User_id_biodata_fkey` (`id_biodata`),
  ADD KEY `User_masterKesatuanId_fkey` (`masterKesatuanId`);

--
-- Indeks untuk tabel `useranswer`
--
ALTER TABLE `useranswer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserAnswer_userTestSessionId_fkey` (`userTestSessionId`),
  ADD KEY `UserAnswer_soalId_fkey` (`soalId`),
  ADD KEY `UserAnswer_pilihanJawabanId_fkey` (`pilihanJawabanId`);

--
-- Indeks untuk tabel `usertestsession`
--
ALTER TABLE `usertestsession`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserTestSession_userId_fkey` (`userId`),
  ADD KEY `UserTestSession_kategoriTesId_fkey` (`kategoriTesId`);

--
-- Indeks untuk tabel `websitebackground`
--
ALTER TABLE `websitebackground`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `biodata`
--
ALTER TABLE `biodata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `hasiltes`
--
ALTER TABLE `hasiltes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kategorites`
--
ALTER TABLE `kategorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `masterjenistes`
--
ALTER TABLE `masterjenistes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `masterkesatuan`
--
ALTER TABLE `masterkesatuan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT untuk tabel `masterpangkat`
--
ALTER TABLE `masterpangkat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `pilihanjawaban`
--
ALTER TABLE `pilihanjawaban`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `soal`
--
ALTER TABLE `soal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `useranswer`
--
ALTER TABLE `useranswer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `usertestsession`
--
ALTER TABLE `usertestsession`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `websitebackground`
--
ALTER TABLE `websitebackground`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `biodata`
--
ALTER TABLE `biodata`
  ADD CONSTRAINT `Biodata_masterPangkatId_fkey` FOREIGN KEY (`masterPangkatId`) REFERENCES `masterpangkat` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasiltes`
--
ALTER TABLE `hasiltes`
  ADD CONSTRAINT `HasilTes_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admin` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `HasilTes_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `usertestsession` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kategorites`
--
ALTER TABLE `kategorites`
  ADD CONSTRAINT `KategoriTes_masterJenisTesId_fkey` FOREIGN KEY (`masterJenisTesId`) REFERENCES `masterjenistes` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pilihanjawaban`
--
ALTER TABLE `pilihanjawaban`
  ADD CONSTRAINT `PilihanJawaban_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `soal`
--
ALTER TABLE `soal`
  ADD CONSTRAINT `Soal_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategorites` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_id_biodata_fkey` FOREIGN KEY (`id_biodata`) REFERENCES `biodata` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_masterKesatuanId_fkey` FOREIGN KEY (`masterKesatuanId`) REFERENCES `masterkesatuan` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `useranswer`
--
ALTER TABLE `useranswer`
  ADD CONSTRAINT `UserAnswer_pilihanJawabanId_fkey` FOREIGN KEY (`pilihanJawabanId`) REFERENCES `pilihanjawaban` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserAnswer_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserAnswer_userTestSessionId_fkey` FOREIGN KEY (`userTestSessionId`) REFERENCES `usertestsession` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `usertestsession`
--
ALTER TABLE `usertestsession`
  ADD CONSTRAINT `UserTestSession_kategoriTesId_fkey` FOREIGN KEY (`kategoriTesId`) REFERENCES `kategorites` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserTestSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
