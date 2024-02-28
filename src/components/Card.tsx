import { useState, useEffect } from 'react';
import { Trash, Pencil, ArrowLeftRight } from 'lucide-react';
import { CardProperties, CardItems } from '../types';
import { addNewOption, deleteItem, editItem, moveItem } from '../CardFunctions';

function Card({
  cardOptions,
  editCard,
  cardItems,
  setCardItems,
  notify,
  removeCard,
}: {
  cardOptions: CardProperties;
  editCard: (id: number) => void;
  cardItems: CardItems[];
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>;
  notify: (message: string, type: string) => void;
  removeCard: (id: number) => void;
}) {
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
  const cards = JSON.parse(localStorage.getItem('cards') as string);
  const cardId = cardOptions.id;
  const itensNumber = cardItems.filter((item) => item.cardId === cardId).length;
  const height = 180 + 70 * itensNumber;
  const [showMoveItem, setShowMoveItem] = useState<number[]>([]);

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
        <li
          key={index}
          className="p-2 bg-slate-200 rounded mt-4"
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', item.id.toString());
          }}
        >
          <div className="flex justify-between align-middle">
            <input
              id={item.id.toString()}
              defaultValue={item.value}
              className="bg-slate-200 w-2/4 cursor-default p-2 focus:outline-double rounded"
              onBlur={() => {
                if (editItemValue === '') {
                  console.log(cardItems);
                  (document.getElementById(
                    item.id.toString()
                  ) as HTMLInputElement)!.value = cardItems.find(
                    (i) => i.id === item.id
                  )?.value as string;
                  return;
                }

                editItem(item.id, editItemValue, setCardItems);
                notify('Item editado!', 'success');
              }}
              onChange={(e) => {
                setEditItemValue(e.target.value);
              }}
            />
            <div className="w-1/6 flex justify-end">
              <button className="p-2 h-auto w-auto">
                {showMoveItem.includes(item.id) ? (
                  <select
                    className="bg-slate-200 w-auto focus:outline-none rounded px-2 transition-colors hover:bg-white hover:text-black"
                    id={item.id.toString()}
                    value={cardOptions.id}
                    onChange={(e) => {
                      moveItem(
                        +e.target.value,
                        item.id,
                        cardItems,
                        setCardItems
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
                  notify('Item deletado!', 'error');
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
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setCardItems(cardItems.filter((item) => item.id !== 0));
      }}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        moveItem(cardOptions.id, +id, cardItems, setCardItems);
      }}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold ">{cardOptions.title}</h3>
        <div className="flex gap-4">
          <Pencil
            className="text-zinc-800 cursor-pointer hover:text-slate-200 transition-colors"
            onClick={() => {
              editCard(cardOptions.id);
            }}
          />
          <Trash
            className="text-zinc-800 cursor-pointer hover:text-slate-200 transition-colors"
            onClick={() => {
              removeCard(cardOptions.id);
            }}
          />
        </div>
      </div>
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
            Adicionar
          </button>
        </div>
      </ul>
    </div>
  );
}

export default Card;
