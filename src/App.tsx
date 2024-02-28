import { Info, PlusCircle, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo, FormEvent, SetStateAction } from 'react';
import { Bounce, toast } from 'react-toastify';
import { CardItems, CardProperties } from './types';
import defaultCards from './defaultCards';
import Card from './components/Card';
import 'react-toastify/dist/ReactToastify.css';
import { Color, SliderPicker } from 'react-color';

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
    color: string;
  }>();

  const [color, setColor] = useState({ hex: '#FFFFFF' });

  const editMode = (id: number) => {
    showModal ? setShowModal(false) : setShowModal(true);
    setCardToEditId(id);
    setColor({
      hex: cardsState.find((card) => card.id === id)?.color || '#FFFFFF',
    });
    const cardToEdit = cardsState.find((card) => card.id === id);
    if (cardToEdit) {
      setCardToEdit({
        cardName: cardToEdit.title,
        cardDescription: cardToEdit.description,
        color: cardToEdit.color,
      });
    }
  };

  const editCard = (newCard: {
    cardTitle: string;
    cardDescription: string;
    color: string;
  }) => {
    console.log(cardToEditId);
    console.log(newCard);
    const newCards = cardsState.map((card) => {
      if (card.id === cardToEditId) {
        card.title = newCard.cardTitle;
        card.description = newCard.cardDescription;
        card.color = color.hex;
      }
      return card;
    });
    console.log(newCards);
    setCardsState(newCards);
    localStorage.setItem('cards', JSON.stringify(newCards));
  };

  const addCard = () => {
    const newCard = {
      id: cardsState.length + 1,
      title: 'Novo card',
      description: 'Descrição do card',
      color: '#2D7D9A',
    };
    setCardsState([...cardsState, newCard]);
    localStorage.setItem('cards', JSON.stringify([...cardsState, newCard]));
  };

  const removeCard = (id: number) => {
    const newCards = cardsState.filter((card) => card.id !== id);
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
              color: color.hex,
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
          <div className="m-4">
            <SliderPicker
              color={color as unknown as Color | undefined}
              onChange={(color: SetStateAction<{ hex: string }>) => {
                setColor(color);
              }}
            />
          </div>
          <button
            className="bg-green-200 p-2 rounded-lg w-full mt-4 hover:bg-green-500 transition-colors text-white"
            type="submit"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );

  const notify = (message: string, type: string) => {
    console.log('TOAST TRIGGERED');
    if (type === 'error') {
      toast.error(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } else if (type === 'success') {
      toast.success(message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-800 overflow-y-hidden">
      <div className="p-10 mr-10 text-white text-2xl flex justify-between ">
        <h2>Kanban Simples</h2>
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
      <div className="flex flex-wrap ">
        {cardsState.map((card, index) => (
          <Card
            key={index}
            cardOptions={card}
            editCard={editMode}
            cardItems={cardItems}
            setCardItems={setCardItems}
            notify={notify}
            removeCard={removeCard}
          />
        ))}
        <div
          className={`border-slate-300 border-2 p-4 rounded-lg m-4 w-1/5 flex justify-center items-center`}
          style={{ backgroundColor: 'transparent', height: `180px` }}
        >
          <PlusCircle
            size={80}
            className="text-slate-200 cursor-pointer"
            onClick={addCard}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
