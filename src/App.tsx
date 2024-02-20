import { useState } from 'react';
import { CardProperties } from './types';
import Card from './components/Card';

function App() {
  const storedCardsJson = localStorage.getItem('cards');
  const storedCards: CardProperties[] = storedCardsJson
    ? JSON.parse(storedCardsJson)
    : [];

  const defaultCards: CardProperties[] = [
    {
      id: 1,
      title: 'To Do',
      description: 'Things I have to do',
      color: '#ae8fc7',
    },
    {
      id: 2,
      title: 'Doing',
      description: 'Things I am doing',
      color: '#8fc78f',
    },
    {
      id: 3,
      title: 'Done',
      description: 'Things I have done',
      color: '#f26e64',
    },
  ];

  const cards: CardProperties[] =
    storedCards.length > 0 ? storedCards : defaultCards;

  const [cardsState, setCardsState] = useState<CardProperties[]>(cards);

  return (
    <div className="w-screen h-screen bg-zinc-800">
      <div className="p-10 text-white text-2xl">
        <h2>Kanban</h2>
      </div>
      <div className="flex">
        {cardsState.map((card, index) => (
          <Card key={index} cardOptions={card} />
        ))}
      </div>
    </div>
  );
}

export default App;
