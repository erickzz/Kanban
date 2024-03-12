import { useState, useEffect } from 'react';
import { Trash, Pencil } from 'lucide-react';
import { CardProperties, CardItems } from '../types';
import { addNewOption, deleteItem, editItem, moveItem } from '../CardFunctions';

function Card({
  cardOptions,
  editCard,
  notify,
  removeCard,
  refresh,
  setRefresh,
}: {
  cardOptions: CardProperties;
  editCard: (id: number) => void;
  notify: (message: string, type: string) => void;
  removeCard: (id: number) => void;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [cardItems, setCardItems] = useState<CardItems[]>(() => {
    const itemsFromStorage = localStorage.getItem(
      `cardItems_${cardOptions.id}`
    );
    return itemsFromStorage ? JSON.parse(itemsFromStorage) : [];
  });

  /*   useEffect(() => {
    localStorage.setItem(`cardItems_${cardId}`, JSON.stringify(cardItems));
  }, [cardItems]); */

  const [newCardOption, setNewCardOption] = useState<string>('');
  const [editItemValue, setEditItemValue] = useState<string>('');
  const cardId = cardOptions.id;
  const itensNumber = cardItems.length;
  const height = 180 + 70 * itensNumber;
  const [showMoveItem] = useState<number[]>([]);

  useEffect(() => {
    setCardItems(
      JSON.parse(localStorage.getItem(`cardItems_${cardId}`) || '[]')
    );
  }, [refresh]);

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

  const sortItems = cardItems.sort((a, b) => a.index - b.index);

  const ItemsRender = sortItems.map((item) => {
    return (
      <li
        key={item.id}
        className="p-2 bg-slate-200 mt-4"
        style={{ backgroundColor: cardOptions.color }}
        draggable="true"
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', `${item.id},${cardId}`);
        }}
      >
        <div className="flex justify-between align-middle">
          <input
            id={item.id.toString()}
            defaultValue={item.value}
            className="bg-slate-200 w-3/4 cursor-default p-2 focus:outline-double h-auto flex-wrap"
            onBlur={() => {
              if (editItemValue === '') {
                (document.getElementById(
                  item.id.toString()
                ) as HTMLInputElement)!.value = cardItems.find(
                  (i) => i.id === item.id
                )?.value as string;
                return;
              }

              editItem(cardId, item.id, editItemValue, setCardItems);
              notify('Item editado!', 'success');
            }}
            onChange={(e) => {
              setEditItemValue(e.target.value);
            }}
          />
          <div className="w-1/6 flex justify-end">
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
                deleteItem(cardId, item.id, setCardItems);
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
  });

  return (
    <div
      className={`p-4  mx-4 mb-14 w-1/5`}
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
        const data = e.dataTransfer.getData('text/plain');
        const [itemId, cardId] = data.split(',');
        moveItem(cardOptions.id, +itemId, +cardId, setCardItems, setRefresh);
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
