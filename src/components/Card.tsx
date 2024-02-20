import { useState } from 'react';
import { CardProperties, CardItems } from '../types';

function Card({
  cardOptions,
  cardsState,
}: {
  cardOptions: CardProperties;
  cardsState: React.Dispatch<React.SetStateAction<CardProperties[]>>;
}) {
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

  console.log(cardItems);

  const [newCardOption, setNewCardOption] = useState('');

  const addNewOption = () => {
    console.log(cardOptions.id);
    console.log(newCardOption);
  };

  const ItemsRender = cardItems.map((item) => {
    console.log(item.cardId, cardOptions.id);
    if (item.cardId === cardOptions.id) {
      item.items.map((item, index) => {
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
        <div className="flex h-auto w-auto justify-around align-bottom">
          <input
            className="bg-slate-200 rounded mt-4 mx-4 h-10 p-2 w-4/6 focus:outline-none"
            onChange={(e) => setNewCardOption(e.target.value)}
          />
          <button
            className="bg-slate-200 rounded px-4 h-10 text-sm self-end w-2/6"
            onClick={addNewOption}
          >
            Add new
          </button>
        </div>
      </ul>
    </div>
  );
}

export default Card;
