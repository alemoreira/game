// CAMADA DE INPUT - ACAO DO JOGADOR
// Factory Pattern - isolando a camada de INPUT

export default function createKeyboardListener(document) {
  // Observer Pattern - createKeyboardListener passa a ser um Subject
  // Aqui vai ter o game (em runtime e não mais estaticamente acoplado)
  const state = {
    observers: [],
    playerId: null,
  };

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    //   console.log(`Notifying ${observers.length} observers`);

    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }
  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(event) {
    const keyPressed = event.key;

    // Este o objeto preparado para transportar o estado (dados) esperados pelos Observers para que eles possam realizar suas ações. Neste caso o jogo poder mover o jogador.
    const command = {
      type: "move-player",
      playerId: state.playerId,
      keyPressed,
    };

    //game.movePlayer(command);
    notifyAll(command);
    // o objetivo com o Observer Pattern foi remover o acomplamento com game (camada de jogo)
  }

  return {
    subscribe,
    registerPlayerId,
  };
}
