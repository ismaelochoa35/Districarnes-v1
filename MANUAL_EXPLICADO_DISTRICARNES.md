# Entender Districarnes: de la pantalla al código

## 1. ¿De qué se trata tu proyecto?

Districarnes es una aplicación para que una persona que atiende una carnicería pueda consultar los productos disponibles, actualizar el inventario y registrar lo que vende. También permite revisar ventas anteriores, imprimir comprobantes y crear cuentas para otras personas que van a operar el sistema. Su propósito es organizar esas tareas en un solo lugar.

Imagina una situación de trabajo: llega un cliente y pide 400 gramos de Punta de Anca. La persona que atiende busca el producto, lo agrega al carrito, indica la cantidad y registra cómo pagó el cliente. El sistema calcula cuánto debe cobrar, comprueba las existencias, guarda la venta y disminuye el inventario. Finalmente muestra el recibo. Esa situación resume la operación más importante del proyecto.

El inventario y las ventas están conectados. Un producto creado en Inventario puede aparecer en Nueva venta cuando está activo y tiene existencias. Una venta registrada aparece en Historial y afecta las cifras de resumen. Por eso los módulos no son pantallas independientes sin relación: comparten productos, categorías, cuentas y ventas.

El proyecto no hace todo lo que podría hacer un negocio. No se encontraron compras a proveedores, contabilidad completa, devoluciones operativas, pagos bancarios conectados ni facturación electrónica integrada. Seleccionar Tarjeta o Transferencia registra el método elegido; no significa que la aplicación consulte un banco. Esto es importante para explicar con precisión qué desarrollaste.

Las capturas de pantalla de esta edición utilizan el HTML, CSS y JavaScript reales del proyecto con datos ilustrativos suministrados para el manual. No representan el estado actual de tu base ni son evidencia de ventas ejecutadas. Los círculos numerados se agregaron a las capturas para ayudarte a ubicar controles. Las capturas de código sí reproducen fragmentos de tus archivos, con sus números de línea.

## 2. Cómo entender MVC sin perderte en los nombres

La Vista es lo que la persona ve y utiliza: el formulario de acceso, el menú, la tabla de inventario, los campos y los botones. En tu proyecto se construye en FRONTEND. El HTML coloca los elementos, el CSS les da presentación y el JavaScript del navegador responde a lo que hace la persona.

El Controlador recibe una solicitud de la Vista. Por ejemplo: «quiero crear este producto con este nombre, este precio y este stock». Examina los datos y decide si puede continuar. Si faltan datos o son inválidos, devuelve un mensaje. Si son válidos, pide al Modelo que haga la operación. Tus controladores están en BACKEND/src/controllers.

El Modelo se encarga de las operaciones sobre los datos y parte de las reglas del negocio. Sus archivos están en BACKEND/src/models y utilizan MySQL. Guardar un producto significa insertar una fila en una tabla; listar productos significa consultarlas. Los servicios y los triggers apoyan las reglas y operaciones del Modelo y de la aplicación.

Las rutas no son otra pantalla. Son direcciones que permiten llegar a una operación. Por ejemplo, /api/productos identifica operaciones relacionadas con productos. El método GET pide consultar; POST pide crear; PUT pide actualizar; DELETE pide eliminar. La misma dirección puede tener comportamientos distintos porque cambia el método.

Para estudiar una función, no empieces preguntando «¿qué significa cada símbolo?». Empieza preguntando «¿qué tarea está resolviendo?». Después identifica qué recibe, qué hace con eso y qué entrega. Finalmente conecta sus instrucciones con esa tarea. Esta forma de leer te permite comprender el código aunque el profesor cambie su orden o el nombre de una variable.

## 3. Primera pantalla: entrar al sistema

[[pantalla:01_acceso]]

En la captura, el número 1 identifica el correo; el 2, la contraseña; el 3, la confirmación de contraseña; y el 4, el botón Ingresar. Los ojos a la derecha de las claves permiten ver u ocultar lo escrito. No cambian la contraseña: solo cambian cómo se muestra el campo.

### FRONTEND/index.html: dónde se construye el acceso

Este archivo contiene la primera pantalla. Cuando escribes la dirección principal del sistema, el servidor entrega este documento al navegador. Dentro aparece un formulario llamado login-form. En ese formulario se encuentran los campos email, password y password-confirmation, además del botón Ingresar.

Los nombres que aparecen después de id funcionan como identificadores: permiten que JavaScript encuentre un elemento concreto. El texto visible del botón puede decir «Ingresar», mientras que el programa lo reconoce como el botón de envío del formulario. Cambiar únicamente el texto visible no tiene el mismo efecto que cambiar un id usado por JavaScript.

Al final del HTML se carga login.js. Esa es la conexión entre la pantalla dibujada y su comportamiento. El HTML por sí solo no comprueba si una cuenta está registrada en MySQL. Su responsabilidad es ofrecer los campos y las restricciones básicas, como pedir que el correo tenga forma de correo y que los campos obligatorios no estén vacíos.

### FRONTEND/js/login.js: qué ocurre al usar el acceso

Este archivo localiza el formulario y sus campos. clearLoginFields deja los campos vacíos, vuelve a ocultar las contraseñas y limpia el mensaje de error. Por eso, si el profesor pregunta quién limpia los datos de acceso, esta función es el punto de partida.

Luego prepara los botones del ojo. Cuando haces clic, lee a qué campo apunta el botón y alterna entre mostrar texto y ocultarlo como contraseña. Los atributos data-password-target del HTML son el vínculo que le indica cuál campo debe cambiar.

La acción más importante está en el evento submit del formulario. Un evento es algo que sucede, como hacer clic, escribir o enviar un formulario. Aquí no se llama una función con un nombre propio como guardarLogin: se registra una función directamente dentro de addEventListener. Aunque no tenga nombre, sigue siendo una función y contiene comportamiento que debes estudiar.

Al enviar, evita la recarga tradicional, compara las dos claves y muestra un error si son diferentes. Si coinciden, deshabilita temporalmente Ingresar y llama a startSession. Cuando el servidor confirma el acceso, abre /app. Si el servidor rechaza los datos, muestra el error y vuelve a habilitar el botón. La confirmación de clave solo se compara en esta pantalla; la API recibe correo y una contraseña.

### BACKEND/src/routes/authRoutes.js: cómo llega el acceso al servidor

Aquí se registra POST /login y se conecta con authController.login. El prefijo /api se agrega en otro archivo, por eso la dirección completa que utiliza el navegador es POST /api/login. Esta ruta permite entrar sin tener una sesión anterior: exigir una sesión para iniciar la primera sesión impediría acceder.

También se registra POST /logout, que sí exige sesión. Su tarea es cerrar el acceso que ya existe. No confundas la ruta /login con el archivo login.js: la primera es una dirección HTTP del servidor y el segundo es un archivo que se ejecuta en el navegador.

### BACKEND/src/controllers/authController.js: decidir si puede ingresar

login recibe el correo y la contraseña. Limpia los espacios del correo, lo pasa a minúsculas y comprueba que ambos datos estén presentes. Después pide a administratorModel que busque una cuenta activa con esas credenciales. Si no existe, responde «Credenciales incorrectas». Si existe, crea una sesión y envía un token al navegador.

Un token es un identificador que el navegador presenta en las siguientes solicitudes para que el servidor reconozca la sesión. No necesitas volver a mandar la contraseña al consultar cada pantalla. logout hace la operación inversa: elimina la sesión reconocida por ese token y devuelve el mensaje de cierre.

## 4. El panel: dónde encuentras las funcionalidades

[[pantalla:02_inicio]]

En el número 1 está el menú: Inicio, Inventario, Nueva venta, Historial y Administradores. Los números 2, 3 y 4 señalan tarjetas de resumen que también se pueden pulsar. El número 5 identifica Cerrar sesión, arriba a la derecha. La ubicación descrita corresponde a la vista de escritorio; en una pantalla pequeña el CSS reorganiza el menú.

### FRONTEND/app.html: la estructura del panel completo

Este documento contiene las cinco secciones del panel. Al cambiar de menú no estás abriendo cinco archivos HTML diferentes. Sigues dentro de app.html y JavaScript oculta unas secciones y muestra otra. Por eso puedes conservar algunos filtros y el carrito mientras navegas sin recargar la página.

Cada botón del menú tiene un atributo data-section, por ejemplo inventory. La sección correspondiente se llama inventory-section. Esa coincidencia permite relacionar el botón «Inventario» con el bloque que debe verse. La clase hidden hace que una sección quede oculta, pero no elimina sus elementos del documento.

Aquí también están los formularios emergentes llamados dialog: uno de producto, otro de administrador, otro para el recibo y otro para el reporte. No son páginas nuevas. Una función los abre sobre el panel y otra los cierra. Si buscas el botón Guardar producto, debes buscar dentro de product-form; si buscas Imprimir recibo, dentro de receipt-dialog.

Algunos botones no aparecen escritos directamente en app.html. Editar y Eliminar se repiten una vez por producto y los crea inventory.js al construir cada fila. Agregar lo crea sales.js para cada tarjeta del catálogo. Esto explica por qué buscar la palabra del botón solo en HTML a veces no lo encuentra.

### FRONTEND/js/app.js: quién hace funcionar el menú

initializeApplication prepara el panel: pide las categorías al servidor, se las entrega a inventario y ventas, prepara administradores y conecta los botones. Después abre Inicio. Inicializar significa dejar listos los eventos y controles; cargar significa traer o actualizar los datos que se mostrarán.

openSection recibe el nombre de la sección elegida. Marca el botón del menú como activo, oculta las otras secciones y ejecuta la función que carga la seleccionada. sectionLoaders es la relación entre cada sección y esa función. Por ejemplo, inventory corresponde a loadInventory y home a loadDashboard.

El archivo escucha clics en elementos con data-section. Si pulsas una tarjeta que solicita stock bajo, primero ajusta ese filtro y luego abre Inventario. También conecta el botón logout con closeSession. Esta es la razón por la que modificar la navegación normalmente empieza aquí y en los atributos de app.html.

### FRONTEND/js/dashboard.js: de dónde salen los números de Inicio

loadDashboard consulta la lista de productos y las ventas de la fecha actual. Cuenta cuántos productos recibió, cuántas categorías hay, cuántos productos tienen stock menor o igual que diez y cuántas ventas se encontraron. Luego escribe esos números en las tarjetas del HTML.

No guarda esas cifras en una tabla llamada dashboard. Las calcula cuando carga la pantalla a partir de consultas existentes. Tampoco muestra utilidad del negocio: contar ventas no es calcular ganancias. Los productos inactivos siguen incluidos en el conteo general porque la consulta de productos los devuelve.

## 5. Inventario: consultar y cambiar productos

[[pantalla:03_inventario]]

El botón 1, Nuevo producto, está arriba a la derecha del Inventario. El campo 2 busca por nombre o corte. El selector 3 cambia la categoría y la casilla 4 limita la consulta a stock bajo. Los botones 5 y 6 son Editar y Eliminar: pertenecen a una fila concreta, por eso cada uno debe llevar el identificador de su producto.

Las pestañas con nombres de categorías son otra forma de seleccionar la categoría. El resumen al lado muestra lo vendido ese día para la seleccionada. Ese resumen habla de ventas; la tabla habla de existencias. No debes interpretar el total vendido como el valor del inventario disponible.

### FRONTEND/js/inventory.js: las funciones que mueven esta pantalla

initializeInventory recibe las categorías, llena los selectores, dibuja las pestañas y conecta los eventos. Allí el clic de new-product llama a openProductForm sin pasarle un producto. Esa ausencia significa «vamos a crear uno nuevo». El clic de close-dialog cierra la ventana sin guardar.

openProductForm se utiliza tanto para crear como para editar. Primero limpia el formulario. Si recibe un producto, coloca sus datos y su ID; si no recibe ninguno, prepara valores iniciales y deja el ID vacío. Finalmente llama a showModal para que la ventana aparezca. Abrir la ventana todavía no modifica MySQL.

productPayload recoge lo escrito en nombre, corte, categoría, unidad, precio, stock y activo. Lo convierte en un objeto para enviarlo. Piensa en esa función como el momento en que el programa reúne los campos de la ficha: aún no los guarda, solo los organiza.

El evento submit de product-form realiza el envío. Si product-id tiene valor, usa PUT y agrega ese ID a la dirección; si está vacío, usa POST. Ambos casos aprovechan productPayload. Cuando la API confirma, cierra la ventana, muestra el aviso y llama a loadInventory para que la tabla refleje el cambio. Si hay error, muestra el mensaje.

loadInventory toma los filtros actuales y pide al servidor los productos correspondientes. Puede pedir además el resumen diario de categorías. Cuando llegan los datos, los conserva en products y llama a renderProducts. Esta separación importa: loadInventory consigue la información y renderProducts la convierte en filas visibles.

renderProducts crea la tabla, incluyendo los botones Editar y Eliminar de cada fila. data-edit y data-delete contienen el ID del producto. Al pulsar Editar, el listener busca ese producto dentro de la lista cargada y lo pasa a openProductForm. Al pulsar Eliminar, pide confirmación y envía DELETE /api/productos/ID. Si el producto ya tiene ventas relacionadas, MySQL puede impedir el borrado y la API responde con un conflicto.

renderCategoryTabs construye las pestañas y marca la seleccionada. selectInventoryCategory cambia el valor del selector, redibuja esas pestañas y puede recargar la tabla. selectLowStock marca o desmarca la casilla y puede recargar. renderCategorySummary busca los datos de la categoría seleccionada y escribe su total diario, fecha y cantidad.

Escribir en la búsqueda provoca una nueva consulta; cambiar stock bajo también. La opción refreshSummary=false evita pedir otra vez el resumen cuando solo cambió la búsqueda. Así puedes explicar para qué sirve ese parámetro sin memorizar la llamada completa.

[[pantalla:04_producto]]

En el formulario, el número 1 es el nombre; el 2, la categoría; el 3, el precio; el 4, la existencia; y el 5, Guardar. El precio y la existencia dependen de la unidad elegida: si es kg, el precio es por kilogramo y el stock se interpreta en kilogramos. «Activo» controla si podrá ofrecerse en el catálogo de ventas; desactivarlo no borra su información.

### BACKEND/src/routes/productRoutes.js: las cuatro operaciones del inventario

Este archivo dice qué controlador atiende cada acción: GET lista, POST crea, PUT /:id actualiza y DELETE /:id elimina. Antes de permitir cualquiera, exige una sesión válida. El texto :id es un espacio variable: /productos/7 significa que el producto solicitado tiene identificador 7.

Aquí no se calcula un precio ni se dibuja una tabla. Si una petición usa el método equivocado o una dirección que no coincide, puede no llegar al controlador esperado. Por eso revisar la ruta es un paso diferente de revisar los campos del formulario.

### BACKEND/src/controllers/productController.js: revisar antes de guardar

parseProduct toma los datos enviados y los prepara: elimina espacios innecesarios de los textos y transforma ciertas entradas en números. validateProduct comprueba que haya nombre, categoría numérica válida, unidad permitida, precio positivo y stock no negativo. parseId comprueba que un identificador sea un entero positivo.

create utiliza esas comprobaciones y, si todo está bien, pide al Modelo que inserte el producto. update revisa además el ID y solicita actualizar esa fila. remove verifica el ID y solicita eliminarla. list interpreta los filtros de búsqueda y pide los resultados. Estas funciones deciden la respuesta que recibe el navegador, por ejemplo «Producto creado» o «Producto no encontrado».

La validación actual todavía puede mejorar; no debes afirmar que cubre cualquier entrada imaginable. Lo esencial para entenderla es que escribir un dato en un formulario no da autorización para guardarlo sin revisión en el servidor.

### BACKEND/src/models/productModel.js: donde se escribe el SQL

findAll consulta productos y los relaciona con categorías para devolver también el nombre de la categoría. Agrega las condiciones de búsqueda y stock bajo y ordena por nombre. La palabra LIKE sirve para buscar coincidencias de texto. Los signos ? reciben valores separados de la consulta.

create ejecuta INSERT, que añade un producto. update ejecuta UPDATE, que cambia datos del producto identificado. remove ejecuta DELETE, que intenta borrar la fila. Las funciones de escritura devuelven el nuevo ID o cuántas filas se afectaron; el controlador usa ese resultado para responder.

Este archivo es el lugar adecuado para buscar cómo se guarda un campo. Pero si el problema es que el botón no abre el formulario, todavía no se ha llegado a este archivo: primero debes revisar la Vista.

## 6. Nueva venta: del producto seleccionado al cobro

[[pantalla:05_venta]]

En esta captura, el número 1 identifica la búsqueda del catálogo; el 2, Agregar; el 3, la cantidad; el 4, su unidad; el 5, el método de pago; y el 6, Registrar venta. El carrito está al lado del catálogo en escritorio. Dentro de cada línea también existe Quitar. El cliente y el efectivo recibido se escriben en la zona de cobro.

Agregar no guarda una venta y Quitar no borra una venta registrada. Ambos modifican una compra que aún estás preparando. El cambio definitivo ocurre cuando el servidor acepta Registrar venta. Esto explica por qué debes distinguir la información temporal del carrito de los registros duraderos en MySQL.

### FRONTEND/js/sales.js: catálogo y carrito

loadSaleCatalog trae los productos del servidor. visibleProducts selecciona los que están activos, tienen stock y coinciden con la búsqueda y categoría elegidas. renderCatalog toma esa selección y dibuja las tarjetas por páginas de 24. Por eso los botones Anterior y Siguiente cambian qué tarjetas ves, pero no hacen una venta.

categoryImage decide qué imagen usar cuando el producto no trae una propia. Convierte el nombre de categoría a un nombre de archivo. Así, Vísceras termina relacionado con visceras.png. Si falta la imagen, eso no demuestra que falte el producto en la base.

Cuando pulsas Agregar, el evento busca el producto y lo copia al arreglo cart si todavía no estaba. Un producto por peso empieza con 400 g; uno por unidad, con cantidad 1. En el comportamiento actual, volver a pulsar Agregar sobre el mismo producto no aumenta la cantidad: debes cambiarla en el campo.

renderCart vuelve visible ese arreglo: crea las líneas, campos de cantidad, listas de unidad y botones Quitar. También escribe el total y habilita o deshabilita Registrar venta según cartIsValid. Si el carrito está vacío o tiene una cantidad inválida, no debe quedar listo para registrar.

quantityInBase convierte lo que escribiste a la unidad del producto. cartTotal utiliza esa cantidad convertida para sumar precios. cartIsValid revisa que cada cantidad sea positiva, válida y no supere el stock que se cargó en la pantalla. convertDisplayedQuantity cambia la cantidad mostrada cuando eliges otra unidad, intentando conservar el mismo peso. saleUnitOptions ofrece solo las unidades que corresponden al producto.

Un ejemplo: si el producto se vende por kilogramo, 400 g deben convertirse en 0,4 kg antes de multiplicar por su precio. Si cuesta $38.000/kg, el subtotal es $15.200. Multiplicar 400 directamente por 38.000 sería interpretar gramos como kilogramos.

### FRONTEND/js/sales.js: pago y registro

updatePayment muestra los campos de efectivo cuando eliges Efectivo y presenta el cambio. Para Tarjeta y Transferencia oculta esos campos y toma el total como recibido. No realiza un cobro bancario.

initializeSales prepara todas las búsquedas, selectores y botones del módulo. Dentro están las funciones sin nombre que responden a Agregar, cambiar cantidad, cambiar unidad, Quitar, cambiar pago y Registrar venta. Puedes encontrarlas buscando el id del botón o el atributo data-* que aparece en la tarjeta.

Al pulsar save-sale, el código envía los IDs de productos, cantidades, unidades y datos de cobro mediante POST /api/ventas. No envía un precio que el servidor deba aceptar a ciegas. Al recibir éxito, vacía el carrito, limpia cliente y recibido, actualiza el catálogo y llama a showReceipt con el ID de la nueva venta.

### BACKEND/src/routes/saleRoutes.js: dónde llegan las solicitudes de ventas

POST / se conecta con create para registrar; GET / se conecta con list para historial; GET /resumen-categorias entrega totales por categoría; GET /:id entrega un recibo. Todas llevan /api/ventas como dirección base y exigen sesión.

La ruta fija resumen-categorias está antes de /:id para que el servidor no intente interpretar esa palabra como el número de una venta. Ese orden es algo concreto que el profesor podría cambiar y que necesitas reconocer.

### BACKEND/src/controllers/saleController.js: revisar la solicitud de venta

create comprueba que llegue una lista con productos, que cada producto tenga un ID positivo y que las cantidades y unidades sean válidas. También revisa el método de pago. La cuenta que atendió se toma de la sesión reconocida por el servidor; no depende de que el navegador escriba un administrador cualquiera.

list interpreta la fecha y categoría del historial; dailyCategorySummary interpreta la fecha del resumen; detail revisa el ID del recibo. parseDate y parseCategoryId son auxiliares que preparan esos filtros. Una función auxiliar ayuda a otra y evita repetir la misma comprobación.

### BACKEND/src/services/measurementService.js: la conversión que usa el servidor

convertToBaseQuantity convierte gramos, kilogramos y libras a la unidad base guardada en el producto. Para artículos por unidad solo acepta cantidades enteras. Si la combinación no tiene sentido, devuelve un valor inválido que el modelo debe rechazar.

El servidor vuelve a hacer la conversión aunque el navegador ya la haya mostrado. La pantalla puede estar desactualizada o alguien puede modificar una petición; el servidor necesita comprobarla por sí mismo. Actualmente hay una diferencia de redondeo entre ambas capas para algunas cantidades, identificada en la revisión anterior.

### BACKEND/src/models/saleModel.js: guardar todo como una operación

create reserva una conexión y abre una transacción. Una transacción agrupa cambios que deben confirmarse juntos: la venta, sus detalles, el movimiento de pago y los efectos de los triggers. No sería correcto guardar el pago si falló el detalle o descontar un producto de una venta que no quedó registrada.

Primero consulta cada producto real, comprueba que esté activo, toma su precio y stock y bloquea la fila mientras decide la operación. Convierte la cantidad, comprueba existencias y suma el total. Luego revisa si el efectivo recibido alcanza. Si algo falla, no debe confirmar una venta parcial.

Después inserta la cabecera en ventas. Esa cabecera contiene cliente, fecha, quién atendió, método de pago y total. Inserta una línea en detalle_venta por cada artículo. En ese momento MySQL ejecuta el trigger que descuenta las existencias. También guarda un movimiento de pago. commit confirma; rollback revierte ante error; release devuelve la conexión para que otras operaciones puedan usarla.

El mismo archivo contiene findAll para el historial, findDailyCategorySummary para los resúmenes y findById para un recibo. Son consultas de información guardada: abrir un recibo no debería volver a descontar inventario.

## 7. Historial, recibo e impresión

[[pantalla:06_historial]]

El número 1 elige fecha; el 2, categoría; el 3 muestra el total consultado; el 4 abre el recibo de una fila; y el 5 abre el reporte diario. Una fila representa una venta. Si filtras por categoría, el subtotal mostrado puede ser menor que el total completo de esa venta porque solo considera la categoría elegida.

### Las funciones de sales.js que explican esta pantalla

loadSalesHistory lee fecha y categoría, pide las ventas y el resumen, dibuja las filas y conserva los datos necesarios para imprimir. Cambiar un filtro vuelve a consultar. El filtro no modifica ni elimina ventas: cambia cuáles ves.

showReceipt pide al servidor la venta seleccionada y construye el comprobante. Dentro tiene renderReceiptItems, que dibuja los artículos y permite filtrar su detalle por categoría. Ese filtro cambia el subtotal visible, pero conserva el total de la venta completa.

[[pantalla:07_recibo]]

En el recibo aparecen número de venta, fecha, cliente, persona que atendió, pago, artículos y totales. Imprimir llama a window.print; Cerrar cierra el diálogo. Los botones se declaran en app.html y sus eventos se conectan en sales.js. El contenido del recibo lo genera showReceipt después de consultar sus datos.

openDailyReport toma los datos que loadSalesHistory dejó preparados y abre otra ventana con el resumen de la fecha y categoría consultadas. No crea otra venta ni una tabla nueva de reportes.

[[pantalla:08_reporte]]

Este reporte permite imprimir la lista y el total consultado. Si la información cambia después de cargar el historial, debes volver a consultarlo para que el reporte refleje esos cambios. La impresión utiliza la vista del navegador, no un servicio de generación de comprobantes en el backend.

## 8. Administradores: quién puede usar el sistema

[[pantalla:09_cuentas]]

El número 1 abre el formulario para crear una cuenta. El número 2 cambia el estado de la cuenta de esa fila. Activo significa que puede iniciar sesión; Inactivo impide un nuevo ingreso. En esta versión todas las cuentas son administradores: no se encontraron roles separados de cajero y supervisor.

### FRONTEND/js/administrators.js: lista, formulario y botones

loadAdministrators consulta las cuentas. renderAdministrators las convierte en filas y crea el botón Activar o Desactivar según el estado actual. El botón contiene data-admin-id, que identifica la cuenta, y data-next-active, que indica el estado que se quiere asignar.

initializeAdministrators conecta Nuevo administrador, Cerrar, el envío del formulario y los botones de estado. Al enviar el formulario recoge nombre, correo y contraseña y pide POST /api/administradores. Si funciona, limpia campos, cierra y recarga. Para cambiar estado envía PATCH /api/administradores/ID/estado con un verdadero o falso.

[[pantalla:10_cuenta_nueva]]

El formulario está escrito en app.html. El botón Crear acceso es un botón de envío: por eso la función que debes localizar está en el evento submit de administrator-form, no necesariamente en un listener de clic con el mismo texto.

### BACKEND/src/routes/administratorRoutes.js

Asocia consultar, crear y cambiar estado con list, create y updateStatus del controlador. Todas requieren sesión. No hay una ruta implementada para cambiar contraseñas desde la pantalla actual; el texto «contraseña temporal» del formulario no demuestra que exista ese flujo posterior.

### BACKEND/src/controllers/administratorController.js

list pide y devuelve cuentas. create revisa nombre, correo y longitud mínima de la clave, y solicita guardarla. Si el correo ya existe, responde que está duplicado. updateStatus comprueba ID y estado booleano e impide desactivar la misma cuenta que está atendiendo la solicitud.

Esa última restricción protege contra autodesactivarse en ese momento. No soluciona todavía todos los casos de sesión: cuando desactivas otra cuenta, su sesión que ya estaba abierta puede seguir reconocida. Conviene conocer esta limitación y no prometer que la desconexión sea inmediata.

### BACKEND/src/models/administratorModel.js

findActiveByCredentials busca una cuenta activa con el correo y hash de contraseña adecuados; la usa el login. findAll consulta los datos que se muestran en Administradores sin devolver el hash. create inserta la cuenta y transforma la clave con SHA2. setStatus cambia activo en la cuenta indicada.

Este archivo se relaciona tanto con acceso como con mantenimiento de cuentas. Por eso no todos los modelos corresponden a una única pantalla. El modo de guardar contraseñas necesita mejorarse, pero debes explicar primero lo que el código actual realiza.

## 9. Las categorías también recorren varios archivos

### BACKEND/src/routes/categoryRoutes.js

Esta ruta permite GET /api/categorias con sesión válida. Se utiliza al preparar los filtros del panel. No existen rutas de crear, editar o eliminar categorías en la aplicación revisada.

### BACKEND/src/controllers/categoryController.js

Su función list pide al modelo todas las categorías y responde con ellas. Si la consulta falla, entrega el error al manejador compartido. Es breve porque no tiene formularios de escritura ni filtros complejos que interpretar.

### BACKEND/src/models/categoryModel.js

findAll consulta ID y nombre de categorías y ordena por nombre. El ID es el que se envía al filtrar; el nombre es lo que ve la persona. No conviene usar el texto visible como sustituto del ID porque los nombres pueden cambiar.

app.js del frontend recibe esa lista y se la pasa a inventory.js y sales.js. Ambos llenan opciones y pestañas con ella. Una falla en categorías al inicializar puede afectar varios módulos, aunque la persona crea que solo falló un selector.

## 10. Los archivos que conectan todo

### FRONTEND/js/api.js: el encargado de llevar y traer solicitudes

apiRequest es la función que usan las pantallas para hablar con el servidor. Recibe una dirección, un método y, cuando corresponde, datos. Agrega /api a la dirección, incluye el token de sesión, convierte los datos a JSON y espera la respuesta. Si la operación fue rechazada, lanza un error para que la pantalla lo muestre.

hasSession solo comprueba si el navegador tiene un token guardado. startSession llama al login y guarda el token devuelto. closeSession pide cerrar el acceso y limpia la copia local incluso si hubo un error de comunicación. Guardar un token local no garantiza que el servidor todavía lo reconozca.

La ventaja de apiRequest es que no repites la preparación de solicitudes en cada pantalla. Si todas dejan de enviar el token, revisar este archivo puede ser más útil que revisar cada controlador por separado.

### FRONTEND/js/ui.js: pequeñas ayudas de presentación

La función $ abrevia la búsqueda de un elemento HTML por selector. formatMoney presenta valores como moneda colombiana; no consulta precios. formatQuantity presenta cantidades con su unidad. formatDate y formatDateTime presentan fechas; today obtiene la fecha del navegador para filtros.

escapeHtml permite incluir un texto dentro del HTML sin interpretar sus signos como etiquetas. Por ejemplo, un nombre con < y > debería seguir siendo un nombre visible, no convertirse en elementos de página. showMessage escribe un aviso de éxito o error y lo quita después de unos segundos; messageTimer evita que un temporizador anterior quite un aviso nuevo demasiado pronto.

Estas funciones se reutilizan en varios módulos. No registran ventas ni modifican productos. Si todos los precios se ven con un formato incorrecto, formatMoney es una referencia directa; si el valor guardado es incorrecto, el problema puede estar en el cálculo y no en el formato.

### BACKEND/src/middleware/authMiddleware.js: reconocer la sesión

requireAuth mira el token enviado en la cabecera Authorization y pregunta a sessionService si existe. Si no existe, detiene la petición con 401. Si existe, coloca los datos de la persona en req.user y permite continuar al controlador.

Ocultar el menú no reemplaza esta comprobación. Una solicitud podría hacerse sin pulsar un botón, por lo que el servidor debe proteger las operaciones de datos. requireAuth no vuelve a pedir la contraseña: reconoce una sesión creada antes.

### BACKEND/src/services/sessionService.js: recordar quién entró

create genera un token aleatorio y guarda una relación entre ese token y los datos básicos de la cuenta. find busca esa relación. remove la elimina al cerrar sesión. Todo se conserva en un Map de la memoria de Node, no en una tabla persistente.

Por eso reiniciar Node hace que los tokens anteriores dejen de estar reconocidos. Los productos y ventas no se pierden por ese reinicio porque viven en MySQL. Esta diferencia entre información temporal y persistente explica un comportamiento que puede aparecer durante el examen.

### BACKEND/src/middleware/errorMiddleware.js: cómo se informan fallos

notFound responde cuando ninguna ruta atiende la petición. errorHandler recibe errores que los controladores le pasan y construye una respuesta. Algunos conflictos se convierten a 409; los errores internos se registran en consola y se muestran con un mensaje general.

Si ves 404, puede faltar una ruta o no existir el recurso pedido. Si ves 401, revisa la sesión. Si ves 400, revisa los datos enviados. Un 500 requiere mirar el servidor: el mensaje general de pantalla no explica por sí solo la causa.

## 11. ¿Qué pasa al encender el proyecto?

### INICIAR.bat

Este archivo facilita iniciar el proyecto en Windows. Entra a BACKEND, instala dependencias si falta node_modules, comprueba que exista .env, abre el navegador y ejecuta npm start. No construye la base de datos ni reemplaza MySQL Server.

### BACKEND/package.json y BACKEND/package-lock.json

package.json declara qué necesita el backend y qué comandos se pueden ejecutar. npm start corresponde a node src/server.js. npm run dev utiliza el mismo archivo con vigilancia de cambios. Express atiende HTTP, mysql2 permite consultar MySQL y dotenv carga variables locales.

package-lock.json registra versiones concretas de dependencias para instalar de forma consistente. No contiene las reglas de inventario. Si quieres cambiar el descuento de stock, no lo buscas aquí; si quieres saber qué se ejecuta al arrancar, miras scripts en package.json.

### BACKEND/src/server.js

startServer comprueba primero la conexión con la base y luego abre el puerto para atender al navegador. handleServerError informa, por ejemplo, si el puerto ya está ocupado. Este archivo decide cuándo empezar a escuchar; app.js define qué atender una vez que el servidor está escuchando.

### BACKEND/src/app.js

Prepara Express para recibir JSON, entregar los archivos de FRONTEND y montar las rutas /api. También indica que / entrega index.html y /app entrega app.html. Al final conecta los manejadores de error.

El app.js del backend y el app.js del frontend tienen el mismo nombre, pero tareas diferentes. El primero organiza el servidor; el segundo organiza el panel dentro del navegador. Debes fijarte en la carpeta antes de explicar un archivo.

### BACKEND/src/routes/index.js

Reúne las rutas de autenticación, categorías, productos, ventas y administradores. Puedes entenderlo como el punto donde se organizan las direcciones del sistema. El archivo de productos escribe sus rutas desde /; este agrupador añade /productos y app.js añade /api. Entre los tres forman la dirección final.

### BACKEND/src/config/database.js y BACKEND/.env

database.js prepara un pool, es decir, conexiones reutilizables con MySQL. Los modelos lo importan para ejecutar sus consultas. checkConnection pregunta qué base está conectada y qué versión de MySQL responde; server.js usa esa comprobación antes de arrancar.

.env contiene la configuración del equipo: dirección y puerto de MySQL, usuario, contraseña, nombre de base y puerto de la aplicación. Cambiar el nombre de base selecciona otra; no crea automáticamente sus tablas. Las claves privadas no deben aparecer en capturas del manual ni entregarse como documentación pública.

## 12. Dónde está la apariencia y por qué se mueven los botones

### FRONTEND/css/styles.css

Este archivo organiza colores, tamaños, espacios, columnas, tablas, formularios y ventanas. Las reglas que comienzan con punto se aplican a clases HTML, como .card o .hidden. El JavaScript puede cambiar una clase y el CSS cambia entonces la apariencia correspondiente.

.hidden oculta secciones del panel; .active distingue una pestaña o botón seleccionado; .stock.low destaca una existencia baja. .sales-layout coloca catálogo y carrito; .side-nav organiza el menú; los estilos de dialog dan forma a formularios emergentes. Los nombres ayudan a relacionar lo que ves con el bloque de apariencia que lo controla.

Las reglas @media adaptan el diseño al ancho disponible. En escritorio el menú está a un lado y el carrito junto al catálogo; en pantallas pequeñas el contenido se reorganiza. Por eso «dónde está el botón» debe interpretarse según el dispositivo, aunque el ID y la función que lo atienden no cambien.

@media print decide qué queda visible al imprimir. Las acciones Imprimir llaman a window.print, y estas reglas ocultan el panel y muestran el diálogo abierto. Si el recibo sale con menú y botones, debes revisar este bloque además del evento de impresión.

### FRONTEND/images: res.png, cerdo.png, pollo.png, pescado.png y visceras.png

Son las imágenes que sales.js puede usar para las categorías del catálogo. No contienen funciones. Su relación con el programa es el nombre y la dirección del archivo: categoryImage los calcula y Express los entrega como recursos de FRONTEND.

## 13. La base de datos explicada como información del negocio

### BACKEND/database/schema.sql

Este archivo contiene instrucciones para construir tablas, relaciones, datos iniciales y triggers. La base que está funcionando vive en MySQL Server. El archivo no se ejecuta cada vez que pulsas un botón: las consultas de los modelos trabajan con los objetos ya instalados.

administradores guarda las cuentas; categorias clasifica artículos; productos guarda el catálogo, su precio y existencias. ventas guarda la información general de cada compra; detalle_venta guarda los productos vendidos en esa compra. movimientos registra importes asociados y auditoria_productos conserva cambios de productos.

La separación entre ventas y detalle_venta es fácil de entender con un recibo: arriba aparecen fecha, cliente, pago y total; debajo puede haber varios artículos. Guardar toda la cabecera repetida por cada artículo no es la organización usada aquí. Una venta se relaciona con varias líneas de detalle.

Las relaciones protegen la coherencia. Un producto necesita una categoría existente. Una línea de venta necesita un producto y una venta existentes. Un producto que ya aparece en ventas no se borra libremente, porque perderías la referencia de lo vendido. Desactivar y eliminar son acciones distintas.

Un trigger es una regla que MySQL ejecuta automáticamente ante un cambio. trg_producto_validar_insert y trg_producto_validar_update impiden precio no positivo y stock negativo. trg_producto_auditar_update y trg_producto_auditar_delete registran cambios y borrados. trg_administrador_validar_email comprueba una forma básica de correo al insertar cuentas.

trg_detalle_validar_insert revisa cantidad, precio y disponibilidad al insertar un detalle. trg_detalle_descontar_stock descuenta su cantidad del producto después de insertar. Por eso, si preguntas «¿qué instrucción baja el inventario cuando vendo?», la respuesta termina en ese trigger. El UPDATE que hace también provoca la auditoría de productos.

El subtotal de cada detalle se calcula automáticamente como cantidad por precio_unitario. La aplicación conserva ese precio de venta, aunque después cambie el precio del catálogo. Sin embargo, los recibos actuales consultan algunos otros datos del producto desde el catálogo vigente; esa conservación histórica aún puede mejorarse.

El inicio del script elimina tablas antes de reconstruirlas. No debes ejecutarlo entero para reparar una función de pantalla ni actualizar una instalación que debe conservar sus ventas. Cambiar el texto del trigger en el archivo tampoco cambia el trigger que ya existe en MySQL: instalación de código SQL y uso del sistema son momentos distintos.

## 14. Los demás archivos: documentación y herramientas

README.md explica instalación y uso general. INFORME_ESTRUCTURA_CODIGO.md documenta una revisión anterior. GUIA_REVISION_Y_EXAMEN.md contiene el mapa de operaciones y prácticas. ARQUITECTURA_ARCHIVO_POR_ARCHIVO.md es la referencia técnica detallada que acompaña esta explicación. Ninguno atiende una petición de venta.

.gitignore indica archivos que no deben agregarse a Git, como configuración privada y dependencias. No borra archivos ni protege con contraseña. node_modules contiene librerías instaladas y .npm-cache es caché de npm: no debes cambiar sus archivos para reparar una regla de negocio propia.

build_integracion_tests.mjs crea un Excel con un plan de pruebas. Organiza casos, aplica formato, agrega estados y guarda el documento y su vista previa. Que se genere el Excel no significa que se hayan ejecutado sus pruebas. outputs/integracion_districarnes contiene esos resultados documentales.

Los scripts manual_visual.py, capturar_manual.cjs y capturar_recorrido.cjs, junto con este documento, son herramientas añadidas para preparar los manuales. No forman parte del flujo de ventas. Las capturas y PDF están bajo output/manual_visual. La versión explicada se prepara además con generar_manual_explicado.py.

## 15. Un ejemplo completo para explicárselo al profesor

«Mi proyecto administra el inventario y las ventas de una carnicería. La persona entra con una cuenta, consulta productos por categoría y prepara una venta. La Vista presenta controles y envía solicitudes a una API. Las rutas seleccionan el Controlador, el Controlador revisa los datos y el Modelo ejecuta las operaciones en MySQL».

«Si creo un producto, el botón abre un formulario. Guardar reúne los campos y manda POST /api/productos. El controlador valida y el modelo inserta. Después la Vista consulta otra vez y muestra la nueva fila. Si edito, el mismo formulario conserva el ID y manda PUT para modificar ese producto».

«Si vendo 400 gramos a $38.000 por kilogramo, se convierten a 0,4 kg y el total es $15.200. El servidor consulta precio y stock reales, guarda una venta y sus detalles dentro de una transacción, y un trigger descuenta las existencias. Con $20.000 recibidos quedan $4.800 de cambio. El recibo consulta lo que se guardó».

Esa explicación une lo que hace el negocio con lo que hace el código. En el examen, comienza por la acción visible y sigue la cadena. Si no aparece el formulario, revisa Vista y evento. Si la solicitud llega pero se rechaza, revisa datos y Controlador. Si la operación devuelve resultados incorrectos, revisa Modelo, consultas y reglas de MySQL.

## 16. Referencia detallada de funciones y bloques

La parte siguiente conserva la descripción técnica por archivo para consultar nombres, campos y condiciones exactas. No necesitas memorizarla seguida. Úsala después del recorrido anterior: localiza el archivo que ya entendiste y compara la explicación con sus funciones y capturas de código.
