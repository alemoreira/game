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

  const observers = [];

  function start() {
    const frequency = 2000;

    setInterval(addFruit, frequency);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX =
      "playerX" in command
        ? command.playerX
        : Math.floor(Math.random() * state.screen.width);
    const playerY =
      "playerY" in command
        ? command.playerY
        : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }

  function addFruit(command) {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 10000000);
    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.screen.width);
    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: "add-fruit",
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY,
    });
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];

    notifyAll({
      type: "remove-fruit",
      fruitId: fruitId,
    });
  }

  function movePlayer(command) {
    //   console.log(`Moving ${command.playerId} with ${command.keyPressed}`);
    notifyAll(command);

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
    addPlayer,
    removePlayer,
    movePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start,
  };
}
