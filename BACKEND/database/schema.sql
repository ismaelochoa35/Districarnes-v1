-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: districarnes
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,'Administrador principal','administrador@districarnes.local','f125ffff0f05bf7483ec556ca92a1482d00b26b825b12e166aca902585be683e',1,'2026-08-31 23:51:56'),(2,'María Gómez','maria.gomez@districarnes.local','80f0ba29e909a928784db26475341a13c968335e56f9f942bd38159e1a988c85',1,'2026-08-31 23:51:56'),(3,'Carlos Ruiz','carlos.ruiz@districarnes.local','d942192b4d18ccc3d97e7e87106f2229c17ee223fc8a51c14f5ece34cbb52cf7',1,'2026-08-31 23:51:56'),(4,'Laura Pérez','laura.perez@districarnes.local','6ca6c99f6f73852b7476b5b1aef94c3b7b97dc923eabe6f2bb71c484a96bfbdc',1,'2026-08-31 23:51:56'),(5,'Andrés Torres','andres.torres@districarnes.local','a8f8e086d09c67e5a440522fb2a32a7b17be73563476dc3cc2d8a09338e85bea',1,'2026-08-31 23:51:56');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria_productos`
--

DROP TABLE IF EXISTS `auditoria_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_productos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` int(10) unsigned NOT NULL,
  `accion` enum('ACTUALIZACION','ELIMINACION') NOT NULL,
  `nombre_anterior` varchar(100) DEFAULT NULL,
  `precio_anterior` decimal(10,2) DEFAULT NULL,
  `precio_nuevo` decimal(10,2) DEFAULT NULL,
  `stock_anterior` decimal(10,3) DEFAULT NULL,
  `stock_nuevo` decimal(10,3) DEFAULT NULL,
  `usuario_bd` varchar(128) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_productos`
--

LOCK TABLES `auditoria_productos` WRITE;
/*!40000 ALTER TABLE `auditoria_productos` DISABLE KEYS */;
INSERT INTO `auditoria_productos` VALUES (1,182,'ACTUALIZACION','Atún Fresco - porción 1 kg',51000.00,51000.00,18.000,17.700,'root@localhost','2026-08-31 23:55:45'),(2,203,'ACTUALIZACION','Bacalao - corte premium',62000.00,62000.00,14.000,13.400,'root@localhost','2026-08-31 23:55:45'),(3,17,'ACTUALIZACION','Bondiola de Cerdo',26000.00,26000.00,20.000,19.600,'root@localhost','2026-08-31 23:55:45'),(4,45,'ACTUALIZACION','Anillos de Calamar',27000.00,27000.00,20.000,19.761,'root@localhost','2026-08-31 23:55:45'),(5,163,'ACTUALIZACION','Alas BBQ - corte premium',31000.00,31000.00,14.000,13.600,'root@localhost','2026-08-31 23:55:45'),(6,87,'ACTUALIZACION','Aguja de Res - corte premium',37000.00,37000.00,14.000,13.600,'root@localhost','2026-08-31 23:55:45'),(7,57,'ACTUALIZACION','Bofe de Res',8000.00,8000.00,20.000,18.500,'root@localhost','2026-08-31 23:55:45'),(8,57,'ACTUALIZACION','Bofe de Res',8000.00,8000.00,18.500,18.400,'root@localhost','2026-08-31 23:59:23'),(9,242,'ACTUALIZACION','Chunchullo de Res - porción 1 kg',26000.00,26000.00,18.000,17.050,'root@localhost','2026-08-31 23:59:23'),(10,230,'ACTUALIZACION','Corazón de Cerdo - porción 1 kg',20500.00,20500.00,18.000,17.140,'root@localhost','2026-08-31 23:59:23'),(11,162,'ACTUALIZACION','Alas BBQ - porción 1 kg',26000.00,26000.00,18.000,17.500,'root@localhost','2026-08-31 23:59:23'),(12,161,'ACTUALIZACION','Alas BBQ - porción 500 g',17000.00,17000.00,24.000,23.200,'root@localhost','2026-09-01 00:00:31'),(13,87,'ACTUALIZACION','Aguja de Res - corte premium',37000.00,37000.00,13.600,6.600,'root@localhost','2026-09-01 00:01:47'),(14,20,'ACTUALIZACION','Brazo de Cerdo',17000.00,17000.00,35.000,34.500,'root@localhost','2026-09-01 00:33:48'),(15,105,'ACTUALIZACION','Cabeza de Lomo - porción 500 g',23000.00,23000.00,24.000,23.500,'root@localhost','2026-09-01 00:33:48'),(16,87,'ACTUALIZACION','Aguja de Res - corte premium',37000.00,37000.00,6.600,6.100,'root@localhost','2026-09-01 00:36:16'),(17,86,'ACTUALIZACION','Aguja de Res - porción 1 kg',32000.00,32000.00,18.000,17.500,'root@localhost','2026-09-01 00:36:16'),(18,45,'ACTUALIZACION','Anillos de Calamar',27000.00,27000.00,19.761,18.961,'root@localhost','2026-09-01 00:36:16'),(19,163,'ACTUALIZACION','Alas BBQ - corte premium',31000.00,31000.00,13.600,12.850,'root@localhost','2026-09-01 00:36:16'),(20,20,'ACTUALIZACION','Brazo de Cerdo',17000.00,17000.00,34.500,34.000,'root@localhost','2026-09-01 00:39:15'),(21,107,'ACTUALIZACION','Cabeza de Lomo - corte premium',37000.00,37000.00,14.000,13.600,'root@localhost','2026-09-01 00:39:15'),(22,183,'ACTUALIZACION','Atún Fresco - corte premium',56000.00,56000.00,14.000,13.600,'root@localhost','2026-09-01 00:39:15'),(23,182,'ACTUALIZACION','Atún Fresco - porción 1 kg',51000.00,51000.00,17.700,17.300,'root@localhost','2026-09-01 00:39:15'),(24,28,'ACTUALIZACION','Alitas de Pollo',15000.00,15000.00,50.000,49.600,'root@localhost','2026-09-01 00:39:15'),(25,37,'ACTUALIZACION','Carne Molida de Pollo',16500.00,16500.00,25.000,24.600,'root@localhost','2026-09-01 00:39:15'),(26,88,'ACTUALIZACION','Aguja de Res - porción familiar',42000.00,42000.00,20.000,19.600,'root@localhost','2026-09-01 00:39:15'),(27,64,'ACTUALIZACION','Bife Ancho - porción familiar',52000.00,52000.00,20.000,19.600,'root@localhost','2026-09-01 00:39:15'),(28,243,'ACTUALIZACION','Chunchullo de Res - corte premium',31000.00,31000.00,14.000,13.600,'root@localhost','2026-09-01 00:39:15'),(29,242,'ACTUALIZACION','Chunchullo de Res - porción 1 kg',26000.00,26000.00,17.050,16.650,'root@localhost','2026-09-01 00:39:15'),(30,64,'ACTUALIZACION','Bife Ancho - porción familiar',52000.00,52000.00,19.600,19.100,'root@localhost','2026-09-01 18:44:44'),(31,8,'ACTUALIZACION','Sobrebarriga',24000.00,24000.00,15.000,14.500,'root@localhost','2026-09-01 18:47:40');
/*!40000 ALTER TABLE `auditoria_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Res','2026-08-31 23:51:56'),(2,'Cerdo','2026-08-31 23:51:56'),(3,'Pollo','2026-08-31 23:51:56'),(4,'Pescado','2026-08-31 23:51:56'),(5,'Vísceras','2026-08-31 23:51:56');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_venta`
--

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_venta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `venta_id` int(10) unsigned NOT NULL,
  `producto_id` int(10) unsigned NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED,
  PRIMARY KEY (`id`),
  KEY `fk_detalle_venta` (`venta_id`),
  KEY `fk_detalle_producto` (`producto_id`),
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_venta`
--

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
INSERT INTO `detalle_venta` (`id`, `venta_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES (1,1,182,0.300,51000.00),(2,1,203,0.600,62000.00),(3,1,17,0.400,26000.00),(4,1,45,0.239,27000.00),(5,1,163,0.400,31000.00),(6,1,87,0.400,37000.00),(7,1,57,1.500,8000.00),(8,2,57,0.100,8000.00),(9,2,242,0.950,26000.00),(10,2,230,0.860,20500.00),(11,2,162,0.500,26000.00),(12,3,161,0.800,17000.00),(13,4,87,7.000,37000.00),(14,5,20,0.500,17000.00),(15,5,105,0.500,23000.00),(16,6,87,0.500,37000.00),(17,6,86,0.500,32000.00),(18,6,45,0.800,27000.00),(19,6,163,0.750,31000.00),(20,7,20,0.500,17000.00),(21,7,107,0.400,37000.00),(22,7,183,0.400,56000.00),(23,7,182,0.400,51000.00),(24,7,28,0.400,15000.00),(25,7,37,0.400,16500.00),(26,7,88,0.400,42000.00),(27,7,64,0.400,52000.00),(28,7,243,0.400,31000.00),(29,7,242,0.400,26000.00),(30,8,64,0.500,52000.00),(31,9,8,0.500,24000.00);
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('pago','devolucion','cancelacion','actualizacion') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `venta_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_movimiento_venta` (`venta_id`),
  CONSTRAINT `fk_movimiento_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (1,'pago',108553.00,'2026-08-31 23:55:45',1),(2,'pago',56130.00,'2026-08-31 23:59:23',2),(3,'pago',13600.00,'2026-09-01 00:00:31',3),(4,'pago',259000.00,'2026-09-01 00:01:47',4),(5,'pago',20000.00,'2026-09-01 00:33:48',5),(6,'pago',79350.00,'2026-09-01 00:36:16',6),(7,'pago',139100.00,'2026-09-01 00:39:15',7),(8,'pago',26000.00,'2026-09-01 18:44:44',8),(9,'pago',12000.00,'2026-09-01 18:47:40',9);
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo_corte` varchar(100) DEFAULT NULL,
  `categoria_id` int(10) unsigned NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `unidad_medida` enum('kg','lb','unidad') NOT NULL DEFAULT 'kg',
  `precio` decimal(10,2) NOT NULL,
  `stock` decimal(10,3) NOT NULL DEFAULT 0.000,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_producto_categoria` (`categoria_id`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Punta de Anca','Filete',1,NULL,'kg',38000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(2,'Lomo Fino','Medallón',1,NULL,'kg',45000.00,10.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(3,'Carne Molida de Res','Molida',1,NULL,'kg',18000.00,25.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(4,'Chatas de Res','Bife',1,NULL,'kg',34000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(5,'Costilla de Res','Tira',1,NULL,'kg',22000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(6,'Muchacho de Res','Corte entero',1,NULL,'kg',28000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(7,'Bola de Pierna','Filete',1,NULL,'kg',26000.00,35.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(8,'Sobrebarriga','Corte entero',1,NULL,'kg',24000.00,14.500,1,'2026-08-31 23:51:56','2026-09-01 18:47:40'),(9,'Falda de Res','Desmechada',1,NULL,'kg',21000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(10,'Hígado de Res','Víscera',5,NULL,'kg',12000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(11,'Lengua de Res','Entera',5,NULL,'kg',32000.00,8.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(12,'Cola de Res','Troceada',1,NULL,'kg',19000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(13,'Costilla de Cerdo','Costilla',2,NULL,'kg',35000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(14,'Panceta','Bloque',2,NULL,'kg',22000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(15,'Chuleta de Cerdo','Con hueso',2,NULL,'kg',21000.00,28.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(16,'Cañón de Cerdo','Filete',2,NULL,'kg',24000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(17,'Bondiola de Cerdo','Corte entero',2,NULL,'kg',26000.00,19.600,1,'2026-08-31 23:51:56','2026-08-31 23:55:45'),(18,'Tocino Barriguero','Tiras',2,NULL,'kg',19500.00,50.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(19,'Pierna de Cerdo','Corte entero',2,NULL,'kg',18500.00,40.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(20,'Brazo de Cerdo','Cubos',2,NULL,'kg',17000.00,34.000,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(21,'Carne Molida de Cerdo','Molida',2,NULL,'kg',16000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(22,'Solomillo de Cerdo','Filete',2,NULL,'kg',29000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(23,'Chicharrón','Troceado',2,NULL,'kg',25000.00,25.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(24,'Codillo de Cerdo','Con hueso',2,NULL,'kg',18000.00,12.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(25,'Chorizo de Cerdo','Embutido',2,NULL,'kg',15000.00,60.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(26,'Pechuga de Pollo','Filete',3,NULL,'kg',18000.00,40.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(27,'Muslos de Pollo','Presa',3,NULL,'kg',12000.00,35.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(28,'Alitas de Pollo','Entera',3,NULL,'kg',15000.00,49.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(29,'Contramuslos de Pollo','Presa',3,NULL,'kg',13000.00,45.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(30,'Pollo Entero','Entero',3,NULL,'kg',22000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(31,'Menudencias de Pollo','Vísceras',5,NULL,'kg',4500.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(32,'Filete de Pechuga','Filete delgado',3,NULL,'kg',19500.00,40.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(33,'Pechuga con Hueso','Corte entero',3,NULL,'kg',15000.00,35.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(34,'Pierna Pernil','Presa',3,NULL,'kg',11500.00,55.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(35,'Mollejas de Pollo','Víscera',5,NULL,'kg',7000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(36,'Corazones de Pollo','Víscera',5,NULL,'kg',8500.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(37,'Carne Molida de Pollo','Molida',3,NULL,'kg',16500.00,24.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(38,'Chorizo de Pollo','Embutido',3,NULL,'kg',15000.00,35.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(39,'Filete de Tilapia','Filete',4,NULL,'kg',24000.00,12.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(40,'Salmón','Filete con piel',4,NULL,'kg',65000.00,8.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(41,'Trucha','Entera',4,NULL,'kg',28000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(42,'Filete de Merluza','Filete',4,NULL,'kg',22000.00,25.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(43,'Róbalo','Filete',4,NULL,'kg',39000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(44,'Camarón Limpio','Sin cáscara',4,NULL,'kg',45000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(45,'Anillos de Calamar','Rodajas',4,NULL,'kg',27000.00,18.961,1,'2026-08-31 23:51:56','2026-09-01 00:36:16'),(46,'Bagre','Rodajas',4,NULL,'kg',25000.00,30.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(47,'Filete de Basa','Filete',4,NULL,'kg',15000.00,45.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(48,'Sierra','Posta',4,NULL,'kg',21000.00,25.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(49,'Mojarra Roja','Entera',4,NULL,'kg',17500.00,50.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(50,'Filete de Corvina','Filete',4,NULL,'kg',34000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(51,'Langostinos','Con cáscara',4,NULL,'kg',62000.00,15.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(52,'Filete de Dorado','Filete',4,NULL,'kg',31000.00,22.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(53,'Riñón de Res','Víscera limpia',5,NULL,'kg',11000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(54,'Corazón de Res','Víscera limpia',5,NULL,'kg',13500.00,16.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(55,'Mondongo','Callo limpio',5,NULL,'kg',14500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(56,'Librillo de Res','Callo limpio',5,NULL,'kg',15000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(57,'Bofe de Res','Víscera limpia',5,NULL,'kg',8000.00,18.400,1,'2026-08-31 23:51:56','2026-08-31 23:59:23'),(58,'Ubre de Res','Víscera limpia',5,NULL,'kg',9500.00,12.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(59,'Sesos de Res','Víscera limpia',5,NULL,'kg',12500.00,10.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(60,'Criadillas de Res','Víscera limpia',5,NULL,'kg',18000.00,8.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(61,'Bife Ancho - porción 500 g','Filete',1,NULL,'kg',33000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(62,'Bife Ancho - porción 1 kg','Filete',1,NULL,'kg',42000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(63,'Bife Ancho - corte premium','Filete',1,NULL,'kg',47000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(64,'Bife Ancho - porción familiar','Filete',1,NULL,'kg',52000.00,19.100,1,'2026-08-31 23:51:56','2026-09-01 18:44:44'),(65,'Bife Angosto - porción 500 g','Filete',1,NULL,'kg',32000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(66,'Bife Angosto - porción 1 kg','Filete',1,NULL,'kg',41000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(67,'Bife Angosto - corte premium','Filete',1,NULL,'kg',46000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(68,'Bife Angosto - porción familiar','Filete',1,NULL,'kg',51000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(69,'Entraña de Res - porción 500 g','Tira',1,NULL,'kg',30000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(70,'Entraña de Res - porción 1 kg','Tira',1,NULL,'kg',39000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(71,'Entraña de Res - corte premium','Tira',1,NULL,'kg',44000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(72,'Entraña de Res - porción familiar','Tira',1,NULL,'kg',49000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(73,'Tapa de Cuadril - porción 500 g','Corte entero',1,NULL,'kg',29000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(74,'Tapa de Cuadril - porción 1 kg','Corte entero',1,NULL,'kg',38000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(75,'Tapa de Cuadril - corte premium','Corte entero',1,NULL,'kg',43000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(76,'Tapa de Cuadril - porción familiar','Corte entero',1,NULL,'kg',48000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(77,'Ossobuco de Res - porción 500 g','Rodaja con hueso',1,NULL,'kg',21000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(78,'Ossobuco de Res - porción 1 kg','Rodaja con hueso',1,NULL,'kg',30000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(79,'Ossobuco de Res - corte premium','Rodaja con hueso',1,NULL,'kg',35000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(80,'Ossobuco de Res - porción familiar','Rodaja con hueso',1,NULL,'kg',40000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(81,'Pecho de Res - porción 500 g','Corte entero',1,NULL,'kg',20000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(82,'Pecho de Res - porción 1 kg','Corte entero',1,NULL,'kg',29000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(83,'Pecho de Res - corte premium','Corte entero',1,NULL,'kg',34000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(84,'Pecho de Res - porción familiar','Corte entero',1,NULL,'kg',39000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(85,'Aguja de Res - porción 500 g','Filete',1,NULL,'kg',23000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(86,'Aguja de Res - porción 1 kg','Filete',1,NULL,'kg',32000.00,17.500,1,'2026-08-31 23:51:56','2026-09-01 00:36:16'),(87,'Aguja de Res - corte premium','Filete',1,NULL,'kg',37000.00,6.100,1,'2026-08-31 23:51:56','2026-09-01 00:36:16'),(88,'Aguja de Res - porción familiar','Filete',1,NULL,'kg',42000.00,19.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(89,'Paletero de Res - porción 500 g','Corte entero',1,NULL,'kg',25000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(90,'Paletero de Res - porción 1 kg','Corte entero',1,NULL,'kg',34000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(91,'Paletero de Res - corte premium','Corte entero',1,NULL,'kg',39000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(92,'Paletero de Res - porción familiar','Corte entero',1,NULL,'kg',44000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(93,'Solomo Redondo - porción 500 g','Filete',1,NULL,'kg',31000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(94,'Solomo Redondo - porción 1 kg','Filete',1,NULL,'kg',40000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(95,'Solomo Redondo - corte premium','Filete',1,NULL,'kg',45000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(96,'Solomo Redondo - porción familiar','Filete',1,NULL,'kg',50000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(97,'Solomo Extranjero - porción 500 g','Filete',1,NULL,'kg',35000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(98,'Solomo Extranjero - porción 1 kg','Filete',1,NULL,'kg',44000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(99,'Solomo Extranjero - corte premium','Filete',1,NULL,'kg',49000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(100,'Solomo Extranjero - porción familiar','Filete',1,NULL,'kg',54000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(101,'Lomo de Cerdo - porción 500 g','Filete',2,NULL,'kg',24000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(102,'Lomo de Cerdo - porción 1 kg','Filete',2,NULL,'kg',33000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(103,'Lomo de Cerdo - corte premium','Filete',2,NULL,'kg',38000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(104,'Lomo de Cerdo - porción familiar','Filete',2,NULL,'kg',43000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(105,'Cabeza de Lomo - porción 500 g','Corte entero',2,NULL,'kg',23000.00,23.500,1,'2026-08-31 23:51:56','2026-09-01 00:33:48'),(106,'Cabeza de Lomo - porción 1 kg','Corte entero',2,NULL,'kg',32000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(107,'Cabeza de Lomo - corte premium','Corte entero',2,NULL,'kg',37000.00,13.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(108,'Cabeza de Lomo - porción familiar','Corte entero',2,NULL,'kg',42000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(109,'Costilla St. Louis - porción 500 g','Costilla',2,NULL,'kg',31000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(110,'Costilla St. Louis - porción 1 kg','Costilla',2,NULL,'kg',40000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(111,'Costilla St. Louis - corte premium','Costilla',2,NULL,'kg',45000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(112,'Costilla St. Louis - porción familiar','Costilla',2,NULL,'kg',50000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(113,'Costilla Baby Back - porción 500 g','Costilla',2,NULL,'kg',34000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(114,'Costilla Baby Back - porción 1 kg','Costilla',2,NULL,'kg',43000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(115,'Costilla Baby Back - corte premium','Costilla',2,NULL,'kg',48000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(116,'Costilla Baby Back - porción familiar','Costilla',2,NULL,'kg',53000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(117,'Secreto de Cerdo - porción 500 g','Filete',2,NULL,'kg',29000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(118,'Secreto de Cerdo - porción 1 kg','Filete',2,NULL,'kg',38000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(119,'Secreto de Cerdo - corte premium','Filete',2,NULL,'kg',43000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(120,'Secreto de Cerdo - porción familiar','Filete',2,NULL,'kg',48000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(121,'Presa de Cerdo - porción 500 g','Filete',2,NULL,'kg',27000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(122,'Presa de Cerdo - porción 1 kg','Filete',2,NULL,'kg',36000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(123,'Presa de Cerdo - corte premium','Filete',2,NULL,'kg',41000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(124,'Presa de Cerdo - porción familiar','Filete',2,NULL,'kg',46000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(125,'Lagarto de Cerdo - porción 500 g','Tiras',2,NULL,'kg',21000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(126,'Lagarto de Cerdo - porción 1 kg','Tiras',2,NULL,'kg',30000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(127,'Lagarto de Cerdo - corte premium','Tiras',2,NULL,'kg',35000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(128,'Lagarto de Cerdo - porción familiar','Tiras',2,NULL,'kg',40000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(129,'Papada de Cerdo - porción 500 g','Bloque',2,NULL,'kg',18000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(130,'Papada de Cerdo - porción 1 kg','Bloque',2,NULL,'kg',27000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(131,'Papada de Cerdo - corte premium','Bloque',2,NULL,'kg',32000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(132,'Papada de Cerdo - porción familiar','Bloque',2,NULL,'kg',37000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(133,'Manitas de Cerdo - porción 500 g','Con hueso',2,NULL,'kg',12000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(134,'Manitas de Cerdo - porción 1 kg','Con hueso',2,NULL,'kg',21000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(135,'Manitas de Cerdo - corte premium','Con hueso',2,NULL,'kg',26000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(136,'Manitas de Cerdo - porción familiar','Con hueso',2,NULL,'kg',31000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(137,'Espaldilla de Cerdo - porción 500 g','Corte entero',2,NULL,'kg',22000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(138,'Espaldilla de Cerdo - porción 1 kg','Corte entero',2,NULL,'kg',31000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(139,'Espaldilla de Cerdo - corte premium','Corte entero',2,NULL,'kg',36000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(140,'Espaldilla de Cerdo - porción familiar','Corte entero',2,NULL,'kg',41000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(141,'Suprema de Pollo - porción 500 g','Filete',3,NULL,'kg',19000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(142,'Suprema de Pollo - porción 1 kg','Filete',3,NULL,'kg',28000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(143,'Suprema de Pollo - corte premium','Filete',3,NULL,'kg',33000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(144,'Suprema de Pollo - porción familiar','Filete',3,NULL,'kg',38000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(145,'Pernil de Pollo - porción 500 g','Presa',3,NULL,'kg',13000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(146,'Pernil de Pollo - porción 1 kg','Presa',3,NULL,'kg',22000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(147,'Pernil de Pollo - corte premium','Presa',3,NULL,'kg',27000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(148,'Pernil de Pollo - porción familiar','Presa',3,NULL,'kg',32000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(149,'Colombina de Pollo - porción 500 g','Presa',3,NULL,'kg',12500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(150,'Colombina de Pollo - porción 1 kg','Presa',3,NULL,'kg',21500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(151,'Colombina de Pollo - corte premium','Presa',3,NULL,'kg',26500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(152,'Colombina de Pollo - porción familiar','Presa',3,NULL,'kg',31500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(153,'Cuarto Trasero - porción 500 g','Presa',3,NULL,'kg',14000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(154,'Cuarto Trasero - porción 1 kg','Presa',3,NULL,'kg',23000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(155,'Cuarto Trasero - corte premium','Presa',3,NULL,'kg',28000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(156,'Cuarto Trasero - porción familiar','Presa',3,NULL,'kg',33000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(157,'Cuarto Delantero - porción 500 g','Presa',3,NULL,'kg',13500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(158,'Cuarto Delantero - porción 1 kg','Presa',3,NULL,'kg',22500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(159,'Cuarto Delantero - corte premium','Presa',3,NULL,'kg',27500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(160,'Cuarto Delantero - porción familiar','Presa',3,NULL,'kg',32500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(161,'Alas BBQ - porción 500 g','Alitas',3,NULL,'kg',17000.00,23.200,1,'2026-08-31 23:51:56','2026-09-01 00:00:31'),(162,'Alas BBQ - porción 1 kg','Alitas',3,NULL,'kg',26000.00,17.500,1,'2026-08-31 23:51:56','2026-08-31 23:59:23'),(163,'Alas BBQ - corte premium','Alitas',3,NULL,'kg',31000.00,12.850,1,'2026-08-31 23:51:56','2026-09-01 00:36:16'),(164,'Alas BBQ - porción familiar','Alitas',3,NULL,'kg',36000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(165,'Pechuga Mariposa - porción 500 g','Filete',3,NULL,'kg',20500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(166,'Pechuga Mariposa - porción 1 kg','Filete',3,NULL,'kg',29500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(167,'Pechuga Mariposa - corte premium','Filete',3,NULL,'kg',34500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(168,'Pechuga Mariposa - porción familiar','Filete',3,NULL,'kg',39500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(169,'Filete Tender - porción 500 g','Tiras',3,NULL,'kg',21500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(170,'Filete Tender - porción 1 kg','Tiras',3,NULL,'kg',30500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(171,'Filete Tender - corte premium','Tiras',3,NULL,'kg',35500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(172,'Filete Tender - porción familiar','Tiras',3,NULL,'kg',40500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(173,'Filete de Contramuslo - porción 500 g','Filete',3,NULL,'kg',16500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(174,'Filete de Contramuslo - porción 1 kg','Filete',3,NULL,'kg',25500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(175,'Filete de Contramuslo - corte premium','Filete',3,NULL,'kg',30500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(176,'Filete de Contramuslo - porción familiar','Filete',3,NULL,'kg',35500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(177,'Cuellos de Pollo - porción 500 g','Presa',3,NULL,'kg',5500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(178,'Cuellos de Pollo - porción 1 kg','Presa',3,NULL,'kg',14500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(179,'Cuellos de Pollo - corte premium','Presa',3,NULL,'kg',19500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(180,'Cuellos de Pollo - porción familiar','Presa',3,NULL,'kg',24500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(181,'Atún Fresco - porción 500 g','Filete',4,NULL,'kg',42000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(182,'Atún Fresco - porción 1 kg','Filete',4,NULL,'kg',51000.00,17.300,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(183,'Atún Fresco - corte premium','Filete',4,NULL,'kg',56000.00,13.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(184,'Atún Fresco - porción familiar','Filete',4,NULL,'kg',61000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(185,'Corvina - porción 500 g','Filete',4,NULL,'kg',35000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(186,'Corvina - porción 1 kg','Filete',4,NULL,'kg',44000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(187,'Corvina - corte premium','Filete',4,NULL,'kg',49000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(188,'Corvina - porción familiar','Filete',4,NULL,'kg',54000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(189,'Pargo Rojo - porción 500 g','Entero',4,NULL,'kg',33000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(190,'Pargo Rojo - porción 1 kg','Entero',4,NULL,'kg',42000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(191,'Pargo Rojo - corte premium','Entero',4,NULL,'kg',47000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(192,'Pargo Rojo - porción familiar','Entero',4,NULL,'kg',52000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(193,'Mero - porción 500 g','Filete',4,NULL,'kg',44000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(194,'Mero - porción 1 kg','Filete',4,NULL,'kg',53000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(195,'Mero - corte premium','Filete',4,NULL,'kg',58000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(196,'Mero - porción familiar','Filete',4,NULL,'kg',63000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(197,'Lenguado - porción 500 g','Filete',4,NULL,'kg',36000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(198,'Lenguado - porción 1 kg','Filete',4,NULL,'kg',45000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(199,'Lenguado - corte premium','Filete',4,NULL,'kg',50000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(200,'Lenguado - porción familiar','Filete',4,NULL,'kg',55000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(201,'Bacalao - porción 500 g','Lomo',4,NULL,'kg',48000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(202,'Bacalao - porción 1 kg','Lomo',4,NULL,'kg',57000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(203,'Bacalao - corte premium','Lomo',4,NULL,'kg',62000.00,13.400,1,'2026-08-31 23:51:56','2026-08-31 23:55:45'),(204,'Bacalao - porción familiar','Lomo',4,NULL,'kg',67000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(205,'Pulpo - porción 500 g','Tentáculos',4,NULL,'kg',52000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(206,'Pulpo - porción 1 kg','Tentáculos',4,NULL,'kg',61000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(207,'Pulpo - corte premium','Tentáculos',4,NULL,'kg',66000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(208,'Pulpo - porción familiar','Tentáculos',4,NULL,'kg',71000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(209,'Calamar Entero - porción 500 g','Entero',4,NULL,'kg',29000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(210,'Calamar Entero - porción 1 kg','Entero',4,NULL,'kg',38000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(211,'Calamar Entero - corte premium','Entero',4,NULL,'kg',43000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(212,'Calamar Entero - porción familiar','Entero',4,NULL,'kg',48000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(213,'Mejillones - porción 500 g','Con concha',4,NULL,'kg',26000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(214,'Mejillones - porción 1 kg','Con concha',4,NULL,'kg',35000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(215,'Mejillones - corte premium','Con concha',4,NULL,'kg',40000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(216,'Mejillones - porción familiar','Con concha',4,NULL,'kg',45000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(217,'Vieiras - porción 500 g','Limpias',4,NULL,'kg',58000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(218,'Vieiras - porción 1 kg','Limpias',4,NULL,'kg',67000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(219,'Vieiras - corte premium','Limpias',4,NULL,'kg',72000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(220,'Vieiras - porción familiar','Limpias',4,NULL,'kg',77000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(221,'Hígado de Cerdo - porción 500 g','Víscera limpia',5,NULL,'kg',9000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(222,'Hígado de Cerdo - porción 1 kg','Víscera limpia',5,NULL,'kg',18000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(223,'Hígado de Cerdo - corte premium','Víscera limpia',5,NULL,'kg',23000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(224,'Hígado de Cerdo - porción familiar','Víscera limpia',5,NULL,'kg',28000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(225,'Riñón de Cerdo - porción 500 g','Víscera limpia',5,NULL,'kg',10500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(226,'Riñón de Cerdo - porción 1 kg','Víscera limpia',5,NULL,'kg',19500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(227,'Riñón de Cerdo - corte premium','Víscera limpia',5,NULL,'kg',24500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(228,'Riñón de Cerdo - porción familiar','Víscera limpia',5,NULL,'kg',29500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(229,'Corazón de Cerdo - porción 500 g','Víscera limpia',5,NULL,'kg',11500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(230,'Corazón de Cerdo - porción 1 kg','Víscera limpia',5,NULL,'kg',20500.00,17.140,1,'2026-08-31 23:51:56','2026-08-31 23:59:23'),(231,'Corazón de Cerdo - corte premium','Víscera limpia',5,NULL,'kg',25500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(232,'Corazón de Cerdo - porción familiar','Víscera limpia',5,NULL,'kg',30500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(233,'Lengua de Cerdo - porción 500 g','Víscera limpia',5,NULL,'kg',14500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(234,'Lengua de Cerdo - porción 1 kg','Víscera limpia',5,NULL,'kg',23500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(235,'Lengua de Cerdo - corte premium','Víscera limpia',5,NULL,'kg',28500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(236,'Lengua de Cerdo - porción familiar','Víscera limpia',5,NULL,'kg',33500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(237,'Pajarilla de Res - porción 500 g','Víscera limpia',5,NULL,'kg',9000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(238,'Pajarilla de Res - porción 1 kg','Víscera limpia',5,NULL,'kg',18000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(239,'Pajarilla de Res - corte premium','Víscera limpia',5,NULL,'kg',23000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(240,'Pajarilla de Res - porción familiar','Víscera limpia',5,NULL,'kg',28000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(241,'Chunchullo de Res - porción 500 g','Intestino limpio',5,NULL,'kg',17000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(242,'Chunchullo de Res - porción 1 kg','Intestino limpio',5,NULL,'kg',26000.00,16.650,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(243,'Chunchullo de Res - corte premium','Intestino limpio',5,NULL,'kg',31000.00,13.600,1,'2026-08-31 23:51:56','2026-09-01 00:39:15'),(244,'Chunchullo de Res - porción familiar','Intestino limpio',5,NULL,'kg',36000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(245,'Tripa para Chorizo - porción 500 g','Intestino limpio',5,NULL,'kg',13000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(246,'Tripa para Chorizo - porción 1 kg','Intestino limpio',5,NULL,'kg',22000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(247,'Tripa para Chorizo - corte premium','Intestino limpio',5,NULL,'kg',27000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(248,'Tripa para Chorizo - porción familiar','Intestino limpio',5,NULL,'kg',32000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(249,'Molleja de Res - porción 500 g','Víscera limpia',5,NULL,'kg',15500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(250,'Molleja de Res - porción 1 kg','Víscera limpia',5,NULL,'kg',24500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(251,'Molleja de Res - corte premium','Víscera limpia',5,NULL,'kg',29500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(252,'Molleja de Res - porción familiar','Víscera limpia',5,NULL,'kg',34500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(253,'Intestino de Cerdo - porción 500 g','Intestino limpio',5,NULL,'kg',12000.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(254,'Intestino de Cerdo - porción 1 kg','Intestino limpio',5,NULL,'kg',21000.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(255,'Intestino de Cerdo - corte premium','Intestino limpio',5,NULL,'kg',26000.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(256,'Intestino de Cerdo - porción familiar','Intestino limpio',5,NULL,'kg',31000.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(257,'Pulmón de Cerdo - porción 500 g','Víscera limpia',5,NULL,'kg',8500.00,24.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(258,'Pulmón de Cerdo - porción 1 kg','Víscera limpia',5,NULL,'kg',17500.00,18.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(259,'Pulmón de Cerdo - corte premium','Víscera limpia',5,NULL,'kg',22500.00,14.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(260,'Pulmón de Cerdo - porción familiar','Víscera limpia',5,NULL,'kg',27500.00,20.000,1,'2026-08-31 23:51:56','2026-08-31 23:51:56'),(316,'prueba','prueba',2,NULL,'kg',13000.00,30.000,1,'2026-09-01 00:07:53','2026-09-01 00:07:53');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `administrador_id` int(10) unsigned DEFAULT NULL,
  `cliente_nombre` varchar(100) NOT NULL DEFAULT 'Consumidor final',
  `metodo_pago` enum('efectivo','tarjeta','transferencia') NOT NULL DEFAULT 'efectivo',
  `monto_recibido` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cambio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` enum('pendiente','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  KEY `fk_venta_administrador` (`administrador_id`),
  CONSTRAINT `fk_venta_administrador` FOREIGN KEY (`administrador_id`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,1,'ismael','tarjeta',108553.00,0.00,'2026-08-31 23:55:45',108553.00,'completada'),(2,1,'Consumidor final','efectivo',57100.00,970.00,'2026-08-31 23:59:23',56130.00,'completada'),(3,1,'ismael','efectivo',15000.00,1400.00,'2026-09-01 00:00:31',13600.00,'completada'),(4,1,'ismael','efectivo',300000.00,41000.00,'2026-09-01 00:01:47',259000.00,'completada'),(5,1,'ismael','efectivo',20000.00,0.00,'2026-09-01 00:33:48',20000.00,'completada'),(6,1,'ismael','tarjeta',79350.00,0.00,'2026-09-01 00:36:16',79350.00,'completada'),(7,1,'Consumidor final','transferencia',139100.00,0.00,'2026-09-01 00:39:15',139100.00,'completada'),(8,1,'ismael','efectivo',29800.00,3800.00,'2026-09-01 18:44:44',26000.00,'completada'),(9,1,'maria','efectivo',15000.00,3000.00,'2026-09-01 18:47:40',12000.00,'completada');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-27 10:52:11
