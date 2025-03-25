import React, { useState } from 'react';
import { generateTreatRecipe } from '../lib/gemini';
import { Cookie, Plus, X, Loader2 } from 'lucide-react';

export default function TreatMaker() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await generateTreatRecipe(ingredients);
      setRecipe(result);
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-orange-100 p-2">
          <Cookie className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DIY Pet Treat Maker</h1>
          <p className="mt-2 text-gray-600">
            Generate healthy, homemade treat recipes using ingredients you have at home.
            Get nutritional information and safety guidelines for each recipe.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">Available Ingredients</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add the ingredients you have available, and we'll create a pet-safe recipe
        </p>

        <div className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
              placeholder="Enter an ingredient..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={handleAddIngredient}
              className="flex items-center space-x-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="rounded-full p-1 hover:bg-orange-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateRecipe}
            disabled={ingredients.length === 0 || isLoading}
            className="mt-6 flex items-center justify-center space-x-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600 disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Recipe...</span>
              </>
            ) : (
              <>
                <Cookie className="h-5 w-5" />
                <span>Generate Recipe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {recipe && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Your Pet Treat Recipe</h2>
          <div className="mt-4 whitespace-pre-wrap text-gray-700">{recipe}</div>
        </div>
      )}
    </div>
  );
}