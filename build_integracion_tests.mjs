import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/integracion_districarnes";
await fs.mkdir(outputDir, { recursive: true });

const tests = [
  ["BB-001", "Login + Categorías + Productos + Carrito + Ventas + Movimientos + Historial", "Verificar de una sola vez el flujo completo de venta en efectivo, desde la autenticación hasta la consulta del recibo.", "Administrador activo; Punta de Anca: 0,400 kg; precio $38.000/kg; efectivo recibido $20.000.", "Inicio de sesión exitoso; total $15.200; cambio $4.800; venta completada; movimiento de pago creado; stock disminuido 0,400 kg y recibo visible en historial.", "Pendiente de ejecución. Insertar captura del recibo y del historial.", "Pendiente", "Método Big Bang: todos los módulos se integran simultáneamente."],
  ["BB-002", "Inventario + Categorías + API + Base de datos + Auditoría", "Validar conjuntamente la creación, edición, búsqueda y eliminación de un producto y su registro de auditoría.", "Crear 'Producto prueba BB' en Res, kg, precio $25.000, stock 10; editar precio a $27.000 y stock a 8; buscar y eliminar.", "El producto aparece en inventario y filtros; la edición persiste; la auditoría registra actualización y eliminación; al final ya no aparece en el catálogo.", "Pendiente de ejecución. Insertar capturas del inventario y auditoría.", "Pendiente", "Usar un producto exclusivo de pruebas para no afectar datos reales."],
  ["BB-003", "Administradores + Autenticación + Sesiones + Rutas protegidas + Interfaz", "Comprobar el ciclo completo de creación, acceso, desactivación y bloqueo de un administrador.", "Crear qa.bb@districarnes.local con clave válida; iniciar sesión; desactivar la cuenta; intentar un nuevo acceso.", "La cuenta se crea y accede mientras está activa; tras desactivarla, el sistema rechaza el acceso con 'Credenciales incorrectas' y protege las rutas privadas.", "Pendiente de ejecución. Insertar captura de la lista y del acceso rechazado.", "Pendiente", "Restaurar o eliminar el usuario de prueba al finalizar."],
  ["BB-004", "Catálogo + Conversión de medidas + Carrito + Venta + Stock + Recibo", "Validar una venta con artículos expresados en unidades de medida diferentes.", "Punta de Anca: 400 g; Costilla de Cerdo: 1 lb; método tarjeta; cliente 'Cliente BB'.", "Cada cantidad se convierte a la unidad base; subtotales y total son correctos; no se calcula cambio; ambos stocks se descuentan y el recibo conserva cantidades y precios.", "Pendiente de ejecución. Insertar captura del carrito y recibo.", "Pendiente", "Confirmar antes de ejecutar que ambos productos tengan stock suficiente."],
  ["BB-005", "Carrito + API de ventas + Transacción SQL + Trigger de stock + Manejo de errores", "Verificar que una venta con stock insuficiente falle sin dejar registros parciales.", "Agregar Salmón con una cantidad superior a su stock disponible y confirmar la venta.", "Se muestra 'No existe stock suficiente'; la transacción se revierte; no se crean venta, detalle ni movimiento y el stock permanece igual.", "Pendiente de ejecución. Insertar captura del mensaje y comprobación de datos.", "Pendiente", "Caso negativo crítico de integridad transaccional."],

  ["IA-001", "Base de datos de categorías + Modelo de productos", "Validar desde la capa inferior que el modelo recupere productos con su categoría y unidad de medida.", "Consultar productos de categoria_id=1 y buscar 'Punta de Anca'.", "El modelo devuelve el producto asociado a Res, con precio, stock, estado y unidad kg sin duplicados ni campos nulos obligatorios.", "Pendiente de ejecución. Insertar captura de la respuesta del modelo/API.", "Pendiente", "Primera etapa ascendente: datos y consultas."],
  ["IA-002", "Servicio de medidas + Modelo de productos + Modelo de ventas", "Comprobar que la conversión de gramos se integre con el cálculo y la disponibilidad de inventario.", "Producto Punta de Anca con unidad base kg; cantidad 400; unidad_venta='g'.", "El servicio convierte 400 g en 0,400 kg; el subtotal calculado es $15.200 y la validación usa 0,400 contra el stock real.", "Pendiente de ejecución. Insertar captura de valores calculados.", "Pendiente", "Segunda etapa ascendente: servicios de dominio sobre los datos."],
  ["IA-003", "Modelo de ventas + Ventas + Detalle de venta + Movimientos + Triggers", "Validar la transacción de persistencia antes de conectarla con controladores e interfaz.", "Administrador válido; un ítem Punta de Anca 0,400 kg; pago efectivo; recibido $20.000.", "Se crean venta completada, detalle con subtotal $15.200 y movimiento por $15.200; cambio $4.800; el trigger descuenta 0,400 kg y la transacción confirma todo.", "Pendiente de ejecución. Insertar captura de las tablas relacionadas.", "Pendiente", "Tercera etapa ascendente: integración transaccional."],
  ["IA-004", "Modelos + Controladores + Middleware + Rutas REST", "Verificar que las capas inferiores expongan correctamente una venta por la API protegida.", "POST /api/ventas con token válido, cliente 'Cliente IA', efectivo y un ítem válido.", "La ruta autoriza la sesión, el controlador valida los datos y responde HTTP 201 con 'Venta registrada', id, total y cambio coherentes.", "Pendiente de ejecución. Insertar captura de la petición y respuesta.", "Pendiente", "Cuarta etapa ascendente: publicación del servicio."],
  ["IA-005", "Base de datos + Modelos + Servicios + API + Frontend", "Validar el flujo final agregando la interfaz a todas las capas ya integradas.", "Iniciar sesión; seleccionar 0,400 kg de Punta de Anca; pagar en efectivo con $20.000; abrir historial.", "La interfaz muestra venta exitosa; el inventario se actualiza; el recibo e historial reflejan total $15.200 y cambio $4.800.", "Pendiente de ejecución. Insertar capturas de venta, inventario e historial.", "Pendiente", "Etapa final ascendente con el sistema completo."],

  ["ID-001", "Interfaz de login + Cliente API + Controlador de autenticación", "Validar desde la interfaz el inicio de sesión usando inicialmente una respuesta simulada del servicio de sesiones.", "Correo administrador@districarnes.local y contraseña Districarnes2026!; stub devuelve token válido.", "La interfaz envía las credenciales, almacena el token simulado y abre el panel privado sin mostrar datos sensibles.", "Pendiente de ejecución. Insertar captura del panel después del acceso.", "Pendiente", "Primera etapa descendente; el stub sustituye temporalmente sesión y BD."],
  ["ID-002", "Panel principal + Cliente API + Rutas de productos y ventas", "Comprobar que el panel consuma respuestas simuladas y presente indicadores y accesos correctamente.", "Stub: 3 productos, 1 con stock bajo; 2 ventas del día por total $50.000.", "El panel muestra 3 productos, 1 existencia baja, 2 ventas y $50.000; los indicadores navegan a inventario o historial según corresponda.", "Pendiente de ejecución. Insertar captura de los indicadores.", "Pendiente", "Segunda etapa descendente: sustituir luego los stubs por controladores reales."],
  ["ID-003", "Nueva venta + Catálogo + Carrito + Cliente API + Controlador de ventas", "Validar el comportamiento de alto nivel de la venta antes de conectar la transacción real.", "Respuesta simulada del catálogo con Punta de Anca; agregar 400 g; efectivo $20.000; confirmar.", "El carrito calcula $15.200, valida el efectivo, muestra cambio $4.800 y envía items, unidad_venta, cliente y método al controlador.", "Pendiente de ejecución. Insertar captura del carrito y payload.", "Pendiente", "Tercera etapa descendente; el modelo de ventas puede mantenerse simulado."],
  ["ID-004", "Inventario UI + API + Controlador + Modelo + MySQL", "Reemplazar simulaciones y validar la búsqueda y el filtro de inventario contra datos reales.", "Buscar 'Punta de Anca'; seleccionar categoría Res; activar filtro de stock bajo.", "La interfaz presenta únicamente registros que cumplen cada filtro; los datos coinciden con productos y categorías almacenados en MySQL.", "Pendiente de ejecución. Insertar capturas de los tres filtros.", "Pendiente", "Cuarta etapa descendente: conexión progresiva con la capa de datos."],
  ["ID-005", "Historial + Reporte diario + API + Modelo de ventas + Base de datos", "Validar la pila completa del historial y reporte al incorporar la base de datos real.", "Fecha con ventas registradas; categoría Res; abrir una venta y generar reporte diario.", "Listado, cantidad de ventas, subtotales filtrados, total diario y detalle del recibo coinciden; el reporte imprimible conserva fecha y categoría.", "Pendiente de ejecución. Insertar captura del historial y vista de impresión.", "Pendiente", "Etapa final descendente con componentes reales."],

  ["HB-001", "Login UI + API de autenticación + Sesiones + Modelo de administradores + MySQL", "Integrar el frente descendente de autenticación con el frente ascendente de usuarios y sesiones.", "Administrador activo con credenciales válidas; luego repetir con contraseña incorrecta.", "Los frentes se unen en el controlador: el acceso válido entrega token y abre el panel; el inválido responde 401 y muestra 'Credenciales incorrectas'.", "Pendiente de ejecución. Insertar capturas de ambos intentos.", "Pendiente", "Punto de encuentro híbrido: authController."],
  ["HB-002", "Inventario UI + Búsqueda/Filtros + API + Categorías + Productos + MySQL", "Combinar la navegación descendente del inventario con consultas ascendentes de categorías y productos.", "Seleccionar Vísceras; buscar 'Hígado'; activar y desactivar stock bajo.", "La interfaz recibe categorías y productos reales; cada cambio actualiza el listado sin mezclar categorías y mantiene precio, unidad, stock y estado correctos.", "Pendiente de ejecución. Insertar captura de resultados filtrados.", "Pendiente", "Punto de encuentro híbrido: rutas y controlador de productos."],
  ["HB-003", "Carrito + Conversión de medidas + Controlador de ventas + Transacción + Triggers", "Unir el flujo descendente del carrito con el flujo ascendente de inventario, detalle, pago y descuento de stock.", "Punta de Anca 400 g; cliente 'Cliente HB'; pago efectivo; recibido $20.000.", "El controlador une ambos frentes; total $15.200, cambio $4.800, venta y movimiento creados, stock reducido 0,400 kg y confirmación visible.", "Pendiente de ejecución. Insertar capturas del carrito, confirmación y stock.", "Pendiente", "Punto de encuentro híbrido: saleController/saleModel."],
  ["HB-004", "Historial UI + Filtros + Resumen por categoría + Modelo de ventas + MySQL", "Integrar la presentación descendente de reportes con las agregaciones ascendentes de ventas y detalles.", "Fecha del día; categoría Res; al menos dos ventas de prueba en categorías distintas.", "El historial filtra Res, el total coincide con sus detalles y el resumen diario por categoría separa correctamente Res de las demás categorías.", "Pendiente de ejecución. Insertar captura del historial y resumen.", "Pendiente", "Validar coherencia entre endpoints /ventas y /ventas/resumen-categorias."],
  ["HB-005", "Frontend completo + API + Autenticación + Inventario + Ventas + Administradores + MySQL", "Validar la integración total después de unir los recorridos ascendentes y descendentes.", "Iniciar sesión; crear producto de prueba; vender una cantidad; consultar recibo y reporte; crear y desactivar un administrador.", "Todas las operaciones se completan con datos coherentes; la venta descuenta stock y crea pago; historial y reporte coinciden; la cuenta desactivada no puede iniciar sesión.", "Pendiente de ejecución. Insertar capturas principales de cada módulo.", "Pendiente", "Prueba híbrida final de regresión de extremo a extremo."],
];

const wb = Workbook.create();
const sh = wb.worksheets.add("Pruebas de Integración");
sh.showGridLines = false;

sh.getRange("A1:H1").merge();
sh.getRange("A1").values = [["PLAN DE PRUEBAS DE INTEGRACIÓN"]];
sh.getRange("A2:B4").values = [["Proyecto:", "Districarnes-v1"], ["Integrantes:", "____________________________"], ["Alcance:", "20 pruebas - Big Bang, Incremental Ascendente, Incremental Descendente e Híbrido"]];
sh.getRange("B2:H2").merge();
sh.getRange("B3:H3").merge();
sh.getRange("B4:H4").merge();

const headers = ["ID Prueba", "Módulos a integrar", "Descripción de la prueba", "Datos de entrada", "Resultado esperado", "Resultado obtenido (captura de pantalla)", "Estado", "Observaciones"];
sh.getRange("A6:H6").values = [headers];
sh.getRange("A7:H26").values = tests;

// Formula-driven summary so status updates remain auditable.
sh.getRange("A28:B32").values = [["RESUMEN", "Cantidad"], ["Total de pruebas", null], ["Aprobadas", null], ["No aprobadas", null], ["Pendientes / en proceso", null]];
sh.getRange("B29").formulas = [["=COUNTA(A7:A26)"]];
sh.getRange("B30").formulas = [["=COUNTIF(G7:G26,\"Aprobado\")"]];
sh.getRange("B31").formulas = [["=COUNTIF(G7:G26,\"No aprobado\")"]];
sh.getRange("B32").formulas = [["=COUNTIF(G7:G26,\"Pendiente\")+COUNTIF(G7:G26,\"En proceso\")"]];
sh.getRange("D28:H28").merge();
sh.getRange("D28").values = [["Nota de ejecución"]];
sh.getRange("D29:H32").merge();
sh.getRange("D29").values = [["Los resultados obtenidos y las capturas deben completarse al ejecutar cada caso en el entorno local. No se marcaron pruebas como aprobadas sin evidencia. Cambie el Estado con la lista desplegable y reemplace el texto de la columna F por la captura o referencia correspondiente."]];

const titleFmt = { fill: "#7F1D1D", font: { bold: true, color: "#FFFFFF", size: 18 }, horizontalAlignment: "center", verticalAlignment: "center" };
sh.getRange("A1:H1").format = titleFmt;
sh.getRange("A1:H1").format.rowHeight = 34;
sh.getRange("A2:A4").format = { fill: "#FEE2E2", font: { bold: true, color: "#7F1D1D" }, verticalAlignment: "center" };
sh.getRange("B2:H4").format = { fill: "#FFF7ED", font: { color: "#3F3F46" }, verticalAlignment: "center" };
sh.getRange("A6:H6").format = { fill: "#991B1B", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#7F1D1D" } };
sh.getRange("A7:H26").format = { font: { color: "#27272A", size: 10 }, verticalAlignment: "top", wrapText: true, borders: { preset: "all", style: "thin", color: "#E4E4E7" } };
sh.getRange("A7:A26").format = { fill: "#FEF2F2", font: { bold: true, color: "#991B1B" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#E4E4E7" } };
sh.getRange("G7:G26").format = { fill: "#FFFBEB", font: { bold: true, color: "#92400E" }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#E4E4E7" } };
sh.getRange("A28:B28").format = { fill: "#7F1D1D", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sh.getRange("A29:B32").format = { fill: "#FFF7ED", borders: { preset: "all", style: "thin", color: "#FED7AA" } };
sh.getRange("B29:B32").format = { fill: "#FFEDD5", font: { bold: true, color: "#9A3412" }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: "#FED7AA" } };
sh.getRange("D28:H28").format = { fill: "#334155", font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
sh.getRange("D29:H32").format = { fill: "#F8FAFC", font: { color: "#334155" }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: "#CBD5E1" } };

// Group cues for the four required approaches.
for (const row of [7, 12, 17, 22]) {
  sh.getRange(`A${row}:H${row}`).format.borders = { top: { style: "medium", color: "#991B1B" }, bottom: { style: "thin", color: "#E4E4E7" }, left: { style: "thin", color: "#E4E4E7" }, right: { style: "thin", color: "#E4E4E7" } };
}

sh.getRange("G7:G26").dataValidation = { rule: { type: "list", values: ["Pendiente", "En proceso", "Aprobado", "No aprobado"] } };
sh.getRange("G7:G26").conditionalFormats.add("containsText", { text: "Aprobado", format: { fill: "#DCFCE7", font: { color: "#166534", bold: true } } });
sh.getRange("G7:G26").conditionalFormats.add("containsText", { text: "No aprobado", format: { fill: "#FEE2E2", font: { color: "#991B1B", bold: true } } });
sh.getRange("G7:G26").conditionalFormats.add("containsText", { text: "En proceso", format: { fill: "#DBEAFE", font: { color: "#1D4ED8", bold: true } } });

const widths = [12, 31, 38, 34, 39, 34, 14, 31];
for (let c = 0; c < widths.length; c++) sh.getRangeByIndexes(0, c, 32, 1).format.columnWidth = widths[c];
sh.getRange("A6:H6").format.rowHeight = 42;
sh.getRange("A7:H26").format.rowHeight = 94;
sh.getRange("A2:H4").format.rowHeight = 22;
sh.getRange("D29:H32").format.rowHeight = 30;
sh.freezePanes.freezeRows(6);
sh.freezePanes.freezeColumns(1);

const table = sh.tables.add("A6:H26", true, "PruebasIntegracion");
table.style = "TableStyleMedium2";
table.showBandedRows = true;
table.showFilterButton = true;

const inspect = await wb.inspect({ kind: "table", range: "Pruebas de Integración!A1:H32", include: "values,formulas", tableMaxRows: 32, tableMaxCols: 8, maxChars: 12000 });
console.log(inspect.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 50 }, summary: "final formula error scan" });
console.log(errors.ndjson);

const preview = await wb.render({ sheetName: "Pruebas de Integración", range: "A1:H32", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
const file = await SpreadsheetFile.exportXlsx(wb);
await file.save(`${outputDir}/Plan_Pruebas_Integracion_Districarnes.xlsx`);
