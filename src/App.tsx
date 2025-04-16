import React, { useState } from 'react';
import { TowerControl as GameController } from 'lucide-react';
import Memory from './games/Memory';

type Difficulty = 'easy' | 'medium';

interface MemoryGame {
  id: string;
  name: string;
  emojis: string[];
}

function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const memoryGames: MemoryGame[] = [
    // Zwierzęta
    { id: 'farm-animals', name: 'Zwierzęta Gospodarskie', emojis: ['🐮', '🐷', '🐔', '🐑', '🐴', '🦃', '🐰', '🦆'] },
    { id: 'wild-animals', name: 'Dzikie Zwierzęta', emojis: ['🦁', '🐯', '🐘', '🦒', '🦊', '🦝', '🦘', '🦬'] },
    { id: 'sea-animals', name: 'Zwierzęta Morskie', emojis: ['🐋', '🐬', '🦈', '🐟', '🐠', '🦀', '🦑', '🐙'] },
    { id: 'insects', name: 'Owady', emojis: ['🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🦂'] },
    { id: 'birds', name: 'Ptaki', emojis: ['🦅', '🦜', '🦢', '🦩', '🦚', '🦃', '🦉', '🐧'] },
    
    // Jedzenie
    { id: 'fruits', name: 'Owoce', emojis: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🥝', '🍍'] },
    { id: 'vegetables', name: 'Warzywa', emojis: ['🥕', '🥦', '🥬', '🥒', '🍅', '🌽', '🥔', '🧅'] },
    { id: 'fast-food', name: 'Fast Food', emojis: ['🍔', '🍟', '🌭', '🍕', '🌮', '🌯', '🥪', '🥤'] },
    { id: 'desserts', name: 'Desery', emojis: ['🍦', '🍰', '🧁', '🍪', '🍫', '🍩', '🥞', '🍮'] },
    { id: 'drinks', name: 'Napoje', emojis: ['☕', '🍵', '🧃', '🥤', '🧋', '🍷', '🍹', '🥂'] },
    
    // Sport i Rozrywka
    { id: 'ball-sports', name: 'Sporty z Piłką', emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱'] },
    { id: 'olympic-sports', name: 'Sporty Olimpijskie', emojis: ['🏊‍♂️', '🤸‍♂️', '🏃‍♂️', '🚴‍♂️', '🤺', '🏹', '⛹️‍♂️', '🏋️‍♂️'] },
    { id: 'music', name: 'Muzyka', emojis: ['🎸', '🎹', '🎺', '🎻', '🥁', '🎷', '🪗', '🎼'] },
    { id: 'games', name: 'Gry', emojis: ['🎮', '🎲', '🎯', '🎳', '🎪', '🎨', '🎭', '🎪'] },
    { id: 'activities', name: 'Aktywności', emojis: ['🎣', '🤿', '🏹', '🎯', '🪂', '🏄‍♂️', '🚣‍♂️', '🧗‍♂️'] },
    
    // Transport i Miejsca
    { id: 'transport', name: 'Transport', emojis: ['✈️', '🚗', '🚂', '🚢', '🚁', '🚲', '🚌', '🛵'] },
    { id: 'places', name: 'Miejsca', emojis: ['🗽', '🗼', '🗿', '🎡', '🎢', '⛰️', '🌋', '🏖️'] },
    { id: 'buildings', name: 'Budynki', emojis: ['🏰', '🏛️', '⛪', '🏢', '🏤', '🏨', '🏪', '🏫'] },
    { id: 'landmarks', name: 'Zabytki', emojis: ['🗽', '🗼', '🗿', '🏛️', '🏰', '⛩️', '🕌', '🕍'] },
    { id: 'nature-places', name: 'Miejsca w Naturze', emojis: ['🌋', '⛰️', '🏖️', '🏜️', '🏝️', '🏞️', '❄️', '🌲'] },
    
    // Natura i Pogoda
    { id: 'flowers', name: 'Kwiaty', emojis: ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '💐', '🌱'] },
    { id: 'weather', name: 'Pogoda', emojis: ['☀️', '🌤️', '☁️', '🌧️', '⛈️', '❄️', '🌈', '⚡'] },
    { id: 'space', name: 'Kosmos', emojis: ['🌎', '🌙', '⭐', '🚀', '🛸', '☄️', '🌠', '🌌'] },
    { id: 'plants', name: 'Rośliny', emojis: ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀'] },
    { id: 'seasons', name: 'Pory Roku', emojis: ['🌸', '☀️', '🍁', '❄️', '🌺', '🌻', '🍂', '⛄'] }
  ];

  const difficultySettings = {
    easy: { pairs: 6, timeLimit: 120 },
    medium: { pairs: 8, timeLimit: 180 }
  };

  const filteredGames = memoryGames.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentGame) {
    const game = memoryGames.find(g => g.id === currentGame);
    if (game) {
      return (
        <Memory
          onBack={() => setCurrentGame(null)}
          emojis={game.emojis}
          gameName={game.name}
          difficulty={difficulty}
          settings={difficultySettings[difficulty]}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <GameController className="w-16 h-16 mx-auto text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Memory</h1>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-center gap-2">
              {(['easy', 'medium'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    difficulty === level
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {level === 'easy' ? 'Łatwy' : 'Średni'}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Wyszukaj grę..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{game.name}</h2>
              <div className="grid grid-cols-4 gap-2">
                {game.emojis.slice(0, 4).map((emoji, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-2xl"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {difficulty === 'easy' ? '6 par' : '8 par'}
                {' • '}
                {difficultySettings[difficulty].timeLimit}s
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;