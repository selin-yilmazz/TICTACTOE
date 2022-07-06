import React, { useState, useEffect } from 'react';
import Box from './Box';

// başlangıç pozisyonları
const positions = {
  '0,0': '',
  '0,1': '',
  '0,2': '',
  '1,0': '',
  '1,1': '',
  '1,2': '',
  '2,0': '',
  '2,1': '',
  '2,2': '',
};

// kazanma pozisyonları
const winningPositions = [
  ['0,0', '0,1', '0,2'],
  ['1,0', '1,1', '1,2'],
  ['2,0', '2,1', '2,2'],
  ['0,0', '1,0', '2,0'],
  ['0,1', '1,1', '2,1'],
  ['0,2', '1,2', '2,2'],
  ['0,0', '1,1', '2,2'],
  ['0,2', '1,1', '2,0'],
];

// array içerisinden rastgele bi index döndürür
const randomPlace = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default () => {
  const [boxPositions, setBoxPositions] = useState(positions);
  const [settings, setSettings] = useState({
    winner: '',
    gameOver: false,
    gameStarted: false,
  });

  const [computerTurn, setComputerTurn] = useState(false);
  const [startFirst, setStartFirst] = useState(true);

  useEffect(() => {
    // oyun bittiyse veya başlamadıysa, bir şey yapma.
    if (settings.gameOver || !settings.gameStarted) {
      return;
    }

    // kazanma durumunu kontrol et
    checkWinner(boxPositions);

    // bilgisayarın turuysa ve oyun bitmediyse, bilgisayara oynat
    if (computerTurn && !settings.gameOver) {
      handleComputerTurn();
    }
  }, [boxPositions]);

  const handleBoxClick = (box) => {
    // bilgisayarın turuysa, oyun bittiyse, başlamadıysa veya üstüne tıklanan kutu
    // X veya O ile doldurulmuşsa, bir şey yapma.
    if (
      computerTurn ||
      settings.gameOver ||
      !settings.gameStarted ||
      boxPositions[box] != ''
    ) {
      return;
    }

    // X veya O'yu işaretle
    setBoxPositions({ ...boxPositions, [box]: 'X' });
    // oynama sırasını bilgisayara ver
    setComputerTurn(true);
  };

  const handleComputerTurn = () => {
    // bilgisayarın oynayacağı boş kutuyu seç
    let randomBox = randomPlace(
      Object.keys(boxPositions).filter(
        (box) => boxPositions[box] === ''
      )
    );

    // işaretlenecek kutu kalmadıysa bir şey yapma
    if (!randomBox) {
      return;
    }

    // oynama sırasını bilgisayardan al
    setComputerTurn(false);

    // kutuyu o ile işaretle
    setBoxPositions({ ...boxPositions, [randomBox]: 'O' });
  };

  const checkWinner = (bPositions) => {
    // kazanma pozisyonlarını loop'a sok
    for (let i = 0; i < winningPositions.length; i++) {
      const [a, b, c] = winningPositions[i];
      if (
        bPositions[a] !== '' &&
        bPositions[a] === bPositions[b] &&
        bPositions[a] === bPositions[c]
      ) {
        let kazanan = bPositions[a];
        if (kazanan == 'X') {
          alert('Kazandın');
        } else {
          alert('Kaybettin');
        }
        setSettings({
          ...settings,
          gameOver: true,
          winner: bPositions[a],
          gameStarted: false,
        });
        setComputerTurn(false);
      } else if (!Object.values(bPositions).some((v) => v === '')) {
        alert('Berabere');
        setComputerTurn(false);
        setSettings({
          ...settings,
          gameOver: true,
          winner: bPositions[a],
          gameStarted: false,
        });
        return;
      }
    }
  };

  const startGame = () => {
    resetGame();
    setComputerTurn(!startFirst);
    setSettings({ ...settings, gameStarted: true, gameOver: false });
    if (!startFirst) {
      handleComputerTurn();
    }
  };

  const resetGame = () => {
    setSettings({ ...settings, gameOver: false, gameStarted: false });
    setBoxPositions(positions);
    setComputerTurn(!startFirst);
  };

  return (
    <div>
      <div>
        <button onClick={startGame}>Start Game</button>
        <button onClick={resetGame}>Reset Game</button>
        Start first:
        <input
          type="checkbox"
          checked={startFirst}
          onChange={() => {
            setStartFirst(!startFirst);
          }}
        />
      </div>
      <div className="game-board">
        {settings.gameStarted
          ? Object.keys(boxPositions).map((box, i) => (
              <Box
                key={i}
                item={boxPositions[box]}
                onClick={() => {
                  handleBoxClick(box);
                }}
              />
            ))
          : 'Game not started'}
      </div>
    </div>
  );
};
