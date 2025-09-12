// Web Worker para tarefas intensivas
self.onmessage = function (event) {
  const { data } = event;
  // Exemplo: cálculo pesado
  const result = data.map((num) => num * 2);
  self.postMessage(result);
};
