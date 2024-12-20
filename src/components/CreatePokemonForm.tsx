import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import useCustomPokemonStore from '@/store/useCustomPokemonStore';

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const CreatePokemonForm: FC = () => {
  const addCustomPokemon = useCustomPokemonStore((state) => state.addCustomPokemon);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    types: [] as string[],
    hp: 100,
    stats: [
      { name: 'attack', value: 50 },
      { name: 'defense', value: 50 },
      { name: 'speed', value: 50 }
    ]
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    
    if (!formData.imageUrl) {
      setError('Image URL is required');
      return;
    }
    
    if (formData.types.length === 0) {
      setError('Select at least one type');
      return;
    }

    addCustomPokemon(formData);
    setFormData({
      name: '',
      imageUrl: '',
      types: [],
      hp: 100,
      stats: [
        { name: 'attack', value: 50 },
        { name: 'defense', value: 50 },
        { name: 'speed', value: 50 }
      ]
    });
    setError('');
  };

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Custom Pokemon</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Image URL Input */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/pokemon-image.png"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a valid image URL. Try using images from trusted sources like:
          </p>
          <ul className="list-disc ml-4 mt-1 text-sm text-gray-500">
            <li>raw.githubusercontent.com</li>
            <li>i.imgur.com</li>
            <li>assets.pokemon.com</li>
          </ul>
        </div>

        {/* HP Slider */}
        <div>
          <label htmlFor="hp" className="block text-sm font-medium text-gray-700">
            HP: {formData.hp}
          </label>
          <input
            type="range"
            id="hp"
            min="1"
            max="255"
            value={formData.hp}
            onChange={(e) => setFormData(prev => ({ ...prev, hp: parseInt(e.target.value) }))}
            className="mt-1 block w-full"
          />
        </div>

        {/* Stats Sliders */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Stats</h3>
          {formData.stats.map((stat, index) => (
            <div key={stat.name}>
              <label htmlFor={stat.name} className="block text-sm font-medium text-gray-700">
                {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: {stat.value}
              </label>
              <input
                type="range"
                id={stat.name}
                min="1"
                max="100"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...formData.stats];
                  newStats[index] = { ...stat, value: parseInt(e.target.value) };
                  setFormData(prev => ({ ...prev, stats: newStats }));
                }}
                className="mt-1 block w-full"
              />
            </div>
          ))}
        </div>

        {/* Types Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Types</h3>
          <div className="flex flex-wrap gap-2">
            {POKEMON_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                          ${formData.types.includes(type)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600
                     transition-colors duration-200 font-medium"
        >
          Create Pokemon
        </button>
      </form>
    </motion.div>
  );
};

export default CreatePokemonForm;
