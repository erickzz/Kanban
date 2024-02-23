import React, { useState, useEffect } from 'react';
import { CardProperties, CardItems } from '../types';
import { Trash, Pencil, ArrowLeftRight } from 'lucide-react';

function Card({ cardOptions }: { cardOptions: CardProperties }) {
  useEffect(() => {
    const itemsFromStorage = localStorage.getItem('cardItems');
    if (itemsFromStorage === null) {
      localStorage.setItem('cardItems', JSON.stringify([]));
    } else {
      setCardItems(JSON.parse(itemsFromStorage));
    }
  }, []);

  const options = cardOptions;

  const cardsInfo = JSON.parse(localStorage.getItem('cards') ?? '');

  const [newCardOption, setNewCardOption] = useState<string>('');

  const [editItemValue, setEditItemValue] = useState<string>('');

  const [cardItems, setCardItems] = useState<CardItems[]>([]);

  const inputsElements = document.getElementsByTagName('input');

  const addNewOption = (id: number) => {
    if (newCardOption === '') return;
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

  const editItem = (id: number) => {
    const inputOfItem = inputsElements[id];
    const prevItem: CardItems | undefined = cardItems.find(
      (item) => item.id === id
    );

    if (editItemValue === '') {
      if (inputOfItem.id === id.toString()) {
        inputOfItem.value = prevItem?.value || '';
      }

      return;
    }
    const getItems = JSON.parse(localStorage.getItem('cardItems') ?? '');
    const newItems = getItems.map((item: { id: number; value: string }) => {
      if (item.id === id) {
        item.value = editItemValue;
      }
      return item;
    });
    setCardItems(newItems);
    localStorage.setItem('cardItems', JSON.stringify(newItems));
  };

  const cardId = cardOptions.id;
  const itensNumber = cardItems.filter((item) => item.cardId === cardId).length;
  const height = 180 + 70 * itensNumber;

  const [showMoveItem, setShowMoveItem] = useState<number[]>([]);

  useEffect(() => {
    console.log(cardItems);
  }, [cardItems]);

  const moveItem = (moveItemTo: number, id: number) => {
    setShowMoveItem((prev) => prev.filter((item) => item !== id));
    const newItems = cardItems.map((item) => {
      if (item.id === id) {
        item.cardId = moveItemTo;
      }
      return item;
    });
    localStorage.setItem('cardItems', JSON.stringify(newItems));
    setCardItems(newItems);
    window.location.reload();
  };

  const ItemsRender = cardItems.map((item, index) => {
    if (item.cardId === cardOptions.id) {
      return (
        <li key={index} className="p-2 bg-slate-200 rounded mt-4">
          <div className="flex justify-between align-middle">
            <input
              id={item.id.toString()}
              defaultValue={item.value}
              className="bg-slate-200 w-2/4 cursor-default"
              onBlur={() => {
                editItem(item.id);
              }}
              onChange={(e) => {
                setEditItemValue(e.target.value);
              }}
            />
            <div className="w-1/6 flex justify-end">
              <button>
                {showMoveItem.includes(item.id) ? (
                  <select
                    className="bg-slate-200"
                    value={options.id}
                    onChange={(e) => {
                      moveItem(+e.target.value, item.id);
                    }}
                  >
                    {cardsInfo.map((card: CardProperties, index: number) => {
                      return (
                        <option key={index} value={card.id}>
                          {card.title}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <ArrowLeftRight
                    size={20}
                    className="text-zinc-500 hover:text-zinc-800 transition-colors"
                    onClick={() => {
                      setShowMoveItem((prev) => [...prev, item.id]);
                    }}
                  />
                )}
              </button>
              <button
                className="px-4 h-auto w-2"
                onClick={() => {
                  const input = document.getElementById(item.id.toString());
                  console.log(input);
                  input?.focus();
                }}
              >
                <Pencil
                  size={20}
                  className="text-zinc-500 hover:text-zinc-800 transition-colors "
                />
              </button>
              <button
                className="px-4 h-auto w-2 mr-2"
                onClick={() => {
                  deleteItem(item.id);
                }}
              >
                <Trash
                  size={20}
                  className="text-zinc-500 hover:text-zinc-800 transition-colors "
                />
              </button>
            </div>
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
            className=" bg-slate-200 rounded mt-4 mr-4 h-10 p-2 w-4/6 focus:outline-none"
            onChange={(e) => setNewCardOption(e.target.value)}
            value={newCardOption}
          />
          <button
            className="bg-none border-2 border-white rounded px-4 h-10 text-sm text-white self-end w-2/6 hover:bg-white hover:text-black transition-colors"
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
