# 

# 

# 

# 

# 

# 

# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

**Proyecto:** Sistema de Gestión y Sincronización Personal (MVP)  
**Usuarios Principales:** Alejandro y Lesly  
**Plataformas:** Web App Responsiva (Desktop-first para planeación, Mobile-first para captura y ejecución).

## 

## 

## **Reglas y requisitos:**

* **Se desplegará en railway con base de datos postgre SQL**  
    
* **Usa el framework que me recomiendes**  
    
* **Voy a hacerlo principalmente para teléfonos Iphone 13**  
    
* **Tengo planeado implementar IA pero hasta que este mas avanzado aun no lo voy a implementar**

* **Si necesitas descargar alguna libreria extra, Hazlo no me tienes q preguntar.**  
    
* **Si puedes, que sea una Aplicacion PWA.**


## **1\. Arquitectura de Base de Datos y Reglas de Privacidad**

El sistema opera bajo un modelo de instancias relacionales para evitar fricción en la captura y proteger el espacio individual.

* **100% Compartido (Sincronización Bidireccional):** Catálogo de comidas, planificador semanal, lista de súper y metas de ahorro mutuo.  
    
* **Instanciado (Misma estructura, ejecución separada):** Módulo de Salud/Ejercicio y Hábitos personales.  
    
* **Condicional (Privacidad Parcial):** Calendario. Los eventos configurados como "Privados" renderizan únicamente un bloque visual de "Ocupado" en la vista del otro usuario.  
    
* **100% Privado:** Finanzas y hobbies individuales.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## 

## **2\. Estructura de Navegación Global**

* **Desktop:** *Sidebar* (Barra lateral izquierda) para alternar entre módulos. Área de trabajo principal configurada para lectura horizontal de datos y tableros expansivos.  
    
* **Mobile:** *Bottom Navigation Bar* (Barra de navegación inferior) con los iconos de Home, Calendario, Finanzas, Salud. En el centro exacto, un Botón de Acción Flotante (FAB "+") persistente.


\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## **3\. Módulo 0: Dashboard (Home)**

El espejo del día. Zona de cero configuración, solo lectura y ejecución rápida. Área *Above the Fold* (sin *scroll* inicial).

* **Header Fijo:** Saludo contextual y foto de perfil.  
    
* **Bloque 1: Centro de Comando (Calendario y Recordatorios)**  
    
  * Tarjeta ancha superior mostrando **únicamente** el próximo evento inmediato (Título y Hora).  
      
  * Carrusel horizontal de *chips* debajo de la tarjeta para recordatorios de "Todo el día" o tareas sin hora fija.  
      
* **Bloque 2: Foco Físico (Rutina del Día)**

  * Tarjeta de alto impacto visual (imagen atenuada de fondo).  
      
  * Texto central dictando la rutina (ej. "Día de Fuerza").  
      
  * Botón *Checkbox* masivo a la derecha para marcar la sesión como completada directamente.  
      
* **Bloque 3: Panel de Progreso Semanal (Horizontal)**

  * Cuadrícula de tarjetas de lectura horizontal.  
      
  * **Tarjeta Hábitos:** Días en racha de hábitos personales.  
      
  * **Tarjeta Ejercicio:** Contador dinámico basado en la meta del perfil (ej. "1/3 Entrenamientos esta semana"). Se reinicia cada lunes a las 00:00 hrs.  
      
  * **Tarjeta Finanzas:** Barra de progreso lineal para meta de ahorro conjunto.  
    

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## 

## **4\. Botón Captura Rápida (Bottom Sheet del FAB "+")**

Accionado desde el botón central en Mobile. Sube un panel superpuesto oscureciendo el fondo. Navegación por pestañas (*Segmented Control*).

* **Pestaña A: Hábitos (Cero Texto)**

  * **Baño:** Botón circular masivo \[ 💩 \]. Suma \+1 al contador diario con vibración de confirmación y cierra el panel.  
      
  * **Agua:** Fila horizontal de *chips*: \[ \+ 500ml \] \[ \+ 1L \] \[ \+ 1.5L \] \[ \+ 2L \].  
      
  * **Love:** Botón de acción simple (icono visual). Suma \+1 al histórico de días.  
      
* **Pestaña B: Finanzas**

  * Teclado numérico desplegado en automático.

  * **Ingreso/Gasto:** Input numérico \-\> Selector de origen/destino en *chips* (\[Nu\], \[BBVA\], \[Efectivo\]) \-\> Concepto (texto opcional).  
      
  * **Préstamos:** Selector \[Nuevo Préstamo\] (crea deuda en DB con nombre de contacto) vs. \[Liquidar Préstamo\] (despliega carrusel de deudas activas). Permite input manual para abonos parciales, restando del total hasta llegar a saldo cero.

* **Pestaña C: Nutrición (Generativo)**

  * Caja de texto única y botón de micrófono.

  * Input de lenguaje natural (ej. "Comí 2 rebanadas de pizza").

  * El backend envía el *prompt* a una IA (Gemini/GPT) para calcular calorías y sumar el resultado a la métrica diaria en la base de datos de forma invisible.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## **5\. Módulo de Calendario**

* **Vista por Defecto (Agenda Vertical):** Eje temporal a la izquierda, tarjetas de eventos a la derecha con un borde grueso del color de la categoría (etiquetas predefinidas, sin colores libres). Textos minimalistas (solo Título).  
    
* **Eventos Flotantes:** Recordatorios de "Todo el día" anclados en la parte superior del *scroll*.  
    
* **Alternancia (Mes):** Interruptor a vista mensual clásica. Días con puntos de color. Al tocar un día, despliega un *Bottom Sheet* con la Agenda Vertical de esa fecha.  
    
* **Flujo de Creación:** *Popup* con input de título, selectores rápidos (\[Hoy\], \[Mañana\]), carrusel de color/categoría, e interruptor de privacidad \[Compartido / Privado\].


\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## **6\. Módulo de Comidas y Lista de Súper**

* **Pantalla de Planeación (UI Dividida):**  
  

  * *Izquierda (Catálogo):* Filtros \[Desayuno\] \[Comida\] \[Cena\]. Cuadrícula de tarjetas de platillos pre-guardados (cada receta contiene sus ingredientes base para 1 porción ocultos en DB).  
      
  * *Derecha (Canvas Semanal):* Columnas de Lunes a Domingo.  
      
* **Interacción (*Drag & Drop*):** Arrastrar tarjeta de platillo al día deseado. Despliega micro-modal automático preguntando "Porciones" con el número **\[ 2 \]** preseleccionado. Botón de confirmar.  
    
* **Automatización de Compras:** Botón superior "Generar Súper". El sistema multiplica ingredientes de la semana por las porciones, consolida duplicados y exporta un *checklist* agrupado por pasillos lógicos (Lácteos, Proteínas, etc.).


\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## **7\. Módulo de Salud y Ejercicio**

* **Onboarding Estático (Primera vez o Edición):** Formulario para Peso/Altura, Inventario de equipo con *Toggles* (\[Mancuernas\], \[Piso\], \[Cajón\]), y variables de Entrenamiento: **Días por semana** y **Duración por sesión (min)**. Perfiles asimétricos y separados en la base de datos.  
    
* **Pantalla Diaria:** Gráfico de línea minimalista comparando evolución de biometría. Botón masivo central: **"Generar Rutina de Hoy"** (El backend inyecta las variables del Onboarding en un *prompt* y devuelve tarjetas horizontales de ejercicios).  
    
* **Modo Ejecución (*Workout Player / Companion Timer*):**  
    
  * Pantalla aislada de distracciones. Nombre de ejercicio en texto masivo.  
      
  * **Master Timer (Círculo de Progreso):** El límite del anillo visual (100%) equivale a la variable dinámica Duración por sesión del usuario activo. Si se rebasa, cambia a color naranja sin detener el tiempo.  
      
  * **Burbujas de Intervalo:** Fila inferior con botones \[1m\] \[2m\] \[3m\] \[4m\] \[5m\]. Al tocar uno, lanza una cuenta regresiva superpuesta sin detener el Master Timer. Vibra al llegar a cero.  
      
  * **Cierre:** Botón "Finalizar Entrenamiento". Registra la duración, avanza el contador semanal (ej. 1/3 a 2/3) y marca la tarjeta del Dashboard como completada.  
    

