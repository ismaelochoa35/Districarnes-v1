# Informe técnico de estructura — Districarnes v1

## 1. Resumen ejecutivo

Districarnes v1 es una aplicación web local de inventario y punto de venta (POS) para una carnicería. Está construida con HTML, CSS y JavaScript nativo en el navegador; Node.js y Express en el servidor; y MySQL como base de datos.

La estructura general es adecuada para un proyecto académico o una primera versión funcional. El backend aplica una variante sencilla de MVC: las rutas reciben la URL, los controladores validan la petición, los modelos ejecutan SQL y algunos servicios encapsulan reglas reutilizables. El frontend también está dividido por módulos de negocio. No obstante, todavía no debe considerarse listo para producción: no hay pruebas automatizadas, las sesiones se pierden al reiniciar el servidor, las contraseñas usan SHA-256 sin sal, no existen roles diferenciados, faltan límites contra abuso y el archivo CSS concentra 1.035 líneas.

**Valoración general:** buena separación inicial y flujo comprensible; madurez media para demostración académica y baja para producción. Aproximadamente **7/10 como proyecto académico** y **4/10 como sistema productivo**, principalmente por seguridad, pruebas, operación y mantenibilidad.

## 2. Cómo leer una línea de código

El proyecto utiliza dos sistemas de módulos:

- En el frontend, `import` y `export` conectan módulos ES. Ejemplo: `inventory.js` importa `apiRequest` para llamar al backend y utilidades visuales desde `ui.js`.
- En el backend, `require(...)` y `module.exports` conectan módulos CommonJS. Ejemplo: un controlador requiere su modelo y exporta las funciones que las rutas ejecutarán.
- `const` declara una referencia que no se reasigna; `let` representa estado que sí cambia, como el carrito o la página actual.
- `function nombre(...)` define una función; `async function` permite esperar operaciones de red o base de datos mediante `await`.
- `req` contiene la petición HTTP, `res` construye la respuesta y `next(error)` entrega un error al middleware central.
- `?` en SQL representa un parámetro separado del texto de la consulta. Esto reduce el riesgo de inyección SQL.
- `id`, atributos `data-*` y selectores como `#save-sale` conectan el HTML con JavaScript.
- Las clases CSS, por ejemplo `.card` o `.hidden`, determinan apariencia y visibilidad; no representan clases de JavaScript.

## 3. Mapa completo de carpetas

```text
Districarnes-v1/
├── .gitignore
├── INICIAR.bat
├── README.md
├── INFORME_ESTRUCTURA_CODIGO.md
├── FRONTEND/
│   ├── index.html
│   ├── app.html
│   ├── css/styles.css
│   ├── images/{res,cerdo,pollo,pescado,visceras}.png
│   └── js/
│       ├── api.js
│       ├── login.js
│       ├── app.js
│       ├── dashboard.js
│       ├── inventory.js
│       ├── sales.js
│       ├── administrators.js
│       └── ui.js
└── BACKEND/
    ├── .env                       (local, ignorado por Git)
    ├── package.json
    ├── package-lock.json
    ├── node_modules/              (generado, no es código fuente)
    ├── database/schema.sql
    └── src/
        ├── server.js
        ├── app.js
        ├── config/database.js
        ├── middleware/
        │   ├── authMiddleware.js
        │   └── errorMiddleware.js
        ├── services/
        │   ├── sessionService.js
        │   └── measurementService.js
        ├── routes/
        │   ├── index.js
        │   ├── authRoutes.js
        │   ├── categoryRoutes.js
        │   ├── productRoutes.js
        │   ├── saleRoutes.js
        │   └── administratorRoutes.js
        ├── controllers/
        │   ├── authController.js
        │   ├── categoryController.js
        │   ├── productController.js
        │   ├── saleController.js
        │   └── administratorController.js
        └── models/
            ├── administratorModel.js
            ├── categoryModel.js
            ├── productModel.js
            └── saleModel.js
```

## 4. Función de cada archivo raíz

| Archivo | Función |
|---|---|
| `README.md` | Manual de arquitectura, instalación, API y funciones. Es la documentación actual, aunque no sustituye una especificación formal de requisitos. |
| `INICIAR.bat` | Iniciador para Windows: entra a `BACKEND`, instala dependencias si faltan, comprueba `.env`, abre el navegador y ejecuta `npm start`. |
| `.gitignore` | Evita versionar dependencias, configuración secreta y logs. |
| `INFORME_ESTRUCTURA_CODIGO.md` | Este análisis técnico. |

## 5. Frontend: composición y responsabilidades

### 5.1 HTML

`FRONTEND/index.html` es la vista pública de acceso. Contiene correo, contraseña, confirmación, dos botones de ojo e ingreso. Carga `login.js` como módulo.

`FRONTEND/app.html` es la vista privada y funciona como una SPA sencilla: todas las secciones están en el mismo documento y JavaScript alterna la clase `hidden`. Sus áreas son:

1. barra superior y cierre de sesión;
2. menú lateral;
3. inicio con indicadores;
4. inventario, filtros y tabla;
5. catálogo, carrito y cobro;
6. historial y reporte diario;
7. administradores;
8. diálogos de producto, administrador, recibo e informe.

### 5.2 CSS

`FRONTEND/css/styles.css` reúne toda la presentación en 1.035 líneas. Define variables visuales en `:root`, componentes reutilizables (`card`, botones, formularios, tablas y diálogos), layouts del panel y ventas, estados visuales y tres rangos adaptables. Al final contiene reglas de impresión para recibos e informes.

La hoja funciona, pero es el archivo con mayor deuda de organización. Conviene dividirla en `base.css`, `layout.css`, `components.css`, `modules/*.css`, `responsive.css` y `print.css`, o adoptar una convención estricta de nombres.

### 5.3 Imágenes

`FRONTEND/images` contiene una imagen por categoría. `sales.js` normaliza el nombre de la categoría y forma `/images/<categoria>.png`; por ello los nombres de archivo están ligados a los nombres almacenados en MySQL.

### 5.4 JavaScript del navegador

| Archivo | Estado propio | Funciones y responsabilidad |
|---|---|---|
| `api.js` | clave de sesión | `hasSession` comprueba token; `apiRequest` agrega cabeceras, serializa JSON, trata errores y redirige ante 401; `startSession` guarda token; `closeSession` lo elimina. |
| `login.js` | referencias al formulario | Limpia datos sensibles, muestra/oculta contraseñas, valida que coincidan, inicia sesión y redirige. |
| `app.js` | `sectionLoaders` | Punto coordinador: valida sesión, carga categorías, inicializa módulos, abre secciones y conecta navegación/cierre de sesión. |
| `dashboard.js` | ninguno | Carga productos y ventas del día en paralelo y calcula cuatro indicadores. |
| `inventory.js` | productos y categorías | Dibuja pestañas/resumen/tabla, construye el objeto producto, aplica búsqueda/categoría/stock bajo y realiza crear, editar y eliminar. |
| `sales.js` | catálogo, carrito, página, reporte | Es el módulo más grande (393 líneas): catálogo paginado, conversiones g/kg/lb, carrito, pago/cambio, venta, historial, recibo, reporte e impresión. |
| `administrators.js` | ninguno persistente | Lista cuentas, abre formulario, crea administradores y cambia su estado. |
| `ui.js` | temporizador de mensajes | Selector `$`, formato COP/fecha/cantidad, fecha local, escape contra HTML inyectado y mensajes temporales. |

La interfaz usa delegación de eventos en tablas, catálogo y carrito. Es una buena decisión: los botones creados dinámicamente no necesitan un listener individual.

## 6. Dónde están los botones y qué hacen

Los botones estáticos se declaran principalmente en `index.html` y `app.html`; los botones que dependen de datos se generan mediante plantillas de texto en `inventory.js`, `sales.js` y `administrators.js`.

| Zona | Botones | Lógica asociada |
|---|---|---|
| Acceso | mostrar/ocultar contraseña, ingresar | `login.js` |
| Barra superior | cerrar sesión | `app.js` → `api.js` |
| Menú | inicio, inventario, nueva venta, historial, administradores | `app.js`, atributo `data-section` |
| Inicio | registrar venta, ver inventario, cuatro tarjetas-indicador | `app.js`; algunas pasan `data-low-stock` |
| Inventario | nuevo producto, pestañas por categoría, editar, eliminar, cerrar y guardar | `inventory.js` |
| Nueva venta | anterior, siguiente, agregar, quitar, registrar venta | `sales.js` |
| Historial | imprimir total, ver recibo | `sales.js` |
| Administradores | nuevo, crear acceso, activar/desactivar, cerrar | `administrators.js` |
| Recibo/reporte | imprimir y cerrar | `sales.js` |

La asociación funciona por `id` cuando existe una sola acción (`#save-sale`) y por `data-*` para acciones repetidas (`data-edit`, `data-delete`, `data-add-product`, `data-receipt`, etc.).

## 7. Backend: composición y responsabilidades

### 7.1 Inicio y configuración

- `src/server.js`: carga `.env`, comprueba MySQL antes de escuchar, inicia el puerto y explica errores de conexión o puerto ocupado.
- `src/app.js`: crea Express, habilita JSON, publica los archivos frontend, monta `/api`, sirve las dos páginas y coloca los manejadores de 404/errores.
- `src/config/database.js`: crea un pool MySQL de hasta diez conexiones y expone una prueba de conexión.

### 7.2 Rutas

Las rutas traducen método + URL a una función controladora. `routes/index.js` reúne los cinco grupos. Todas las operaciones salvo `POST /api/login` requieren `Bearer token` mediante `requireAuth`.

| Método y URL | Controlador | Finalidad |
|---|---|---|
| `POST /api/login` | `authController.login` | Autenticar y crear token. |
| `POST /api/logout` | `authController.logout` | Invalidar token. |
| `GET /api/categorias` | `categoryController.list` | Listar categorías. |
| `GET /api/productos` | `productController.list` | Buscar/filtrar inventario. |
| `POST /api/productos` | `productController.create` | Crear producto. |
| `PUT /api/productos/:id` | `productController.update` | Reemplazar datos editables. |
| `DELETE /api/productos/:id` | `productController.remove` | Eliminar producto si las relaciones lo permiten. |
| `GET /api/ventas` | `saleController.list` | Historial por fecha/categoría. |
| `GET /api/ventas/resumen-categorias` | `saleController.dailyCategorySummary` | Totales diarios. |
| `GET /api/ventas/:id` | `saleController.detail` | Datos de recibo. |
| `POST /api/ventas` | `saleController.create` | Validar y registrar venta. |
| `GET /api/administradores` | `administratorController.list` | Listar cuentas. |
| `POST /api/administradores` | `administratorController.create` | Crear cuenta. |
| `PATCH /api/administradores/:id/estado` | `administratorController.updateStatus` | Activar/desactivar. |

### 7.3 Controladores

Los controladores son la frontera HTTP. Convierten texto a números, validan formato, llaman al modelo y asignan estados HTTP (200, 201, 400, 401, 404, 409). Esta separación es correcta, aunque la validación podría centralizarse con esquemas reutilizables.

- `authController`: autentica y cierra sesión.
- `categoryController`: lista categorías.
- `productController`: interpreta, valida y gestiona CRUD de productos.
- `saleController`: valida filtros, identificadores, ítems y pago antes de registrar.
- `administratorController`: valida cuenta, duplicados y evita la autodesactivación.

### 7.4 Modelos

Los modelos son los únicos módulos que consultan MySQL, una separación acertada.

- `administratorModel`: búsqueda por credenciales, listado, creación y estado.
- `categoryModel`: listado alfabético.
- `productModel`: consulta filtrada y CRUD con parámetros SQL.
- `saleModel`: historial, resumen, detalle y transacción de venta. Bloquea productos con `FOR UPDATE`, recalcula precio/stock en el servidor, inserta cabecera, detalles y movimiento, y confirma o revierte toda la operación. Es la parte con mejor protección de consistencia.

### 7.5 Servicios y middleware

- `sessionService`: genera tokens criptográficamente aleatorios y los conserva en un `Map` de memoria.
- `measurementService`: convierte gramos, kilogramos y libras a la unidad base, redondeando a tres decimales; exige enteros para productos por unidad.
- `authMiddleware`: extrae `Authorization: Bearer`, busca la sesión y añade `req.user`/`req.token`.
- `errorMiddleware`: produce 404 uniforme, convierte una restricción referencial en 409 y oculta detalles internos en errores 500.

## 8. Base de datos y significado de los datos

`database/schema.sql` reconstruye completamente la base `districarnes`. Esta característica es útil para instalaciones limpias, pero destruye información previa al volver a ejecutarse.

| Tabla | Significado | Relaciones/datos clave |
|---|---|---|
| `administradores` | Personas autorizadas | correo único, hash de contraseña, estado activo. |
| `categorias` | Familias de productos | Res, Cerdo, Pollo, Pescado y Vísceras. |
| `productos` | Catálogo e inventario | corte, categoría, imagen, unidad base, precio, stock, estado. |
| `ventas` | Cabecera de cada operación | administrador, cliente, pago, recibido, cambio, total y estado. |
| `detalle_venta` | Líneas de una venta | producto, cantidad en unidad base, precio congelado y subtotal calculado. |
| `movimientos` | Registro financiero asociado | pago/devolución/cancelación/actualización, aunque hoy solo se crea `pago`. |
| `auditoria_productos` | Historial técnico de producto | valores anteriores/nuevos, usuario MySQL y fecha. |

Las claves primarias `id` identifican registros. Las claves foráneas preservan relaciones. `DECIMAL` evita errores típicos de punto flotante en dinero y cantidades. `ENUM` limita valores admitidos. `TIMESTAMP` registra fechas automáticamente. El subtotal es una columna generada por MySQL.

Los triggers validan precio y stock, auditan actualizaciones/eliminaciones y descuentan inventario al insertar el detalle. La transacción del modelo más estos triggers protegen la venta ante fallos parciales. Existe cierta duplicación deliberada de validación entre frontend, controlador y base de datos: aporta defensa por capas, aunque debe mantenerse consistente.

## 9. Flujo completo de los datos

Ejemplo de registro de venta:

```text
Usuario pulsa “Registrar venta”
  → sales.js arma JSON con ítems, cliente y pago
  → api.js envía POST /api/ventas + Bearer token
  → authMiddleware comprueba la sesión
  → saleController valida forma y valores básicos
  → saleModel abre transacción y bloquea cada producto
  → measurementService convierte la cantidad
  → MySQL inserta venta, detalles y movimiento
  → trigger descuenta stock
  → COMMIT confirma todo
  → API devuelve id/total/cambio
  → sales.js limpia carrito, actualiza catálogo y muestra recibo
```

Este flujo evita confiar en el precio calculado por el navegador: el backend vuelve a consultar precio y stock. Esa es una decisión correcta de seguridad e integridad.

## 10. Requisitos funcionales

Un requisito funcional describe **qué hace** el sistema. El repositorio no tiene un documento formal de requisitos con identificadores y criterios de aceptación; se pueden localizar o inferir desde README, vistas, rutas, controladores y SQL.

| ID propuesto | Requisito implementado | Evidencia principal |
|---|---|---|
| RF-01 | Iniciar y cerrar sesión administrativa. | `index.html`, `login.js`, rutas/controlador de autenticación. |
| RF-02 | Consultar indicadores del negocio. | `dashboard.js`, sección inicio. |
| RF-03 | Listar, buscar y filtrar inventario. | `inventory.js`, `productModel.findAll`. |
| RF-04 | Crear, editar, activar y eliminar productos. | formulario, controlador/modelo de producto. |
| RF-05 | Consultar categorías y resumen diario por categoría. | rutas/modelos de categoría y venta. |
| RF-06 | Formar un carrito y vender en g, kg, lb o unidades. | `sales.js`, `measurementService.js`. |
| RF-07 | Validar stock y descontarlo de forma transaccional. | `saleModel.create`, triggers SQL. |
| RF-08 | Registrar cliente, medio de pago, recibido y cambio. | interfaz de venta, controlador/modelo. |
| RF-09 | Consultar historial por fecha y categoría. | `loadSalesHistory`, `saleModel.findAll`. |
| RF-10 | Ver, filtrar e imprimir recibos. | `showReceipt`, reglas CSS de impresión. |
| RF-11 | Generar e imprimir reporte diario. | `openDailyReport`. |
| RF-12 | Crear, listar, activar y desactivar administradores. | módulo, controlador y modelo de administradores. |
| RF-13 | Auditar cambios y eliminaciones de productos. | tabla y triggers de auditoría. |

Para establecerlos formalmente conviene crear `docs/REQUISITOS.md` con: identificador, actor, precondición, flujo, resultado, reglas, errores y criterio de aceptación; luego vincular cada requisito a una prueba.

## 11. Requisitos no funcionales

Un requisito no funcional describe **cómo de bien**, bajo qué restricciones o con qué cualidades funciona el sistema. En el código aparecen parcialmente, pero no están medidos ni documentados formalmente.

| Categoría | Evidencia actual | Estado |
|---|---|---|
| Seguridad | autenticación, rutas protegidas, consultas parametrizadas, escape HTML, errores 500 ocultos | Parcial: hash débil, sin expiración ni roles ni rate limiting. |
| Integridad | transacciones, `FOR UPDATE`, claves foráneas, triggers, `DECIMAL` | Buena para el alcance actual. |
| Usabilidad | mensajes, filtros, confirmación, botones deshabilitados, navegación modular | Adecuada; falta evaluación con usuarios. |
| Accesibilidad | idioma, viewport, algunos `aria-label`/`aria-live`, HTML semántico | Parcial; falta auditoría WCAG y control completo de teclado/foco. |
| Rendimiento | pool de 10 conexiones, algunas cargas paralelas, paginación visual | Parcial: la paginación es cliente; la API devuelve todo el catálogo. |
| Compatibilidad | JavaScript moderno y CSS adaptable | No define navegadores/versions objetivo. |
| Disponibilidad | verificación de MySQL y errores de inicio claros | Local y de un solo proceso; sin recuperación/monitorización. |
| Mantenibilidad | capas y módulos con nombres claros | Buena base; CSS y `sales.js` empiezan a crecer demasiado. |
| Testabilidad | funciones parcialmente separadas | Insuficiente: cero pruebas y sin script `test`. |
| Portabilidad | `.env`, Node/MySQL, iniciador Windows | Parcial: instalación documentada, pero `INICIAR.bat` solo sirve en Windows. |
| Observabilidad | algunos logs de inicio y errores 500 | Insuficiente: no hay log estructurado, métricas ni trazabilidad. |
| Respaldo/recuperación | no implementado | Crítico antes de datos reales. |

Ejemplos de requisitos medibles que hoy faltan: “respuesta p95 menor a 500 ms con 20 usuarios”, “sesión expira tras 30 minutos”, “WCAG 2.2 AA”, “RPO 24 h/RTO 2 h”, “80 % de cobertura” y “cero vulnerabilidades críticas”.

## 12. Evaluación crítica

### Aspectos bien estructurados

- Separación clara entre navegador, API y MySQL.
- Backend organizado por responsabilidades y nombres coherentes.
- Consultas parametrizadas.
- Autenticación aplicada a todos los recursos privados.
- Venta transaccional con bloqueo de stock y rollback.
- Precio y existencias recalculados en backend.
- Utilidades comunes de formato y escape.
- README útil y esquema reproducible.
- Sintaxis válida en todos los archivos JavaScript revisados.

### Riesgos y mejoras prioritarias

1. **Contraseñas:** reemplazar `SHA2(..., 256)` por Argon2id o bcrypt con sal y migración segura. Las contraseñas de demostración visibles en SQL no deben usarse en producción.
2. **Sesiones:** añadir expiración, almacenamiento persistente seguro, revocación y cookies `HttpOnly/Secure/SameSite` o un diseño de tokens debidamente gestionado. El `Map` crece sin límite y se vacía al reiniciar.
3. **Autorización:** hoy cualquier administrador puede crear/desactivar a otros y modificar/eliminar productos. Incorporar roles y permisos.
4. **Protección HTTP:** agregar rate limiting al login, Helmet/CSP, límite explícito de JSON, validación de origen y política HTTPS en despliegue.
5. **Pruebas:** crear unitarias para conversiones/validaciones, integración para API/transacciones y E2E para acceso, inventario y venta.
6. **Eliminación de productos:** preferir baja lógica (`activo=false`) para conservar trazabilidad; una venta existente actualmente impide borrar por clave foránea y produce 409.
7. **Validación:** utilizar esquemas comunes (por ejemplo, Zod/Joi/express-validator), validar longitud de cliente/correo y normalizar errores MySQL.
8. **Modularidad:** dividir `sales.js` en catálogo, carrito, cobro, historial y recibos; dividir CSS por responsabilidad.
9. **Escalabilidad:** paginación, búsqueda y límites desde servidor; hoy el catálogo completo se descarga y pagina en memoria.
10. **Operación:** backups automáticos, migraciones versionadas, logs estructurados, health check, cierre ordenado del pool y configuración separada por ambiente.
11. **Datos/zonas horarias:** definir explícitamente zona horaria de aplicación y MySQL para que filtros diarios coincidan en todos los equipos.
12. **Documentación:** incorporar requisitos, diagramas, diccionario de datos, decisiones arquitectónicas y contratos API/OpenAPI.

## 13. Propuesta documental

Para que cualquier persona pueda establecer dónde está cada requisito, se recomienda esta estructura futura:

```text
docs/
├── REQUISITOS.md          RF/RNF y criterios de aceptación
├── ARQUITECTURA.md        capas, dependencias y decisiones
├── API.yaml               contrato OpenAPI
├── DICCIONARIO_DATOS.md   tablas, columnas y reglas
├── SEGURIDAD.md           amenazas, sesiones, roles y secretos
└── TRAZABILIDAD.md        requisito → archivo → endpoint → prueba
tests/
├── unit/
├── integration/
└── e2e/
```

La matriz de trazabilidad es la respuesta más precisa a “dónde se encuentra un requerimiento”: el requisito no debería vivir únicamente dentro del código; debe estar documentado y apuntar a sus implementaciones y pruebas.

## 14. Conclusión

El proyecto sí está razonablemente bien estructurado para su tamaño y objetivo académico. Su flujo principal —autenticación, inventario, venta, descuento de stock, historial y administración— es entendible y está separado por módulos. La transacción de venta y las consultas parametrizadas son fortalezas importantes.

La principal diferencia entre “funciona” y “está listo para operar con datos reales” está en los requisitos no funcionales. Seguridad de contraseñas y sesiones, pruebas, respaldo, observabilidad, roles y rendimiento necesitan trabajo antes de producción. La siguiente etapa recomendable es formalizar requisitos y trazabilidad, y después abordar seguridad y pruebas antes de añadir más funcionalidades.
