# 🌟 Hi! — Sistema de Gestión y Sincronización Personal (MVP)

> Diseñado para **Alejandro & Lesly**  
> Optimizado para **iPhone 13** (PWA, Safe Areas, Feedback Háptico) y **Desktop** (Sidebar & Planeación dividida).  
> Preparado para despliegue en **Railway con PostgreSQL**.

---

## 🚀 Características Implementadas (PRD)

### 1. Arquitectura de Privacidad
* **100% Compartido:** Catálogo de comidas, planificador semanal, lista de súper consolidada por pasillos y meta de ahorro mutuo.
* **Instanciado:** Salud/ejercicio (onboarding biométrico, rutinas generadas y player) y hábitos personales (digestión, hidratación, amor).
* **Condicional (Calendario):** Los eventos configurados como **Privados** se renderizan únicamente como un bloque visual de `🔒 Ocupado` en la vista del otro usuario.
* **100% Privado:** Finanzas personales (cuentas Nu, BBVA, Efectivo, transacciones y control de préstamos/deudas con abonos parciales).

### 2. Módulos
* **Dashboard (Home):**
  * Saludo contextual ("Buenos días", "Buenas tardes", etc.) y avatar de perfil.
  * **Centro de Comando:** Próximo evento inmediato + chips de eventos de todo el día.
  * **Foco Físico:** Tarjeta de alto impacto visual con fondo atenuado (`workout_hero.jpg`), rutina del día y checkbox masivo con confetti.
  * **Panel de Progreso Semanal:** Racha de hábitos con fuego 🔥, contador dinámico semanal de entrenamientos y barra de ahorro conjunto.
* **FAB "+" (Bottom Sheet):**
  * **Pestaña Hábitos (Cero Texto):** Baño masivo `[ 💩 ]`, Agua en chips `[ +500ml ] [ +1L ] [ +1.5L ] [ +2L ]`, Love `[ ❤️ ]`.
  * **Pestaña Finanzas:** Teclado numérico desplegado en automático, selector `[ Nu ] [ BBVA ] [ Efectivo ]`, y selector `[ Nuevo Préstamo ]` vs `[ Liquidar Préstamo ]`.
  * **Pestaña Nutrición (Generativo):** Input en lenguaje natural + botón de micrófono + desglose automático de calorías, proteínas, carbohidratos y grasas.
* **Módulo Calendario:**
  * Agenda vertical (eje temporal a la izquierda, tarjetas con borde de color de categoría).
  * Vista mensual clásica con puntos de color y bottom sheet por fecha.
  * Selector rápido `[ Hoy ] [ Mañana ]` e interruptor `[ Compartido / Privado ]`.
* **Módulo Comidas y Súper:**
  * Catálogo de recetas con filtros (Desayuno, Comida, Cena) y fotos gastronómicas reales.
  * Canvas semanal de Lunes a Domingo.
  * Micro-modal automático de porciones con `[ 2 ]` preseleccionado.
  * Botón **"Generar Súper"**: multiplica ingredientes por porciones, consolida duplicados y genera un checklist interactivo ordenado por pasillos (Lácteos, Proteínas, Frutas y Verduras, Despensa, Panadería).
* **Módulo Salud y Ejercicio:**
  * Onboarding estático/edición: Peso, Altura, equipo `[ Mancuernas ] [ Piso ] [ Cajón ]`, días por semana y duración por sesión.
  * Gráfico minimalista SVG de evolución de peso y botón **"Generar Rutina de Hoy"**.
  * **Workout Player Companion:**
    * Pantalla completa libre de distracciones.
    * **Master Timer Circular**: círculo de progreso que al rebasar la duración meta cambia a color naranja sin detener el cronómetro.
    * **Burbujas de Intervalo**: botones `[ 1m ] [ 2m ] [ 3m ] [ 4m ] [ 5m ]` que lanzan un timer de descanso superpuesto con cuenta regresiva.
    * Botón de finalización que incrementa el contador semanal y lanza confetti.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
* **Estilos:** Tailwind CSS v4 + Glassmorphism + Safe-areas iOS
* **Iconos & Efectos:** `lucide-react`, `canvas-confetti`
* **Base de Datos & ORM:** PostgreSQL + Prisma ORM (`prisma/schema.prisma`)
* **PWA:** Web App Manifest (`public/manifest.json`), Apple Touch Icons, viewport-fit=cover

---

## 💻 Ejecución Local

```bash
# 1. Instalar dependencias (ya configuradas)
npm install

# 2. Generar cliente de Prisma
npm run postinstall

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador o dispositivo iPhone: `http://localhost:3000`

---

## 🚂 Despliegue en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.app/).
2. Agrega un servicio de **PostgreSQL Database** en Railway.
3. Conecta este repositorio de GitHub a Railway.
4. En las variables de entorno de tu servicio web en Railway, enlaza la variable de la base de datos:
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
5. Railway ejecutará automáticamente la configuración definida en `railway.json`:
   * Build: `npx prisma generate && npm run build`
   * Deploy: `npx prisma db push && npm run start`
