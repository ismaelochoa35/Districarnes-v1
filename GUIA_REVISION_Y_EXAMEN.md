# Districarnes: revisión de arquitectura y guía de examen

Revisión del código disponible al 6 de septiembre de 2026. Este documento describe el estado actual y propone mejoras; no se modificó la aplicación ni se ejecutó el script SQL.

## 1. Qué se revisó y qué está comprobado

Se revisaron los 30 archivos JavaScript de la aplicación, los dos HTML, el CSS, el SQL completo, las rutas, la configuración de conexión e inicio, package.json, .gitignore, README, el informe anterior y el generador del plan de integración. Las dependencias instaladas, las imágenes y el Excel generado no son código de negocio; no se auditó internamente cada dependencia ni se volvió a validar visualmente el Excel. No se leyó ni reprodujo el contenido privado de .env.

Verificaciones ejecutadas: los 30 JavaScript pasan `node --check`; cinco comprobaciones del servicio de medidas pasan (400 g, 1000 g, unidades enteras y rechazo de fracciones o unidades incompatibles). Se reprodujo aritméticamente la diferencia de redondeo entre navegador y servidor. Esto no equivale a aprobar el sistema completo: no se ejecutaron ventas, pruebas del navegador ni pruebas contra MySQL en esta revisión.

Existe un plan de pruebas en outputs y un generador, build_integracion_tests.mjs. Este último escribe un Excel de casos pendientes: no ejecuta las operaciones de Districarnes. package.json no incluye un comando test. El informe anterior sirve como material adicional, pero sus calificaciones numéricas no son una evaluación del profesor ni del SENA.

## 2. El schema y la observación del profesor

**schema.sql es un archivo de instrucciones, no la base de datos en funcionamiento.** MySQL Server almacena y administra los datos. Workbench es una herramienta para administrarlo. Node.js se conecta al servidor mediante mysql2 y la configuración de BACKEND/src/config/database.js.

Actualmente el archivo está en BACKEND/database/schema.sql, fuera de src y fuera de FRONTEND. Express publica únicamente FRONTEND. Por tanto, esa ubicación no publica el SQL en la web. Tampoco se importa o ejecuta el schema al iniciar el servidor: server.js verifica la conexión a una base ya instalada.

Guardar los scripts de estructura junto al código permite reconstruir y revisar la base. Tenerlos en BACKEND/database o en database en la raíz son decisiones organizativas defendibles. Mover el archivo no mueve los datos de MySQL y no cambia por sí solo la arquitectura.

Según la aclaración del aprendiz, el profesor dijo que otros grupos lo tenían en otro lugar. Sin la guía ni una ubicación concreta, no se puede concluir que incumpla una norma. Para esta entrega recomiendo database en la raíz: hace visible la separación entre interfaz, servidor y scripts de base de datos. Es una propuesta técnica, no una exigencia oficial verificada.

La [oferta oficial de ADSO del SENA](https://betowa.sena.edu.co/oferta/analisis-y-desarrollo-de-software) contempla requisitos, diseño, desarrollo, calidad e implementación. Esa página no establece un árbol obligatorio de carpetas. La rúbrica particular del instructor debe contrastarse cuando esté disponible; no corresponde aplicar a todos los proyectos una convención que no hemos recibido.

El problema concreto del archivo actual es que mezcla cuatro responsabilidades:

- Crea tablas y relaciones.
- Elimina las tablas anteriores mediante DROP TABLE, perdiendo sus registros.
- Inserta categorías, cuentas y productos de demostración.
- Instala siete triggers que validan, auditan y descuentan existencias.

No se debe usar para actualizar una instalación que necesita conservar datos. Separar un script de reinicio, el esquema, los datos de ejemplo y las migraciones permite distinguir instalación de actualización. Una migración es un cambio versionado, por ejemplo agregar una columna mediante ALTER TABLE sin reconstruir todas las tablas.

## 3. Arquitectura actual y estructura propuesta

El sistema es una aplicación cliente-servidor con backend modular, API HTTP y MySQL. El frontend usa JavaScript nativo y cambia secciones dentro de app.html. El backend sigue una separación inspirada en MVC: rutas, controladores y modelos. No son microservicios. Los modelos realizan SQL y también parte de las reglas del negocio; otras reglas están en servicios y triggers.

```text
Navegador: HTML + JS
  -> apiRequest: petición HTTP con JSON y token
  -> ruta Express: elige la operación
  -> requireAuth: verifica la sesión cuando corresponde
  -> controlador: interpreta y valida la petición
  -> modelo y servicios: consultan y coordinan la operación
  -> MySQL: tablas, restricciones y triggers
  -> respuesta JSON -> actualización de la pantalla
```

Propuesta gradual, conservando los nombres actuales para reducir cambios:

```text
Districarnes-v1/
  FRONTEND/
    index.html
    app.html
    css/                  estilos; dividir solo cuando ayude a mantenerlos
    images/
    js/
      api.js              comunicación HTTP
      app.js              navegación e inicialización
      login.js
      inventory.js
      administrators.js
      dashboard.js
      ui.js
      sales/              futura separación: catálogo, carrito, historial, recibos
  BACKEND/
    src/
      config/
      routes/
      middleware/
      controllers/        validación HTTP y respuesta
      services/           reglas y coordinación de casos de uso
      models/             consultas SQL
      app.js
      server.js
    tests/                medidas, autenticación, productos y ventas
    .env.example          nombres de variables sin secretos reales
    package.json
    package-lock.json
  database/
    schema.sql            estructura inicial
    triggers.sql          reglas automáticas de MySQL
    seeds/                datos mínimos y demostración separados
    migrations/           cambios incrementales numerados
    reset-demo.sql        reconstrucción explícita solo de una base de pruebas
    README.md             orden de instalación y actualización
  docs/
    requisitos.md
    arquitectura.md
    modelo-datos.md       diagrama y diccionario
    matriz-trazabilidad.md
    pruebas/              casos y resultados realmente ejecutados
    manual-usuario.md
    manual-tecnico.md
  scripts/                generador de documentación y utilidades
  .gitignore
  README.md
  INICIAR.bat
```

Esta estructura es una propuesta, no se crearon carpetas vacías ni se movieron archivos. Si se aplica, deben actualizarse las referencias al SQL del README y del informe. La conexión de Node no cambia por mover ese script. Al separarlo, instalar tablas y triggers antes de los datos de ejemplo; actualmente los triggers se crean después de los INSERT iniciales.

No hace falta añadir frameworks para defender esta aplicación. La mejora más útil del backend sería extraer progresivamente la coordinación de ventas de saleModel.create a un servicio, manteniendo la misma conexión durante toda la transacción. Los modelos no deben abrir conexiones independientes para cada paso transaccional. Mantener el descuento en un trigger es válido si se documenta y prueba: no agregar otro descuento en JavaScript, porque se descontaría dos veces.

## 4. Cambios prioritarios encontrados

| Prioridad | Evidencia en el código | Consecuencia y cambio propuesto |
|---|---|---|
| Alta | schema.sql, líneas 7–15: DROP TABLE | Separar reinicio de instalación y migración para conservar datos. |
| Alta | sessionService usa Map; requireAuth solo consulta ese Map | Desactivar una cuenta impide nuevos logins, pero su token anterior sigue funcionando. Invalidar sesiones de esa cuenta o comprobar su estado; añadir vencimiento. |
| Alta | sales.js quantityInBase no redondea como measurementService | Para 1 lb a $38.000/kg, el navegador calcula $17.236,51006 y el servidor $17.252 con 0,454 kg. Unificar precisión y reglas de cálculo; comprobar que cobro y recibo coincidan. |
| Alta | saleModel.findById y reportes unen detalle con productos actuales | Cambiar nombre, categoría o unidad de un producto altera la interpretación de recibos anteriores. Guardar esos valores históricos en el detalle o impedir cambios incompatibles. El precio unitario sí se conserva. |
| Alta | save-sale no bloquea envíos mientras espera; API sin clave de operación | Dos solicitudes pueden generar dos ventas válidas. Bloquear reenvío en pantalla y aplicar idempotencia en servidor. Un bloqueo de stock no reconoce que sea la misma compra. |
| Alta | administratorModel usa SHA2(password,256) | Sustituir por un algoritmo para contraseñas y adaptar creación, login y cuentas existentes. No es suficiente cambiar solo el INSERT. |
| Media | Controladores llaman trim sin verificar tipos, validan parcialmente longitudes y activo | Algunas entradas inválidas pueden terminar en 500. Validar tipo, longitud, fecha real, límites numéricos y booleanos; responder 400. |
| Media | Resúmenes suman d.cantidad entre productos | Sumar kg, lb y unidades no produce una cantidad comparable. Separar por unidad o convertir pesos a kg y mostrar unidades aparte. |
| Media | Stock bajo usa 10 en SQL, inventario y tablero | La regla se repite y no distingue productos ni unidad. Definir umbral por producto o configuración y usar una política consistente. |
| Media | Cambiar unidad_medida no convierte precio ni stock | Pasar de kg a lb conserva los números aunque su significado cambia. Definir conversión explícita o restringir el cambio. |
| Media | CURRENT_USER() en auditoría; sin administrador_id del usuario web | Registra la identidad de ejecución de MySQL, no quién estaba conectado a Districarnes. Añadir trazabilidad del actor de la aplicación. |
| Media | Capturas de errores incompletas en filtros y solicitudes simultáneas | Algunas fallas no se muestran y una respuesta antigua puede reemplazar la búsqueda más reciente. Gestionar errores y descartar respuestas obsoletas. |
| Media | Tarjeta «Ventas de hoy» solo abre history | Si antes se eligió otra fecha, conserva ese filtro. Reiniciar fecha al pulsar ese acceso específico. |
| Organización | Sin .env.example; node_modules de raíz no cubierto por .gitignore | Añadir ejemplo de configuración y exclusión de dependencias a cualquier nivel; organizar generadores y evidencias. |

La recomendación de contraseñas se apoya en [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), que recomienda algoritmos adaptativos como Argon2id y desaconseja SHA-256 para este uso.

Otros puntos para revisar con pruebas: el esquema no declara explícitamente ENGINE=InnoDB; comprobar el motor real para garantizar transacciones. Dos ventas que bloqueen varios productos en órdenes distintos pueden entrar en interbloqueo: ordenar IDs y contemplar reintento controlado. Los errores SIGNAL de triggers terminan normalmente como 500 porque errorMiddleware no los traduce a errores de negocio. El login repite contraseña; no aporta otro factor de autenticación, por lo que conviene justificar ese requisito.

Hay decisiones correctas que se deben conservar: consultas parametrizadas, autenticación de las rutas de datos, separación de configuración e inicio, recalcular precio en servidor, FOR UPDATE y transacción de venta, restricciones entre tablas y escapeHtml al construir contenido con datos.

## 5. Mapa de funcionalidades para estudiar

Los códigos RF de esta tabla son identificadores propuestos para estudiar; no son requisitos oficiales recibidos. Todos los endpoints llevan el prefijo /api. Salvo login, requieren sesión.

| ID / operación | Pantalla y función principal | Ruta y backend | Resultado o regla que debes explicar |
|---|---|---|---|
| RF01 Ingresar | index.html; login.js submit; api.js startSession | POST /login → authController.login → administratorModel.findActiveByCredentials | Cuenta activa y clave correcta; crea token en Map y lo guarda en sessionStorage. 401 si falla. |
| RF02 Ver/ocultar contraseña | login.js, data-password-target | Sin API | Cambia type password/text; no cambia la contraseña almacenada. |
| RF03 Cerrar sesión | app.js logout → api.js closeSession | POST /logout → authController.logout → sessionService.remove | Elimina token del servidor y del navegador. Si falla la red, el navegador lo borra, pero puede quedar la sesión del servidor. |
| RF04 Navegar | app.js openSection y sectionLoaders | Depende de la sección | Alterna hidden y carga datos; el menú no es la protección de seguridad. |
| RF05 Resumen inicial | dashboard.js loadDashboard | GET /productos y GET /ventas?fecha=... | Cuenta productos, categorías, stock <=10 y ventas del día. No calcula utilidad. |
| RF06 Consultar categorías | app.js initializeApplication | GET /categorias → categoryController.list → categoryModel.findAll | Llena opciones y pestañas. No hay CRUD de categorías. |
| RF07 Buscar inventario | inventory.js loadInventory/renderProducts | GET /productos?buscar=...&categoria=...&stockBajo=... → productController.list → productModel.findAll | Filtra por nombre/corte, categoría y stock; devuelve activos e inactivos. |
| RF08 Crear producto | openProductForm, productPayload, submit | POST /productos → productController.create → productModel.create | Valida y hace INSERT; MySQL verifica relaciones y trigger de producto. |
| RF09 Editar producto | data-edit y formulario compartido | PUT /productos/:id → productController.update → productModel.update | Envía todos los campos editables; UPDATE genera auditoría por trigger. |
| RF10 Eliminar producto | data-delete y confirm | DELETE /productos/:id → productController.remove → productModel.remove | DELETE físico. Si tiene detalle de venta, FK lo impide y devuelve 409. Desactivarlo es distinto. |
| RF11 Resumen de categoría | inventory.js renderCategorySummary | GET /ventas/resumen-categorias?fecha=... → dailyCategorySummary → findDailyCategorySummary | Suma subtotales de ventas completadas del día. |
| RF12 Catálogo | sales.js loadSaleCatalog, visibleProducts, renderCatalog | GET /productos | Filtra en navegador por activos, stock positivo, búsqueda y categoría. Páginas de 24; no paginación SQL. |
| RF13 Carrito | cart, renderCart, listeners data-add/remove-product | Sin API hasta registrar | Agrega una fila por producto; repetir Agregar no aumenta cantidad. Quitar no devuelve stock porque todavía no se ha descontado. |
| RF14 Cantidad y medidas | quantityInBase, convertDisplayedQuantity, cartIsValid | measurementService.convertToBaseQuantity al guardar | Convierte g/kg/lb; productos unidad requieren enteros. El backend es quien valida finalmente. |
| RF15 Cobro y cambio | updatePayment | saleModel.create | Efectivo debe cubrir total. Tarjeta y transferencia toman recibido=total y cambio=0; no hay pasarela bancaria. |
| RF16 Registrar venta | sales.js listener save-sale | POST /ventas → saleController.create → saleModel.create | Transacción: venta, detalles, movimiento y efectos de triggers. Devuelve 201 con ID y total. |
| RF17 Historial | loadSalesHistory | GET /ventas?fecha=...&categoria=... → saleController.list → saleModel.findAll | Solo completadas; total_filtrado es subtotal de la categoría, no siempre total del recibo. items cuenta líneas de detalle, no kilos. |
| RF18 Ver recibo y filtrar | showReceipt y renderReceiptItems | GET /ventas/:id → saleController.detail → saleModel.findById | Recupera cabecera y detalles. Filtro visual cambia subtotal visible, no modifica venta ni total guardado. |
| RF19 Imprimir recibo | print-receipt → window.print | Sin nueva escritura | CSS @media print selecciona el diálogo abierto. |
| RF20 Reporte diario | dailyReport, openDailyReport, print-daily-report | Reutiliza consultas del historial | Imprime fecha, categoría, ventas y total consultado; no crea tabla de reportes. |
| RF21 Listar administradores | loadAdministrators/renderAdministrators | GET /administradores → administratorController.list → administratorModel.findAll | No devuelve password_hash. Todas las cuentas actuales tienen el mismo nivel de acceso. |
| RF22 Crear administrador | administrator-form submit | POST /administradores → administratorController.create → administratorModel.create | Nombre, correo y clave mínima de 6; correo duplicado produce 409. |
| RF23 Activar/desactivar | data-admin-id, data-next-active | PATCH /administradores/:id/estado → updateStatus → setStatus | Exige booleano y prohíbe desactivar la propia cuenta; falta revocar sesiones ajenas existentes. |

Soporte transversal: ui.js da formato COP, cantidades y fechas, escapa HTML y muestra mensajes. api.js agrega /api, cabeceras y token, serializa JSON y trata respuestas. server.js carga configuración y comprueba conexión; app.js registra páginas, archivos estáticos, rutas y errores. INICIAR.bat facilita arrancar en Windows, aunque abre el navegador antes de confirmar que el servidor esté listo y usa el puerto fijo 3000.

## 6. Las siete tablas y los siete triggers

| Tabla | Qué representa | Relación principal |
|---|---|---|
| administradores | Usuarios que operan el sistema | Un administrador puede atender muchas ventas. |
| categorias | Clasificación del catálogo | Una categoría contiene muchos productos. |
| productos | Precio y existencia en su unidad base | Cada producto pertenece a una categoría. |
| ventas | Cabecera: fecha, cliente, cobro, total y estado | Tiene muchos detalles y movimientos. |
| detalle_venta | Cada línea vendida, cantidad y precio histórico | Relaciona una venta con un producto; subtotal generado por MySQL. |
| movimientos | Registro monetario ligado a la venta | Actualmente el código inserta pagos; no es un kardex de inventario. |
| auditoria_productos | Valores anteriores/nuevos de edición y borrado | Conserva producto_id sin FK para sobrevivir al borrado del producto. |

No hay tabla independiente de clientes: solo se guarda cliente_nombre. Los ENUM incluyen estados y movimientos que todavía no tienen interfaz ni endpoints: pendiente, cancelada, devolución y otros no prueban que exista la funcionalidad.

| Trigger | Momento y efecto |
|---|---|
| trg_producto_validar_insert | Antes de crear producto: precio >0 y stock >=0. |
| trg_producto_validar_update | Antes de actualizar producto: mismas restricciones. |
| trg_producto_auditar_update | Después de UPDATE: guarda valores anteriores y nuevos; también se activa al descontar stock por venta. |
| trg_producto_auditar_delete | Antes de DELETE: registra lo eliminado; si la sentencia falla, sus efectos se revierten en tablas transaccionales. |
| trg_administrador_validar_email | Antes de INSERT de administrador: comprobación básica de formato. |
| trg_detalle_validar_insert | Antes de INSERT de detalle: cantidad y precio positivos, existencia suficiente. |
| trg_detalle_descontar_stock | Después de INSERT de detalle: stock = stock - cantidad. |

Un trigger queda instalado en MySQL al ejecutar su CREATE TRIGGER. Modificar el texto del archivo no modifica el trigger que ya existe. Para comprobar la base instalada se puede consultar SHOW TRIGGERS y SHOW CREATE TRIGGER sobre una conexión autorizada. La [documentación de MySQL sobre triggers](https://dev.mysql.com/doc/refman/8.4/en/trigger-syntax.html) explica su ejecución y comportamiento ante errores en tablas transaccionales.

## 7. Explicación completa de una venta

Ejemplo: precio $38.000 por kg, stock inicial 15 kg, venta 400 g, recibido $20.000.

1. El botón Agregar coloca el producto en el arreglo cart del navegador. Todavía no hay venta ni descuento.
2. El navegador convierte 400 g a 0,4 kg y presenta $15.200 y cambio $4.800.
3. Registrar envía producto_id, cantidad=400, unidad_venta=g y datos del cobro. No se envía un precio que el servidor deba aceptar.
4. apiRequest agrega Authorization: Bearer y manda POST /api/ventas.
5. requireAuth verifica el token y establece req.user. El controlador toma de allí administradorId; no confía en un administrador enviado por el navegador.
6. saleController.create valida artículos, cantidades y método de pago.
7. saleModel.create obtiene una conexión e inicia la transacción.
8. SELECT ... FOR UPDATE consulta y bloquea los productos; vuelve a leer precio, unidad, estado y stock de MySQL.
9. measurementService convierte y redondea la cantidad base a tres decimales. El modelo valida disponibilidad y calcula total y cambio.
10. Inserta la cabecera en ventas y después los detalles. MySQL genera cada subtotal.
11. Al insertar cada detalle, los triggers validan y descuentan stock. El UPDATE de productos dispara además validación y auditoría.
12. Se inserta un movimiento de tipo pago por el total vendido, no por el efectivo entregado.
13. commit confirma todo. Ante un error se llama rollback; finalmente release devuelve la conexión al pool. Estas garantías requieren tablas transaccionales.
14. El frontend vacía el carrito, recarga catálogo y consulta el recibo guardado.

Resultado esperado: stock 14,600 kg, total $15.200, cambio $4.800. Si falla la carga del recibo después de guardar, la venta ya puede existir: un error de pantalla no demuestra que haya fallado la transacción.

Pregunta típica: «¿Dónde descuentas el inventario?». Respuesta: «En trg_detalle_descontar_stock, después de insertar cada detalle. saleModel.create realiza el INSERT dentro de una transacción. No lo descuenta renderCart».

## 8. Cómo localizar y restaurar una función en el examen

No memorices únicamente líneas: pueden cambiar de lugar. Aprende nombres, entradas, salidas y responsabilidades. Para cada fallo sigue este orden:

1. Describe qué debería ocurrir con un ejemplo verificable.
2. Localiza el botón o campo en HTML y su id/data-*.
3. Busca ese selector en JS y verifica el listener y sus importaciones.
4. Abre Consola: errores de sintaxis o selectores nulos pueden detener la inicialización.
5. En Red/Network comprueba método, URL, JSON, token y estado de respuesta. Si no sale petición, el fallo suele estar antes de la API; algunas funciones, como quitar del carrito, no necesitan petición.
6. Sigue ruta → middleware → controlador → modelo/servicio → SQL/trigger.
7. Corrige el tramo responsable y prueba caso normal y caso de error. Revisa también los datos que debían cambiar y los que debían permanecer iguales.

Guía HTTP del proyecto: 200 consulta/cambio exitoso; 201 creación; 400 datos rechazados; 401 sesión o credenciales inválidas; 404 ruta/recurso inexistente; 409 conflicto como correo repetido o producto relacionado; 500 fallo no tratado. Una ruta inexistente y una venta inexistente pueden producir el mismo código por causas distintas.

## 9. Simulacro con pistas y criterios de restauración

Practicar sobre una copia de código y una base de pruebas. Guardar un punto de comparación antes de cada ejercicio. No ejecutar el schema completo para arreglar un botón.

| Cambio que podría hacer el profesor | Dónde investigar | Cómo demostrar que quedó restaurado |
|---|---|---|
| Cambia id del botón Nuevo producto | app.html y initializeInventory | El diálogo abre y guardar crea una sola fila. |
| Cambia PUT por POST al editar | inventory.js y productRoutes.js | Editar conserva ID, no duplica producto. |
| Quita filtro de categoría del SQL | productModel.findAll | Res y Cerdo muestran conjuntos correctos con la misma búsqueda. |
| Cambia <=10 por <10 | productModel, inventory y dashboard | Un producto con stock exactamente 10 se marca y filtra como bajo. |
| Quita Authorization | api.js y authMiddleware | Con sesión carga inventario; sin token devuelve 401. |
| Mueve /:id antes de /resumen-categorias | saleRoutes.js | El resumen llega a dailyCategorySummary y no se interpreta como ID. |
| Cambia /1000 por /100 al convertir gramos | measurementService y quantityInBase | 400 g equivalen a 0,4 kg y $15.200 con precio $38.000/kg. |
| Permite 1,5 en productos por unidad | cartIsValid y measurementService | La pantalla y el servidor rechazan unidades fraccionarias. |
| Cambia la fórmula del cambio | updatePayment y saleModel.create | $20.000 − $15.200 = $4.800; recibido insuficiente rechaza venta. |
| Quita el trigger de descuento en la base de pruebas | SHOW TRIGGERS y definición SQL | Una venta baja de 15 a 14,6 kg exactamente una vez. |
| Quita rollback o usa otra conexión | saleModel.create | Un fallo en un detalle posterior no deja cabecera, pagos ni descuentos parciales. |
| Cambia JOIN o filtro por fecha | saleModel.findAll/dailyCategorySummary | Solo aparecen ventas del día y subtotales de categoría correspondientes. |
| Quita renderReceiptItems o su listener | sales.js showReceipt | Cambiar categoría altera filas y subtotal visible, conserva total original. |
| Quita CSS de impresión | styles.css @media print | Vista previa incluye comprobante/reporte y oculta controles. |
| Cambia booleano a texto en estado | administrators.js y updateStatus | PATCH envía true/false JSON y actualiza la cuenta; autodesactivación se rechaza. |
| Quita escapeHtml del nombre | ui.js y render correspondiente | Un nombre con < y > se presenta como texto, sin interpretarse como HTML. |
| Cambia credenciales/puerto de conexión | config/database.js y configuración local | Arranque confirma conexión; nunca copiar secretos en el informe. |

Para simular stock insuficiente desde la interfaz, recuerda que cartIsValid deshabilita el botón. El caso BB-005 del plan existente debe ajustar ese procedimiento: por ejemplo, preparar un carrito válido y reducir disponibilidad desde otra sesión de pruebas antes de enviarlo. Además, el rechazo normal del modelo usa «Producto no disponible o stock insuficiente», no necesariamente el texto del trigger. Un resultado esperado debe corresponder a la capa que realmente se alcanza.

## 10. Orden de estudio y de mejora

Estudio recomendado: primero arranque y login; después CRUD de productos; luego carrito y medidas; después venta con transacción y triggers; finalmente historial, impresión y administradores. Para cada operación completa una ficha: objetivo, entrada, evento, petición, validación, consulta, respuesta y prueba negativa.

Mejora recomendada: primero congelar una versión funcional y registrar resultados de pruebas; después ordenar documentación y scripts SQL; luego corregir sesiones, redondeo, historial y reenvío de ventas; por último dividir módulos grandes. Cada cambio debe conservar los requisitos conocidos y tener un caso de aceptación.

No se encontraron funcionalidades implementadas de proveedores, compras, devoluciones, anulación de ventas, recuperación/cambio de contraseña, roles diferenciados o mantenimiento de categorías. No se deben prometer en la defensa por tener un nombre en un ENUM o por ser habituales en otros sistemas. Solo se agregan si son requisitos acordados.

Una defensa breve de la arquitectura puede ser: «Districarnes tiene interfaz web, una API Express organizada en rutas, controladores, modelos y servicios, y una base MySQL. Los scripts SQL documentan cómo instalarla. Las ventas se ejecutan en una transacción y el stock se descuenta mediante un trigger. Estoy separando scripts de instalación y demostración y relacionando cada requisito con su código y su prueba».
