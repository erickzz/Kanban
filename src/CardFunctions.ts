import { CardItems } from './types';

export function addNewOption(
  newCardOption: string,
  id: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
  if (newCardOption === '') return;
  const itemsFromStorage = JSON.parse(localStorage.getItem(`cardItems_${id}`) || '[]');
  const newItem: CardItems = {
    id: Math.random() * 100,
    value: newCardOption,
    index: Math.max(...itemsFromStorage.map((i: CardItems) => i.index), 0) + 1,
  };
  itemsFromStorage.push(newItem);
  localStorage.setItem(`cardItems_${id}`, JSON.stringify(itemsFromStorage));
  setCardItems(itemsFromStorage);
}

export function deleteItem(
  cardId: number,
  id: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
  const itemsFromStorage = JSON.parse(localStorage.getItem(`cardItems_${cardId}`) || '[]');
  const newItems = itemsFromStorage.filter((i: CardItems) => i.id !== id);
  localStorage.setItem(`cardItems_${cardId}`, JSON.stringify(newItems));
  setCardItems(newItems);
}

export function editItem(
  cardId: number,
  id: number,
  editItemValue: string,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>
) {
  const itemsFromStorage = JSON.parse(localStorage.getItem(`cardItems_${cardId}`) || '[]');
  const newItems = itemsFromStorage.map((item: { id: number; value: string }) => {
    if (item.id === id) {
      item.value = editItemValue;
    }
    return item;
  });
  localStorage.setItem(`cardItems_${cardId}`, JSON.stringify(newItems));
  setCardItems(newItems);
}

export function moveItem(
  idCardTarget: number,
  itemId: number,
  idCard: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardItems[]>>,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) {

  if(idCard === idCardTarget) return;

  let cardTarget = JSON.parse(localStorage.getItem(`cardItems_${idCardTarget}`) || '[]');
  const actualCard = JSON.parse(localStorage.getItem(`cardItems_${idCard}`) || '[]');

  const itemToMoveIndex = actualCard.findIndex((i: CardItems) => i.id === itemId);
  
  if (itemToMoveIndex === -1) return;
  
  const itemToMove = actualCard[itemToMoveIndex];
  itemToMove.index = Math.max(...cardTarget.map((i: CardItems) => i.index), 0) + 1;

  cardTarget = [...cardTarget, itemToMove];
  actualCard.splice(itemToMoveIndex, 1);

  localStorage.setItem(`cardItems_${idCardTarget}`, JSON.stringify(cardTarget));
  localStorage.setItem(`cardItems_${idCard}`, JSON.stringify(actualCard));
  console.log(actualCard)
  setCardItems(actualCard);
  setRefresh(prev => !prev)
}

