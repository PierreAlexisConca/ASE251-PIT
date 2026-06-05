USE master;
GO

IF DB_ID('PIT') IS NULL
BEGIN
    CREATE DATABASE PIT;
END
GO

USE PIT;
GO

IF OBJECT_ID('categorias', 'U') IS NULL
BEGIN
    CREATE TABLE categorias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL
    );
END
GO

IF OBJECT_ID('secciones', 'U') IS NULL
BEGIN
    CREATE TABLE secciones (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL,
        descripcion VARCHAR(255) NULL,
        capacidad FLOAT NULL
    );
END
GO

IF OBJECT_ID('productos', 'U') IS NULL
BEGIN
    CREATE TABLE productos (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(50),
        nombre VARCHAR(100),
        detalle VARCHAR(255),
        categoria_id BIGINT NOT NULL,
        stock INT,
        unidad VARCHAR(50),
        seccion_id BIGINT NOT NULL,
        status VARCHAR(50)
    );
END
GO

IF OBJECT_ID('usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE usuarios (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(150),
        rol VARCHAR(50),
        activo BIT DEFAULT 1
    );
END
GO

IF OBJECT_ID('proveedores', 'U') IS NULL
BEGIN
    CREATE TABLE proveedores (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(200) UNIQUE NOT NULL,
        contacto VARCHAR(200),
        telefono VARCHAR(50),
        direccion VARCHAR(300),
        ruc VARCHAR(20),
        email VARCHAR(200)
    );
END
GO

IF OBJECT_ID('lotes', 'U') IS NULL
BEGIN
    CREATE TABLE lotes (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        producto_id BIGINT NOT NULL,
        codigo_lote VARCHAR(100),
        descripcion VARCHAR(255),
        cantidad INT,
        unidad VARCHAR(50),
        fecha_ingreso DATE,
        fecha_vencimiento DATE,
        proveedor VARCHAR(200),
        nota VARCHAR(255),
        estado VARCHAR(50),
        observacion VARCHAR(255)
    );
END
GO

IF OBJECT_ID('movimientos', 'U') IS NULL
BEGIN
    CREATE TABLE movimientos (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        producto_id BIGINT NOT NULL,
        usuario_id BIGINT NULL,
        tipo VARCHAR(20),
        cantidad INT NOT NULL,
        fecha DATETIME2,
        nota VARCHAR(255),
        proveedor VARCHAR(200),
        documento VARCHAR(100),
        unidad VARCHAR(50),
        seccion VARCHAR(100),
        observaciones VARCHAR(500)
    );
END
GO

SET IDENTITY_INSERT categorias ON;
MERGE categorias AS target
USING (VALUES
    (1, 'Granos'),
    (2, 'Insumos'),
    (3, 'Fertilizantes'),
    (4, 'Herramientas'),
    (5, 'Maquinaria Agricola'),
    (6, 'Semillas Certificadas'),
    (7, 'Plaguicidas Organicos'),
    (8, 'Fungicidas Especiales'),
    (9, 'Herbicidas Selectivos'),
    (10, 'Bioestimulantes Foliares'),
    (11, 'Mejoradores de Suelo'),
    (12, 'Equipos de Riego')
) AS source (id, nombre)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET nombre = source.nombre
WHEN NOT MATCHED THEN
    INSERT (id, nombre) VALUES (source.id, source.nombre);
SET IDENTITY_INSERT categorias OFF;
GO

SET IDENTITY_INSERT secciones ON;
MERGE secciones AS target
USING (VALUES
    (1, 'A', 'Seccion A', 1200),
    (2, 'B', 'Seccion B', 950),
    (3, 'C', 'Seccion C', 700),
    (4, 'D', 'Seccion D', 500),
    (5, 'E', 'Seccion E', 400),
    (6, 'F', 'Seccion F', 350),
    (7, 'G', 'Seccion G', 300),
    (8, 'H', 'Seccion H', 250),
    (9, 'I', 'Seccion I', 200),
    (10, 'J', 'Seccion J', 150),
    (11, 'K', 'Seccion K', 100),
    (12, 'L', 'Seccion L', 80)
) AS source (id, nombre, descripcion, capacidad)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET nombre = source.nombre, descripcion = source.descripcion, capacidad = source.capacidad
WHEN NOT MATCHED THEN
    INSERT (id, nombre, descripcion, capacidad) VALUES (source.id, source.nombre, source.descripcion, source.capacidad);
SET IDENTITY_INSERT secciones OFF;
GO

SET IDENTITY_INSERT usuarios ON;
MERGE usuarios AS target
USING (VALUES
    (1, 'admin', 'admin', 'Administrador', 'ADMIN', 1),
    (2, 'jlopez', 'campo2026', 'Juan Lopez', 'ENCARGADO', 1),
    (3, 'mvalle', 'trigo2026', 'Maria Valle', 'SUPERVISOR', 1),
    (4, 'rquiroz', 'maiz2026', 'Ricardo Quiroz', 'ALMACENERO', 1),
    (5, 'eavila', 'soja2026', 'Elena Avila', 'USUARIO', 1),
    (6, 'cchavez', 'papa2026', 'Carlos Chavez', 'USUARIO', 1)
) AS source (id, username, password, nombre, rol, activo)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET username = source.username, password = source.password, nombre = source.nombre, rol = source.rol, activo = source.activo
WHEN NOT MATCHED THEN
    INSERT (id, username, password, nombre, rol, activo) VALUES (source.id, source.username, source.password, source.nombre, source.rol, source.activo);
SET IDENTITY_INSERT usuarios OFF;
GO

SET IDENTITY_INSERT proveedores ON;
MERGE proveedores AS target
USING (VALUES
    (1, 'AgroInsumos S.A.', 'Pedro Gomez', '555-1234', 'Av. Agricola 123', NULL, NULL),
    (2, 'CampoFertil Ltda.', 'Ana Torres', '555-5678', 'Calle Siembra 456', NULL, NULL),
    (3, 'Maquinarias del Valle', 'Luis Perez', '555-9012', 'Av. Tractores 789', NULL, NULL),
    (4, 'Semillas Selectas', 'Marta Ruiz', '555-3456', 'Calle Semilla 321', NULL, NULL),
    (5, 'BioVerde', 'Jorge Salas', '555-7890', 'Av. Organica 654', NULL, NULL),
    (6, 'RiegoPlus', 'Patricia Leon', '555-2345', 'Calle Agua 987', NULL, NULL),
    (7, 'Fertilizantes Andinos', 'Raul Castro', '555-6789', 'Av. Abono 159', NULL, NULL),
    (8, 'AgroQuimicos Sur', 'Cecilia Rivas', '555-4321', 'Calle Quimica 753', NULL, NULL)
) AS source (id, nombre, contacto, telefono, direccion, ruc, email)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET nombre = source.nombre, contacto = source.contacto, telefono = source.telefono, direccion = source.direccion, ruc = source.ruc, email = source.email
WHEN NOT MATCHED THEN
    INSERT (id, nombre, contacto, telefono, direccion, ruc, email) VALUES (source.id, source.nombre, source.contacto, source.telefono, source.direccion, source.ruc, source.email);
SET IDENTITY_INSERT proveedores OFF;
GO

SET IDENTITY_INSERT productos ON;
MERGE productos AS target
USING (VALUES
    (1, 'AG-001', 'Maiz Amarillo Duro', 'Grano seco para almacenamiento', 1, 2400, 'kg', 1, 'ACTIVO'),
    (2, 'AG-002', 'Trigo Blando', 'Variedad harinera certificada', 1, 1800, 'kg', 1, 'ACTIVO'),
    (3, 'AG-003', 'Arroz Largo Fino', 'Arroz pilado de primera', 1, 45, 'kg', 1, 'ACTIVO'),
    (4, 'AG-004', 'Semilla de Papa', 'Papa blanca seleccionada', 1, 45, 'kg', 2, 'ACTIVO'),
    (5, 'AG-005', 'Fertilizante NPK 20-20-20', 'Fertilizante balanceado granulado', 3, 320, 'kg', 3, 'ACTIVO'),
    (6, 'AG-006', 'Pesticida Foliar', 'Control de plagas foliares', 2, 80, 'L', 2, 'ACTIVO'),
    (7, 'AG-007', 'Herbicida Selectivo', 'Para malezas de hoja ancha', 2, 60, 'L', 2, 'ACTIVO'),
    (8, 'AG-008', 'Azadon de Acero', 'Herramienta de labranza manual', 4, 150, 'unid.', 4, 'ACTIVO'),
    (9, 'AG-009', 'Pala Agricola', 'Pala de acero con mango de madera', 4, 200, 'unid.', 4, 'ACTIVO'),
    (10, 'AG-010', 'Cebada Cervecera', 'Grano para malteado', 1, 900, 'kg', 1, 'ACTIVO'),
    (11, 'AG-011', 'Urea 46%', 'Fertilizante nitrogenado', 3, 75, 'kg', 3, 'ACTIVO'),
    (12, 'AG-012', 'Fungicida Sistemico', 'Control de oidio y roya', 2, 40, 'L', 2, 'ACTIVO')
) AS source (id, codigo, nombre, detalle, categoria_id, stock, unidad, seccion_id, status)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET codigo = source.codigo, nombre = source.nombre, detalle = source.detalle, categoria_id = source.categoria_id, stock = source.stock, unidad = source.unidad, seccion_id = source.seccion_id, status = source.status
WHEN NOT MATCHED THEN
    INSERT (id, codigo, nombre, detalle, categoria_id, stock, unidad, seccion_id, status)
    VALUES (source.id, source.codigo, source.nombre, source.detalle, source.categoria_id, source.stock, source.unidad, source.seccion_id, source.status);
SET IDENTITY_INSERT productos OFF;
GO

SET IDENTITY_INSERT lotes ON;
MERGE lotes AS target
USING (VALUES
    (1, 1, 'L-AG001-01', 'Lote inicial de maiz', 2400, 'kg', CAST('2026-01-15' AS date), NULL, 'AgroInsumos S.A.', NULL, 'ACTIVO', NULL),
    (2, 2, 'L-AG002-01', 'Lote de trigo blando', 1800, 'kg', CAST('2026-02-10' AS date), NULL, 'CampoFertil Ltda.', NULL, 'ACTIVO', NULL),
    (3, 3, 'L-AG003-01', 'Arroz pilado', 45, 'kg', CAST('2026-03-05' AS date), NULL, 'AgroInsumos S.A.', NULL, 'ACTIVO', NULL),
    (4, 4, 'L-AG004-01', 'Semilla de papa', 45, 'kg', CAST('2026-03-20' AS date), NULL, 'Semillas Selectas', NULL, 'ACTIVO', NULL),
    (5, 5, 'L-AG005-01', 'Fertilizante NPK', 320, 'kg', CAST('2026-04-01' AS date), NULL, 'Fertilizantes Andinos', NULL, 'ACTIVO', NULL),
    (6, 6, 'L-AG006-01', 'Pesticida foliar', 80, 'L', CAST('2026-04-05' AS date), NULL, 'AgroQuimicos Sur', NULL, 'ACTIVO', NULL)
) AS source (id, producto_id, codigo_lote, descripcion, cantidad, unidad, fecha_ingreso, fecha_vencimiento, proveedor, nota, estado, observacion)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET producto_id = source.producto_id, codigo_lote = source.codigo_lote, descripcion = source.descripcion, cantidad = source.cantidad, unidad = source.unidad, fecha_ingreso = source.fecha_ingreso, fecha_vencimiento = source.fecha_vencimiento, proveedor = source.proveedor, nota = source.nota, estado = source.estado, observacion = source.observacion
WHEN NOT MATCHED THEN
    INSERT (id, producto_id, codigo_lote, descripcion, cantidad, unidad, fecha_ingreso, fecha_vencimiento, proveedor, nota, estado, observacion)
    VALUES (source.id, source.producto_id, source.codigo_lote, source.descripcion, source.cantidad, source.unidad, source.fecha_ingreso, source.fecha_vencimiento, source.proveedor, source.nota, source.estado, source.observacion);
SET IDENTITY_INSERT lotes OFF;
GO

SET IDENTITY_INSERT movimientos ON;
MERGE movimientos AS target
USING (VALUES
    (1, 1, 1, 'Entrada', 2400, CAST('2026-01-15T08:00:00' AS datetime2), 'Ingreso inicial de maiz', NULL, NULL, 'kg', NULL, NULL),
    (2, 2, 1, 'Entrada', 1800, CAST('2026-02-10T09:00:00' AS datetime2), 'Ingreso de trigo blando', NULL, NULL, 'kg', NULL, NULL),
    (3, 5, 2, 'Entrada', 320, CAST('2026-04-01T10:00:00' AS datetime2), 'Ingreso fertilizante NPK', NULL, NULL, 'kg', NULL, NULL),
    (4, 6, 2, 'Entrada', 80, CAST('2026-04-05T11:00:00' AS datetime2), 'Ingreso pesticida foliar', NULL, NULL, 'L', NULL, NULL),
    (5, 1, 3, 'Salida', 200, CAST('2026-04-10T14:00:00' AS datetime2), 'Despacho a parcela norte', NULL, NULL, 'kg', NULL, NULL),
    (6, 5, 3, 'Salida', 150, CAST('2026-04-15T15:00:00' AS datetime2), 'Aplicacion en campo', NULL, NULL, 'kg', NULL, NULL),
    (7, 6, 4, 'Salida', 60, CAST('2026-04-20T16:00:00' AS datetime2), 'Uso en fumigacion', NULL, NULL, 'L', NULL, NULL),
    (8, 2, 1, 'Salida', 500, CAST('2026-04-21T08:30:00' AS datetime2), 'Despacho a molino', NULL, NULL, 'kg', NULL, NULL),
    (9, 8, 2, 'Entrada', 150, CAST('2026-04-22T09:00:00' AS datetime2), 'Compra de azadones', NULL, NULL, 'unid.', NULL, NULL),
    (10, 9, 2, 'Entrada', 200, CAST('2026-04-22T09:30:00' AS datetime2), 'Compra de palas', NULL, NULL, 'unid.', NULL, NULL)
) AS source (id, producto_id, usuario_id, tipo, cantidad, fecha, nota, proveedor, documento, unidad, seccion, observaciones)
ON target.id = source.id
WHEN MATCHED THEN
    UPDATE SET producto_id = source.producto_id, usuario_id = source.usuario_id, tipo = source.tipo, cantidad = source.cantidad, fecha = source.fecha, nota = source.nota, proveedor = source.proveedor, documento = source.documento, unidad = source.unidad, seccion = source.seccion, observaciones = source.observaciones
WHEN NOT MATCHED THEN
    INSERT (id, producto_id, usuario_id, tipo, cantidad, fecha, nota, proveedor, documento, unidad, seccion, observaciones)
    VALUES (source.id, source.producto_id, source.usuario_id, source.tipo, source.cantidad, source.fecha, source.nota, source.proveedor, source.documento, source.unidad, source.seccion, source.observaciones);
SET IDENTITY_INSERT movimientos OFF;
GO
PRINT 'categorias';
SELECT * FROM categorias;

PRINT 'secciones';
SELECT * FROM secciones;

PRINT 'productos';
SELECT * FROM productos;

PRINT 'usuarios';
SELECT * FROM usuarios;

PRINT 'proveedores';
SELECT * FROM proveedores;

PRINT 'lotes';
SELECT * FROM lotes;

PRINT 'movimientos';
SELECT * FROM movimientos;