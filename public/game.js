// CAMADA DE LOGICA, DADOS = JOGO
// Factory Pattern - isolando a camada do Jogo
export default function createGame() {
  const state = {
    fruits: {},
    players: {},
    screen: {
      width: 10,
      height: 10,
    },
  };

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = command.playerX;
    const playerY = command.playerY;

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];
  }

  function movePlayer(command) {
    //   console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

    const acceptedMoves = {
      ArrowUp(player) {
        //   console.log(`Moving ${player} Up`);

        //   if (player.y - 1 >= 0) {
        //     player.y = player.y - 1;
        //   }
        player.y = Math.max(player.y - 1, 0);
      },
      ArrowRight(player) {
        //   console.log(`Moving ${player} Right`);

        //   if (player.x + 1 < screen.width) {
        //     player.x = player.x + 1;
        //   }
        player.x = Math.min(player.x + 1, state.screen.width - 1);
      },
      ArrowDown(player) {
        //   console.log(`Moving ${player} Down`);

        //   if (player.y + 1 < screen.height) {
        //     player.y = player.y + 1;
        //   }
        player.y = Math.min(player.y + 1, state.screen.width - 1);
      },
      ArrowLeft(player) {
        //   console.log(`Moving ${player} Left`);

        //   if (player.x > 0) {
        //     player.x = player.x - 1;
        //   }
        player.x = Math.max(player.x - 1, 0);
      },
    };

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId); // Assim a cada movimento, é analisado colisão apenas com o jogador que se movimentou.
    }
  }

  function checkForFruitCollision(playerId) {
    //   for (const playerId in state.players) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      console.log(`Checking ${playerId} and ${fruitId}`);

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`COLLISION between ${playerId} and ${fruitId}`);

        // removeFruit({ fruitId });
        removeFruit({ fruitId: fruitId });
      }
    }
    //   }
  }

  // Retornar o objeto Jogo.
  // Externalizando método ou funcionalidade mover jogador.
  return {
    addFruit,
    removeFruit,
    addPlayer,
    removePlayer,
    movePlayer,
    state,
  };
}
