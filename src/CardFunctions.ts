// CardFunctions.ts

import { CardItems } from './types';

export function addNewOption(
  newCardOption: string,
  id: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
  if (newCardOption === '') return;
  const itemsFromStorage = JSON.parse(localStorage.getItem('cardItems') || '');
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
}

export function deleteItem(
  id: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
    const items = JSON.parse(localStorage.getItem('cardItems') || '');
  const newItems = items.filter((i: CardItems) => i.id !== id);
  localStorage.setItem('cardItems', JSON.stringify(newItems));
  setCardItems(newItems);
}

export function editItem(
  id: number,
  editItemValue: string,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
  const getItems = JSON.parse(localStorage.getItem('cardItems') || '');
  const newItems = getItems.map((item: { id: number; value: string }) => {
    if (item.id === id) {
      item.value = editItemValue;
    }
    return item;
  });
  setCardItems(newItems);
  localStorage.setItem('cardItems', JSON.stringify(newItems));
}

export function moveItem(
  moveItemTo: number,
  id: number,
  cardItems: CardItems[],
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>,
) {

  const newItems = cardItems.map((item) => {
    if (item.id === id) {
      item.cardId = moveItemTo;
    }
    return item;
  });
  localStorage.setItem('cardItems', JSON.stringify(newItems));
  setCardItems(newItems);
}
