import React, { useState } from "react";
import "./App.css";

function getMatrixU(matrix, size) {
  let U = [];
  for (let i = 0; i < size; i++) {
    U.push([]);
  }
  U[0][0] = Math.sqrt(matrix[0][0]);
  for (let k = 1; k < size; k++) {
    U[0][k] = matrix[0][k] / U[0][0];
  }

  for (let i = 1; i < size; i++) {
    for (let j = i; j < size; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += U[k][i] * U[k][j];
      }
      U[i][j] = matrix[i][j] - sum;
    }
    U[i][i] = Math.sqrt(U[i][i]);
    for (let k = i + 1; k < size; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += U[j][i] * U[j][k];
      }
      U[i][k] = (matrix[i][k] - sum) / U[i][i];
    }
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i > j) {
        U[i][j] = 0;
      }
    }
  }
  return U;
}
function getY(U, b) {
  let y = [];
  for (let i = 0; i < U.length; i++) {
    let sum = 0;
    for (let k = 0; k < i; k++) {
      sum += U[k][i] * y[k];
    }
    y.push((b[i] - sum) / U[i][i]);
  }
  return y;
}
function getX(U, y) {
  let x = [];
  let len = U.length - 1;
  let index = 0;
  for (let i = 0; i < U.length; i++) {
    let sum = 0;
    for (let k = 0; k < i; k++) {
      sum += U[len - k][len - i] * x[len - k];
    }
    x[len - i] = (y[len - i] - sum) / U[len - i][len - i];
  }
  return x;
}
function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const transposedMatrix = [];
  for (let j = 0; j < cols; j++) {
    transposedMatrix.push([]);
    for (let i = 0; i < rows; i++) {
      transposedMatrix[j].push(matrix[i][j]);
    }
  }
  return transposedMatrix;
}

function UTU() {
  const [round, setRound] = useState(3);
  const [isStart, setIsStart] = useState(false);
  const [size, setSize] = useState(null);
  const [matrix, setMatrix] = useState([[]]);
  const [strMatrix, setStrMatrix] = useState([[]]);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const matrix = parseMatrix(content);
      setMatrix(matrix);
      setSize(matrix.length);
    };
    reader.readAsText(file);
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
                <p style={{ margin: 10 }}>{el.toFixed(round)}</p>
                {isBystep && (index + 1) % countRow === 0 ? (
                  <p style={{ margin: 10 }}>|</p>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const parseMatrix = (content) => {
    const rows = content.trim().split("\n");
    const matrix = rows.map((row) => row.trim().split(" ").map(Number));
    return matrix;
  };
  let U = [[]];
  const handleStart = (matrix) => {
    let m = strMatrix.map((row) => row.map((el) => parseFloat(el)));
    setMatrix(m);
    console.log(matrix);
    setIsStart(true);
    U = getMatrixU(matrix, size);
    console.log(U);
  };
  const getVector = (vector) => {
    return (
      <div>
        {vector.map((el, index) => (
          <p key={index} style={{ margin: 10 }}>
            {el.toFixed(round)}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <h1>UTU</h1>
        <p>Округлення</p>
      </div>
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

      <button onClick={() => handleStart(matrix)}>Запустити обчислення</button>
      {isStart ? (
        <>
          <h3>Початкова матриця</h3>
          {getMatrix(matrix, true)}
          <h4>Матриця U</h4>
          {getMatrix(getMatrixU(matrix, size))}
          <h4>Транспонована U матриця</h4>
          {getMatrix(transposeMatrix(getMatrixU(matrix, size)))}
          <h4>Вектор Y</h4>
          {getVector(
            getY(
              getMatrixU(matrix, size),
              matrix.map((row) => row[row.length - 1])
            )
          )}
          <h4>Розв'язок</h4>
          {getVector(
            getX(
              transposeMatrix(getMatrixU(matrix, size)),
              getY(
                getMatrixU(matrix, size),
                matrix.map((row) => row[row.length - 1])
              )
            )
          )}
        </>
      ) : null}
    </div>
  );
}

export default UTU;
