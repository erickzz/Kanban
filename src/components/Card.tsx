import { useState } from 'react';
import { CardProperties, CardItems } from '../types';

function Card({ cardOptions }: { cardOptions: CardProperties }) {
  const options = cardOptions;

  const storedItemsJson = localStorage.getItem('cards');
  const storedItems: CardItems[] = storedItemsJson
    ? JSON.parse(storedItemsJson)
    : [];

  const cardItems: CardItems[] =
    storedItems.length > 0
      ? storedItems
      : [
          { cardId: 1, items: ['item 1', 'item 1'] },
          { cardId: 2, items: ['item 2', 'item 2'] },
          { cardId: 3, items: ['item 3', 'item 3'] },
        ];

  const [cardsItemsState, setCardsItemsState] =
    useState<CardItems[]>(cardItems);

  const [newCardOption, setNewCardOption] = useState('');

  const addNewOption = (cardId: number) => {
    setNewCardOption('');
    setCardsItemsState((prev) => {
      return prev.map((item) => {
        if (item.cardId === cardId) {
          return {
            ...item,
            items: [...item.items, newCardOption],
          };
        }
        return item;
      });
    });
  };

  const ItemsRender = cardsItemsState.map((item) => {
    if (item.cardId === cardOptions.id) {
      return item.items.map((item, index) => {
        return (
          <li key={index} className="p-2 bg-slate-200 rounded mt-4">
            {item}
          </li>
        );
      });
    }
  });

  return (
    <div
      className={`border-slate-300 border-2 p-4 rounded-lg m-4 w-1/5`}
      style={{ backgroundColor: cardOptions.color }}
    >
      <h3 className="text-xl font-semibold ">{options.title}</h3>
      <p className="">{options.description}</p>
      <ul>
        {ItemsRender}
        <div className="flex h-auto w-auto  ">
          <input
            className="bg-slate-200 rounded mt-4 mr-4 h-10 p-2 w-4/6 focus:outline-none"
            onChange={(e) => setNewCardOption(e.target.value)}
            value={newCardOption}
          />
          <button
            className="bg-slate-200 rounded px-4 h-10 text-sm self-end w-2/6"
            onClick={() => addNewOption(options.id)}
          >
            Add new
          </button>
        </div>
      </ul>
    </div>
  );
}

export default Card;
