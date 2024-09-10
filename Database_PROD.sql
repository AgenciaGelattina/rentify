-- PRODUCTION V 1.1.2

-- --------------------------------------------------------
-- Table `accounts_roles`

CREATE TABLE `accounts_roles` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `accounts_roles` (`id`, `label`) VALUES
(1, 'Super Admin'),
(2, 'Admin'),
(3, 'Broker'),
(4, 'Mantenimiento'),
(5, 'Cobrador');

-- --------------------------------------------------------
-- Table `accounts`

CREATE TABLE `accounts` (
  `id` smallint(5) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `names` varchar(100) NOT NULL,
  `surnames` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` tinyint(3) UNSIGNED NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  `created` date NOT NULL,
  `updated` date NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`role`) REFERENCES accounts_roles (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `accounts` (`id`, `names`, `surnames`, `email`, `password`, `role`, `active`, `created`, `updated`) VALUES
(1, 'Romeo', 'Marquez', 'romeo@gelattina.com', '$2y$10$W3hVJv7BbaUSkMWQNTthU.5ddteLP9wGMqFD8gYETav7OAG2EDnhu', 1, 1, '2023-09-13', '2024-01-17'),
(2, 'Yolanda', 'Maltos', 'Yolanda@gelattina.com', '$2y$10$EAa0aT99g8rv/LXNms837uD9iL7XpkHJFke1UgCgEnhTwv0/gAmB6', 1, 1, '2024-06-17', '2024-06-17 20:13:30');

-- --------------------------------------------------------
-- Table `properties_types`

CREATE TABLE `properties_types` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `properties_types` (`id`, `label`) VALUES
(1, 'Casa'),
(2, 'Departamento'),
(3, 'Local'),
(4, 'Oficina');

-- --------------------------------------------------------
-- Table `properties_status`

CREATE TABLE `properties_status` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `properties_status` (`id`, `label`) VALUES
(1, 'En Venta'),
(2, 'En Renta'),
(3, 'Rentada'),
(4, 'Vendida'),
(5, 'En Reparación'),
(6, 'Reparada');

-- --------------------------------------------------------
-- Table `groups_types`

CREATE TABLE `groups_types` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `groups_types` (`id`, `label`) VALUES
(1, 'Edificio'),
(2, 'Mixto'),
(3, 'Comercial'),
(4, 'Oficina'),
(5, 'Casa aislada'),
(6, 'Departamento Aislado');

-- --------------------------------------------------------
-- Table `properties_groups`

CREATE TABLE `properties_groups` (
  `id` smallint(5) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `address` varchar(150) NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (`type`) REFERENCES groups_types (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `properties_groups` (`id`, `type`, `title`, `description`, `address`, `active`) VALUES
(4, 2, 'San Salvador', '', 'San Salvador 312', 1),
(5, 2, 'Passport', '', 'Paseo de los Leones 608', 1),
(6, 1, 'Distrito', '', 'Distrito b 8', 1),
(7, 3, 'Taller Mecánico', 'Local preparado para taller', 'Paseo de los Leones 1920', 1),
(8, 4, 'Las Torreones', 'Twin offices', 'Torreon 327', 1),
(9, 6, 'Independientes', '', 'Varios', 1),
(10, 5, 'San Antonio', '', 'Varios', 1),
(11, 4, 'Bodega+', '', 'Golfo de México', 1);

-- --------------------------------------------------------
-- Table `properties`

CREATE TABLE `properties` (
  `id` smallint(5) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL,
  `group` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created` date NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (`type`) REFERENCES properties_types (`id`),
  FOREIGN KEY (`status`) REFERENCES properties_status (`id`),
  FOREIGN KEY (`group`) REFERENCES properties_groups (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `properties` (`id`, `type`, `status`, `group`, `title`, `description`, `created`, `active`) VALUES 
(23, 2, 3, 4, '312-B', 'Piso superior completo', '2024-06-13', 1), 
(24, 2, 3, 4, '312-C', 'Depa pequeño', '2024-06-13', 1), 
(25, 3, 3, 5, 'Local Restaurante', 'Local preparado para restaurante', '2024-06-13', 1), 
(26, 2, 3, 5, 'Leones 2-1', 'Departamento de 1 recámara', '2024-06-13', 1), 
(27, 3, 3, 7, 'Taller Mecánico', 'Taller Mecánico', '2024-06-13', 1), 
(28, 2, 3, 6, 'Distrito 1-1', 'Departamento studio', '2024-06-13', 1), 
(29, 4, 3, 8, '327', 'Oficina dos pisos', '2024-06-13', 1), 
(30, 4, 3, 8, '331', 'Oficina dos pisos', '2024-06-13', 1), 
(31, 4, 3, 4, '312-A', 'Oficina de 1 piso', '2024-06-13', 1), 
(32, 2, 3, 9, 'Condesa', 'Departamento en edificio', '2024-06-13', 1), 
(33, 2, 3, 9, 'Xilofactos', 'Departamento en edificio', '2024-06-13', 1), 
(34, 4, 2, 11, 'Golfo 1', 'Oficina multiniveles', '2024-06-13', 1), 
(35, 4, 2, 11, 'Golfo 2', 'Oficina multiniveles', '2024-06-13', 1), 
(36, 4, 2, 11, 'Mar caribe', 'Oficina multiniveles', '2024-06-13', 1), 
(37, 2, 3, 6, 'Distrito 1-2', 'estudio', '2024-06-17', 1), 
(38, 2, 3, 6, 'Distrito 1-3 ', '', '2024-06-20', 1), 
(39, 2, 3, 6, 'Distrito 1-4', '', '2024-06-20', 1), 
(40, 2, 3, 6, 'Distrito 1-5', '', '2024-06-20', 1), 
(41, 2, 3, 6, 'Distrito 2-1', '', '2024-06-20', 1), 
(42, 2, 3, 6, 'Distrito 2-2', '', '2024-06-20', 1), 
(43, 2, 3, 6, 'Distrito 2-3', '', '2024-06-20', 1), 
(44, 2, 3, 6, 'Distrito 2-4', '', '2024-06-20', 1), 
(45, 2, 3, 6, 'Distrito 2-5', '', '2024-06-20', 1), 
(46, 2, 3, 6, 'Distrito 2-6', '', '2024-06-20', 1), 
(47, 2, 3, 6, 'Distrito 3-1', '', '2024-06-20', 1), 
(48, 2, 3, 6, 'Distrito 3-2', '', '2024-06-20', 1), 
(49, 2, 3, 6, 'Distrito 3-3', '', '2024-06-20', 1), 
(50, 2, 3, 6, 'Distrito 3-4', '', '2024-06-20', 1), 
(51, 2, 3, 6, 'Distrito 3-5', '', '2024-06-20', 1), 
(52, 2, 3, 6, 'Distrito 3-6', '', '2024-06-20', 1), 
(53, 2, 3, 6, 'Distrito 4-1', '', '2024-06-20', 1), 
(54, 2, 3, 6, 'Distrito 4-2', '', '2024-06-20', 1), 
(55, 2, 3, 6, 'Distrito 4-3', '', '2024-06-20', 1), 
(56, 2, 3, 6, 'Distrito 4-4', '', '2024-06-20', 1), 
(57, 2, 3, 6, 'Distrito 4-5', '', '2024-06-20', 1), 
(58, 2, 3, 6, 'Distrito 4-6', '', '2024-06-20', 1), 
(59, 2, 3, 5, 'Leones 2-2', '', '2024-06-20', 1), 
(60, 2, 3, 5, 'Leones 2-3', '', '2024-06-20', 1), 
(61, 2, 3, 5, 'Leones 2-4', '', '2024-06-20', 1), 
(62, 2, 3, 5, 'Leones 2-5', '', '2024-06-20', 1), 
(63, 2, 3, 5, 'Leones 2-6', '', '2024-06-20', 1), 
(64, 2, 3, 5, 'Leones 2-7', '', '2024-06-20', 1), 
(65, 2, 3, 5, 'Leones 2-8', '', '2024-06-20', 1), 
(66, 2, 3, 5, 'Leones 3-1', '', '2024-06-20', 1), 
(67, 2, 3, 5, 'Leones 3-2', '', '2024-06-20', 1), 
(68, 2, 3, 5, 'Leones 3-3', '', '2024-06-20', 1), 
(69, 2, 3, 5, 'Leones 3-4', '', '2024-06-20', 1), 
(70, 2, 3, 5, 'Leones 3-5', '', '2024-06-20', 1), 
(71, 2, 3, 5, 'Leones 3-6', '', '2024-06-20', 1), 
(72, 2, 3, 5, 'Leones 3-7', '', '2024-06-20', 1), 
(73, 2, 3, 5, 'Leones 3-8', '', '2024-06-20', 1), 
(74, 2, 3, 5, 'Leones 3-9', '', '2024-06-20', 1), 
(75, 2, 3, 5, 'Leones 3-10', '', '2024-06-20', 1), 
(76, 2, 3, 5, 'Leones 3-11', '', '2024-06-20', 1), 
(77, 2, 3, 5, 'Leones 3-12', '', '2024-06-20', 1), 
(78, 1, 3, 10, 'Cactus Flower 472', '', '2024-06-21', 1), 
(79, 1, 3, 10, 'Colbert Ferry 322', '', '2024-06-21', 1), 
(80, 1, 3, 10, 'Erstein Valley 12359', '', '2024-06-21', 1), 
(81, 1, 3, 10, 'Grey Sotol Way 4675', 'z', '2024-06-21', 1), 
(82, 1, 3, 10, 'Grey Sotol Way 4679', '', '2024-06-21', 1), 
(83, 1, 3, 10, 'Luneville Lane 10333', '', '2024-06-21', 1);
-----------------------------------

-- --------------------------------------------------------
-- Table `property_contracts`

CREATE TABLE `property_contracts` (
  `id` mediumint(8) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `property` smallint(5) UNSIGNED NOT NULL,
  `due_date` tinyint(2) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created` date NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (`property`) REFERENCES properties (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `property_contracts` (`id`,`property`,`due_date`,`start_date`,`end_date`,`created`,`active`) VALUES 
(11, 31, 1, '2024-01-10', '2025-01-31', '2024-06-13', 1), 
(12, 23, 15, '2024-06-01', '2025-05-31', '2024-06-13', 1), 
(13, 24, 1, '2024-06-01', '2025-05-31', '2024-06-13', 1), 
(14, 25, 15, '2024-04-01', '2025-03-31', '2024-06-17', 1), 
(15, 28, 1, '2024-01-01', '2024-12-31', '2024-06-20', 1), 
(16, 37, 1, '2024-02-01', '2024-07-31', '2024-06-20', 1), 
(17, 38, 1, '2023-08-02', '2024-08-01', '2024-06-20', 1), 
(18, 39, 1, '2023-07-24', '2024-07-23', '2024-06-20', 1), 
(19, 40, 1, '2024-02-01', '2025-01-31', '2024-06-20', 1), 
(20, 41, 15, '2023-11-15', '2025-11-14', '2024-06-20', 1), 
(21, 42, 13, '2024-06-13', '2025-06-12', '2024-06-20', 1), 
(22, 43, 12, '2023-10-12', '2024-10-14', '2024-06-20', 1), 
(23, 45, 1, '2023-06-28', '2024-06-27', '2024-06-20', 1), 
(24, 44, 15, '2024-06-17', '2025-06-16', '2024-06-20', 1), 
(25, 46, 10, '2024-06-10', '2025-06-09', '2024-06-20', 1), 
(26, 47, 1, '2023-09-29', '2024-09-25', '2024-06-20', 1), 
(27, 48, 8, '2023-12-08', '2024-12-07', '2024-06-20', 1), 
(28, 49, 10, '2024-02-10', '2025-02-09', '2024-06-20', 1), 
(29, 50, 10, '2024-04-10', '2025-04-09', '2024-06-20', 1), 
(30, 51, 1, '2023-09-01', '2024-08-31', '2024-06-20', 1), 
(31, 52, 26, '2023-06-26', '2024-06-25', '2024-06-20', 1), 
(32, 53, 8, '2024-06-09', '2024-06-08', '2024-06-20', 1), 
(33, 55, 3, '2023-07-03', '2024-07-02', '2024-06-20', 1), 
(34, 56, 5, '2023-12-05', '2024-12-04', '2024-06-20', 1), 
(35, 57, 15, '2024-01-16', '2025-01-15', '2024-06-20', 1), 
(36, 59, 15, '2023-09-15', '2024-09-14', '2024-06-20', 1), 
(37, 26, 15, '2023-11-15', '2024-11-14', '2024-06-20', 1), 
(38, 61, 15, '2023-10-19', '2024-10-18', '2024-06-20', 1), 
(39, 62, 1, '2023-06-28', '2024-06-27', '2024-06-20', 1), 
(40, 60, 22, '2023-11-22', '2024-11-21', '2024-06-20', 1), 
(41, 63, 21, '2024-02-21', '2024-12-20', '2024-06-20', 1), 
(42, 64, 26, '2023-10-26', '2024-10-25', '2024-06-20', 1), 
(43, 65, 1, '2024-03-01', '2025-02-28', '2024-06-20', 1), 
(44, 66, 26, '2023-09-26', '2024-09-25', '2024-06-20', 1), 
(45, 67, 15, '2024-02-15', '2024-08-14', '2024-06-20', 1), 
(46, 68, 15, '2024-02-15', '2025-02-14', '2024-06-20', 1), 
(47, 69, 21, '2023-06-21', '2024-07-20', '2024-06-20', 1), 
(48, 70, 1, '2024-02-01', '2025-01-31', '2024-06-20', 1), 
(49, 71, 26, '2024-01-26', '2025-01-25', '2024-06-20', 1), 
(50, 72, 1, '2023-08-01', '2024-07-31', '2024-06-20', 1), 
(51, 73, 24, '2024-02-24', '2024-08-23', '2024-06-20', 1), 
(52, 74, 15, '2024-02-15', '2025-02-14', '2024-06-20', 1), 
(53, 83, 1, '2024-04-30', '2025-04-29', '2024-06-21', 1), 
(54, 77, 1, '2024-05-01', '2024-05-31', '2024-06-21', 1), 
(55, 77, 1, '2024-04-01', '2024-04-30', '2024-06-21', 1), 
(56, 77, 1, '2024-06-01', '2024-06-30', '2024-06-21', 1), 
(57, 80, 1, '2023-12-01', '2024-12-31', '2024-06-24', 1), 
(58, 79, 1, '2024-06-01', '2025-05-31', '2024-06-24', 1), 
(59, 78, 1, '2024-04-01', '2024-10-31', '2024-06-24', 1), 
(60, 82, 15, '2024-01-01', '2025-01-31', '2024-06-24', 1), 
(61, 81, 1, '2023-12-15', '2024-11-30', '2024-06-24', 1);

-- --------------------------------------------------------
-- Table `contracts_contractors`

CREATE TABLE `contracts_contractors` (
  `id` mediumint(8) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `names` varchar(100) NOT NULL,
  `surnames` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `contracts_contractors` (`id`, `contract`, `names`, `surnames`, `email`, `phone`) VALUES
(1, 12, 'Hazur', 'No sé', 'hazur@gmail.com', '55555555'),
(2, 11, 'Claudia', 'Martinez', 'claudia@gmail.com', '55555555'),
(3, 13, 'Chisquis', '+', 'chisquis@gmail.com', '55555555'),
(4, 15, 'Ricardo', 'García de León González', 'pendiente@gmail.com', '.'),
(5, 16, 'Santiago Eduardo', 'Aguilar Martinez', 'pendiente@gmail.com', '.'),
(6, 17, 'René Alejandro', 'Barrón Sosa', 'pendiente@gmail.com', '.'),
(7, 18, 'Maurilio', 'Gutierrez Castillo', 'pendiente@gmail.com', '.'),
(8, 19, 'Berenice', 'Espinoza', 'pendiente@gmail.com', '.'),
(9, 20, 'IRVING ALEJANDRO ', 'MARQUEZ DIAZ', 'pendiente@gmail.com', '.'),
(10, 21, 'Fernando', 'Muñiz Valencia', 'pendiente@gmail.com', '5586773712'),
(11, 22, 'JUAN MANUEL ', 'MELCHOR VALENCIA ', 'pendiente@gmail.com', '8120658939'),
(12, 24, 'LILIANA ITZEL ', 'CRUZ CRUZ', 'pendiente@gmail.com', '8135762878'),
(13, 25, 'FRANCISCO GERARDO ', 'ALMAGUER GUTIERREZ', 'pendiente@gmail.com', '8341220669'),
(14, 25, 'KENNYA', 'ALMAGUER', 'pendiente@gmail.com', '8341212055'),
(15, 25, 'Frida', 'Almaguer', 'pendiente@gmail.com', '8343305834'),
(16, 26, 'EMMANUEL ALEJANDRO ', 'ALVAREZ MARTINEZ ', 'a@a.com', '811935986'),
(17, 26, 'JORGE ANTONIO ', 'ALVAREZ MARTINEZ', 'a@a.com', '8182008683'),
(18, 27, '	JESUS MA. ', 'RAMIREZ CONS', 'A@a.com', '6621730916'),
(19, 27, 'EVA LAURA	', '.', 'A@a.com', '6621991118'),
(20, 28, 'OSWALDO ARTURO ', 'LUNA GIL', 'A@a.com', '6621237948'),
(21, 29, 'SERGIO ALEJANDRO ', 'MARTINEZ GARCIA	', 'A@a.com', '3313601264'),
(22, 30, 'MELCHOR ', 'ORTIZ CASTELLANOS ', 'A@a.com', '8661279809'),
(23, 30, 'EMILIO', 'ORTIZ', 'A@a.com', '8661478159'),
(24, 31, 'GUSTAVO EMILIO ', 'GONZALEZ VAZQUEZ', 'A@a.com', '4151142812'),
(25, 32, 'HECTOR ', 'ARRIAGA GARCIA', 'A@a.com', '8116114478'),
(26, 33, 'RICARDO ', 'MORALES HENRIQUEZ', 'A@a.com', '6862777374'),
(27, 34, 'AZUCENA ', 'ROLON JAIMES ', 'A@a.com', 'A'),
(28, 35, 'RUTH ', ' ARREGUIN PEREZ', 'A@a.com', '8661078718'),
(29, 36, 'LUIS GUILLERMO ', 'FUENTES SANCHEZ', 'A@a.com', '.'),
(30, 37, 'IRVING ALEJANDRO ', 'MARQUEZ DIAZ', 'A@a.com', '.'),
(31, 38, 'GERARDO ', 'RICO ORTIZ', 'A@a.com', '.'),
(32, 39, 'EDUARDO', ' RODRIGUEZ FLORES', 'A@a.com', '.'),
(33, 39, 'RODY ', 'RAE ZYLLA', 'A@a.com', '.'),
(34, 40, 'Angel Humberto', 'Diaz Diaz', 'A@a.com', '.'),
(35, 41, 'Jose mario', 'Calderon herrera', 'A@a.com', '.'),
(36, 42, 'RAFAEL ', 'BECERRA GARCIA ', 'A@a.com', '.'),
(37, 43, 'KIMBERLY YAMILETH ', 'ESCALON GOZALEZ	', 'A@a.com', '8123200461'),
(38, 44, 'EMMANUEL ALEJANDRO ', 'ALVAREZ MARTINEZ', 'A@a.com', '.'),
(39, 45, 'JUAN NIKANDI ', 'SALINAS GLEZ', 'A@a.com', '.'),
(40, 46, 'PEDRO ', 'SOLANO MURILLO ', 'A@a.com', '3314695537'),
(41, 46, 'PAOLA 	', 'SOLANO', 'A@a.com', '.'),
(42, 47, 'ANTONIO ', 'LOPEZ URIBE', 'A@a.com', '.'),
(43, 48, 'PABLO MIGUEL ', 'PEREZ MORALES', 'A@a.com', '9512345450'),
(44, 49, 'VALERIA ', 'JIMENEZ BARRIOS', 'A@a.com', '7711142809'),
(45, 50, 'MARTINA ', 'LEURA HENANDEZ', 'A@a.com', 'A.'),
(46, 51, 'LUIS ', 'FLORES', 'A@a.com', '5512246906'),
(47, 51, 'ricardo ', 'rocha', 'A@a.com', '5512246906'),
(48, 52, 'MARIANA ALEJANDRA ', 'HERNANDEZ GONZALEZ', 'A@a.com', '5536666039'),
(49, 53, 'DIANA', 'EMENS', 'EANE.EMENS@SEFL.COM', '281-795-3995'),
(50, 53, 'DIANA', 'EMENS', 'EANE.EMENS@SEFL.COM', '281-795-3995'),
(51, 57, 'CHRISTINA', 'PFISTER', 'cpfister@satx.rr.com', '210.833.1232'),
(52, 58, 'AMBER  ', 'WINSETT', 'a@a.com', '.'),
(53, 58, 'TYLER', 'WINSETT', 'a@a.com', '.'),
(54, 59, 'DEJON ', 'STALLINGS', 'DEJASTALLS17@GMAIL.COM', '.'),
(55, 59, 'DERREAN', 'STALLINGS', 'derrean.stallings@yahoo.com', '.'),
(56, 60, 'JENNIFER ', 'LUNA ', 'JENNYTLUNA88@GMAIL.COM', '.'),
(57, 60, 'DIEGO', 'TORRES', 'diegot1990@gmail.com', '.'),
(58, 60, 'VIVIAN', 'SENSIALES', 'a@a.com', '210.535.5252'),
(59, 61, 'ADAM ', 'MESSINGER', 'a@a.com', '.'),
(60, 61, 'KELSEY', 'MESSINGER', 'q@a.com', '.');

-- --------------------------------------------------------
-- Table `contracts_folders`

CREATE TABLE `contracts_folders` (
  `name` varchar(36) NOT NULL PRIMARY KEY,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created` date NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `contracts_folders` (`name`, `contract`, `title`, `description`, `created`) VALUES
('1BB2BC9AE6C4437FA3A13EBC7B657342', 27, 'Contrato', '', '2024-06-20'),
('2F182FA4DFF344E99BD55B01E257CCFC', 11, 'Fotos de entrega a inquilino', '', '2024-06-13'),
('3A3BD5FC5DF84C3B8C47142CBCFA7699', 15, 'Contratos', '', '2024-06-20'),
('3BABE09EB5234D0588E33F89EF65278A', 12, 'Contratos', '', '2024-06-13'),
('41D8B637A58449E1B4684976666F36C8', 38, ' Contrato', '', '2024-06-20'),
('510FB33D240F4A3A893EB7C17B622DDF', 28, 'Contrato ', '', '2024-06-20'),
('5115504A67DA41AFB905018C1C03C919', 41, 'Contrato', '', '2024-06-20'),
('5E890682E66F4BFE90090CD38778E736', 39, 'Contrato', '', '2024-06-20'),
('6ECC848854CC4828A8C375FA9C20B45F', 48, 'Contrato', '', '2024-06-21'),
('73838D97CC904A309148478FB8C0A0E8', 43, 'Contrato ', '', '2024-06-20'),
('816A5FD581E14E5F85D1AB7F5E4DB6A3', 11, 'Contratos', '', '2024-06-13'),
('92C37BA648C14B099DD46335FFF36A6E', 49, 'Contrato', '', '2024-06-21'),
('9FDDDF6123B744568B684F16809DA688', 37, 'Contrato ', '', '2024-06-20'),
('AD6CB76E40F244E997C2189833F64EFC', 11, 'Fotos de cierre', '', '2024-06-13'),
('D35B8BBCE0A74034BE6F644E998EAC1C', 36, 'Contrato', '', '2024-06-20'),
('DA2BB91907BA44A2A78F0DB8264606BD', 42, 'Contrato', '', '2024-06-20'),
('DBDB5DBE531E4F8AA147975B570D1708', 20, 'Contratos', '.', '2024-06-20'),
('DC9C9B15BED7487F9957E88583A85557', 14, 'Contrato', '', '2024-06-20'),
('FE17A6434FEF46A59B7ACB6AEDBA04BD', 22, 'Contrato', '', '2024-06-20');

-- --------------------------------------------------------
-- Table `files`
CREATE TABLE `files` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `folder` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(10) NOT NULL,
  `size` mediumint(8) UNSIGNED NOT NULL DEFAULT 0,
  `created` date NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`folder`) REFERENCES contracts_folders (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `files` (`id`, `folder`, `name`, `type`, `size`, `created`) VALUES
('033D972348C7414EB5573B156491FA28', '3BABE09EB5234D0588E33F89EF65278A', 'Cerro_de_la_Silla', 'jpeg', 1749939, '2024-06-14'),
('1A1B56596E284DB1B2C979A8139E5047', 'FE17A6434FEF46A59B7ACB6AEDBA04BD', 'Distrito_23_Oct142024', 'pdf', 14481965, '2024-06-20'),
('1C05EB3668494D6FB60FF10EF2D77732', '3A3BD5FC5DF84C3B8C47142CBCFA7699', 'Distrito_11_Dic3124', 'pdf', 16033475, '2024-06-20'),
('2CD8D160177E47118A8C70702DFFD2F2', 'DA2BB91907BA44A2A78F0DB8264606BD', 'Leones_27_Oct252024', 'pdf', 10810853, '2024-06-21'),
('3052D87A84BB42C68F9C59BDC9FEAD97', '816A5FD581E14E5F85D1AB7F5E4DB6A3', 'cerro_silla', 'jpeg', 46554, '2024-06-14'),
('48951AAEF7054CD3B20BEE22F60D23E8', 'D35B8BBCE0A74034BE6F644E998EAC1C', 'Leones_22_Agosto142024', 'pdf', 10430115, '2024-06-20'),
('544409B3B47E4310B11C1F96107A9E22', '5115504A67DA41AFB905018C1C03C919', 'Leones_26_Dic202024', 'pdf', 11683717, '2024-06-21'),
('5FE0142C4B634AB89E3EB2E98E12E60A', 'DC9C9B15BED7487F9957E88583A85557', 'Restaurante', 'pdf', 11076257, '2024-06-20'),
('77F7E63128F448959DF427D306F50B94', '41D8B637A58449E1B4684976666F36C8', 'Leones_24_Agos312024', 'pdf', 11327587, '2024-06-20'),
('79E23F77A4D548D0AC1D05BBEF6E1FF7', '1BB2BC9AE6C4437FA3A13EBC7B657342', 'Distrito_32_Dic072024', 'pdf', 11027699, '2024-06-20'),
('A80C89B62D1D4828A36345D2A9435116', '5E890682E66F4BFE90090CD38778E736', 'Leones_25_Junio_27_24', 'pdf', 11334380, '2024-06-21'),
('B9DBCF65082346BE9349360434277FBF', '92C37BA648C14B099DD46335FFF36A6E', 'Leones_36_Enero252025', 'pdf', 16777215, '2024-06-21'),
('BCF3A1F6434F42B99ABD10A27B75B823', '41D8B637A58449E1B4684976666F36C8', 'Leones_24_Agos312024', 'pdf', 11327587, '2024-06-20'),
('D352E42254BA407FA938A2CBF4F6E9E6', '3A3BD5FC5DF84C3B8C47142CBCFA7699', 'Distrito_11_Dic3124', 'pdf', 16033475, '2024-06-20'),
('E566B78D512747B48A53C6762A513966', '6ECC848854CC4828A8C375FA9C20B45F', 'Leones_35_Enero312025', 'pdf', 10213960, '2024-06-21'),
('E6E529A49E33474B90F52BE6601E66D7', '1BB2BC9AE6C4437FA3A13EBC7B657342', 'Distrito_23_Oct142024', 'pdf', 14481965, '2024-06-20'),
('E91B9D383DEB4F4BB44DA3DF8806593F', '2F182FA4DFF344E99BD55B01E257CCFC', 'cerro_silla', 'jpeg', 46554, '2024-06-17'),
('EDE9648FA4EF416681A8D3BFE1EB93AD', '73838D97CC904A309148478FB8C0A0E8', 'Leones_28_Feb282025', 'pdf', 12709772, '2024-06-21'),
('EE6B7AEDC6DC4AE7BB59CA86B15CF8A1', 'DBDB5DBE531E4F8AA147975B570D1708', 'Distrito_21_Febrero21_2025', 'pdf', 15047797, '2024-06-20'),
('EF155383B9A245259B49CCBE4F8BBB64', '9FDDDF6123B744568B684F16809DA688', 'Leones_21_Nov_142024', 'pdf', 11927287, '2024-06-20');

-- --------------------------------------------------------
-- Table `payments_types`

CREATE TABLE `payments_types` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `payments_types` (`id`, `label`) VALUES
(1, 'Recurrente'),
(2, 'Único');

-- Table structure for table `contracts_recurring_payments`
--
CREATE TABLE `contracts_recurring_payments` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `label` varchar(80) NOT NULL,
  `value` int(10) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `contracts_recurring_payments` (`id`,`contract`,`label`,`value`,`start_date`,`end_date`) VALUES 
(1, 11, 'Renta', 17500,'2024-01-10', '2025-01-31'), 
(2, 12, 'Renta', 15000,'2024-06-01', '2025-05-31'), 
(3, 13, 'Renta', 12000,'2024-06-01', '2025-05-31'), 
(4, 14, 'Renta', 25000,'2024-04-01', '2025-03-31'), 
(5, 15, 'Renta', 8400,'2024-01-01', '2024-12-31'), 
(6, 16, 'Renta', 8800,'2024-02-01', '2024-07-31'), 
(7, 17, 'Renta', 7500,'2023-08-02', '2024-08-01'), 
(8, 18, 'Renta', 13000,'2023-07-24', '2024-07-23'), 
(9, 19, 'Renta', 13820,'2024-02-01', '2025-01-31'), 
(10, 20, 'Renta', 15500,'2023-11-15', '2025-11-14'), 
(11, 21, 'Renta', 13000,'2024-06-13', '2025-06-12'), 
(12, 22, 'Renta', 8400,'2023-10-12', '2024-10-14'), 
(13, 23, 'Renta', 13500,'2023-06-28', '2024-06-27'), 
(14, 24, 'Renta', 7800,'2024-06-17', '2025-06-16'), 
(15, 25, 'Renta', 14000,'2024-06-10', '2025-06-09'), 
(16, 26, 'Renta', 14000,'2023-09-29', '2024-09-25'), 
(17, 27, 'Renta', 8500,'2023-12-08', '2024-12-07'), 
(18, 28, 'Renta', 8500,'2024-02-10', '2025-02-09'), 
(19, 29, 'Renta', 7800,'2024-04-10', '2025-04-09'), 
(20, 30, 'Renta', 12200,'2023-09-01', '2024-08-31'), 
(21, 31, 'Renta', 14000,'2023-06-26', '2024-06-25'), 
(22, 32, 'Renta', 13000,'2024-06-09', '2024-06-08'), 
(23, 33, 'Renta', 8000,'2023-07-03', '2024-07-02'), 
(24, 34, 'Renta', 8500,'2023-12-05', '2024-12-04'), 
(25, 35, 'Renta', 14100,'2024-01-16', '2025-01-15'), 
(26, 36, 'Renta', 13500,'2023-09-15', '2024-09-14'), 
(27, 37, 'Renta', 15500,'2023-11-15', '2024-11-14'), 
(28, 38, 'Renta', 9000,'2023-10-19', '2024-10-18'), 
(29, 39, 'Renta', 9000,'2023-06-28', '2024-06-27'), 
(30, 40, 'Renta', 9500,'2023-11-22', '2024-11-21'), 
(31, 41, 'Renta', 9850,'2024-02-21', '2024-12-20'), 
(32, 42, 'Renta', 9000,'2023-10-26', '2024-10-25'), 
(33, 43, 'Renta', 17500,'2024-03-01', '2025-02-28'), 
(34, 44, 'Renta', 12500,'2023-09-26', '2024-09-25'), 
(35, 45, 'Renta', 11400,'2024-02-15', '2024-08-14'), 
(36, 46, 'Renta', 16590,'2024-02-15', '2025-02-14'), 
(37, 47, 'Renta', 12500,'2023-06-21', '2024-07-20'), 
(38, 48, 'Renta', 9850,'2024-02-01', '2025-01-31'), 
(39, 49, 'Renta', 9800,'2024-01-26', '2025-01-25'), 
(40, 50, 'Renta', 9500,'2023-08-01', '2024-07-31'), 
(41, 51, 'Renta', 9000,'2024-02-24', '2024-08-23'), 
(42, 52, 'Renta', 8500,'2024-02-15', '2025-02-14'), 
(43, 53, 'Renta', 2100,'2024-04-30', '2025-04-29'), 
(44, 54, 'Renta', 1000,'2024-05-01', '2024-05-31'), 
(45, 55, 'Renta', 1000,'2024-04-01', '2024-04-30'), 
(46, 56, 'Renta', 1000,'2024-06-01', '2024-06-30'), 
(47, 57, 'Renta', 2060,'2023-12-01', '2024-12-31'), 
(48, 58, 'Renta', 2200,'2024-06-01', '2025-05-31'), 
(49, 59, 'Renta', 2600,'2024-04-01', '2024-10-31'), 
(50, 60, 'Renta', 2400,'2024-01-01', '2025-01-31'), 
(51, 61, 'Renta', 2200,'2023-12-15', '2024-11-30');

-- Table structure for table `contracts_payments`
--

CREATE TABLE `contracts_payments` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `recurring` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `clarifications` varchar(150) NOT NULL,
  `created` date NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`),
  FOREIGN KEY (`type`) REFERENCES payments_types (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;