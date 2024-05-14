import React, { useState } from "react";
import "./App.css";
import Gausa2 from "./gausa2";
import UTU from "./UTU";
import LU from "./LU";
import GausaDet from "./gausa";
import SimpleIteration from "./SimpleIteration";
import Zendel from "./Zendel";

function App() {
  const [selectedOption, setSelectedOption] = useState(6);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  let content;
  if (selectedOption === 1) {
    content = <GausaDet />;
  } else if (selectedOption === 2) {
    content = <UTU />;
  } else if (selectedOption === 3) {
    content = <Gausa2 />;
  } else if (selectedOption === 4) {
    content = <LU />;
  } else if (selectedOption === 5) {
    content = <SimpleIteration />;
  } else if (selectedOption === 6) {
    content = <Zendel />;
  }

  return (
    <div>
      <input
        type="radio"
        value={1}
        checked={selectedOption === 1}
        onChange={() => handleOptionChange(1)}
      />
      <label>Option 1</label>

      <input
        type="radio"
        value={2}
        checked={selectedOption === 2}
        onChange={() => handleOptionChange(2)}
      />
      <label>Option 2</label>

      <input
        type="radio"
        value={3}
        checked={selectedOption === 3}
        onChange={() => handleOptionChange(3)}
      />
      <label>Option 3</label>

      <input
        type="radio"
        value={4}
        checked={selectedOption === 4}
        onChange={() => handleOptionChange(4)}
      />
      <label>Option 4</label>
      <input
        type="radio"
        value={4}
        checked={selectedOption === 5}
        onChange={() => handleOptionChange(5)}
      />
      <label>Метод простої ітерації</label>
      <input
        type="radio"
        value={4}
        checked={selectedOption === 6}
        onChange={() => handleOptionChange(6)}
      />
      <label>Зенделя</label>
      {content}
    </div>
  );
}

export default App;
