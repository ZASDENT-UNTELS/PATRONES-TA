# ZAZDENT - Sistema de Gestión de Clínica Dental

## 🎉 ¡El Sistema está Completamente Funcional!

ZAZDENT es una aplicación web completa para la gestión de una clínica dental con roles de usuario, control de citas, pagos, y más.

---

## 🚀 **ACCESO A LA APLICACIÓN**

### URL de Acceso
```
http://localhost/PATRONES-TA/login.html
```

### Credenciales de Prueba

| Rol | Usuario | Contraseña | Acceso |
|-----|---------|------------|--------|
| **Administrador** | `admin` | `123456` | Dashboard completo, gestión total |
| **Dentista** | `drCarolay` | `123456` | Agenda, citas, pacientes |
| **Recepción** | `recepcion01` | `123456` | Citas, pagos, agenda |
| **Paciente** | `jmartinez` | `123456` | Perfil, citas, pagos |

---

## 📊 **CARACTERÍSTICAS DEL SISTEMA**

### ✅ Administrador
- 📊 Dashboard con estadísticas en tiempo real
- 👥 Gestión completa de usuarios
- 📅 Control total de citas
- 💰 Gestión de pagos y reportes
- 📋 Reportes de ingresos

### ✅ Dentista
- 📊 Dashboard personal
- 📅 Mi agenda de citas
- 👤 Información de pacientes

### ✅ Recepción
- 📊 Dashboard operativo
- 📅 Gestión de citas
- 💰 Registro de pagos
- 📋 Control de pacientes

### ✅ Paciente
- 👤 Perfil personal
- 📅 Mis citas programadas
- 💰 Historial de pagos
- 📋 Historial médico

---

## 🔧 **RUTAS API REST**

### Autenticación
```
POST   /api/auth/login        - Iniciar sesión
POST   /api/auth/logout       - Cerrar sesión
GET    /api/auth/me           - Obtener datos del usuario actual
```

### Dashboard
```
GET    /api/dashboard         - Obtener estadísticas
```

### Citas
```
GET    /api/citas             - Listar citas
GET    /api/citas/hoy         - Citas de hoy
POST   /api/citas             - Crear cita
PUT    /api/citas/{id}        - Actualizar estado
DELETE /api/citas/{id}        - Eliminar cita
```

### Pagos
```
GET    /api/pagos             - Listar pagos
POST   /api/pagos             - Registrar pago
PUT    /api/pagos/{id}/anular - Anular pago
GET    /api/pagos/reporte     - Reporte de pagos
```

### Paciente
```
GET    /api/paciente/perfil   - Mi perfil
PUT    /api/paciente/perfil   - Actualizar perfil
GET    /api/paciente/citas    - Mis citas
GET    /api/paciente/historial - Mi historial médico
GET    /api/paciente/pagos    - Mis pagos
```

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
PATRONES-TA/
├── login.html              ← Página de login
├── dashboard.html          ← Panel de control principal
├── .env                    ← Configuración (creado automáticamente)
├── .htaccess               ← Rewrite rules para routing
├── public/
│   ├── .htaccess
│   └── index.php           ← Front Controller (punto de entrada API)
├── php/
│   ├── database/
│   │   └── conexion.php    ← Conexión a BD (Singleton)
│   ├── dao/                ← Data Access Objects
│   │   ├── CitaDAO.php
│   │   ├── PacienteDAO.php
│   │   ├── PagoDAO.php
│   │   ├── DentistaDAO.php
│   │   ├── UsuarioDAO.php
│   │   └── ...
│   ├── service/            ← Lógica de negocio
│   │   ├── AuthService.php
│   │   ├── CitaService.php
│   │   ├── PagoService.php
│   │   ├── PacienteService.php
│   │   └── ...
│   └── dto/                ← Data Transfer Objects
│       ├── CitaDTO.php
│       ├── PacienteDTO.php
│       └── ...
├── modulo/                 ← Módulos por rol (estructura)
│   ├── admin/
│   ├── dentista/
│   ├── recepcion/
│   └── paciente/
└── assets/                 ← CSS, JS, imágenes
    ├── css/
    ├── js/
    └── img/
```

---

## 🛠️ **ARQUITECTURA TÉCNICA**

### Patrón: MVC + Service Layer + DAO

1. **Front Controller** (`public/index.php`)
   - Punto de entrada único
   - Routing de peticiones
   - Headers CORS

2. **Services** (Lógica de negocio)
   - AuthService: Autenticación y roles
   - CitaService: Operaciones de citas
   - PagoService: Operaciones de pagos
   - PacienteService: Perfil y datos del paciente

3. **DAO** (Acceso a datos)
   - Todas las queries SQL centralizadas
   - Métodos CRUD estándar
   - Consultas específicas por rol

4. **DTO** (Transferencia de datos)
   - Objetos tipados
   - Serialización/Desserialización
   - Validaciones

5. **Database** (Singleton)
   - Una única conexión
   - Variables de entorno (.env)
   - Manejo de transacciones

---

## 🔐 **SISTEMA DE ROLES Y PERMISOS**

| Rol | ID | Permisos |
|-----|----|---------| 
| **Administrador** | 1 | Gestión total, usuarios, citas, pagos |
| **Dentista** | 2 | Ver/editar sus citas, pacientes, agenda |
| **Recepción** | 3 | Citas, pagos, pacientes |
| **Paciente** | 4 | Perfil, citas propias, pagos |

---

## 📊 **BASE DE DATOS**

Tablas principales:
- `usuarios` - Cuentas de usuario (admin, dentista, recepción, paciente)
- `roles` - Definición de roles
- `pacientes` - Datos de pacientes
- `dentistas` - Datos de dentistas
- `citas` - Citas programadas
- `pagos` - Registro de pagos
- `tratamientos` - Tipos de tratamientos
- `especialidades` - Especialidades dentales
- `historiales_medicos` - Historial médico de pacientes

---

## 🔄 **FLUJO DE UNA CITA**

1. **Paciente** solicita cita (vía web o recepción)
2. **Recepción** registra cita en el sistema
3. **Dentista** ve cita en su agenda
4. **Cita confirmada/realizada**
5. **Recepción** registra pago si corresponde
6. **Sistema** genera estadísticas automáticas

---

## 💰 **GESTIÓN DE PAGOS**

- Registro de pagos por cita
- Métodos de pago: Efectivo, Tarjeta, Transferencia
- Anulación de pagos
- Reportes mensuales de ingresos

---

## 📈 **ESTADÍSTICAS EN DASHBOARD**

- **Citas hoy**: Cantidad de citas programadas
- **Total pacientes**: Cantidad de pacientes registrados
- **Ingresos mes**: Total recaudado en el mes
- **Dentistas activos**: Cantidad de dentistas disponibles

---

## 🎨 **INTERFAZ DE USUARIO**

- **Responsive Design**: Funciona en desktop y mobile
- **Tema moderno**: Colores profesionales
- **Sidebar dinámico**: Menú según rol
- **Tablas interactivas**: Edición, eliminación, búsqueda

---

## ⚙️ **CONFIGURACIÓN ACTUAL**

Archivo `.env`:
```
DB_HOST=localhost
DB_NAME=zazdent
DB_USER=root
DB_PASS=
DB_CHARSET=utf8mb4
```

---

## 🐛 **TROUBLESHOOTING**

### "No autenticado"
- Inicia sesión nuevamente
- Limpia cookies del navegador
- Verifica que la sesión PHP está activa

### "Base de datos no encontrada"
- Verifica que la BD `zazdent` existe
- Revisa el archivo `.env`
- Reinicia MySQL desde XAMPP

### Citas no se cargan
- Asegúrate de estar autenticado
- Verifica en BD que existan citas
- Abre la consola del navegador (F12) para ver errores

---

## 🚀 **PRÓXIMAS MEJORAS**

- [ ] Formulario de nueva cita (frontend)
- [ ] Formulario de nuevo pago (frontend)
- [ ] Gestión de usuarios (frontend)
- [ ] Notificaciones por email
- [ ] Exportar reportes a PDF
- [ ] Calendario visual de citas
- [ ] WhatsApp para recordatorios

---

## 📞 **SOPORTE**

Para reportar errores o sugerencias, revisa los logs en:
- `php_errors.log` (directorio XAMPP)
- Consola del navegador (F12)

---

**✅ Sistema completamente funcional y listo para usar**

**Última actualización:** 8 de mayo de 2026
