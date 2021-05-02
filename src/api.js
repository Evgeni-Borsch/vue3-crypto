

const API_KEY = "73302d28d5bf9f8ff43620332515ace6d89a2a4a3d13bcf35fcb34ec81075908";
const tickersHandlers = new Map();

export const loadTickers = () => {
  if(tickersHandlers.size == 0) {
    return
  }
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys()
    ].join(',')}&tsyms=USD&api_key=${API_KEY}`
  )
   .then(r=>r.json())
   .then(rawData =>{
    const updatedPrices = Object.fromEntries(
      Object.entries(rawData).map(([key,value]) => [key,value.USD])
    );

    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handlers = tickersHandlers.get(currency) ?? [];
      handlers.forEach(fn=>fn(newPrice))
    })
  });
};
export const subscribeToTicker = (ticker, cb) => { //когда тикер обновится - вызывай cb()
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb])
};

// функция отписки от ticker
export const unsubscribeFromTicker = (ticker, cb) =>{
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(
    ticker,
    subscribers.filter(fn => fn!==cb)
  )
}
setInterval(loadTickers, 5000);