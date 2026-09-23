# Districarnes

Sistema local de inventario y punto de venta desarrollado con HTML, CSS, JavaScript, Node.js, Express y MySQL.

## Estructura

```text
Districarnes/
├── BACKEND/
│   ├── database/schema.sql
│   ├── src/
│   │   ├── config/          conexión a MySQL
│   │   ├── controllers/     validación y respuestas HTTP
│   │   ├── middleware/      sesión y manejo de errores
│   │   ├── models/          consultas y transacciones SQL
│   │   ├── routes/          endpoints utilizados por el frontend
│   │   ├── services/        sesiones y conversión de medidas
│   │   ├── app.js           configuración de Express
│   │   └── server.js        inicio del servidor
│   ├── .env
│   └── package.json
└── FRONTEND/
    ├── css/styles.css
    ├── images/
    ├── js/
    │   ├── api.js
    │   ├── login.js
    │   ├── app.js
    │   ├── dashboard.js
    │   ├── inventory.js
    │   ├── sales.js
    │   ├── administrators.js
    │   └── ui.js
    ├── index.html           inicio de sesión
    └── app.html             panel privado
```

## Arquitectura MVC

- **Vista:** `FRONTEND` contiene solamente presentación e interacción del navegador.
- **Controladores:** reciben datos HTTP, los validan y coordinan cada operación.
- **Modelos:** son los únicos módulos que ejecutan consultas o transacciones MySQL.
- **Rutas:** exponen solamente operaciones que la interfaz utiliza.
- **Middleware:** valida la sesión y devuelve errores HTTP uniformes.
- **Servicios:** administran las sesiones y convierten gramos, kilogramos o libras a la unidad base del producto.

Ejemplo de una consulta de inventario:

```text
inventory.js
  → GET /api/productos
    → productRoutes.js
      → productController.js
        → productModel.js
          → MySQL
```

## Rutas utilizadas

| Método | Ruta | Uso en la interfaz |
|---|---|---|
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/categorias` | Cargar filtros y formularios |
| GET | `/api/productos` | Inventario, tablero y catálogo |
| POST | `/api/productos` | Crear un producto |
| PUT | `/api/productos/:id` | Editar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |
| GET | `/api/ventas` | Tablero e historial |
| GET | `/api/ventas/resumen-categorias` | Ventas diarias por categoría |
| GET | `/api/ventas/:id` | Mostrar un recibo |
| POST | `/api/ventas` | Registrar una venta |
| GET | `/api/administradores` | Listar administradores |
| POST | `/api/administradores` | Crear un administrador |
| PATCH | `/api/administradores/:id/estado` | Activar o desactivar una cuenta |

## Base de datos

`BACKEND/database/schema.sql` crea solamente los objetos usados por el sistema:

- administradores y control de acceso;
- categorías y productos;
- ventas y detalle de venta;
- movimientos de pago creados por cada venta;
- auditoría de productos;
- triggers de validación, auditoría y descuento de stock;
- 265 productos de demostración distribuidos entre res, cerdo, pollo, pescado y vísceras.

El proyecto conserva un único script definitivo: `BACKEND/database/schema.sql`. Este crea la base completa con categorías, productos, ventas por peso, administradores, auditoría y triggers. Al ejecutarlo reconstruye `districarnes`, por lo que debe usarse para una instalación nueva o cuando no sea necesario conservar ventas anteriores.

### Venta por peso

Cada producto tiene una unidad base: `kg`, `lb` o `unidad`. El precio y el inventario se guardan en esa unidad, mientras que en Nueva venta el usuario puede digitar gramos, kilogramos o libras. El backend convierte la cantidad a la unidad base antes de calcular el subtotal y descontar el inventario.

Ejemplo: si un producto cuesta `$38.000` por kilogramo, una compra de `400 g` equivale a `0,400 kg`; el subtotal es `$15.200` y el inventario disminuye `0,400 kg`. Los productos marcados como `unidad` solo aceptan cantidades enteras.

### Cómo se conecta realmente

MySQL Workbench es únicamente una aplicación visual para administrar MySQL. No necesita permanecer abierto. Los datos viven en **MySQL Server**, que se ejecuta como servicio de Windows. El backend Node.js usa `mysql2` y los valores de `.env` para conectarse directamente a ese servidor.

Al ejecutar `npm start`, el backend prueba primero la conexión. Solo abre `http://localhost:3000` si MySQL responde y muestra en la terminal el nombre exacto de la base conectada. Si la contraseña, el puerto o el servicio son incorrectos, el servidor se detiene con un mensaje explicativo.

## Instalación

1. Ejecuta `BACKEND/database/schema.sql` completo en MySQL Workbench.
2. Configura `BACKEND/.env` con los datos de tu MySQL:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_clave_local
   DB_NAME=districarnes
   ```

3. Abre una terminal dentro de `BACKEND`.
4. Ejecuta `npm install`.
5. Ejecuta `npm start`.
6. Abre `http://localhost:3000`.

La terminal debe mostrar primero `MySQL conectado: base districarnes` y después `Servidor disponible`. Si no aparece, verifica en Servicios de Windows que MySQL esté iniciado y revisa `DB_USER`, `DB_PASSWORD` y `DB_PORT`.

El script SQL crea una cuenta inicial para la demostración académica. Sus credenciales se encuentran en la sección de administradores de `schema.sql`. Los campos del formulario de acceso permanecen vacíos y el navegador no deja ningún correo precargado.

## Archivos de configuración

- `.env` contiene datos privados del equipo local y está ignorado por Git.
- `package.json` declara las dependencias y comandos del backend.
- `package-lock.json` fija las versiones instaladas.
- `node_modules` se genera con `npm install` y no debe incluirse en la entrega.

Antes de compartir el proyecto, borra el valor de `DB_PASSWORD` en `BACKEND/.env`. Cada computador debe escribir su propia contraseña local de MySQL.

## Funciones disponibles

- Inicio de sesión sin credenciales precargadas, con confirmación y botones de ojo para ver u ocultar cada contraseña.
- Panel modular: inicio, inventario, nueva venta, historial y administradores.
- Los cuatro indicadores del inicio funcionan como accesos a inventario, existencias bajas e historial.
- Inventario separado mediante pestañas por categoría.
- Resumen lateral de ventas del día para la categoría seleccionada en Inventario.
- Categoría Vísceras con 53 productos.
- Búsqueda y filtros de productos.
- Historial consultable por cualquier fecha y categoría, con total diario y subtotales coherentes con el filtro.
- Reporte diario imprimible con fecha, categoría, cantidad de ventas y total vendido.
- Filtro por categoría dentro del detalle de cada recibo.
- Creación, edición y eliminación de productos.
- Catálogo paginado y carrito con cantidades en gramos, kilogramos, libras o unidades.
- Cliente, método de pago, efectivo recibido y cambio.
- Registro transaccional de ventas y descuento automático de stock.
- Historial, detalle e impresión de recibos.
- Creación, activación y desactivación de administradores.
"# Districarnes-v1"  
