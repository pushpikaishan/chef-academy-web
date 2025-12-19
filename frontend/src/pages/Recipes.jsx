import { useEffect, useState } from 'react'
import RecipeList from '../components/recipes/RecipeList'
import { getAllRecipes } from '../services/recipeService'

export default function Recipes(){
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllRecipes()
        setRecipes(list)
      } catch (e) {
        setError(e?.message || 'Failed to load')
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h1>Recipes</h1>
      <RecipeList recipes={recipes} />
    </div>
  )
}
