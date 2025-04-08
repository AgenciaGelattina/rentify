-- DESARROLLO V 1.2.0

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
(2, 'Carlos Roberto', 'Baglieri', 'robertob@gelattina.com', '$2y$10$EAa0aT99g8rv/LXNms837uD9iL7XpkHJFke1UgCgEnhTwv0/gAmB6', 3, 1, '2024-06-17', '2024-06-17 20:13:30');

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
(1, ''),
(2, 'Edificio'),
(3, 'Mixto'),
(4, 'Comercial'),
(5, 'Oficina'),
(6, 'Casa aislada'),
(7, 'Departamento Aislado');

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
(1, 1, '', '', '', 0);

-- --------------------------------------------------------
-- Table `properties`

CREATE TABLE `properties` (
  `id` smallint(5) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `status` tinyint(3) UNSIGNED NOT NULL,
  `group` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `title` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  FOREIGN KEY (`type`) REFERENCES properties_types (`id`),
  FOREIGN KEY (`status`) REFERENCES properties_status (`id`),
  FOREIGN KEY (`group`) REFERENCES properties_groups (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------
-- Table `property_contracts`

CREATE TABLE `property_contracts` (
  `id` mediumint(8) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `property` smallint(5) UNSIGNED NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT "express",
  `due_date` tinyint(2) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `in_date` date NOT NULL,
  `out_date` date NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT "mxn",
  `canceled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `finalized` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (`property`) REFERENCES properties (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  `created` date NOT NULL,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------
-- Table `contracts_folders_files`
CREATE TABLE `contracts_folders_files` (
  `id` varchar(36) NOT NULL PRIMARY KEY,
  `folder` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(10) NOT NULL,
  `size` mediumint(8) UNSIGNED NOT NULL DEFAULT 0,
  `created` date NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`folder`) REFERENCES contracts_folders (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Table structure for table `contracts_express_charges`
--
CREATE TABLE `contracts_express_charges` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `label` varchar(80) NOT NULL,
  `value` int(10) UNSIGNED NOT NULL,
  `canceled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Table structure for table `contracts_recurring_charges`
--
CREATE TABLE `contracts_recurring_charges` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `label` varchar(80) NOT NULL,
  `value` int(10) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `canceled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Table structure for table `contracts_payments`
--

CREATE TABLE `contracts_payments` (
  `id` int(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `contract` mediumint(8) UNSIGNED NOT NULL,
  `recurring` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `express` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `amount` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `clarifications` varchar(150) NOT NULL,
  `confirmed` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  FOREIGN KEY (`contract`) REFERENCES property_contracts (`id`),
  KEY (`recurring`),
  KEY (`express`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;