import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const allImages = {
  flower: [
    "/images/daisy.jpg",
    "/images/sunflower.jpg",
    "/images/tulip.jpg",
    "/images/rose.jpg",
    "/images/purple.jpg",
    "/images/tree.jpg",
  ],
  animal: [
    "/images/bunny.jpg",
    "/images/deer.jpg",
    "/images/duck.jpg",
    "/images/kitten.jpg",
    "/images/panda.jpg",
    "/images/puppy.jpg",
  ],
  random: [
    "/images/ball.jpg",
    "/images/door.jpg",
    "/images/fan.jpg",
    "/images/book.jpg",
    "/images/refrigerator.jpg",
    "/images/tv.jpg",
  ],
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomImages(images, level, category) {
  const selectedImages = images[category];
  const shuffled = shuffle(selectedImages);
  return shuffled.slice(0, level * 2);
}

function Tile({ tile, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 80,
        height: 80,
        margin: 8,
        backgroundColor: "#e9ecef",
        borderRadius: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 32,
        userSelect: "none",
      }}
    >
      {tile.flipped || tile.matched ? (
        <img
          className="img-fluid"
          src={tile.image}
          alt="tile"
          style={{ width: 64, height: 64, borderRadius: 8 }}
        />
      ) : (
        <span>❓</span>
      )}
    </div>
  );
}

export default function MatchingGame() {
  const [level, setLevel] = useState(1);
  const [category, setCategory] = useState("flower");
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const baseImages = pickRandomImages(allImages, level, category);
    const doubled = [...baseImages, ...baseImages].map((img, index) => ({
      id: index,
      image: img,
      flipped: false,
      matched: false,
    }));
    setTiles(shuffle(doubled));
    setSelected([]);
    setLock(false);
    setFeedback("");
  }, [level, category]);

  const handleClick = (index) => {
    if (lock || tiles[index].flipped || tiles[index].matched) return;

    const newTiles = [...tiles];
    newTiles[index].flipped = true;
    const newSelected = [...selected, index];

    if (newSelected.length === 2) {
      const [firstIdx, secondIdx] = newSelected;
      if (newTiles[firstIdx].image === newTiles[secondIdx].image) {
        newTiles[firstIdx].matched = true;
        newTiles[secondIdx].matched = true;
        setScore((prev) => prev + 10);
        setFeedback("🌟 Great job! You found a match!");
        setSelected([]);
      } else {
        setFeedback("🌀 Try again!");
        setLock(true);
        setTimeout(() => {
          newTiles[firstIdx].flipped = false;
          newTiles[secondIdx].flipped = false;
          setTiles([...newTiles]);
          setSelected([]);
          setLock(false);
        }, 1000);
        setScore((prev) => Math.max(prev - 2, 0));
      }
    } else {
      setSelected(newSelected);
    }
    setTiles([...newTiles]);
  };

  const isLevelComplete = tiles.every((tile) => tile.matched);
  const gridSize = Math.max(2, Math.ceil(Math.sqrt(tiles.length)));

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e0f7fa, #ffffff)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          padding: "2.5rem",
          borderRadius: "1.5rem",
          backgroundColor: "#fff",
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        {/* Header + Mascot */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.75rem", fontWeight: "700", color: "#222" }}>
            🧩 Let's Play the Matching Pair Game!
          </h1>
          <img
            src="/images/game-mascot.png"
            alt="Game Mascot"
            style={{
              width: "120px",
              margin: "1rem auto",
              animation: "bounce 2s infinite",
              display: "block",
            }}
          />
          <p
            style={{
              fontSize: "1.25rem",
              color: "#555",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Select your level and category to start playing. Match all the pairs
            to win!
          </p>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontWeight: "600", fontSize: "1rem" }}>
            Select Level:
          </label>
          <select
            className="form-select mb-3"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>

          <label style={{ fontWeight: "600", fontSize: "1rem" }}>
            Select Category:
          </label>
          <select
            className="form-select mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="flower">Flower</option>
            <option value="animal">Animal</option>
            <option value="random">Random</option>
          </select>

          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.25rem",
              marginBottom: "0.5rem",
            }}
          >
            Score: {score}
          </p>
          <p
            className="text-center"
            style={{ fontSize: "1rem", color: "#a15e75", minHeight: "24px" }}
          >
            {feedback}
          </p>
        </div>

        {/* Game Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 80px)`,
            gap: 12,
            justifyContent: "center",
          }}
        >
          {tiles.map((tile, index) => (
            <Tile
              key={tile.id}
              tile={tile}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="danger" onClick={() => window.location.reload()}>
            🔁 Restart Game
          </Button>

          {isLevelComplete &&
            (level === 3 ? (
              <Button
                variant="success"
                onClick={() => (window.location.href = "/congrats")}
              >
                🎊 Finish Game
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => setLevel((prev) => Math.min(prev + 1, 3))}
              >
                Next Level
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}
