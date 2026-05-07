-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 19-07-2025 a las 09:37:07
-- Versión del servidor: 10.11.13-MariaDB-cll-lve
-- Versión de PHP: 8.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `androlag_albumclinica--nuevo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_tratamiento` int(11) NOT NULL,
  `id_dentista` int(11) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  `duracion` int(11) DEFAULT 30 COMMENT 'Duración en minutos',
  `estado` enum('Pendiente','Confirmada','Completada','Cancelada','No asistió') DEFAULT 'Pendiente',
  `notas` text DEFAULT NULL,
  `recordatorio_enviado` tinyint(1) DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `creado_por` int(11) DEFAULT NULL COMMENT 'ID del usuario que creó la cita'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `id_paciente`, `id_tratamiento`, `id_dentista`, `fecha_hora`, `duracion`, `estado`, `notas`, `recordatorio_enviado`, `creado_en`, `creado_por`) VALUES
(1, 5, 2, 1, '2025-05-02 10:00:00', 30, 'Confirmada', 'Revisión general y limpieza.', 1, '2025-04-28 06:49:00', 3),
(2, 1, 8, 1, '2025-05-02 10:00:00', 45, 'Confirmada', 'Paciente solicitó limpieza profunda.', 1, '2025-05-01 08:49:27', 3),
(3, 2, 7, 2, '2025-05-03 14:30:00', 30, 'Pendiente', 'Evaluación inicial para posible caries.', 0, '2025-05-01 08:49:27', 2),
(4, 3, 3, NULL, '2025-05-04 09:00:00', 60, 'Cancelada', 'Paciente canceló debido a un viaje.', 0, '2025-05-01 08:49:27', 5),
(5, 4, 6, 3, '2025-05-05 16:15:00', 30, 'No asistió', 'No respondió llamadas de confirmación.', 1, '2025-05-01 08:49:27', 7),
(6, 5, 5, 4, '2025-05-06 11:45:00', 30, 'Completada', 'Colocación de brackets sin inconvenientes.', 1, '2025-05-01 08:49:27', 4),
(7, 12, 2, 5, '2025-06-05 04:05:00', 30, 'Completada', 'Pago con yape', 1, '2025-06-14 08:04:38', 4),
(8, 15, 8, 1, '2025-06-10 03:05:00', 30, 'Completada', 'Paciente delicada, pago efectivo', 1, '2025-06-14 08:05:54', 4),
(9, 7, 7, 4, '2025-06-02 03:06:00', 60, 'Completada', '', 1, '2025-06-14 08:07:05', 4),
(10, 9, 7, 5, '2025-06-18 03:07:00', 30, 'Completada', 'pago plinn', 1, '2025-06-14 08:08:18', 4),
(11, 15, 6, 5, '2025-06-30 11:40:00', 30, 'Pendiente', '', 0, '2025-06-14 14:41:36', 4),
(12, 11, 3, 1, '2025-06-18 00:45:00', 30, 'Completada', '', 0, '2025-06-14 14:42:40', 4),
(13, 16, 5, 4, '2025-06-02 09:40:00', 30, 'Completada', '', 0, '2025-06-14 14:43:50', 4),
(14, 16, 1, 1, '2025-06-13 14:49:00', 30, 'Confirmada', '', 0, '2025-06-14 14:44:36', 4),
(15, 9, 2, 2, '2025-06-23 08:40:00', 30, 'Pendiente', '', 0, '2025-06-14 14:45:15', 4),
(16, 10, 8, 1, '2025-06-16 11:45:00', 30, 'Completada', '', 0, '2025-06-14 14:45:52', 4),
(17, 12, 2, 5, '2025-06-06 12:45:00', 30, 'Completada', '', 0, '2025-06-14 14:46:33', 4),
(18, 8, 4, 5, '2025-06-15 16:00:00', 30, 'Confirmada', '', 0, '2025-06-14 14:47:15', 4),
(19, 15, 5, 4, '2025-06-01 14:00:00', 30, 'No asistió', '', 0, '2025-06-14 14:48:08', 4),
(20, 11, 5, 2, '2025-05-30 11:50:00', 30, 'Cancelada', '', 0, '2025-06-14 14:48:45', 4),
(21, 15, 8, 4, '2025-06-18 11:50:00', 30, 'Confirmada', '', 0, '2025-06-14 14:49:28', 4),
(22, 9, 7, 1, '2025-06-08 11:50:00', 30, 'Completada', '', 0, '2025-06-14 14:49:59', 4),
(23, 16, 7, 1, '2025-06-26 14:50:00', 30, 'Confirmada', '', 0, '2025-06-14 14:50:26', 4),
(24, 12, 1, 2, '2025-06-14 16:50:00', 30, 'Confirmada', '', 0, '2025-06-14 14:50:53', 4),
(25, 11, 8, 4, '2025-06-09 10:51:00', 30, 'Completada', '', 0, '2025-06-14 14:51:40', 4),
(26, 15, 1, 4, '2025-06-09 10:50:00', 30, 'Pendiente', '', 0, '2025-06-14 14:52:06', 4),
(27, 12, 1, 4, '2025-06-09 12:50:00', 30, 'Completada', '', 0, '2025-06-14 14:52:30', 4),
(28, 17, 7, 1, '2025-06-21 09:52:00', 30, 'Completada', 'Pagar con yape', 1, '2025-06-14 14:52:50', 4),
(29, 9, 7, 1, '2025-06-18 12:50:00', 30, 'Confirmada', '', 0, '2025-06-14 14:52:56', 4),
(30, 13, 7, 4, '2025-06-20 13:50:00', 30, 'Completada', '', 0, '2025-06-14 14:53:18', 4),
(31, 14, 1, 5, '2025-06-21 14:50:00', 30, 'Cancelada', '', 0, '2025-06-14 14:53:57', 4),
(32, 10, 3, 1, '2025-06-22 23:00:00', 30, 'Completada', '', 0, '2025-06-14 14:54:33', 4),
(33, 10, 7, 4, '2025-06-23 23:00:00', 30, 'Confirmada', '', 0, '2025-06-14 14:54:59', 4),
(34, 8, 4, 2, '2025-06-24 12:00:00', 30, 'Confirmada', '', 0, '2025-06-14 14:55:31', 4),
(35, 30, 4, 1, '2025-06-28 11:20:00', 30, 'Completada', 'pago efectivo', 0, '2025-07-12 16:36:44', 4),
(36, 33, 2, 1, '2025-07-19 11:30:00', 30, 'Pendiente', 'Pagar con yape', 0, '2025-07-12 16:44:14', 4),
(37, 34, 5, 1, '2025-07-19 12:11:00', 30, 'Pendiente', 'pagar con yape', 0, '2025-07-12 17:13:52', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `id_config` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `valor` text DEFAULT NULL,
  `tipo` enum('string','number','boolean','json') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`id_config`, `nombre`, `valor`, `tipo`, `descripcion`, `actualizado_en`) VALUES
(1, 'horario_apertura', '09:00', 'string', 'Hora de apertura de la clínica', '2025-04-14 00:33:15'),
(2, 'horario_cierre', '19:00', 'string', 'Hora de cierre de la clínica', '2025-04-14 00:33:15'),
(3, 'duracion_cita_default', '30', 'number', 'Duración predeterminada de citas en minutos', '2025-04-14 00:33:15'),
(4, 'dias_anticipacion_cancelacion', '2', 'number', 'Días mínimos de anticipación para cancelar citas', '2025-04-14 00:33:15'),
(5, 'email_notificaciones', 'notificaciones@zazdent.com', 'string', 'Email para enviar notificaciones', '2025-04-14 00:33:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dentistas`
--

CREATE TABLE `dentistas` (
  `id_dentista` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_especialidad` int(11) DEFAULT NULL,
  `cedula_profesional` varchar(20) DEFAULT NULL,
  `biografia` text DEFAULT NULL,
  `experiencia` int(11) DEFAULT NULL COMMENT 'Años de experiencia',
  `horario` text DEFAULT NULL COMMENT 'Horario de trabajo en JSON',
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `dentistas`
--

INSERT INTO `dentistas` (`id_dentista`, `id_usuario`, `id_especialidad`, `cedula_profesional`, `biografia`, `experiencia`, `horario`, `foto`) VALUES
(1, 2, 5, 'ABC12345', 'Especialista en ortodoncia con más de 10 años de experiencia.', 10, '{\"lunes\":\"09:00-17:00\", \"martes\":\"09:00-17:00\"}', 'dentista1.jpg'),
(2, 10, 2, 'CP-123456', 'Especialista en ortodoncia con más de 10 años de experiencia.', 10, '{\"lunes\": \"09:00-17:00\", \"miércoles\": \"10:00-18:00\"}', 'foto1.jpg'),
(3, 11, 3, 'CP-654321', 'Odontólogo general apasionado por la salud bucal.', 8, '{\"martes\": \"08:00-16:00\", \"jueves\": \"09:00-17:00\"}', 'foto2.jpg'),
(4, 12, 1, 'CP-789123', 'Cirujano dental especializado en implantes.', 12, '{\"viernes\": \"09:00-15:00\", \"sábado\": \"10:00-14:00\"}', 'foto3.jpg'),
(5, 13, NULL, 'CP-456789', 'Joven profesional dedicado a la estética dental.', 5, '{\"lunes\": \"08:00-14:00\", \"jueves\": \"12:00-18:00\"}', 'foto4.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id_documento` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `tipo` enum('Radiografía','Consentimiento','Historial','Otro') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `notas` text DEFAULT NULL,
  `subido_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `subido_por` int(11) DEFAULT NULL COMMENT 'ID del usuario que subió el documento'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(30) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `descripcion`, `icono`, `creado_en`) VALUES
(1, 'Limpieza Dental', 'Limpieza profesional y remoción de sarro para mantener la salud bucal', 'toothbrush', '2025-04-14 00:33:15'),
(2, 'Ortodoncia Metálica', 'Corrección de la posición dental mediante brackets metálicos tradicionales', 'braces', '2025-04-14 00:33:15'),
(3, 'Endodoncia', 'Tratamiento de conductos radiculares para salvar dientes con pulpitis o necrosis', 'tooth', '2025-04-14 00:33:15'),
(4, 'Rehabilitación Oral', 'Restauración de la función masticatoria mediante prótesis fijas, removibles e implantes', 'teeth', '2025-04-14 00:33:15'),
(5, 'Extracción Dental', 'Extracción de dientes con daño irreversible o para preparación ortodontica', 'teeth-open', '2025-04-14 00:33:15'),
(6, 'Odontopediatría', 'Cuidado dental especializado para niños desde los primeros años de vida', 'child', '2025-04-14 00:33:15'),
(7, 'Periodoncia', 'Tratamiento de las encías y tejidos de soporte dental para prevenir la pérdida de piezas', 'teeth', '2025-04-14 00:33:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_medico`
--

CREATE TABLE `historial_medico` (
  `id_historial` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_dentista` int(11) DEFAULT NULL,
  `id_tratamiento` int(11) DEFAULT NULL,
  `fecha_procedimiento` datetime NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `procedimiento` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `receta` text DEFAULT NULL,
  `proxima_visita` date DEFAULT NULL,
  `adjuntos` text DEFAULT NULL COMMENT 'Rutas de archivos adjuntos en JSON'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `historial_medico`
--

INSERT INTO `historial_medico` (`id_historial`, `id_paciente`, `id_dentista`, `id_tratamiento`, `fecha_procedimiento`, `diagnostico`, `procedimiento`, `observaciones`, `receta`, `proxima_visita`, `adjuntos`) VALUES
(1, 1, 1, 1, '2025-04-30 14:00:00', 'Caries en molar derecho', 'Limpieza y empaste', 'Paciente toleró bien el procedimiento', 'Amoxicilina 500mg cada 8 horas por 7 días', '2025-06-01', '{\"adjunto1.jpg\", \"adjunto2.pdf\"}'),
(2, 2, 1, 2, '2025-04-28 10:30:00', 'Fractura en incisivo superior', 'Reconstrucción dental', 'Se recomienda cuidado al masticar', NULL, '2025-05-15', '{\"radiografia.png\"}'),
(3, 3, NULL, NULL, '2025-04-25 16:00:00', 'Dolor de muelas recurrente', 'Evaluación inicial', 'Se recomienda realizar una radiografía', NULL, '2025-05-02', '{}'),
(5, 5, 1, 4, '2025-04-20 13:15:00', 'Ortodoncia', 'Colocación de brackets', 'Paciente necesitará ajustes periódicos', NULL, '2025-06-10', '{}'),
(9, 30, 1, 6, '2025-06-28 11:00:00', 'Bruxismo', 'extraccion', 'Posible muela de juicuio', 'Amoxixilina 100ml d/n x5', '2025-07-04', NULL),
(10, 30, 1, 6, '2025-06-28 11:00:00', 'Bruxismo', 'extraccion', 'Posible muela de juicuio', 'Amoxixilina 100ml d/n x5', '2025-07-04', NULL),
(11, 30, 1, 6, '2025-06-28 11:00:00', 'Bruxismo', 'extraccion', 'Posible muela de juicuio', 'Amoxixilina 100ml d/n x5', '2025-07-04', NULL),
(12, 34, 1, 2, '2025-07-12 12:00:00', 'limpieza', 'Limpieza', NULL, 'Amoxixilina', '2025-07-26', NULL),
(13, 34, 1, 2, '2025-07-12 12:00:00', 'limpieza', 'Limpieza', NULL, 'Amoxixilina', '2025-07-26', NULL),
(14, 34, 1, 2, '2025-07-12 12:00:00', 'limpieza', 'Limpieza', NULL, 'Amoxixilina', '2025-07-26', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_item` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `categoria` enum('Material','Medicamento','Equipo','Consumible') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `unidad_medida` varchar(10) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT 5,
  `proveedor` varchar(50) DEFAULT NULL,
  `costo_unitario` decimal(10,2) DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_item`, `nombre`, `categoria`, `descripcion`, `cantidad`, `unidad_medida`, `stock_minimo`, `proveedor`, `costo_unitario`, `ubicacion`, `activo`, `actualizado_en`) VALUES
(1, 'Hilo dental', 'Material', 'Hilo dental', 10, '50', 5, 'Oral B', 18.00, 'SMP', 1, '2025-07-12 13:27:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id_log` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` varchar(50) NOT NULL,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `id_registro_afectado` int(11) DEFAULT NULL,
  `datos_anteriores` text DEFAULT NULL COMMENT 'JSON con datos anteriores',
  `datos_nuevos` text DEFAULT NULL COMMENT 'JSON con datos nuevos',
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `enfermedades_cronicas` text DEFAULT NULL,
  `medicamentos` text DEFAULT NULL,
  `seguro_medico` varchar(50) DEFAULT NULL,
  `numero_seguro` varchar(50) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `fecha_nacimiento`, `genero`, `alergias`, `enfermedades_cronicas`, `medicamentos`, `seguro_medico`, `numero_seguro`, `creado_en`) VALUES
(1, 6, '1990-05-15', 'Masculino', 'Polen', 'Hipertensión', 'Lisinopril', 'Seguro A', '123456', '2025-04-28 03:21:26'),
(2, 7, '1985-08-23', 'Femenino', 'Ninguna', 'Diabetes', 'Metformina', 'Seguro B', '789012', '2025-04-28 03:21:26'),
(3, 8, '2000-01-30', 'Otro', 'Maní', 'Asma', 'Salbutamol', 'Seguro C', '345678', '2025-04-28 03:21:26'),
(4, 9, '1995-12-10', 'Masculino', 'Penicilina', 'Ninguna', 'Ibuprofeno', 'Seguro D', '901234', '2025-04-28 03:21:26'),
(5, 10, '1978-07-05', 'Femenino', 'Frutos secos', 'Artritis', 'Celecoxib', 'Seguro E', '567890', '2025-04-28 03:21:26'),
(7, 5, '2000-04-12', 'Masculino', 'mani', 'obesidad', 'paracetamol', 'Rimac', '312312', '2025-06-14 07:54:14'),
(8, 14, '1992-11-12', 'Masculino', 'nuez', 'asma', 'inhalador', 'Rimac', '421234', '2025-06-14 07:54:59'),
(9, 32, '1999-04-23', 'Masculino', 'mani', 'artritis', 'omeprazol', 'no tiene', '', '2025-06-14 07:56:23'),
(10, 18, '2001-08-12', 'Femenino', 'no tiene', 'no tiene', 'vitaminas', 'Rimac', '123232', '2025-06-14 07:56:59'),
(11, 35, '1993-08-21', 'Femenino', 'fresas', 'Diabetes', 'insulina', 'Rimac', '132137', '2025-06-14 07:58:11'),
(12, 83, '2005-06-18', 'Masculino', 'moras', 'no tienee', 'no consume', 'Pacifico', '213128', '2025-06-14 08:00:10'),
(13, 34, '2001-06-11', 'Masculino', 'mani', 'obesidad', 'Salbutamol', 'Pacifico', '123124', '2025-06-14 08:01:16'),
(14, 81, '1998-05-24', 'Femenino', 'fresa', 'no tiene', 'no toms', 'Rimac', '123417', '2025-06-14 08:02:10'),
(15, 21, '2006-12-04', 'Masculino', 'tomate', 'Asma', 'Inhalador, Salbutammol', 'Pacifico', '345623', '2025-06-14 08:04:02'),
(16, 78, '1984-06-18', 'Masculino', 'fresa', 'diabetes', 'paracetamol', 'Pacifico', '453632', '2025-06-14 14:42:47'),
(17, 40, '1999-10-23', 'Femenino', 'mani', 'Asma', 'Salbutamol', 'Rimac', '235346', '2025-06-14 14:51:43'),
(18, 23, '2004-03-12', 'Masculino', 'no tiene', 'noo', 'noo', 'Pacifico', '214235', '2025-06-14 15:06:54'),
(19, 15, '2008-08-12', 'Femenino', 'Alergia a la penicilina', 'No', 'No', 'Pacifico', '89456', '2025-07-12 14:02:55'),
(20, 16, '2000-01-04', 'Femenino', 'No', 'Si', 'Metformina', 'Rimac', '232749', '2025-07-12 14:04:48'),
(21, 17, '1997-06-09', 'Masculino', 'No', 'Hipertensión arterial', 'Losartán', 'Pacifico', '792398', '2025-07-12 14:06:44'),
(22, 19, '2003-03-28', 'Masculino', 'No', 'No', 'No', 'Pacifico', '721456', '2025-07-12 14:08:20'),
(23, 20, '1994-11-14', 'Masculino', ' Alergia a anestesia con lidocaína', 'No', 'Ibuprofeno', 'Mapfre', '964679', '2025-07-12 14:10:16'),
(24, 24, '1999-09-01', 'Femenino', 'No', 'No', 'Suplementos prenatales', 'Rimac', '145267', '2025-07-12 14:12:09'),
(25, 27, '1990-09-30', 'Masculino', 'Alergia al látex', 'No', 'No', 'Mapfre', '995423', '2025-07-12 14:15:42'),
(26, 22, '2003-05-02', 'Femenino', 'No', 'No', 'No', 'Rimac', '542013', '2025-07-12 14:17:22'),
(27, 25, '2010-10-19', 'Masculino', 'No', 'No', 'No', 'SIS', '874563', '2025-07-12 14:19:06'),
(28, 26, '1994-06-25', 'Femenino', 'No', 'No', 'No', 'Pacifico', '145278', '2025-07-12 14:20:22'),
(29, 37, '1997-09-13', 'Masculino', 'Alergia al polvo', 'No', 'No', 'Rimac', '369745', '2025-07-12 14:21:59'),
(30, 36, '1995-05-25', 'Femenino', 'Alergia a mariscos', 'No', 'No', 'Rimac', '789035', '2025-07-12 15:20:50'),
(31, 44, '2000-09-08', 'Femenino', 'Alergia a los gatos', 'No', 'No', 'Pacifico', '345625', '2025-07-12 15:21:58'),
(32, 42, '2002-10-31', 'Masculino', 'Alergia al chocolate', 'No', 'No', 'Mapfre', '234186', '2025-07-12 15:23:20'),
(33, 109, '2004-06-23', 'Femenino', 'Ninguna', 'No tiene', 'No toma', '312312312', 'Rimac', '2025-07-12 16:43:06'),
(34, 110, '2003-03-12', 'Femenino', 'Mani', 'no tiene', 'no toma', '3213', 'Rimac', '2025-07-12 17:13:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_cita` int(11) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta crédito','Tarjeta débito','Transferencia') DEFAULT NULL,
  `estado` enum('Pendiente','Completado','Reembolsado','Cancelado') DEFAULT 'Pendiente',
  `referencia` varchar(50) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_cita`, `monto`, `metodo_pago`, `estado`, `referencia`, `fecha_pago`, `notas`) VALUES
(1, 1, 150.00, 'Efectivo', 'Completado', 'REC12345', '2025-04-30 14:30:00', 'Pago realizado en recepción.'),
(2, 2, 320.50, 'Tarjeta crédito', 'Pendiente', 'REC67890', NULL, 'Esperando confirmación bancaria.'),
(3, 3, 250.75, 'Transferencia', 'Completado', 'REC11223', '2025-04-28 11:00:00', 'Pago confirmado vía transferencia bancaria.'),
(4, 4, 180.00, 'Tarjeta débito', 'Reembolsado', 'REC44556', '2025-04-25 09:45:00', 'Reembolso procesado por error en facturación.'),
(5, 5, 500.00, 'Efectivo', 'Cancelado', '', '1969-12-31 19:00:00', 'Pago cancelado por el paciente.'),
(6, 27, 250.00, 'Tarjeta crédito', 'Completado', '', '2025-07-12 10:17:00', ''),
(7, 8, 200.00, 'Efectivo', 'Completado', '', '2025-06-19 14:00:00', 'Se acordó pago el mismo día de la cita.'),
(8, 9, 250.00, 'Tarjeta débito', 'Completado', 'TRX245713', '2025-06-29 16:00:00', 'Se usó tarjeta Visa.'),
(9, 10, 100.00, 'Efectivo', 'Completado', ' REC98765', '2025-06-14 16:45:00', 'Pago hecho un día antes de la consulta.'),
(10, 11, 300.00, 'Tarjeta débito', 'Pendiente', '', '2025-06-30 17:00:00', ''),
(11, 12, 100.00, 'Efectivo', 'Completado', '', '2025-07-01 10:15:00', 'Pago por limpieza dental.'),
(12, 13, 250.00, 'Tarjeta débito', 'Pendiente', '', '2025-06-05 13:00:00', 'Pago al finalizar el tratamiento.'),
(13, 16, 180.00, 'Tarjeta crédito', 'Cancelado', '', '2025-05-30 15:00:00', 'Paciente canceló cita por motivos personales.'),
(14, 17, 320.00, 'Transferencia', 'Reembolsado', 'TRX789123', '2025-06-10 17:00:00', 'Reembolso por reagendamiento de cirugía.'),
(15, 28, 450.00, 'Tarjeta crédito', 'Completado', 'TRX556784', '2025-05-17 12:00:00', 'Pago por colocación de resina estética.'),
(16, 30, 150.00, 'Tarjeta débito', 'Completado', 'DBT231456', '2025-07-01 15:50:00', 'Control de ortodoncia mensual.'),
(17, 35, 150.00, 'Tarjeta crédito', 'Completado', 'Pago yape', '2025-07-12 11:34:00', ''),
(18, 32, 200.00, 'Transferencia', 'Completado', '', '2025-06-26 11:37:00', 'pago yape');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `creado_en`) VALUES
(1, 'Administrador', 'Acceso completo al sistema', '2025-04-14 00:33:14'),
(2, 'Dentista', 'Personal odontológico', '2025-04-14 00:33:14'),
(3, 'Recepcionista', 'Personal administrativo', '2025-04-14 00:33:14'),
(4, 'Paciente', 'Pacientes de la clínica', '2025-04-14 00:33:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamientos`
--

CREATE TABLE `tratamientos` (
  `id_tratamiento` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `id_especialidad` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion_estimada` int(11) DEFAULT NULL COMMENT 'Duración en minutos',
  `costo` decimal(10,2) NOT NULL,
  `requisitos` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `tratamientos`
--

INSERT INTO `tratamientos` (`id_tratamiento`, `nombre`, `id_especialidad`, `descripcion`, `duracion_estimada`, `costo`, `requisitos`, `activo`, `creado_en`) VALUES
(1, 'Consulta inicial', NULL, 'Evaluación clínica completa con diagnóstico y plan de tratamiento', 30, 300.00, 'Mayor de 18 años o acompañado de tutor', 1, '2025-04-14 00:33:15'),
(2, 'Limpieza dental profesional', 1, 'Remoción de sarro, placa bacteriana y pulido dental con pasta profiláctica', 45, 500.00, 'No haber comido 2 horas antes', 1, '2025-04-14 00:33:15'),
(3, 'Ortodoncia metálica completa', 2, 'Tratamiento integral con brackets metálicos incluyendo controles mensuales', 60, 8000.00, 'Evaluación ortodóntica previa', 1, '2025-04-14 00:33:15'),
(4, 'Endodoncia uniradicular', 3, 'Tratamiento de conducto en dientes con una sola raíz', 90, 2500.00, 'Radiografía periapical reciente', 1, '2025-04-14 00:33:15'),
(5, 'Rehabilitación con implante unitario', 4, 'Colocación de implante dental y corona protésica sobre implante', 120, 1800.00, 'Estudio radiográfico 3D previo', 1, '2025-04-14 00:33:15'),
(6, 'Extracción dental simple', 5, 'Exodoncia de pieza dentaria sin complicaciones quirúrgicas', 30, 800.00, 'No presentar infección activa', 1, '2025-04-14 00:33:15'),
(7, 'Control odontopediátrico', 6, 'Consulta preventiva y aplicación de sellantes en pacientes infantiles', 30, 800.00, 'Edad entre 3-12 años', 1, '2025-04-14 00:33:15'),
(8, 'Tratamiento periodontal básico', 7, 'Raspado y alisado radicular en un cuadrante de la boca', 60, 800.00, 'Diagnóstico de gingivitis/periodontitis', 1, '2025-04-14 00:33:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `usuario_clave` varchar(255) NOT NULL,
  `usuario_usuario` varchar(50) NOT NULL,
  `nombre_apellido` varchar(50) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `ultimo_login` datetime DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `email`, `usuario_clave`, `usuario_usuario`, `nombre_apellido`, `telefono`, `activo`, `ultimo_login`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'admin@clinicadental.com', '$2y$10$kq/ctDAb4pGHd3Xpu4rXEO5W6BwNs0TObO1Sm4amoC8CkTebBFL7q', 'admin', 'Diego Apaza Quispe', '+51987654321', 1, '2025-07-12 11:24:56', '2025-04-25 09:42:47', '2025-07-12 16:24:56'),
(2, 2, 'dr.gonzales@clinicadental.com', '$2y$10$gE2UxMNaHTQZMDz2ZLCwcuZcPcRdtBz7./WHLeqjlUZauIAjm1B0.', 'drCarolay', 'Carolay Corvacho FLores', '+51988776655', 1, '2025-07-12 12:22:20', '2025-04-25 09:42:47', '2025-07-12 17:22:20'),
(3, 3, 'recepcion@clinicadental.com', '$2y$10$cHq09WPl74faVbA/coRKSeljU4L/uTFUEybPWfagQ3lYnWnedqAPu', 'recepcion01', 'Morelia Rodriguez garcia', '+51955667788', 1, '2025-07-12 12:12:28', '2025-04-25 09:42:47', '2025-07-12 17:12:28'),
(4, 1, 'adminn@clinicadental.com', '$2y$10$c0rhmrtL5BtLyK/.TH0equllWdWgebSKQjqpRAPx75SRXj8pkjx5u', 'admin01', 'Delinia Figueroa Gonzalez', '+51955667758', 1, NULL, '2025-04-25 09:42:47', '2025-07-12 01:55:19'),
(5, 4, 'paciente.martinez@gmail.com', '$2y$10$iJUZ5HAECIi45gXX5bZ4ue7Sqv0ABBnOmCmwWMq9fI6y43Ph0vvJC', 'jmartinez', 'Juan Martínez Flores', '+51933445566', 1, '2025-05-01 05:02:06', '2025-04-25 09:42:47', '2025-07-12 01:55:20'),
(6, 4, 'figueroa@untels.com', '$2y$10$JD2XVW8suK/9N3VKE57eFOHJF1MekSVBiQ3MHkEZNYl3Is5uTcx6e', 'GinerBush', 'Figueroa', '98766773', 1, NULL, '2025-04-25 13:20:51', '2025-07-12 01:55:20'),
(7, 4, 'figueroa@unteffls.com', '$2y$10$.HY39ro7.Ss/e2PZu4xzJOVHuTlRcZxvKrTIqtnEE1wIDQxixjidS', 'GinerBufsh#rrtty', 'Figueroaf', '9876673273', 1, NULL, '2025-04-25 13:46:38', '2025-07-12 01:55:20'),
(8, 4, 'hilariweb@gmail.com', '$2y$10$lz9CWUojoIzgBQu.svZS6.gbQ/jV3sqq6QW0UPyOzvc7nAPI0wC3W', 'GinerBushsd123#', 'Figueroaew', '6667771234', 1, NULL, '2025-04-25 13:49:02', '2025-07-12 01:55:20'),
(9, 2, 'giner@hotewemail.comw', '$2y$10$8WHsrSbPsA/bhcJ9KVpvz..7liO9dc.jx4WsuREf0.JSGIygR2FBK', 'juanp12133#$', 'Figueroawew', '9876673273', 1, NULL, '2025-04-25 13:50:57', '2025-07-12 01:55:20'),
(10, 2, 'hilariwebe@gmail.com', '$2y$10$65JJi8CojGIMAktaAwU4Bu9vHb7x6obwm6zXB2DbmVMTjiZIRKjsm', 'juanp122Mfsd#', 'Gonzalez', '9876673', 1, NULL, '2025-04-25 13:54:41', '2025-07-12 01:55:20'),
(11, 2, 'maeia@uteml.comn', '$2y$10$IA7c5Gh7I.vpSfzcpcLP.egWHzFNajzwEsd8uK1whMBRkPZUulFDa', 'maria12M#', 'mariq', '98766773', 1, NULL, '2025-04-25 13:58:13', '2025-07-12 01:55:21'),
(12, 2, 'hilariweb@gmasdil.com', '$2y$10$yxMuYGInZw0uqwgNlGbFbO9TDtybhPnVEWfM/80UB68T4IC0sZaaC', 'juaana12#M', 'Delina Gonzalez', '98766773', 1, '2025-04-25 09:02:56', '2025-04-25 14:02:48', '2025-07-12 01:55:21'),
(13, 2, 'hilariweb@gdmail.com', '$2y$10$AND0YKKAFoyNqVYNEppuGOAb78pO4uXNDu2QQn8azgBOPCU79E6RG', 'juanp233M%#', 'Diego Quispe', '98766732773', 1, NULL, '2025-04-26 11:37:33', '2025-07-12 01:55:21'),
(14, 4, 'tomass@hotmail.com', '$2y$10$JnK9AY8O67TDy9vytjh5WezOWhLen5VdQhopbHOizI/rCM/t.Bgva', 'nicoláss', 'Tomas Silva', '+51935711762', 1, '2025-07-12 10:41:13', '2025-04-25 04:42:47', '2025-07-12 15:41:13'),
(15, 4, 'fiorelac@gmail.com', '$2y$10$fiyjPSVHtmBLMisdclHD6.4v3T8GC9SQ6lrDW/V9M5JKGKX5ZcDzS', 'fátimac', 'Fiorela Castro', '+51948617630', 1, '2025-05-17 04:29:00', '2025-04-25 04:42:47', '2025-07-12 01:55:21'),
(16, 4, 'camilas@hotmail.com', '$2y$10$8cKGDte/n7r.NKiTU6jljurZ1SpyRg5yLMb/Ikh3.v.sOOtqz5rpW', 'camilas', 'Camila Silva', '+51923475704', 1, '2025-05-17 04:16:00', '2025-04-25 04:42:47', '2025-07-12 01:55:21'),
(17, 4, 'damiánf@outlook.com', '$2y$10$0ZgtK6tYZ3YRxtIlljopUO/VGIJu6/Xm91OrFxI0ybAy45Fv3oqC2', 'damiánf', 'Damián Flores', '+51974822858', 1, '2025-05-17 04:17:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(18, 4, 'tatianad@hotmail.com', '$2y$10$qZrCT0XDUnOamFpkVu4OpebLTL9Zusak9JmFGCyrog9GiJxBbcRyG', 'tatianad', 'Tatiana Díaz', '+51919470061', 1, '2025-05-17 04:18:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(19, 4, 'estebant@hotmail.com', '$2y$10$PF4qFv/JH1f0qeu6rCmW/eUHVGwGJgYLoZXqz0R6UboEnmRPYORZS', 'estebant', 'Esteban Torres', '+51921190963', 1, '2025-05-17 04:19:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(20, 4, 'jonathand@gmail.com', '$2y$10$NqTPT6sDRwkhU.uOg.hrgudMqf2y1nRTwfxwv7FL1NF1AHOe2W9Ki', 'jonathand', 'Jonathan Díaz', '+51916461957', 1, '2025-05-17 04:20:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(21, 4, 'lucasf@hotmail.com', '$2y$10$Z6bqUVppnwJT98xYUTmSTe.0WRxzedLwDj/R2y13KT.f8CKvAH6Oq', 'lucasf', 'Lucas Flores', '+51945968300', 1, '2025-07-12 10:52:44', '2025-04-25 04:42:47', '2025-07-12 15:52:44'),
(22, 4, 'andreas@hotmail.com', '$2y$10$AjWGeb2NGWsSkL/3ipc4UeQ3FkzqWCkfIrtEEFQ9uWXNWrBP.rZzi', 'andreas', 'Andrea Silva', '+51998184204', 1, '2025-05-17 04:22:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(23, 4, 'pedror@gmail.com', '$2y$10$/ioa0bvjwW/WVSaYmHpxCOjclvVOPThO9b8Y.FOOkAD3PEbgNDRAy', 'pedror', 'Pedro Rojas', '+51910081467', 1, '2025-05-17 04:23:00', '2025-04-25 04:42:47', '2025-07-12 01:55:22'),
(24, 4, 'maríad@outlook.com', '$2y$10$2rs07oj7ZKAB8YbvsqKtM.0p59rpEFbW9oi3xrQ3rVrJtYcPombRS', 'maríad', 'María Díaz', '+51980860897', 1, '2025-05-17 04:24:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(25, 4, 'sebastiánf@hotmail.com', '$2y$10$tQdbF4hQHrFVnGmEzFDxqeNohk7qW1gAo2p1zlIUqznuOF4nzCLzC', 'sebastiánf', 'Sebastián Flores', '+51922638895', 1, '2025-05-17 04:25:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(26, 4, 'fátimar@outlook.com', '$2y$10$JVq/YnrseA/lrghK0i2z7O6l2plqwRgfBDywzNNZMKoQuDFQYXBb6', 'fátimar', 'Fátima Rojas', '+51929350629', 1, '2025-05-17 04:26:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(27, 4, 'alonsoc@gmail.com', '$2y$10$itLXWOYpGxWJnHTMh0yxve25UChqqag9PgUX9CPbCjRbobEu9VzEe', 'alonsoc', 'Alonso Castro', '+51990689502', 1, '2025-05-17 04:27:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(28, 4, 'nicoláss@hotmail.com', '$2y$10$mw3lIqgOfIBo1HMVHE5p2ey7983LSO6oSxpigT.JNe9jN2UVz6JFO', 'nicoláss', 'Nicolás Silva', '+51935711762', 1, '2025-05-17 04:28:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(29, 4, 'fátimac@gmail.com', '$2y$10$Y6wH7m0aHmqXvuPeQGIAU.8GHD3lsS4Goet1Jsw9chbXJ2/plVxvm', 'fátimac', 'Fátima Castro', '+51978617630', 1, '2025-05-17 04:29:00', '2025-04-25 04:42:47', '2025-07-12 01:55:23'),
(30, 4, 'nataliad@gmail.com', '$2y$10$d6xQKIlDOS5RE0IdPXE3mOkJMgMTANfp2sPkkvCo95K6GlX6Pn0o.', 'nataliad', 'Natalia Díaz', '+51998468375', 1, '2025-05-17 04:30:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(31, 4, 'melanyt@gmail.com', '$2y$10$Pq5KonEqJ2knZPtHnLAUpeZF.kKQtiFNWXGtkIlNMqxQqZ0iJ4cgG', 'melanyt', 'Melany Torres', '+51954953073', 1, '2025-05-17 04:31:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(32, 4, 'pedrod@outlook.com', '$2y$10$1.QDzlNiCz3xVImy611w.u.u/.4gstsvfYwgJNwEUmUZmUNe9xgj2', 'pedrod', 'Pedro Díaz', '+51920208347', 1, '2025-05-17 04:32:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(33, 4, 'melanyr@hotmail.com', '$2y$10$KiMNZ5TqnIdibL9/BTJaSOLuGYqTUUMYYifst/bjV2cjTTLNGuH5W', 'melanyr', 'Melany Rojas', '+51930946581', 1, '2025-05-17 04:33:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(34, 4, 'facundos@hotmail.com', '$2y$10$b1/CLHndOpmyZIKtWYyS0ucOBJTXXXE4/MaIFpONegdqNwvVyNOLm', 'facundos', 'Facundo Silva', '+51990811532', 1, '2025-05-17 04:34:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(35, 4, 'karinad@outlook.com', '$2y$10$6/M4fQzrkrImrYKJoX4eMeRmlRv2Rp1IUR809ks9nGhFMCKSMCvlC', 'karinad', 'Karina Díaz', '+51915601631', 1, '2025-05-17 04:35:00', '2025-04-25 04:42:47', '2025-07-12 01:55:24'),
(36, 4, 'emmac@gmail.com', '$2y$10$qpuCa81Uo/2REIQuXmDwaOboLVyxcG9FU5iPMnMHhIaYXbVba6cXm', 'emmac', 'Emma Cruz', '+51988583431', 1, '2025-07-12 11:37:47', '2025-04-25 04:42:47', '2025-07-12 16:37:47'),
(37, 4, 'gaelr@outlook.com', '$2y$10$g9hqSmS.udnY0YfaKHxdq..s.hWd49RY8ZGxNEq9pVy7XDKDmtN2u', 'gaelr', 'Gael Rojas', '+51935418304', 1, '2025-05-17 04:37:00', '2025-04-25 04:42:47', '2025-07-12 01:55:25'),
(38, 4, 'laurat@gmail.com', '$2y$10$rlrlNcvnDZnCO.4qSa51JO.A6JFym/7Mh1DHVzMvQkx16zzr03JIq', 'laurat', 'Laura Torres', '+51974742247', 1, '2025-05-17 04:38:00', '2025-04-25 04:42:47', '2025-07-12 01:55:25'),
(39, 4, 'fátimas@hotmail.com', '$2y$10$7C/l/OwitVQv8DE5M884Xuuv69fdsXajbNBZjcSZirYisle0rRPNO', 'fátimas', 'Fátima Silva', '+51971269598', 1, '2025-05-17 04:39:00', '2025-04-25 04:42:47', '2025-07-12 01:55:25'),
(40, 4, 'andrear@gmail.com', '$2y$10$Yn.pf46TR8mHm1lth4fU9OCyz7FFnu49F2l5NK0HrSEBC55vLEmWC', 'andrear', 'Andrea Ramírez', '+51924997380', 1, '2025-06-14 09:53:21', '2025-04-25 04:42:47', '2025-06-14 14:55:02'),
(41, 4, 'tatianar@outlook.com', '$2y$10$3iMgAZeYmm.0kVgNMwR9nOzrRA94zKiLPpTfYWF7A1p9MtXHYg.8K', 'tatianar', 'Tatiana Rojas', '+51931563286', 1, '2025-07-12 10:39:09', '2025-04-25 04:42:47', '2025-07-12 15:39:09'),
(42, 4, 'damiáns@outlook.com', '$2y$10$RQBfASupH5E8Q2SJH1Z7xeI6NBNwNArg7sZH0Pu1nruLgJsUd3NNu', 'damiáns', 'Damián Silva', '+51975643150', 1, '2025-05-17 04:42:00', '2025-04-25 04:42:47', '2025-07-12 01:55:25'),
(43, 4, 'gabrield@hotmail.com', '$2y$10$GGZaJE/LKpa4WzhFQYI7Lun6J6OesZPRNSRIh9Ig.fYNi/KzOwTuK', 'gabrield', 'Gabriel Díaz', '+51961540989', 1, '2025-05-17 04:43:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(44, 4, 'elsag@hotmail.com', '$2y$10$R1DpcKqRfPFgqhRXHSq8WOWswsTNRrMPffJa7X9Oiuy9XT.0t6e.6', 'elsag', 'Elsa García', '+51992256689', 1, '2025-05-17 04:44:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(45, 4, 'alans@gmail.com', '$2y$10$ql0vUyUOGSRLKMHl9oRNA.YVAC5dHOXw4VBgkhtkraiXMTDzxd71S', 'alans', 'Alan Silva', '+51938795128', 1, '2025-05-17 04:45:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(46, 4, 'laurad@hotmail.com', '$2y$10$fIejWRhIzFYkMsOfFAWNZ.FCMhuuYXLZYsWQJr3g2.Aa2Hbi/xZai', 'laurad', 'Laura Díaz', '+51917373609', 1, '2025-05-17 04:46:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(47, 4, 'fátimat@hotmail.com', '$2y$10$IVSxWNOCgFu9ZJqcpkqlbOyzTYOBiS3Vf4uhl.yT9EUJXcnBawIH2', 'fátimat', 'Fátima Torres', '+51928156821', 1, '2025-05-17 04:47:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(48, 4, 'camilaf@outlook.com', '$2y$10$D1AcAJnSBSTROe/yhtxwvuWuQ95Fr2g.3U2xVmta0ERjXbofjoKeK', 'camilaf', 'Camila Flores', '+51949682261', 1, '2025-05-17 04:48:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(49, 4, 'kevinr@gmail.com', '$2y$10$zxDvv7LJQWW9MI7rKowe2OGQFReOZowTPqcbf.h.dN/7qrBEW.KkS', 'kevinr', 'Kevin Ramírez', '+51922982279', 1, '2025-05-17 04:49:00', '2025-04-25 04:42:47', '2025-07-12 01:55:26'),
(50, 4, 'tomásc@outlook.com', '$2y$10$kVPOcNe/kF6gv1nfcTCyMe/kN3IN/hHaW6RKTe6R53asLhnSVNOk.', 'tomásc', 'Tomás Castro', '+51935135969', 1, '2025-05-17 04:50:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(51, 4, 'fiorellaf@gmail.com', '$2y$10$cKm89..5oEcYx2V3pg1HXOmoWa/ysacL/pzMA43aMIRcVpyX1I5nS', 'fiorellaf', 'Fiorella Flores', '+51962355884', 1, '2025-05-17 04:51:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(52, 4, 'emmag@gmail.com', '$2y$10$DUS38lv9BKFmBC2J5e77YOKYxJBr3BQ9JC0wj05VaXuCgll2NhIwe', 'emmag', 'Emma García', '+51961960524', 1, '2025-05-17 04:52:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(53, 4, 'fernandar@gmail.com', '$2y$10$agEVBnYlqhjviuB2q/FG4.4BPzIo4sorxc9bP/H/.SxQsT2i/SJ1S', 'fernandar', 'Fernanda Ramírez', '+51947094328', 1, '2025-05-17 04:53:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(54, 4, 'verónicag@hotmail.com', '$2y$10$O58UwFvVtVfzlVXooY8NFuQbQfMIAdWcOOUszAgvn.eHBn/jRZHIO', 'verónicag', 'Verónica García', '+51919890980', 1, '2025-05-17 04:54:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(55, 4, 'fernandar@hotmail.com', '$2y$10$q57R/Ne5mJd2EytVrOgN5eYGJRQ6CqP833TzuhSRSmwWkNXjpD2tK', 'fernandar', 'Fernanda Rojas', '+51998836010', 1, '2025-05-17 04:55:00', '2025-04-25 04:42:47', '2025-07-12 01:55:27'),
(56, 4, 'milagrosf@hotmail.com', '$2y$10$n.Pmi1eLkgYWhO0GV97FNuIQ6f7fMMwVriVbslVyvPR/oHLHcWR4m', 'milagrosf', 'Milagros Flores', '+51915033167', 1, '2025-05-17 04:56:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(57, 4, 'agustíng@hotmail.com', '$2y$10$0Xm.PYtifL6mQzrlcDspROQmxSmD/AxYl8q5.XmENGMCbMjIoHTeq', 'agustíng', 'Agustín García', '+51961438352', 1, '2025-05-17 04:57:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(58, 4, 'isabellac@outlook.com', '$2y$10$HB5kT9q764fsFPqYhtsZtuTfnvQsnnvB9Bk/5r0TJYwHIa7uVflR.', 'isabellac', 'Isabella Cruz', '+51932682669', 1, '2025-05-17 04:58:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(59, 4, 'álvarof@gmail.com', '$2y$10$wxlaDcceLy2hySVFQpklq.SRv1VMbol/FKBFypd6q1MfQxQ3i6ih6', 'álvarof', 'Álvaro Flores', '+51945229732', 1, '2025-05-17 04:59:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(60, 4, 'damiánt@hotmail.com', '$2y$10$xO5hCRGZU4uXdi2ywqmks.G/QV40nFoQR9ebZRnVfp.W1B4F3SObG', 'damiánt', 'Damián Torres', '+51976614695', 1, '2025-05-17 05:00:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(61, 4, 'natalias@hotmail.com', '$2y$10$YsGox6WHfxzRhUkyvy0pc.kXa2oGhsooGYWTmsM0FabLLt8kDSxfC', 'natalias', 'Natalia Silva', '+51942803306', 1, '2025-05-17 05:01:00', '2025-04-25 04:42:47', '2025-07-12 01:55:28'),
(62, 4, 'renzog@hotmail.com', '$2y$10$Yc8459DkHNuUNl7zl0SU7uMpbqJpXj8wbM1jcBu/JAdSPCyNhJi.m', 'renzog', 'Renzo García', '+51950832527', 1, '2025-05-17 05:02:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(63, 4, 'anat@gmail.com', '$2y$10$QJ8GMqiJkEG/6eWWVVZ6p.ia4.oLd0QJToYBV.ORo4vVQ4JdUw22u', 'anat', 'Ana Torres', '+51993236677', 1, '2025-05-17 05:03:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(64, 4, 'lucíac@outlook.com', '$2y$10$IxoIIMnlC3s8ylNpxXk5DeJmGo/rmd76u13RasAsfC.OFwaIrt.Pi', 'lucíac', 'Lucía Castro', '+51984323050', 1, '2025-05-17 05:04:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(65, 4, 'ángelc@hotmail.com', '$2y$10$cVErVoJtDv7grSeWUPGhP.y1W7qQ6ZGy73dXFVUC4M67xd.w3nNBu', 'ángelc', 'Ángel Cruz', '+51950616303', 1, '2025-05-17 05:05:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(66, 4, 'julianaf@outlook.com', '$2y$10$Eg8hC5iNEmWYsLSzaDcjs.p8dCxeVSws8XyDkSeBGB1Ty6kOCxhoq', 'julianaf', 'Juliana Flores', '+51919794442', 1, '2025-05-17 05:06:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(67, 4, 'andreap@hotmail.com', '$2y$10$pi8y3ndCyWX2EbDylYTWNeXU8TN/WMObM9/kJx.0J4cPDZjQbZnhO', 'andreap', 'Andrea Pérez', '+51952157004', 1, '2025-05-17 05:07:00', '2025-04-25 04:42:47', '2025-07-12 01:55:29'),
(68, 4, 'patriciar@outlook.com', '$2y$10$2nVVehNHB6JjxP.gSn50H.AnYQh7vafWq52Xv6YxvccWcURndGvra', 'patriciar', 'Patricia Rojas', '+51997639807', 1, '2025-05-17 05:08:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(69, 4, 'hugoc@outlook.com', '$2y$10$MSGMyZ9SI6mjBdYxBUDydOzPRhycRqeAeZiWvDB.wmXIbEs5meZVG', 'hugoc', 'Hugo Cruz', '+51956939944', 1, '2025-05-17 05:09:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(70, 4, 'luzr@gmail.com', '$2y$10$31S/Z7FNO/0D9S7wsJrFp.3aLub0FtLr4Q96FHUSoZ1YjYdMXcd16', 'luzr', 'Luz Rojas', '+51978621599', 1, '2025-05-17 05:10:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(71, 4, 'estelac@gmail.com', '$2y$10$9/ESI257YLbLTnW/Qe2.werSLwPvnPzbsjYz0me4JfFNcTOcmiY7y', 'estelac', 'Estela Cruz', '+51973243577', 1, '2025-05-17 05:11:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(72, 4, 'damiáns@hotmail.com', '$2y$10$b8bUP3Sz3.9lVD9kFMq0LOJ1mCVt3YvRATEGAR62L8.i9sc.eW1MW', 'damiáns', 'Damián Silva', '+51943846524', 1, '2025-05-17 05:12:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(73, 4, 'camilac@hotmail.com', '$2y$10$luN3mg9Dq/DqEEHc4aDAPuqPQlkTnuX21w0Sf/YcyqpoqKNaTBKt.', 'camilac', 'Camila Castro', '+51991220360', 1, '2025-05-17 05:13:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(74, 4, 'martinac@hotmail.com', '$2y$10$z9Zw5iQKHQbO/A2sv5Pc7uVcpwnKUnMVq1Q.yRSmen57mPUxZsmYe', 'martinac', 'Martina Cruz', '+51987513904', 1, '2025-05-17 05:14:00', '2025-04-25 04:42:47', '2025-07-12 01:55:30'),
(75, 4, 'claudiac@hotmail.com', '$2y$10$EgwKO16DGFajEumrBTS4dekTKACi9lYaGUjYIUlQEMf1GdW1zyd5e', 'claudiac', 'Claudia Cruz', '+51917319852', 1, '2025-05-17 05:15:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(76, 4, 'rominas@gmail.com', '$2y$10$yQ3X8zRvitsUGdgcgsiuAufJbOFz5q7w8MOFQG4t29bIuiSZ44cKC', 'rominas', 'Romina Silva', '+51937026201', 1, '2025-05-17 05:16:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(77, 4, 'pedros@gmail.com', '$2y$10$u1UopnKNtzuFZOElOA75JeF2nNRhC7uSTcUZGisJ5MrFb/ar/MVh2', 'pedros', 'Pedro Silva', '+51999583246', 1, '2025-05-17 05:17:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(78, 4, 'alonsot@hotmail.com', '$2y$10$FGpAvaB7vnPAJfDwxJqoGORQM41JQwL7vCnIVrtxRXidf8QVPLbTy', 'alonsot', 'Alonso Torres', '+51972503486', 1, '2025-05-17 05:18:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(79, 4, 'paolas@hotmail.com', '$2y$10$cx7Rf5c31.4tsyXALVWWhu3Zu4V4AUh2Y.hzF47alz.Aweo..WTFq', 'paolas', 'Paola Silva', '+51939699409', 1, '2025-05-17 05:19:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(80, 4, 'aland@gmail.com', '$2y$10$I74ci5b40BCofdG5SW4ewuZmEJANlpPZ8S3QA2aX/QtfxB4iToL8W', 'aland', 'Alan Díaz', '+51925974001', 1, '2025-05-17 05:20:00', '2025-04-25 04:42:47', '2025-07-12 01:55:31'),
(81, 4, 'sofíac@outlook.com', '$2y$10$O0s8CTmQgqbbVyOiqHUOmu5NR0MVDbn6I.dQT0kp.hX5bz8Ns2zGq', 'sofíac', 'Sofía Castro', '+51990499422', 1, '2025-05-17 05:21:00', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(82, 4, 'rominac@gmail.com', '$2y$10$USEEvwLxiQUAe0OXQGGkyu6paBgOuEMEBxkiwxj8e/ronrjiV3YkC', 'rominac', 'Romina Cruz', '+51987096027', 1, '2025-05-17 05:22:00', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(83, 4, 'marcosr@hotmail.com', '$2y$10$VI1Mdpzgs/dzrm83j0NHn.e/tHILXLfTlz2O5CfGKZKsKML3.LiRy', 'marcosr', 'Marcos Rojas', '+51914668501', 1, '2025-06-14 10:17:53', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(84, 4, 'eduardoc@outlook.com', '$2y$10$e5Gs3mnl7d2guX7U5ApSv.afHm67cCS/dwk3DmUJykoToSTUoaKXu', 'eduardoc', 'Eduardo Cruz', '+51964636479', 1, '2025-07-12 12:17:11', '2025-04-25 04:42:47', '2025-07-12 17:17:11'),
(85, 4, 'mateop@gmail.com', '$2y$10$cFq2bvuUWq7575O9ZZi1Bu3/UlUZsWVaYwTVux38N6pHm/Aubq4Ey', 'mateop', 'Mateo Pérez', '+51916214468', 1, '2025-05-17 05:25:00', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(86, 4, 'melanyr@outlook.com', '$2y$10$CutR709QUsDdlrF5O.GjNeAR1UFTLdW8ARbRxx.vYyWxEyzBxmBfG', 'melanyr', 'Melany Rojas', '+51999393352', 1, '2025-05-17 05:26:00', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(87, 4, 'fátimar@gmail.com', '$2y$10$.3BjxfMnOarPN8ALDdnDGe1GyBqmB3/FWbvd4mT7KK53.MB0HvcEG', 'fátimar', 'Fátima Rojas', '+51957425940', 0, '2025-05-17 05:27:00', '2025-04-25 04:42:47', '2025-07-12 01:55:32'),
(88, 2, 'dquispe123@clinicadental.com', '$2y$10$rQ69KNTH5.PEjhjlpcom9OP9id4wHgEPtKTv.CC6SDVsLFTz85GYe', 'dquispe', 'Diego Quispe', '9934323122', 0, NULL, '2025-06-14 07:43:17', '2025-06-14 07:47:10'),
(89, 2, 'droshi@clinicadental.com', '$2y$10$Ybxv0vsqhXC9Sx35e2iKZ.jlChVVOePUAMmNzzUmILc5zK1SaE4By', 'droshi', 'Delina Roshi', '948235235', 0, NULL, '2025-06-14 07:44:42', '2025-06-14 07:46:39'),
(90, 4, 'katdres2213@gmail.com', '12345678', 'Agutierrez', 'Ana Gutierrez', '998775673', 1, NULL, '2025-07-12 08:34:02', '2025-07-12 08:34:02'),
(91, 4, 'katdres2113@gmail.com', '12345678', 'Psanchez', 'Pablo Sanchez', '978543343', 1, NULL, '2025-07-12 09:03:14', '2025-07-12 09:03:14'),
(92, 4, 'marta13@gmail.com', '12345678', 'Mquispe', 'Marta Quispe', '9876673273', 1, NULL, '2025-07-12 09:29:23', '2025-07-12 09:29:23'),
(93, 4, 'merida1@gmail.com', '$2y$10$aqb.iyfWfkmf3TJHu/Ews.K6xBtAX06t4Hlnj1Gi75zkbagAqSu5O', 'Msanchez', 'Merida Sanchez', '9876673273', 1, '2025-07-12 04:32:06', '2025-07-12 09:30:49', '2025-07-12 09:32:06'),
(94, 4, 'maria.lopez@gmail.com', '$2y$10$RSeZ13CsES7pKJSqgpe9EeOqPZQ4e4HvJXBGZC3MHdptR3umbJ.Su', 'mlopez', 'María López González', '+51 987 654 321', 1, NULL, '2025-07-12 13:29:58', '2025-07-12 13:29:58'),
(95, 4, 'carlos.ramirez@gmail.com', '$2y$10$2xH7NRopjW9bmD0L/62pGOb8xf/G1JIRiXzoD/5c.6jRoz3iiIGQC', 'cramirez', 'Carlos Ramírez Sánchez', '+51 912 345 678', 1, NULL, '2025-07-12 13:33:29', '2025-07-12 13:33:29'),
(96, 4, 'ana.martinez@gmail.com', '$2y$10$4IlxSbLLjwr4dT2ZFjjVMunUZ6.ldmzDPSceclGXuvfypktYyrS1S', 'amartinez', 'Ana Martínez Díaz', '+51 934 567 890', 1, '2025-07-12 08:36:07', '2025-07-12 13:35:25', '2025-07-12 13:36:07'),
(97, 4, 'jorge.hernandez@gmail.com', '$2y$10$GGsLLAvU6O3/2X13xg2nmOV5ClSmQlF8kai/0XqDuvhQIvd29/2S.', 'jhernandez', 'Jorge Hernández Pérez', '+51 976 123 456', 1, NULL, '2025-07-12 13:37:03', '2025-07-12 13:37:03'),
(98, 4, 'laura.garcia@gmail.com', '$2y$10$gv6H7yyzukN7qORnzLxSj.dorzJpi22OcuF2Pj9H4cJnRH9rw837e', 'lgarcia', 'Laura García Ruiz', '+51 998 765 432', 1, NULL, '2025-07-12 13:38:22', '2025-07-12 13:38:22'),
(99, 4, 'luis.torres@gmail.com', '$2y$10$p6PwE.A8I8ArFhfOPLXV/uc6xU1ZCEupC0JdmieEXKeGg7jWtinpC', 'ltorres', 'Luis Torres Mendoza', '+51 911 222 333', 1, NULL, '2025-07-12 13:39:14', '2025-07-12 13:39:14'),
(100, 4, 'sofia.vazquez@example.com', '$2y$10$zY4sLxfE/S57.gSXq/anxeXGNkkYZpU/xaFLPVKmCgDLzOOhEOhpm', 'svazquez', 'Sofía Vázquez Castro', '+51 944 555 666', 1, NULL, '2025-07-12 13:39:42', '2025-07-12 13:39:42'),
(101, 4, 'pedro.jimenez@gmail.com', '$2y$10$HuWWdfkXiN8qyUGs/1XKteFGk1MoqktmVb84hVsE5TvzoR3gvoFz.', 'pjimenez', 'Pedro Jiménez Ortega', '+51 977 888 999', 1, NULL, '2025-07-12 13:40:17', '2025-07-12 13:40:17'),
(102, 4, 'adriana.silva@gmail.com', '$2y$10$PAqUlUhB/hAZp2TZBSZ5PemO5xx/tVYDiDuEQUZ4atPyqzQAoQYia', 'asilva', 'Adriana Silva Rojas', '+51 966 111 222', 1, NULL, '2025-07-12 13:41:06', '2025-07-12 13:41:06'),
(103, 4, 'roberto.navarro@gmail.com', '$2y$10$mtGGiIouTTABt/0iqzIZWOvuXUrCqPLUJKLt1CVujS3jnZ56MKQZG', 'rnavarro', 'Roberto Navarro Flores', '+51 933 444 555', 1, NULL, '2025-07-12 13:41:35', '2025-07-12 13:41:35'),
(104, 4, 'carmen.reyes@gmail.com', '$2y$10$8ackyN2p10lMtT4e6W5GsuJj1d1AuYY9ehOCY8w81ePRNrCmJO08e', 'creyes', 'Carmen Reyes Gutiérrez', '+51 955 666 777', 1, NULL, '2025-07-12 13:42:06', '2025-07-12 13:42:06'),
(105, 4, 'fernando.mendoza@gmail.com', '$2y$10$O6zqiQPn6CJ70rN5/Ck1qeAe9o.FkFZEpBDy3SUIvDRDZNU9esdvW', 'fmendoza', 'Fernando Mendoza Soto', '+51 922 777 888', 1, NULL, '2025-07-12 13:42:41', '2025-07-12 13:42:41'),
(106, 4, 'isabel.castro@gmail.com', '$2y$10$jh6VtHfy5YNfdKjpawM5PesBpVeEXxQNlyX2xbARd5DCWsv2K9i7C', 'icastro', 'Isabel Castro Romero', '+51 988 999 000', 1, NULL, '2025-07-12 13:43:18', '2025-07-12 13:43:18'),
(107, 4, 'diego.ortega@gmail.com', '$2y$10$640aXhwSibuEz4G4kEN7UOk4YfT355i4hWmD9nqYle36Heo5sJORi', 'dortega', 'Diego Ortega Herrera', '+51 999 000 111', 1, NULL, '2025-07-12 13:43:58', '2025-07-12 13:43:58'),
(108, 4, 'patricia.rios@gmail.com', '$2y$10$2WslEZ0EPw.genpoEwb2d.8A6S0/WpivmDU64IJGejxREkHUNt0.i', 'prios', 'Patricia Ríos Vargas', '+51 977 123 456', 1, NULL, '2025-07-12 13:44:34', '2025-07-12 13:44:34'),
(109, 4, 'dharma.bonifacio@gmail.com', '$2y$10$LqYggt3MvnqpG8NQ3b/gjen/.G/AAL89mSNvpqx9RYdPbtoUsrJhy', 'dbonifacio', 'Dharma Bonifacio', '903128540', 1, '2025-07-12 11:41:17', '2025-07-12 16:41:13', '2025-07-12 16:41:17'),
(110, 4, 'danahegutierrez12@gmail.com', '$2y$10$Bfl54niSWwFwpfMKWqcZRuuqi9PX3pw.s4qFGOq9YHzV9Tw1drBuq', 'danahe', 'Danahe Gutierrez', '955433213', 1, '2025-07-12 12:11:44', '2025-07-12 17:11:37', '2025-07-12 17:11:44');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_tratamiento` (`id_tratamiento`),
  ADD KEY `idx_citas_fecha` (`fecha_hora`),
  ADD KEY `idx_citas_paciente` (`id_paciente`),
  ADD KEY `idx_citas_dentista` (`id_dentista`),
  ADD KEY `idx_citas_estado` (`estado`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id_config`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `dentistas`
--
ALTER TABLE `dentistas`
  ADD PRIMARY KEY (`id_dentista`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `cedula_profesional` (`cedula_profesional`),
  ADD KEY `id_especialidad` (`id_especialidad`),
  ADD KEY `idx_dentistas_usuario` (`id_usuario`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id_documento`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_dentista` (`id_dentista`),
  ADD KEY `id_tratamiento` (`id_tratamiento`),
  ADD KEY `idx_historial_paciente` (`id_paciente`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_item`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_pacientes_usuario` (`id_usuario`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `id_cita` (`id_cita`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  ADD PRIMARY KEY (`id_tratamiento`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id_config` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `dentistas`
--
ALTER TABLE `dentistas`
  MODIFY `id_dentista` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id_documento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  MODIFY `id_tratamiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamientos` (`id_tratamiento`),
  ADD CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas` (`id_dentista`);

--
-- Filtros para la tabla `dentistas`
--
ALTER TABLE `dentistas`
  ADD CONSTRAINT `dentistas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `dentistas_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`);

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`);

--
-- Filtros para la tabla `historial_medico`
--
ALTER TABLE `historial_medico`
  ADD CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `historial_medico_ibfk_2` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas` (`id_dentista`),
  ADD CONSTRAINT `historial_medico_ibfk_3` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamientos` (`id_tratamiento`);

--
-- Filtros para la tabla `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`);

--
-- Filtros para la tabla `tratamientos`
--
ALTER TABLE `tratamientos`
  ADD CONSTRAINT `tratamientos_ibfk_1` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
