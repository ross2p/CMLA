import React, { useState } from "react";
import "./App.css";

function GausaDet() {
  const [matrix, setMatrix] = useState([[]]);
  const [result, setResult] = useState([]);
  const [determinant, setDeterminant] = useState(0);
  const [size, setSize] = useState(3);
  const [start, setStart] = useState(false);
  const [steps, setSteps] = useState([]);
  const [strMatrix, setStrMatrix] = useState([[]]);
  const handleStart = () => {
    console.log("strMatrix", strMatrix);
    console.log("size", size);

    let m = strMatrix.map((row) => row.map((el) => parseFloat(el)));
    console.log("m", m);
    setMatrix(m);
    setStart(true);
    const result = gaussianElimination(m);
    console.log("result", result);
    setResult(result.solution);
    setDeterminant(result.determinant);
    setSteps(result.steps);

    //   const [inverse, steps] = inverseMatrix(matrix);
    // setResult(inverse);
    //   setSteps(steps);
  };

  const getMatrix = (matrix, isBystep) => {
    const n = matrix[0].length;
    const countRow = matrix.length;
    return (
      <div>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((el, index) => (
              <React.Fragment key={index}>
                <p style={{ margin: 10 }}>{el.toFixed(2)}</p>
                {(index + 1) % countRow === 0 ? (
                  <p style={{ margin: 10 }}>|</p>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  };
  const getVector = (vector) => {
    return (
      <div>
        {vector.map((el, index) => (
          <p key={index} style={{ margin: 10 }}>
            {el.toFixed(2)}
          </p>
        ))}
      </div>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Метод Гауса детермінант</h1>
      <input
        type="number"
        value={size}
        onChange={(e) => {
          setSize(parseInt(e.target.value));
          let m = [];
          for (var i = 0; i < e.target.value; i++) {
            m[i] = [];
            for (var j = 0; j < Number(e.target.value) + 1; j++) {
              m[i][j] = "";
            }
          }
          setStrMatrix(m);
        }}
      />
      <div>
        {strMatrix.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((col, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={col}
                style={{ width: "50px" }}
                onChange={(e) => {
                  const newMatrix = [...strMatrix];
                  strMatrix[rowIndex][colIndex] = e.target.value;
                  setStrMatrix(newMatrix);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={() => handleStart()}>Start</button>
      {start ? (
        <div>
          <h2>Початкова матриця</h2>
          {getMatrix(matrix)}
          {steps.map((step, index) => (
            <div key={index}>
              <h2>{step.name}</h2>
              {getMatrix(step.matrix)}
              <h2>Детермінант: {step.det}</h2>
            </div>
          ))}
          <h2>Result</h2>
          {getVector(result)}
          <h2>Детермінант {determinant}</h2>
        </div>
      ) : null}
    </div>
  );
}
function gaussianElimination(matrix) {
  console.log("matrix", matrix);
  let mat = matrix.map((row) => [...row]);
  let det = 1;
  let steps = [];

  for (let i = 0; i < mat.length; i++) {
    // Знаходимо найбільший елемент в стовпці
    let maxRow = i;
    for (let j = i + 1; j < mat.length; j++) {
      if (Math.abs(mat[j][i]) > Math.abs(mat[maxRow][i])) {
        maxRow = j;
      }
    }

    // Обмінюємо рядки, щоб найбільший елемент був на поточній позиції
    if (maxRow !== i) {
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
      // Міняємо знак детермінанту при обміні рядків
      det *= -1;

      steps.push({
        name:
          "Поміняли місцями рядки " +
          (maxRow + 1) +
          " та " +
          (i + 1) +
          " і міняємо знак детермінанту",
        matrix: mat.map((row) => [...row]),
        det: det,
      });
    }

    // Перевірка на нульовий стовпчик (незв'язна система)
    if (mat[i][i] === 0) {
      return { solution: null, determinant: 0 }; // Повертаємо нульовий розв'язок і детермінант
    }

    // Віднімаємо рядки зі зміненим коефіцієнтом, щоб зробити елементи під діагоналлю нульовими
    for (let j = i + 1; j < mat.length; j++) {
      let factor = mat[j][i] / mat[i][i];
      for (let k = i; k < mat.length; k++) {
        mat[j][k] -= factor * mat[i][k];
      }
      steps.push({
        name:
          "Рядочок " +
          (j + 1) +
          " віднімемо " +
          (i + 1) +
          " помножений на " +
          factor,
        matrix: mat.map((row) => [...row]),
        det: det,
      });
    }
  }
  for (let i = 0; i < mat.length; i++) {
    // Розрахунок детермінанту (множимо на основну діагональ)
    det *= mat[i][i];
  }
  steps.push({
    name:
      "Перемноживши діагональ отримаємо детермінант: " +
      mat.map((row, index) => row[index]).join(" * "),
    matrix: mat.map((row) => [...row]),
    det: det,
  });

  // Обчислення розв'язку
  let solution = new Array(mat.length);
  for (let i = mat.length - 1; i >= 0; i--) {
    solution[i] = mat[i][mat.length] / mat[i][i];
    for (let j = i - 1; j >= 0; j--) {
      mat[j][mat.length] -= mat[j][i] * solution[i];
    }
  }

  return { solution: solution, determinant: det, steps: steps };
}
export default GausaDet;
