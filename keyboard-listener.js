// CAMADA DE INPUT - ACAO DO JOGADOR
// Factory Pattern - isolando a camada de INPUT
function createKeyboardListener() {
  // Observer Pattern - createKeyboardListener passa a ser um Subject
  const observers = []; // Aqui vai ter o game (em runtime e não mais estaticamente acoplado)

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    //   console.log(`Notifying ${observers.length} observers`);

    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }
  document.addEventListener("keydown", handleKeyDown);

  function handleKeyDown(event) {
    // Este o objeto preparado para transportar o estado (dados) esperados pelos Observers para que eles possam realizar suas ações. Neste caso o jogo poder mover o jogador.
    const command = {
      playerId: "player1",
      keyPressed: event.key,
    };

    //game.movePlayer(command);
    notifyAll(command);
    // o objetivo com o Observer Pattern foi remover o acomplamento com game (camada de jogo)
  }

  return {
    subscribe,
  };
}
