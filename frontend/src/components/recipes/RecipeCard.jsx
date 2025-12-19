export default function RecipeCard({ recipe }){
  return (
    <div className="card">
      <h3>{recipe.name}</h3>
      {recipe.photo && <img src={recipe.photo} alt={recipe.name} style={{maxWidth:'100%'}} />}
      <p>{recipe.description}</p>
    </div>
  )
}
