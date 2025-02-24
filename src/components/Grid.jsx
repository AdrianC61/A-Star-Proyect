import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../css/Grid.css";
import carImage from "../images/carro.gif";
import star from "../images/star.webp";
import explosionImage from "../images/explosion.gif";
import { motion } from "framer-motion";

const Grid = ({ onRunAlgorithm }) => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [goal, setGoal] = useState(null);
  const [path, setPath] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const [exploredCells, setExploredCells] = useState(new Set());
  const [message, setMessage] = useState("");
  const [carImageSrc, setCarImageSrc] = useState(carImage);
  const exploredArray = useMemo(() => [...exploredCells], [exploredCells]);
  const memoizedCarImageSrc = useMemo(() => carImageSrc, [carImageSrc]);
  const stableGrid = useMemo(() => grid, [grid]);
  const [showLegend, setShowLegend] = useState(false);


  const createGrid = (newRows, newCols) => {
    return Array(newRows)
      .fill(null)
      .map(() => Array(newCols).fill(0));
  };


  useEffect(() => {
    setGrid(createGrid(rows, cols));
    if (start && start[0] < rows && start[1] < cols) {
      setStart(start);
    } else {
      setStart(null);
    }
    if (goal && goal[0] < rows && goal[1] < cols) {
      setGoal(goal);
    } else {
      setGoal(null);
    }
    setPath([]);
    setCarPosition(null);
    setExploredCells(new Set());
    setMessage("");
    setCarImageSrc(carImage);
  }, [rows, cols, start, goal]);

  const handleCellClick = useCallback((row, col) => {
    setGrid((prevGrid) => {
      return prevGrid.map((r, rIdx) =>
        r.map((cell, cIdx) => (rIdx === row && cIdx === col ? (cell === 0 ? 1 : 0) : cell))
      );
    });
  }, []);

  const handleCellSize = (e, type) => {
    let num = parseInt(e.target.value, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 99) num = 99;
    if (type === "rows") {
      setRows(num);
    } else if (type === "cols") {
      setCols(num);
    }
  };

  const handleRun = async () => {
    if (start && goal) {
      const { path, explorados } = await window.app.createRequestHandler(grid, start, goal) || { path: [], explorados: new Set() };
      setPath(path);
      setExploredCells(explorados);
      setCarPosition(path.length > 0 ? path[0] : null);
      if (path.length > 0) {
        setCarPosition(path[0]);
        setMessage("✅ Se encontró una ruta ✅");
      } else {
        setCarPosition(start);
        setMessage("❌ No se encontró una ruta ❌");

        setTimeout(() => {
          setCarImageSrc(explosionImage);
        }, 1000);

        setTimeout(() => {
          setCarPosition("");
          setCarImageSrc(carImage);
        }, 2000);
      }
    }
  };

  // Animar el coche a lo largo del camino
  useEffect(() => {
    if (path.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < path.length) {
          setCarPosition(path[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [path]);

  const renderedGrid = useMemo(() => {
    return stableGrid.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        const isStart = start && start[0] === rIdx && start[1] === cIdx;
        const isGoal = goal && goal[0] === rIdx && goal[1] === cIdx;
        const isPath = path.some(p => p[0] === rIdx && p[1] === cIdx);
        const isExplored = exploredArray.includes(`${rIdx},${cIdx}`) && !isPath;

        return (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`cell 
              ${isStart ? "start" : ""}
              ${isGoal ? "goal" : ""}
              ${cell === 1 ? "obstacle" : ""}
              ${isPath ? "path" : ""}
              ${isExplored ? "explored" : ""}
            `}
            onClick={() => handleCellClick(rIdx, cIdx)}
          >
            {carPosition && carPosition[0] === rIdx && carPosition[1] === cIdx ? (
              <motion.img
                src={memoizedCarImageSrc}
                alt="Car"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="car-img"
              />
            ) : `${rIdx},${cIdx}`}
          </div>
        );
      })
    );
  }, [stableGrid, start, goal, path, exploredArray, carPosition, memoizedCarImageSrc, handleCellClick]);



  return (
    <div className="container">
      <h1 className="title">Simulación A{" "} <img src={star} alt="estrella" style={{ width: "80px", verticalAlign: "middle", paddingBottom: "25px" }} /></h1>
      <div className="top-controls">
        <div className="grid-size-controls">
          <label>Cantidad Filas:</label>
          <input
            type="number"
            min="1"
            value={rows}
            onChange={(e) => handleCellSize(e, "rows")}
          />

          <label>Cantidad Columnas:</label>
          <input
            type="number"
            min="1"
            value={cols}
            onChange={(e) => handleCellSize(e, "cols")}
          />
        </div>
        <div className="controls">
          <label>Seleccionar salida:</label>
          <select onChange={(e) => setStart(JSON.parse(e.target.value))} value={start ? JSON.stringify(start) : ""}>
            <option value="" disabled>--Seleccione--</option>
            {grid.flatMap((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isStart = start && start[0] === rIdx && start[1] === cIdx;
                const isGoal = goal && goal[0] === rIdx && goal[1] === cIdx;

                return (
                  <option
                    key={`${rIdx}-${cIdx}`}
                    value={JSON.stringify([rIdx, cIdx])}
                    disabled={cell === 1 || isGoal || isStart}
                    style={{
                      backgroundColor: isStart ? "green" : isGoal ? "red" : cell === 1 ? "#555" : "white",
                      color: isStart || isGoal ? "white" : cell === 1 ? "white" : "black",
                    }}
                  >
                    ({rIdx}, {cIdx})
                  </option>
                );
              })
            )}
          </select>

          <label>Seleccionar llegada:</label>
          <select onChange={(e) => setGoal(JSON.parse(e.target.value))} value={goal ? JSON.stringify(goal) : ""}>
            <option value="" disabled>--Seleccione--</option>
            {grid.flatMap((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isStart = start && start[0] === rIdx && start[1] === cIdx;
                const isGoal = goal && goal[0] === rIdx && goal[1] === cIdx;

                return (
                  <option
                    key={`${rIdx}-${cIdx}`}
                    value={JSON.stringify([rIdx, cIdx])}
                    disabled={cell === 1 || isStart || isGoal}
                    style={{
                      backgroundColor: isStart ? "green" : isGoal ? "red" : cell === 1 ? "#555" : "white",
                      color: isStart || isGoal ? "white" : cell === 1 ? "white" : "black",
                    }}
                  >
                    ({rIdx}, {cIdx})
                  </option>
                );
              })
            )}
          </select>
        </div>
      </div>
      <div className="legend-container">
        <button className="legend-toggle" onClick={() => setShowLegend(!showLegend)}>
          {showLegend ? "Ocultar Leyenda ⬆️" : "Mostrar Leyenda ⬇️"}
        </button>

        {showLegend && (
          <div className="legend">
            <h2>📌 Leyenda</h2>
            <p>⭐ <b>A Star</b> es un algoritmo de pathfinding que busca el recorrido más óptimo posible.</p>
            <p>🚦 Las celdas de <b>Salida</b> y <b>Llegada</b> se seleccionan mediante la lista antes del Grid.</p>
            <p>🚧 Cuando haces click en una celda, esta se convierte en un <b>obstáculo</b> donde no se puede transitar.</p>
            <p>🔴 Las casillas de <b>Salida</b> y <b>Llegada</b> no pueden superponerse ni ser obstáculos.</p>
            <p>📏 El tamaño máximo de X e Y es <b>99</b>, el mínimo es <b>1</b>.</p>
          </div>
        )}
      </div>
      {message && <div className="message">{message}</div>}
      <div className="grid-wrapper">
        <div className="grid-container">
          <div className="grid-container" style={{ "--rows": rows, "--cols": cols }}>
            {renderedGrid}
          </div>
        </div>
      </div>
      
      <button className="run-button" onClick={handleRun} disabled={!start || !goal}>
        Ejecutar A*
      </button>
    </div>
  );
};

export default Grid;
