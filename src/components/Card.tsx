import { useState, useEffect } from 'react';
import { CardProperties, CardItems } from '../types';

function Card({ cardOptions }: { cardOptions: CardProperties }) {
  const options = cardOptions;

  const [newCardOption, setNewCardOption] = useState<string>('');

  const [cardItems, setCardItems] = useState<CardItems[]>([]);

  useEffect(() => {
    const itemsFromStorage = localStorage.getItem('cardItems');
    if (itemsFromStorage === null) {
      localStorage.setItem('cardItems', JSON.stringify([]));
    } else {
      setCardItems(JSON.parse(itemsFromStorage));
    }
  }, []);

  const addNewOption = (id: number) => {
    setNewCardOption('');
    const itemsFromStorage = JSON.parse(
      localStorage.getItem('cardItems') ?? ''
    );
    const newItem: CardItems = {
      id: Math.random() * 100,
      cardId: id,
      value: newCardOption,
    };
    if (itemsFromStorage === null) {
      localStorage.setItem('cardItems', JSON.stringify([newItem]));
      setCardItems([newItem]);
    } else {
      itemsFromStorage.push(newItem);
      localStorage.setItem('cardItems', JSON.stringify(itemsFromStorage));
      setCardItems(itemsFromStorage);
    }
  };

  const deleteItem = (id: number) => {
    const newItems = cardItems.filter((i) => i.id !== id);
    localStorage.setItem('cardItems', JSON.stringify(newItems));
    setCardItems(newItems);
  };

  const cardId = cardOptions.id;
  const itensNumber = cardItems.filter((item) => item.cardId === cardId).length;
  console.log(itensNumber);
  const height = 180 + 70 * itensNumber;

  const ItemsRender = cardItems.map((item, index) => {
    if (item.cardId === cardOptions.id) {
      return (
        <li key={index} className="p-2 bg-slate-200 rounded mt-4">
          <div className="flex justify-between align-middle">
            {item.value}
            <button
              className="bg-slate-300 rounded px-4 h-10 text-sm self-end w-2/6"
              onClick={() => {
                deleteItem(item.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      );
    }
  });

  return (
    <div
      className={`border-slate-300 border-2 p-4 rounded-lg m-4 w-1/5`}
      style={{ backgroundColor: cardOptions.color, height: `${height}px` }}
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
            onClick={() => {
              addNewOption(options.id);
            }}
          >
            Add new
          </button>
        </div>
      </ul>
    </div>
  );
}

export default Card;
