import React, { useState, useEffect } from "react";
import Cover from "../assets/Cover.jpeg";
import JS from "../assets/JS-IMAGE.png";
import Java from "../assets/Java.png";
import Python from "../assets/Python.png";
import Cpp from "../assets/Cpp.png";
import ReactImg from "../assets/React.png";
import Angular from "../assets/Angular.png";
import Confetti from 'react-confetti';
import '../App.css';

const cardImages = [
  { src: JS, name: "JS" },
  { src: Java, name: "Java" },
  { src: Cpp, name: "Cpp" },
  { src: Python, name: "Python" },
  { src: ReactImg, name: "React" },
  { src: Angular, name: "Angular" },
];

const MagicGame = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if all cards are matched
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setIsAnimating(true);
      setShowConfetti(true);
      
      setTimeout(() => {
        setGameCompleted(true);
        setShowConfetti(false);
      }, 2000);
    }
  }, [cards]);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), flipped: false, matched: false }));
    
    setCards(shuffledCards);
    setTurns(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setGameCompleted(false);
    setIsAnimating(false);
    setShowConfetti(false);
  };

  const handleChoice = (card) => {
    if (card.flipped || disabled || card.matched || gameCompleted || isAnimating) return;
    
    if (!choiceOne) {
      setChoiceOne(card);
      flipCard(card.id, true);
    } else if (!choiceTwo) {
      setChoiceTwo(card);
      flipCard(card.id, true);
      setTurns(prevTurns => prevTurns + 1);
      checkForMatch(card);
    }
  };

  const flipCard = (id, flip) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, flipped: flip } : card
      )
    );
  };

  const checkForMatch = (secondChoice) => {
    setDisabled(true);
    
    if (choiceOne.name === secondChoice.name) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.name === choiceOne.name ? { ...card, matched: true } : card
        )
      );
      resetTurn();
    } else {
      setTimeout(() => {
        flipCard(choiceOne.id, false);
        flipCard(secondChoice.id, false);
        resetTurn();
      }, 1000);
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  const resetGame = () => {
    shuffleCards();
  };

  return (
    <div className="bg-fuchsia-950 min-h-screen w-screen py-4 px-2 relative overflow-hidden">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
      
      <div className="container mx-auto flex justify-center flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white py-4 font-game">
          Magic Wall
        </h1>
        <button
          onClick={shuffleCards}
          className="text-white font-bold border-2 p-2 rounded-xl cursor-pointer hover:bg-fuchsia-500 active:bg-fuchsia-700 font-game mb-6 md:mb-10"
        >
          New Game
        </button>
      </div>

      {gameCompleted ? (
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80 bg-white rounded-lg shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-1000 transform scale-110">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-purple-600 opacity-80"></div>
            <div className="relative z-10 text-center p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-white text-lg md:text-xl mb-6">
                You won the game in {turns} turns!
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-white text-fuchsia-800 font-bold rounded-lg cursor-pointer hover:bg-fuchsia-100 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      ) : isAnimating ? (
        <div className="container mx-auto flex justify-center items-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`absolute transition-all duration-1000 ease-in-out`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${1 - index * 0.05})`,
                  zIndex: 12 - index,
                  opacity: 1 - index * 0.08,
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
                  <img 
                    src={card.src} 
                    alt={card.name} 
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto flex justify-center items-center px-2">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-3 md:gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 cursor-pointer rounded-lg border-2 border-white transition-all duration-500 ${
                  card.flipped ? "rotate-y-180" : ""
                } ${card.matched ? "matched" : ""}`}
                onClick={() => handleChoice(card)}
              >
                <div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden shadow-md">
                  <div className={`absolute w-full h-full flex justify-center items-center transition-all duration-500 ${
                    card.flipped ? "rotate-y-180" : ""
                  }`}>
                    <img 
                      src={card.flipped ? card.src : Cover} 
                      alt={card.flipped ? card.name : "card back"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!gameCompleted && !isAnimating && (
        <div className="text-white text-center mt-4 md:mt-6 text-lg md:text-xl">
          Turns: {turns}
        </div>
      )}
    </div>
  );
};

export default MagicGame;