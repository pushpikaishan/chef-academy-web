import RecipeCard from './RecipeCard'

export default function RecipeList({ recipes }){
  if (!recipes?.length) return <p>No recipes yet.</p>
  return (
    <div>
      {recipes.map(r => <RecipeCard key={r._id || r.name} recipe={r} />)}
    </div>
  )
}
