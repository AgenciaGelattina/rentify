# Properties Administration App

# V1.1.2
- Se agregaron los Pagos Recurrentes en los contratos.
- Cambio de Inquilinos a Contactos.
- Creacion de carpetas automaticas de PDFs y Fotos al crear contrato.
- Optimización de la vista de Pagos totales.
- Ordenar el resumen por fecha de corte.

# V1.1.1
- Menú muestra el link activo y items expandidos.
- Optimización del código Grupos y Estados de propiedades.

# V1.1.0
- Optimización del código Propiedades, se modificó el algoritmo para calcular los pagos.
- Nueva forma de visualizar los pagos en forma de lista
- Para identificar a las propiedades activas ahora se vé el ícono de contratos en verde.

# V1.0.9
- Se agregó la sección de Historial de Contratos Vencidos en Administracion de Propiedades.
- Se reparó el Bug del formato de fechas.
- Optimización del código de Resumen de Contratos.
- Se agregó el tipo de pago "Otro" para solo tener 2 tipos:
    - Renta: El pago será contabilizado en el calculo mensual.
    - Otros: Este pago es para otros gastos que no entran en el calculo mensual.

# V1.0.8
- Actualizacion de los paquetes de Node a ultima versión.
- Se agregó la seccion de Pagos en los contratos.
- Se agregó la seccion de Inquilinos en los contratos.
- El resumen ya muestra los contratos que tienen deduda.
- Se agregó la visualización de datos de propiedades y contratos en el Resumen.
- Optimización de la base de datos MySql con Llaves Foraneas.

# V1.0.7
- Ya funciona el sistema de carpetas y archivos para contratos.
- La autentificación se puede hacer por token, solo en la misma TAB.
- Ya se puede cambiar contraseñas a las cuentas de usuarios.
- Se creó el ambiente de Producción - https://github.com/AgenciaGelattina/rentify
- Se modificó el ambiente de Desarrollo - https://github.com/AgenciaGelattina/rentify/dev
- El home muestra un resumen de pagos (Se está trabajando en las tablas)
- Se optimizó los procesos de datos para los formularios.
- varios fixs de estilos.

# V1.0.6
- Se modificó la respuesta del servidor para controlar los errores.
- Se pueden agragar y modificar propiedades.
- Se agregó método de manejo de errores y snackmessages.
- Se gregó el administrador para Tipos de Propiedades.
- Se gregó el administrador para Estados de Propiedades.
- Se gregó el administrador para Grupos de Propiedades.
- Se gregó el administrador para Tipos de grupos de Propiedades.

# V1.0.5
- Creacion del Repositorio de la aplicación en GitHub
    - https://github.com/AgenciaGelattina/rentify

- Actualización de rutas en la Aplicación.
    - Las rutas ya se pueden acceder directamente.
    - Se agregaron rutas de administración.

- Se puede agregar carpetas en el administrador de contratos.
- Las bases de datos para los archivos y Carpetas se maneja bajo UUID.
    - los archivos todavía no se pueden subir, pero se puede testear la funcionalidad.

- Se reparó el bug de selección de grupos al editar una propiedad.

# V1.0.4
- Ya se puede loguear en la aplicación
- Se puede dar de alta, modificar y dar de baja cuentas de usuario.
- Se puede dar de alta, modificar y dar de baja propiedades.
- Creación de datos en la base de datos.

# V1.0.3
- Link de prueba en el servidor 
   - https://agenciagelattina.com/rentify/

# V1.0.2
# V1.0.1
# V1.0.0
 - Creacion del proyecto en Next / React
 - Backend PHP
 - Base de Datos MySql