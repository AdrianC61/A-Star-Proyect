# Simulación del Algoritmo A* con React y Electron

Este proyecto es una simulación interactiva del algoritmo A* para encontrar rutas óptimas en una cuadrícula. Utiliza **React** para la interfaz de usuario y **Electron** para empaquetarlo como una aplicación de escritorio.

---

## Instalación y Configuración

### **1️ Clonar el Repositorio**
```bash
git clone https://github.com/AdrianC61/A-Star-Proyect.git
cd A-Star-Proyect

```

### **2 Instalar Dependencias**
```bash
npm install
```

### **3️ Ejecutar en Modo Desarrollo**
```bash
npm start
```

### **4️ Construir la Aplicación**
```bash
npm run build
```

Si deseas empaquetar la app para escritorio con **Electron**:
```bash
npm run make
```

---

## Uso
1. Define la cantidad de **filas** y **columnas** del grid.
2. Haz clic en las celdas para agregar **obstáculos**.
3. Selecciona la **posición inicial** y la **meta**.
4. Presiona el botón **Ejecutar A*** para iniciar la simulación.
5. Observa cómo el algoritmo encuentra el camino más corto.

---

## Recursos Utilizados
- **Carro animado:** `carro.gif`
- **Ícono A*:** `star.webp`
- **Explosión (fallo de ruta):** `explosion.gif`

Estos recursos deben estar en `src/images/`.

---

## Tecnologías Usadas
- **React** (Interfaz de usuario)
- **Framer Motion** (Animaciones)
- **Electron** (Empaquetado como aplicación de escritorio)
- **CSS Modules** (Estilizado)

---

## Notas
- Asegúrate de que las imágenes `.gif` y `.webp` están correctamente incluidas en la carpeta `public` o `src/images`.
- Si encuentras problemas al construir con `react-scripts build`, revisa que las rutas de los assets sean correctas.

---

## Licencia
Este proyecto está bajo la licencia **MIT**.
