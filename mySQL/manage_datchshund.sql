-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 01-12-2025 a las 14:58:58
-- Versión del servidor: 8.4.3
-- Versión de PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `manage_datchshund`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `animal`
--

CREATE TABLE `animal` (
  `idAnimal` int NOT NULL,
  `gen` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `precioCachorro` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `sexo` enum('M','F') COLLATE utf8mb4_general_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `animal`
--

INSERT INTO `animal` (`idAnimal`, `gen`, `color`, `precioCachorro`, `nombre`, `disponible`, `sexo`, `imagen`) VALUES
(58, 'dfdsfdfd', 'fdsfdfdf', 100000, 'uriel', 0, 'M', '/uploads/1764599885664_logoDashboard.png'),
(59, 'arlequin', 'marron', 1000000, 'uriel', 1, 'M', '/uploads/1764600912675_logoDashboard.png'),
(60, 'arlequin', 'azul', 0, 'jesica', 0, 'F', '/uploads/1764600960092_logoDashboard.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idCliente` int NOT NULL,
  `mail` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `pass` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `activation_token` char(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activation_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idCliente`, `mail`, `pass`, `dni`, `nombre`, `apellido`, `telefono`, `direccion`, `is_active`, `activation_token`, `activation_token_expires`) VALUES
(13, 'cliente1@example.com', '123456', '12345678', 'Carlos', 'Ramirez', '1112345678', 'Calle Falsa 123', 1, NULL, NULL),
(15, 'urielmaza38@gmail.com', '$2b$10$b6z9pmE6fMuCbHYE3FjWo.HPA8zv2f5Zvj3j7tVNZpi3TPRxv4Txy', '', 'Uriel', 'Maza', '', '', 1, NULL, NULL),
(21, 'admin-dachshund', 'admin1234', '47652604', 'uriel', 'maza', '1161757162', 'Los Ombues 70', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parentesco`
--

CREATE TABLE `parentesco` (
  `idParentesco` int NOT NULL,
  `idPadre` int DEFAULT NULL,
  `idMadre` int DEFAULT NULL,
  `idAnimal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `parentesco`
--

INSERT INTO `parentesco` (`idParentesco`, `idPadre`, `idMadre`, `idAnimal`) VALUES
(45, NULL, 60, 58);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registrosanitario`
--

CREATE TABLE `registrosanitario` (
  `idRegSan` int NOT NULL,
  `idAnimal` int NOT NULL,
  `fechaNac` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registrosanitario`
--

INSERT INTO `registrosanitario` (`idRegSan`, `idAnimal`, `fechaNac`) VALUES
(10, 58, '2025-10-31'),
(11, 59, '2025-10-12'),
(12, 60, '2001-11-21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `idReserva` int NOT NULL,
  `idCliente` int NOT NULL,
  `idAnimal` int NOT NULL,
  `fecha` datetime NOT NULL,
  `precioSeña` decimal(10,2) NOT NULL,
  `precioTotal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vd`
--

CREATE TABLE `vd` (
  `idVD` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `matricula` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `idRegSan` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `animal`
--
ALTER TABLE `animal`
  ADD PRIMARY KEY (`idAnimal`),
  ADD KEY `idx_animal_disponible` (`disponible`),
  ADD KEY `idx_animal_nombre` (`nombre`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idCliente`),
  ADD UNIQUE KEY `uk_cliente_mail` (`mail`),
  ADD UNIQUE KEY `uk_cliente_dni` (`dni`),
  ADD UNIQUE KEY `activation_token` (`activation_token`),
  ADD KEY `idx_cliente_is_active` (`is_active`);

--
-- Indices de la tabla `parentesco`
--
ALTER TABLE `parentesco`
  ADD PRIMARY KEY (`idParentesco`),
  ADD KEY `idx_parentesco_hijo` (`idAnimal`),
  ADD KEY `idx_parentesco_padre` (`idPadre`),
  ADD KEY `idx_parentesco_madre` (`idMadre`);

--
-- Indices de la tabla `registrosanitario`
--
ALTER TABLE `registrosanitario`
  ADD PRIMARY KEY (`idRegSan`),
  ADD KEY `idx_regsan_animal` (`idAnimal`),
  ADD KEY `idx_regsan_fechaNac` (`fechaNac`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`idReserva`),
  ADD KEY `idx_reserva_fecha` (`fecha`),
  ADD KEY `idx_reserva_cliente` (`idCliente`),
  ADD KEY `idx_reserva_animal` (`idAnimal`);

--
-- Indices de la tabla `vd`
--
ALTER TABLE `vd`
  ADD PRIMARY KEY (`idVD`),
  ADD UNIQUE KEY `uk_vd_matricula` (`matricula`),
  ADD KEY `idx_vd_nombre` (`nombre`),
  ADD KEY `fk_vd_regs` (`idRegSan`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `animal`
--
ALTER TABLE `animal`
  MODIFY `idAnimal` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idCliente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `parentesco`
--
ALTER TABLE `parentesco`
  MODIFY `idParentesco` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `registrosanitario`
--
ALTER TABLE `registrosanitario`
  MODIFY `idRegSan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `idReserva` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `vd`
--
ALTER TABLE `vd`
  MODIFY `idVD` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `parentesco`
--
ALTER TABLE `parentesco`
  ADD CONSTRAINT `fk_parentesco_hijo` FOREIGN KEY (`idAnimal`) REFERENCES `animal` (`idAnimal`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parentesco_madre` FOREIGN KEY (`idMadre`) REFERENCES `animal` (`idAnimal`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parentesco_padre` FOREIGN KEY (`idPadre`) REFERENCES `animal` (`idAnimal`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `registrosanitario`
--
ALTER TABLE `registrosanitario`
  ADD CONSTRAINT `fk_regsan_animal` FOREIGN KEY (`idAnimal`) REFERENCES `animal` (`idAnimal`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_animal` FOREIGN KEY (`idAnimal`) REFERENCES `animal` (`idAnimal`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reserva_cliente` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vd`
--
ALTER TABLE `vd`
  ADD CONSTRAINT `fk_vd_regs` FOREIGN KEY (`idRegSan`) REFERENCES `registrosanitario` (`idRegSan`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
