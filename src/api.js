

const API_KEY = "ff9ef8eb0a54c0ccc8caede970a1d6781cf183e52d8e479558234b38f97aa155";
const tickersHandlers = new Map();

// ссылка из документации сервиса связанная с websocket
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const  AGGREGATE_INDEX  = '5'; // из документации номер канала подписки

socket.addEventListener('message', e =>{
  const {TYPE:type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
  if(type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }
  const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn=>fn(newPrice))
});

// СПОСОБ ПОДКЛЮЧЕНИЯ ЧЕРЕЗ REST API
// const loadTickers = () => {
//   if(tickersHandlers.size == 0) {
//     return
//   }
//   fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
//       ...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`
//   )
//    .then(r=>r.json())
//    .then(rawData =>{
//     const updatedPrices = Object.fromEntries(
//       Object.entries(rawData).map(([key,value]) => [key,value.USD])
//     );

//     Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      
//     })
//   });
// };

function sendToWebSocket(message){
  const stringifiedMessage = JSON.stringify(message);
  if(socket.readyState === WebSocket.OPEN){
    socket.send(stringifiedMessage);
    return
  }
  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage),
    {once: true}
  })
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: 'SubAdd',
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}
function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

export const subscribeToTicker = (ticker, cb) => { //когда тикер обновится - вызывай cb()
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

// функция отписки от ticker
export const unsubscribeFromTicker = ticker =>{
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker)
}


// setInterval(loadTickers, 5000);