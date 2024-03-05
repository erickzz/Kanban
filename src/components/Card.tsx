import { useState, useEffect } from 'react';
import { Trash, Pencil } from 'lucide-react';
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
  }, [setCardItems]);

  const [newCardOption, setNewCardOption] = useState<string>('');
  const [editItemValue, setEditItemValue] = useState<string>('');
  const cardId = cardOptions.id;
  const itensNumber = cardItems.filter((item) => item.cardId === cardId).length;
  const height = 180 + 70 * itensNumber;
  const [showMoveItem] = useState<number[]>([]);

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
          className="p-2 bg-slate-200 mt-4"
          style={{ backgroundColor: cardOptions.color }}
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', item.id.toString());
          }}
        >
          <div className="flex justify-between align-middle">
            <input
              id={item.id.toString()}
              defaultValue={item.value}
              className="bg-slate-200 w-3/4 cursor-default p-2 focus:outline-double h-auto flex-wrap"
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
              <button className="p-2 h-auto w-auto"></button>
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
      className={`p-4  m-4 w-1/5`}
      style={{ height: `${height}px` }}
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
      <div
        className="flex justify-between w-full flex-wrap p-4"
        style={{ backgroundColor: cardOptions.color }}
      >
        <h3 className="text-xl font-semibold">{cardOptions.title}</h3>
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
        <p className="">{cardOptions.description}</p>
      </div>
      <ul>{ItemsRender}</ul>
      <div
        className="flex items-center justify-center h-auto w-auto p-4 mt-4"
        style={{ backgroundColor: cardOptions.color }}
      >
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
    </div>
  );
}

export default Card;
