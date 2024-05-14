import React, { useState } from "react";
import "./App.css";

function Gausa2() {
  const [matrix, setMatrix] = useState([[]]);
  const [result, setResult] = useState([]);
  const [size, setSize] = useState(3);
  const [start, setStart] = useState(false);
  const [steps, setSteps] = useState([]);
  const [strMatrix, setStrMatrix] = useState([[]]);
  const handleStart = () => {
    let m = strMatrix.map((row) => row.map((el) => parseFloat(el)));
    setMatrix(m);
    setStart(true);
    const [inverse, steps] = inverseMatrix(matrix);
    setResult(inverse);
    setSteps(steps);
  };

  const getMatrixPrint = (matrix) => {
    const n = matrix[0].length;
    return (
      <div>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((el, index) => (
              <React.Fragment key={index}>
                <p style={{ margin: 10 }}>{el}</p>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  };
  const getMatrixBig = (matrix) => {
    const n = matrix[0].length;
    return (
      <div>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((el, index) => (
              <React.Fragment key={index}>
                <p style={{ margin: 10 }}>{el}</p>
                {index === n / 2 - 1 ? <p>|</p> : null}
              </React.Fragment>
            ))}
          </div>
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
      <h1>Метод Гауса</h1>
      <input
        type="number"
        value={size}
        onChange={(e) => {
          setSize(parseInt(e.target.value));
          let m = [];
          for (var i = 0; i < e.target.value; i++) {
            m[i] = [];
            for (var j = 0; j < e.target.value; j++) {
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
          {steps.map((step, index) => (
            <div key={index}>
              <h2>{step.name}</h2>
              {getMatrixBig(step.matrix)}
            </div>
          ))}
          <h2>Result</h2>
          {getMatrixPrint(result)}
        </div>
      ) : null}
    </div>
  );
}
export default Gausa2;
function inverseMatrix(matrix) {
  console.log(matrix);
  const cloneArry = (arr) => arr.map((row) => [...row]);
  let n = matrix.length;
  let augmentedMatrix = new Array(n);
  let steps = [];

  for (let i = 0; i < n; i++) {
    augmentedMatrix[i] = new Array(2 * n);
    for (let j = 0; j < n; j++) {
      augmentedMatrix[i][j] = matrix[i][j];
    }
    for (let j = n; j < 2 * n; j++) {
      augmentedMatrix[i][j] = i === j - n ? 1 : 0;
    }
  }
  console.log(augmentedMatrix);

  steps.push({
    name: "Добавили до матриці одиничну матрицю",
    matrix: cloneArry(augmentedMatrix),
  });

  for (let i = 0; i < n; i++) {
    let maxRowIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (
        Math.abs(augmentedMatrix[j][i]) >
        Math.abs(augmentedMatrix[maxRowIndex][i])
      ) {
        maxRowIndex = j;
      }
    }
    if (i !== maxRowIndex) {
      let temp = augmentedMatrix[i];
      augmentedMatrix[i] = augmentedMatrix[maxRowIndex];
      augmentedMatrix[maxRowIndex] = temp;

      steps.push({
        name: "Поміняли місцями рядки " + (maxRowIndex + 1) + " та " + (i + 1),
        matrix: cloneArry(augmentedMatrix),
      });
    }

    let pivot = augmentedMatrix[i][i];
    for (let j = i; j < 2 * n; j++) {
      augmentedMatrix[i][j] /= pivot;
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        let factor = augmentedMatrix[j][i];
        for (let k = i; k < 2 * n; k++) {
          augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
        }
      }
    }
    steps.push({
      name: "Занулив " + (i + 1) + " стовпець, крім діагонального елемента",
      matrix: cloneArry(augmentedMatrix),
    });
  }

  let inverse = new Array(n);
  for (let i = 0; i < n; i++) {
    inverse[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      inverse[i][j] = augmentedMatrix[i][j + n];
    }
  }
  return [inverse, steps];
}
