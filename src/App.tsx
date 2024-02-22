import { Info, PlusCircle } from 'lucide-react';
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

  const [cardsState] = useState<CardProperties[]>(cards);

  return (
    <div className="w-screen h-screen bg-zinc-800">
      <div className="p-10 mr-10 text-white text-2xl flex justify-between ">
        <h2>Kanban</h2>
        <Info size={30} className="text-slate-200 cursor-pointer" />
      </div>
      <div className="flex ">
        {cardsState.map((card, index) => (
          <Card key={index} cardOptions={card} />
        ))}
        <div
          className={`border-slate-300 border-2 p-4 rounded-lg m-4 w-1/5 flex justify-center items-center`}
          style={{ backgroundColor: 'transparent', height: `320px` }}
        >
          <PlusCircle size={80} className="text-slate-200 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;
