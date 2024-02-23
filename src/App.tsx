import { Info, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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
      title: 'Para fazer 😅',
      description: 'Lista de coisa a fazer',
      color: '#ae8fc7',
    },
    {
      id: 2,
      title: 'Fazendo 🤯',
      description: 'Lista de coisas que estou fazendo no momento',
      color: '#8fc78f',
    },
    {
      id: 3,
      title: 'Feitos 😎',
      description: 'Lista de coisas que já fiz e estão prontas',
      color: '#f26e64',
    },
  ];

  useEffect(() => {
    if (storedCards.length === 0) {
      localStorage.setItem('cards', JSON.stringify(defaultCards));
    }
  }, [storedCards]);

  const cards: CardProperties[] =
    storedCards.length > 0 ? storedCards : defaultCards;

  const [cardsState] = useState<CardProperties[]>(cards);

  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="w-screen h-screen bg-zinc-800">
      <div className="p-10 mr-10 text-white text-2xl flex justify-between ">
        <h2>Kanban</h2>
        <div className="flex items-center gap-4 w-auto h-12">
          {showMessage && (
            <div className="bg-slate-200 opacity-80 w-auto rounded text-black p-4 flex flex-col justify-center">
              <p className="text-xs ">
                🚨 Esta aplicação utiliza de armazenamento local, sendo sujeito
                a perda de dados caso o cache seja limpo. Esteja ciente! 🚨
              </p>
            </div>
          )}

          <Info
            size={30}
            className="text-slate-200 cursor-pointer"
            onMouseEnter={() => {
              setShowMessage(true);
            }}
            onMouseLeave={() => {
              setShowMessage(false);
            }}
          />
        </div>
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
