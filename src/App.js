import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nbPailles, setNbPailles] = useState(2);
  const [colors, setColors] = useState([]);
  const [widths, setWidths] = useState([]);

  useEffect(() => {
    generateColorsAndWidths();
  }, [nbPailles]);

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setNbPailles(isNaN(value) ? 2 : Math.min(Math.max(value, 2), 100));
  };

  const generateColorsAndWidths = () => {
    const step = 360 / nbPailles;
    const newColors = Array.from({ length: nbPailles }, (_, index) => {
      const hue = (index * step) % 360;
      const sat = 80 + index%2 * 10;
      return `hsl(${hue}, 80%, 50%)`;
    });

    const equalWidth = 5; // initial width percentage
    const newWidths = Array.from({ length: nbPailles }, () => equalWidth);

    setColors(shuffle(newColors));
    setWidths(newWidths);
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const tirerlespailles = () => {
    const minWidth = 10; // minimum width percentage
    const maxWidth = 100; // maximum width percentage
    const margin = 5;
    const totalWidth = 100; // total width available

    const randomWidths = Array.from(
      { length: nbPailles - 2 },
      () =>
        minWidth + margin + Math.random() * (maxWidth - minWidth - 2 * margin)
    );

    const remainingWidth =
      totalWidth -
      minWidth -
      maxWidth -
      randomWidths.reduce((acc, width) => acc + width, 0);

    // Ensure at least one paille has 100% width and another has 10% width
    const newWidths = [
      minWidth,
      ...randomWidths,
      remainingWidth > 0 ? remainingWidth : maxWidth, // Ensure the last paille takes the remaining width or max width
    ];

    setWidths(shuffle(newWidths));
  };

  const handleGenerateClick = () => {
    tirerlespailles();
  };

  const renderPailles = () => {
    return colors.map((color, index) => (
      <div
        key={index}
        className={`paille ${widths[index] === 10 ? "loser" : ""} ${
          widths[index] === 100 ? "winner" : ""
        }`}
        style={{ backgroundColor: color, width: `${widths[index]}%` }}
      >{index+1}</div>
    ));
  };

  return (
    <div className="App">
      <label>
        Nombre de pailles (entre 2 et 100):
        <input
          type="number"
          value={nbPailles}
          onChange={handleInputChange}
          min="2"
          max="100"
        />
      </label>
      <button onClick={handleGenerateClick}>Tirer les pailles</button>
      <div className="pailles-container">{renderPailles()}</div>
    </div>
  );
}

export default App;
