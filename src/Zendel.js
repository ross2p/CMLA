import React, { useState } from "react";
import "./App.css";
const Zendel = () => {
  const [size, setSize] = useState(2);
  const [strMatrix, setStrMatrix] = useState([[]]);
  const [matrix, setMatrix] = useState([[]]);
  const [vector, setVector] = useState([]);
  const [start, setStart] = useState(false);
  const [step, setStep] = useState([]);
  const [result, setResult] = useState([]);
  const [eigenvalues, setEigenvalues] = useState([]);
  const [strInitialGuess, setStrInitialGuess] = useState([]);
  const [strTolerance, setStrTolerance] = useState("");

  const handleStart = () => {
    // setStrMatrix([
    //   ["2", -1, 3, 5],
    //   [1, -4, 2, 20],
    //   [2, -1, 5, 10],
    // ]);
    // console.log("strMatrix", strMatrix, [
    //   ["2", -1, 3, 5],
    //   [1, -4, 2, 20],
    //   [2, -1, 5, 10],
    // ]);
    // console.log("size", size);
    const initialGuess = strInitialGuess.map((el) => parseFloat(el));
    const m = strMatrix.map((row) => row.map((el) => parseFloat(el)));
    const [resultMatrix, resultVector] = splitMatrix(m);
    // console.log("resultMatrix", resultMatrix);
    // console.log("resultVector", resultVector);

    setMatrix(resultMatrix);
    setVector(resultVector);
    // const A = [
    //     [4, -1, 1],
    //     [4, -8, 1],
    //     [-2, 1, 5]
    // ];
    // const b = [7, -21, 15];
    const tolerance = parseFloat(strTolerance);
    const maxIterations = 50;
    // console.log("resultMatrix", resultMatrix);
    const res = zendel(
      resultMatrix,
      resultVector,
      initialGuess,
      tolerance,
      maxIterations
    );
    const solution = res.x;
    setStep(res.step);
    // console.log("Розв'язок:", solution);
    // console.log("step", step);
    const math = require("mathjs");

    // Обчислюємо власні значення матриці A
    setEigenvalues(math.eigs(resultMatrix).values);
    setStart(true);
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
      <h1>Зейделя</h1>

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
          let v = [];
          for (var i = 0; i < e.target.value; i++) {
            v[i] = "";
          }
          setStrInitialGuess(v);
          console.log("strMatrix", v);
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
        <h2> Початковий вектор</h2>
        {strInitialGuess.map((el, index) => (
          <input
            key={index}
            type="text"
            value={el}
            style={{ width: "50px" }}
            onChange={(e) => {
              console.log("e", e.target.value);
              const newVector = [...strInitialGuess];
              newVector[index] = e.target.value;
              setStrInitialGuess(newVector);
            }}
          />
        ))}
        <h2>Похибка</h2>
        <input
          type="text"
          value={strTolerance}
          style={{ width: "50px" }}
          onChange={(e) => {
            setStrTolerance(e.target.value);
          }}
        />
      </div>
      <button onClick={() => handleStart()}>Start</button>
      {start ? (
        <>
          {size === 3 ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  {matrix.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {row.map((el, index) => (
                        <React.Fragment key={index}>
                          {index === rowIndex ? (
                            <p style={{ margin: 10 }}>{el}&lambda;</p>
                          ) : (
                            <p style={{ margin: 10 }}>{el}</p>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
                {getDeterminant(matrix)}
              </div>
              <div>
                <p>
                  &lambda; ={" "}
                  {solveCubic(matrix).map((el, index) => (
                    <span key={index}>
                      {el}
                      {index < solveCubic(matrix).length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>

              <p>якщо всі &lambda; менше одиниці то метод збіжний</p>
            </>
          ) : null}
          {step.map((step, index) => (
            <>
              <div key={index}>
                <h2>{step.name}</h2>
                {step.x}
              </div>
            </>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default Zendel;
function splitMatrix(matrix) {
  // Перевірка чи матриця не пуста і чи всі рядки матриці мають однакову довжину
  if (
    matrix.length === 0 ||
    !matrix.every((row) => row.length === matrix[0].length)
  ) {
    return null; // Якщо матриця пуста або рядки матриці мають різну довжину, повертаємо null
  }

  const resultMatrix = [];
  const resultVector = [];

  for (let row of matrix) {
    // Відокремлюємо останній елемент рядка
    const lastElement = row.pop();

    // Додаємо змінений рядок до нової матриці
    resultMatrix.push(row);

    // Додаємо останній елемент до вектора
    resultVector.push(lastElement);
  }

  return [resultMatrix, resultVector];
}

function zendel(A, b, initialGuess, tolerance, maxIterations) {
  const n = A.length;
  const x = initialGuess.slice(); // Копіюємо початкове наближення
  const step = [];
  step.push({
    name: `Перевірка`,
    x: (
      <div>
        {A.map((el, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {el.map((innerEl, i) =>
              i !== index ? <p key={i}>|{innerEl}|+</p> : null
            )}
            <p>&lt;|{A[index][index]}|</p>
          </div>
        ))}
      </div>
    ),
  });
  step.push({
    name: `Формула`,
    x: (
      <>
        {b.map((el, index) => (
          <p
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p>
              x<sub>{index + 1}</sub>
              <sup>(k)</sup>
            </p>
            = ({el}
            {A[index].map((el, i) =>
              i !== index ? (
                <div key={i} style={{ display: "flex" }}>
                  <p>
                    +{el} x<sub>{i + 1}</sub>
                    <sup>{index < i ? "(k-1)" : "(k)"}</sup>
                  </p>
                </div>
              ) : null
            )}
            )/{A[index][index]}
          </p>
        ))}
      </>
    ),
  });
  // console.log("x", x);
  // console.log("step1", step);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const xNew = [];

    // Рахуємо нове наближення
    for (let i = 0; i < n; i++) {
      let sum = b[i];
      for (let j = 0; j < i; j++) {
        if (j !== i) {
          sum -= A[i][j] * xNew[j];
        }
      }
      for (let j = i; j < n; j++) {
        if (j !== i) {
          sum -= A[i][j] * x[j];
        }
      }
      xNew[i] = sum / A[i][i];
    }
    // console.log(xNew);
    step.push({
      name: `Ітерація ${iteration + 1}`,
      x: (
        <>
          {b.map((el, index) => (
            <p
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <p>
                x<sub>{index + 1}</sub>
                <sup>({iteration + 1})</sup>
              </p>
              = ({el}
              {xNew.map((el, i) =>
                i !== index ? (
                  <div key={i} style={{ display: "flex" }}>
                    <p>
                      +{el} x<sub>{i + 1}</sub>
                      <sup>{index < i ? iteration : iteration + 1}</sup>
                    </p>
                  </div>
                ) : null
              )}
              )/{A[index][index]}= {xNew[index]}
            </p>
          ))}
        </>
      ),
    });

    const errors = [];
    // Перевіряємо умову зупинки
    let maxError = 0;
    for (let i = 0; i < n; i++) {
      const error = Math.abs(xNew[i] - x[i]);
      if (error > maxError) {
        maxError = error;
      }
      errors.push(error);
    }
    step.push({
      name: `Шукаємо найбільшу похибку`,
      x: (
        <>
          <p>
            |x<sub>i</sub>
            <sup>(k)</sup> - x<sub>i</sub>
            <sup>(k-1)</sup>|
          </p>
          {errors.map((el, index) => (
            <p key={index}>
              |{xNew[index]} - {x[index]}| = {el}
            </p>
          ))}
          <p>
            max = {maxError} {maxError < tolerance ? "<" : ">"} {tolerance}
          </p>
        </>
      ),
    });

    if (maxError < tolerance) {
      // console.log(`Знайдено розв'язок після ${iteration} ітерацій.`);
      return { x: xNew, step: step };
    }

    // Оновлюємо наближення
    x.splice(0, x.length, ...xNew);
  }

  // console.log("Досягнуто максимальну кількість ітерацій.");
  // console.log("Останнє наближення:", step);
  return { x: x, step: step };
}

// // Приклад використання:
// const A = [
//     [4, -1, 1],
//     [4, -8, 1],
//     [-2, 1, 5]
// ];
// const b = [7, -21, 15];
// const initialGuess = [0, 0, 0];
// const tolerance = 1e-6;
// const maxIterations = 1000;

// const solution = simpleIterationMethod(A, b, initialGuess, tolerance, maxIterations);
// console.log("Розв'язок:", solution);

const getDeterminant = (matrix) => {
  const a = matrix[0][0] * matrix[1][1] * matrix[2][2];
  const b = 0;
  const c =
    -(matrix[0][2] * matrix[1][1] * matrix[2][0]) -
    matrix[1][0] * matrix[0][1] * matrix[2][2] -
    matrix[0][0] * matrix[2][1] * matrix[1][2];
  const d =
    matrix[0][1] * matrix[1][2] * matrix[2][0] +
    matrix[1][0] * matrix[2][1] * matrix[0][2];
  return (
    <>
      <p>
        = {matrix[0][0]}&lambda;*{matrix[1][1]}&lambda;*{matrix[2][2]}&lambda; +{" "}
        {matrix[0][1]}*{matrix[2][0]}*{matrix[1][2]} + {matrix[1][0]}*
        {matrix[2][1]}*{matrix[0][2]}-{matrix[0][2]}*{matrix[1][1]}&lambda;*
        {matrix[2][0]}- {matrix[1][0]}*{matrix[0][1]}* {matrix[2][2]}&lambda; -{" "}
        {matrix[0][0]}&lambda;*
        {matrix[2][1]}*{matrix[1][2]}=0
      </p>
    </>
  );
};

function solveCubic(matrix) {
  let a = matrix[0][0] * matrix[1][1] * matrix[2][2];
  let b = 0;
  let c =
    -(matrix[0][2] * matrix[1][1] * matrix[2][0]) -
    matrix[1][0] * matrix[0][1] * matrix[2][2] -
    matrix[0][0] * matrix[2][1] * matrix[1][2];
  let d =
    matrix[0][1] * matrix[1][2] * matrix[2][0] +
    matrix[1][0] * matrix[2][1] * matrix[0][2];
  console.log("a", a);
  console.log("b", b);
  console.log("c", c);
  console.log("d", d);
  if (a === 0) {
    throw new Error(
      "Коефіцієнт a не може бути нульовим для кубічного рівняння"
    );
  }

  // Нормалізація коефіцієнтів
  b /= a;
  c /= a;
  d /= a;

  // Знаходження дискримінанта
  const delta0 = b * b - 3 * c;
  const delta1 = 2 * b * b * b - 9 * b * c + 27 * d;
  const discriminant = (delta1 * delta1 - 4 * delta0 * delta0 * delta0) / 27;

  let roots = [];

  if (discriminant > 0) {
    // Один дійсний корінь і два комплексних кореня
    let C = Math.cbrt(
      (delta1 + Math.sqrt(delta1 * delta1 - 4 * delta0 * delta0 * delta0)) / 2
    );
    if (C === 0) {
      C = Math.cbrt(
        (delta1 - Math.sqrt(delta1 * delta1 - 4 * delta0 * delta0 * delta0)) / 2
      );
    }
    const u = [1, (-1 + Math.sqrt(-3)) / 2, (-1 - Math.sqrt(-3)) / 2];
    for (let k = 0; k < 3; k++) {
      const root = (-1 / 3) * (b + u[k] * C + delta0 / (u[k] * C));
      roots.push(root);
    }
  } else if (discriminant === 0) {
    // Всі корені дійсні і принаймні два однакові
    if (delta0 === 0) {
      const root = -b / 3;
      roots.push(root);
    } else {
      const root1 = -b / 3 + delta1 / (3 * delta0);
      const root2 = -b / 3 - delta1 / (6 * delta0);
      roots.push(root1, root2, root2);
    }
  } else {
    // Всі три корені дійсні і різні
    const theta = Math.acos(delta1 / (2 * Math.sqrt(delta0 * delta0 * delta0)));
    for (let k = 0; k < 3; k++) {
      const root =
        -2 * Math.sqrt(delta0 / 3) * Math.cos((theta + 2 * Math.PI * k) / 3) -
        b / 3;
      roots.push(root);
    }
  }

  return roots;
}
