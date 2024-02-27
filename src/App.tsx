import { Info, PlusCircle, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { CardItems, CardProperties } from './types';
import defaultCards from './defaultCards';
import Card from './components/Card';

function App() {
  const storedCardsJson = localStorage.getItem('cards');
  const storedCards: CardProperties[] = useMemo(() => {
    return storedCardsJson ? JSON.parse(storedCardsJson) : [];
  }, [storedCardsJson]);

  useEffect(() => {
    if (storedCards.length === 0) {
      localStorage.setItem('cards', JSON.stringify(defaultCards));
    }
  }, [storedCards]);

  const cards: CardProperties[] =
    storedCards.length > 0 ? storedCards : defaultCards;

  const [cardsState, setCardsState] = useState<CardProperties[]>(cards);

  const [cardItems, setCardItems] = useState<CardItems[]>([]);

  const [showMessage, setShowMessage] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [cardToEditId, setCardToEditId] = useState<number>(0);
  const [cardToEdit, setCardToEdit] = useState<{
    cardName: string;
    cardDescription: string;
  }>();

  const editMode = (id: number) => {
    showModal ? setShowModal(false) : setShowModal(true);
    setCardToEditId(id);
    const cardToEdit = cardsState.find((card) => card.id === id);
    if (cardToEdit) {
      setCardToEdit({
        cardName: cardToEdit.title,
        cardDescription: cardToEdit.description,
      });
    }
  };

  const editCard = (newCard: {
    cardTitle: string;
    cardDescription: string;
  }) => {
    console.log(cardToEditId);
    console.log(newCard);
    const newCards = cardsState.map((card) => {
      if (card.id === cardToEditId) {
        card.title = newCard.cardTitle;
        card.description = newCard.cardDescription;
      }
      return card;
    });
    console.log(newCards);
    setCardsState(newCards);
    localStorage.setItem('cards', JSON.stringify(newCards));
  };

  const modal = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white p-4 rounded-lg w-1/4 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const card = {
              cardTitle: (event.target as HTMLFormElement).cardTitle.value,
              cardDescription: (event.target as HTMLFormElement).description
                .value,
            };
            setShowModal(false);
            if (card.cardTitle === '' || card.cardDescription === '') return;
            editCard(card);
          }}
        >
          <div className="flex justify-between">
            <h2>Editar card</h2>
            <XCircle
              className="cursor-pointer"
              onClick={() => {
                setShowModal(false);
              }}
            />
          </div>
          <input
            type="text"
            placeholder="Nome do card"
            name="cardTitle"
            className="border-2 border-slate-300 p-2 rounded-lg w-full mt-4"
            defaultValue={cardToEdit?.cardName}
          />
          <input
            type="text"
            placeholder="Descrição do card"
            name="description"
            className="border-2 border-slate-300 p-2 rounded-lg w-full mt-4"
            defaultValue={cardToEdit?.cardDescription}
          />
          <button
            className="bg-slate-200 p-2 rounded-lg w-full mt-4 hover:bg-green-500 transition-colors text-white"
            type="submit"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-zinc-800">
      <div className="p-10 mr-10 text-white text-2xl flex justify-between ">
        <h2>Kanban</h2>
        <div className="flex items-center gap-4 w-auto h-12">
          {showModal && modal}
          {showMessage && (
            <div className="bg-slate-200 opacity-80 w-auto rounded text-black p-4 flex flex-col justify-center">
              <p className="text-xs ">
                🚨 Esta aplicação utiliza de armazenamento local, sendo sujeito
                a perda de dados caso o cache seja limpo. Esteja ciente! 🚨
              </p>
            </div>
          )}

          <Info
            size={30}
            className="text-slate-200 cursor-pointer"
            onMouseEnter={() => {
              setShowMessage(true);
            }}
            onMouseLeave={() => {
              setShowMessage(false);
            }}
          />
        </div>
      </div>
      <div className="flex ">
        {cardsState.map((card, index) => (
          <Card
            key={index}
            cardOptions={card}
            editCard={editMode}
            cardItems={cardItems}
            setCardItems={setCardItems}
          />
        ))}
        <div
          className={`border-slate-300 border-2 p-4 rounded-lg m-4 w-1/5 flex justify-center items-center`}
          style={{ backgroundColor: 'transparent', height: `320px` }}
        >
          <PlusCircle size={80} className="text-slate-200 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default App;
