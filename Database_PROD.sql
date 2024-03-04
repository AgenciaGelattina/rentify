
-- V 1.0.9

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
  `updated` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`role`) REFERENCES accounts_roles (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `accounts` (`id`, `names`, `surnames`, `email`, `password`, `role`, `active`, `created`, `updated`) VALUES
(1, 'Romeo', 'Marquez', 'romeo@gelattina.com', '$2y$10$W3hVJv7BbaUSkMWQNTthU.5ddteLP9wGMqFD8gYETav7OAG2EDnhu', 1, 1, '2023-09-13', '2024-01-03 02:18:09');

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
(4, 'Terreno');

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
(2, 'Colonia'),
(3, 'Plaza Comercial'),
(4, 'Barrio');

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
(1, 1, 'Passport ', 'Depas', 'Leones 608', 1),
(2, 1, 'Distrito B3', 'Depas', 'Distrito B3', 1);

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
  `updated` datetime NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (`type`) REFERENCES properties_types (`id`),
  FOREIGN KEY (`status`) REFERENCES properties_status (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

ALTER TABLE `properties` ADD KEY `group` (`group`);

INSERT INTO `properties` (`id`, `type`, `status`, `group`, `title`, `description`, `created`, `updated`, `active`) VALUES
(1, 2, 2, 1, '2-1', 'Depa studio', '2024-01-09', '2024-01-09 10:35:17', 1),
(2, 2, 2, 1, '2-2', 'depa studio', '2024-01-09', '2024-01-09 10:48:27', 1),
(3, 2, 2, 1, '2-3', 'studio', '2024-01-09', '2024-01-09 10:49:35', 1),
(4, 2, 2, 1, '2-4', 'studio', '2024-01-09', '2024-01-09 10:49:59', 1),
(5, 2, 2, 1, '2-5', 'studio', '2024-01-09', '2024-01-09 10:50:18', 1),
(6, 2, 2, 1, '2-6', 'studio', '2024-01-09', '2024-01-09 10:50:36', 1),
(7, 2, 2, 1, '2-7', 'studio', '2024-01-09', '2024-01-09 10:50:58', 1),
(8, 2, 2, 1, '2-8', 'studio', '2024-01-09', '2024-01-09 10:51:29', 1),
(9, 2, 2, 1, '3-1', 'studio', '2024-01-09', '2024-01-09 10:52:08', 1),
(10, 2, 2, 1, '3-2', 'studio', '2024-01-09', '2024-01-09 10:53:40', 1),
(11, 2, 2, 1, '3-3', 'studio', '2024-01-09', '2024-01-09 10:54:56', 1),
(12, 2, 2, 1, '3-4', 'studio', '2024-01-09', '2024-01-09 10:55:16', 1),
(13, 2, 2, 1, '3-5', 'studio', '2024-01-09', '2024-01-09 10:56:36', 1),
(14, 2, 2, 1, '3-6', 'studio', '2024-01-09', '2024-01-09 10:56:59', 1),
(15, 2, 2, 1, '3-7', 'studio', '2024-01-09', '2024-01-09 10:57:30', 1),
(16, 2, 2, 1, '3-8', 'studio', '2024-01-09', '2024-01-09 10:57:55', 1),
(17, 2, 2, 1, '3-9', 'studio', '2024-01-09', '2024-01-09 10:58:15', 1),
(18, 2, 2, 1, '3-10', 'studio', '2024-01-09', '2024-01-09 10:58:32', 1),
(19, 2, 2, 1, '3-11', 'studio', '2024-01-09', '2024-01-09 10:58:46', 1),
(20, 2, 2, 1, '3-12', 'studio', '2024-01-09', '2024-01-09 11:01:05', 1);
-- --------------------------------------------------------
-- Table `property_contracts`

CREATE TABLE `property_contracts` (
  `id` mediumint(8) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `property` smallint(5) UNSIGNED NOT NULL,
  `value` int(10) UNSIGNED NOT NULL,
  `due_date` tinyint(2) UNSIGNED NOT NULL DEFAULT 15,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `created` date NOT NULL,
  FOREIGN KEY (`property`) REFERENCES properties (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `property_contracts` (`id`, `property`, `value`, `due_date`, `start_date`, `end_date`, `updated`, `created`) VALUES
(1, 1, 15000, 15, '2024-01-01', '2024-12-31', '2024-01-09 18:03:19', '2024-01-09'),
(2, 2, 13000, 15, '2024-01-01', '2024-12-31', '2024-01-09 18:04:10', '2024-01-09'),
(3, 3, 9500, 1, '2024-01-01', '2024-12-31', '2024-01-09 18:04:49', '2024-01-09'),
(4, 4, 9000, 15, '2024-01-01', '2024-12-31', '2024-01-09 18:05:09', '2024-01-09'),
(5, 5, 9000, 1, '2024-01-01', '2024-12-31', '2024-01-09 18:05:30', '2024-01-09'),
(6, 6, 9500, 1, '2024-01-01', '2024-12-31', '2024-01-09 18:05:52', '2024-01-09'),
(7, 7, 9000, 1, '2024-01-01', '2024-12-31', '2024-01-09 18:06:14', '2024-01-09'),
(8, 9, 12500, 1, '2024-01-01', '2024-12-31', '2024-01-09 18:06:57', '2024-01-09'),
(9, 10, 11000, 15, '2024-01-01', '2024-12-31', '2024-01-09 18:07:20', '2024-01-09');

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


-- --------------------------------------------------------
-- Table `contracts_folders`

CREATE TABLE `contracts_folders` (
  `name` varchar(36) NOT NULL PRIMARY KEY,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `created` date NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------
-- Table `files`
CREATE TABLE `files` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `folder` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(10) NOT NULL,
  `size` mediumint(8) UNSIGNED NOT NULL DEFAULT 0,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`folder`) REFERENCES contracts_folders (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------
-- Table `payments_types`

CREATE TABLE `payments_types` (
  `id` tinyint(3) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `payments_types` (`id`, `label`) VALUES
(1, 'Renta'),
(2, 'Otros');

-- Table structure for table `contracts_payments`
--

CREATE TABLE `contracts_payments` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `amount` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `clarifications` varchar(150) NOT NULL,
  `created` date NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`),
  FOREIGN KEY (`type`) REFERENCES payments_types (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;