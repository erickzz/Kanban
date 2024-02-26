// Limpar o input de um item após adicionar
// Delete está bugando ao deletar itens de cards diferentes

import { useState, useEffect } from 'react';
import { Trash, Pencil, ArrowLeftRight } from 'lucide-react';
import { CardProperties, CardItems } from '../types';
import { addNewOption, deleteItem, editItem, moveItem } from '../CardFunctions';

function Card({ cardOptions }: { cardOptions: CardProperties }) {
  useEffect(() => {
    const itemsFromStorage = localStorage.getItem('cardItems');
    if (itemsFromStorage === null) {
      localStorage.setItem('cardItems', JSON.stringify([]));
    } else {
      setCardItems(JSON.parse(itemsFromStorage));
    }
  }, []);

  const [newCardOption, setNewCardOption] = useState<string>('');
  const [editItemValue, setEditItemValue] = useState<string>('');
  const [cardItems, setCardItems] = useState<CardItems[]>([]);
  const cards = JSON.parse(localStorage.getItem('cards') as string);
  const cardId = cardOptions.id;
  const itensNumber = cardItems.filter((item) => item.cardId === cardId).length;
  const height = 180 + 70 * itensNumber;
  const [showMoveItem, setShowMoveItem] = useState<number[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
    setReload(false);
  }, [reload]);

  useEffect(() => {
    if (showMoveItem.length > 0) {
      const selectElements = Array.from(
        document.getElementsByTagName('select')
      );
      selectElements.filter((select) => {
        if (showMoveItem.includes(+select.id)) {
          select.focus();
        }
      });
    }
  }, [showMoveItem]);

  const ItemsRender = cardItems.map((item, index) => {
    if (item.cardId === cardOptions.id) {
      return (
        <li key={index} className="p-2 bg-slate-200 rounded mt-4">
          <div className="flex justify-between align-middle">
            <input
              id={item.id.toString()}
              defaultValue={item.value}
              className="bg-slate-200 w-2/4 cursor-default p-2 focus:outline-double rounded"
              onBlur={() => {
                editItem(item.id, editItemValue, setCardItems);
              }}
              onChange={(e) => {
                setEditItemValue(e.target.value);
              }}
            />
            <div className="w-1/6 flex justify-end">
              <button className="p-2 h-auto w-auto">
                {showMoveItem.includes(item.id) ? (
                  <select
                    className="bg-slate-200 focus:outline-none w-auto rounded px-2 transition-colors hover:bg-white hover:text-black sm:w-2/6"
                    id={item.id.toString()}
                    value={cardOptions.id}
                    onChange={(e) => {
                      moveItem(
                        +e.target.value,
                        item.id,
                        cardItems,
                        setCardItems,
                        setReload
                      );
                    }}
                    onBlur={() => {
                      setShowMoveItem((prev) =>
                        prev.filter((i) => i !== item.id)
                      );
                    }}
                  >
                    {cards.map((card: CardProperties) => {
                      return (
                        <option key={card.id} value={card.id}>
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
                className="p-2 h-auto w-auto"
                onClick={() => {
                  const input = document.getElementById(item.id.toString());
                  input?.focus();
                }}
              >
                <Pencil
                  size={20}
                  className="text-zinc-500 hover:text-zinc-800 transition-colors "
                />
              </button>
              <button
                className="p-2 h-auto w-auto"
                onClick={() => {
                  deleteItem(item.id, setCardItems);
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
      <h3 className="text-xl font-semibold ">{cardOptions.title}</h3>
      <p className="">{cardOptions.description}</p>
      <ul>
        {ItemsRender}
        <div className="flex h-auto w-auto  ">
          <input
            className=" bg-slate-200 rounded mt-4 mr-4 h-10 p-2 w-4/6 focus:outline-none"
            onChange={(e) => setNewCardOption(e.target.value)}
            value={newCardOption}
          />
          <button
            className="bg-none border-2 border-white rounded px-4 h-10 text-sm text-white self-end w-1/2 hover:bg-white hover:text-black transition-colors"
            onClick={() => {
              addNewOption(newCardOption, cardOptions.id, setCardItems);
              setNewCardOption('');
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
