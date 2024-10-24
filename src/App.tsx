import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import DeadSte from "./assets/DeadSte.jpeg";
import Vivo from "./assets/Vivo.jpeg";

interface Player {
  name: string;
  lives: number;
  eliminated: boolean;
  roulette: string[];
}

const MAX_LIVES = 6;
const INITIAL_ROULETTE = [
  "Salvo",
  "Salvo",
  "Salvo",
  "Salvo",
  "Salvo",
  "Se fodeu",
];

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const addPlayer = () => {
    if (players.length < 4 && playerName) {
      setPlayers([
        ...players,
        {
          name: playerName,
          lives: 0,
          eliminated: false,
          roulette: [...INITIAL_ROULETTE],
        },
      ]);
      setPlayerName("");
    }
  };

  const checkIsMobile = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const spinRoulette = (index: number) => {
    if (players[index].eliminated) return;

    setIsSpinning(true);
    setResult(null);
    onOpen();

    setTimeout(() => {
      const updatedPlayers = [...players];
      const currentPlayer = updatedPlayers[index];

      let result: string;

      if (currentPlayer.lives === 5) {
        result = "Se fodeu";
      } else {
        const roulette = currentPlayer.roulette;
        const randomIndex = Math.floor(Math.random() * roulette.length);
        result = roulette[randomIndex];

        if (result === "Salvo") {
          const salvoIndex = roulette.indexOf("Salvo");
          if (salvoIndex !== -1) {
            currentPlayer.roulette.splice(salvoIndex, 1);
          }
        }
      }

      if (result === "Se fodeu") {
        currentPlayer.eliminated = true;
      } else {
        if (currentPlayer.lives < MAX_LIVES) {
          currentPlayer.lives += 1;
        }
      }

      updatedPlayers[index] = currentPlayer;
      setPlayers(updatedPlayers);

      setIsSpinning(false);
      setResult(result);
    }, 1000);
  };

  const resetGame = () => {
    setPlayers([]);
    setPlayerName("");
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-black">
      <div className="flex flex-col items-center justify-center mt-8 p-3 rounded-xl mb-4 w-[300px]">
        <h1 className="text-4xl font-bold mb-8 text-purple-500">
          Liar's bar app
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nome"
            className="border border-purple-500 rounded px-4 w-[150px] h-[50px]  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addPlayer}
            disabled={players.length >= 4}
            className="bg-purple-400 text-white  rounded disabled:bg-gray-300 h-[50px]"
          >
            Adicionar
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <ul className="space-y-4">
          {players.map((player, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-4 border shadow-sm w-auto gap-2 rounded-xl
              ${
                player.eliminated
                  ? "bg-red-200 text-red-600"
                  : "bg-white text-black"
              }`}
            >
              <span>
                {player.name} - Vidas: {player.lives}/{MAX_LIVES}
              </span>
              {!player.eliminated && (
                <button
                  onClick={() => spinRoulette(index)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Girar Roleta
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={resetGame}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Finalizar Jogo
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "md"}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Roleta</ModalHeader>
            <ModalBody>
              <div className="flex flex-col h-[250px] justify-center items-center">
                {isSpinning ? (
                  <Spinner color="danger" />
                ) : (
                  <>
                    {result === "Se fodeu" ? (
                      <img
                        src={DeadSte}
                        alt="Morreu"
                        className="w-[400px] h-[200px]"
                      />
                    ) : (
                      <img
                        src={Vivo}
                        alt="Morreu"
                        className="w-[400px] h-[400px]"
                      />
                    )}
                    <p className="mt-4 text-xl">{result}</p>
                  </>
                )}
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
