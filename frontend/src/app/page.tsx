'use client'
import { useState } from 'react'
export default function Home() {
  const [url, setUrl] = useState('')
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const scrape = async () => {
    setLoading(true)
    const res = await fetch('/api/scrape', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
    const data = await res.json()
    setRecipe(data)
    setLoading(false)
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">JustTheRecipe</h1>
        <p className="text-gray-400 mb-8">Recipes minus the life story</p>
        <div className="flex gap-3 mb-8">
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste recipe URL..."
            className="flex-1 bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <button onClick={scrape} disabled={!url || loading}
            className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Extracting...' : 'Get Recipe'}
          </button>
        </div>
        {recipe && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">{recipe.title}</h2>
            <div className="flex gap-6 mb-6 text-sm">
              <span className="bg-orange-900/50 px-3 py-1 rounded-lg">⏱ Prep: {recipe.prep_time}</span>
              <span className="bg-red-900/50 px-3 py-1 rounded-lg">🔥 Cook: {recipe.cook_time}</span>
              <span className="bg-yellow-900/50 px-3 py-1 rounded-lg">🍽 Serves: {recipe.servings}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-orange-400">Ingredients</h3>
                <ul className="space-y-2">{recipe.ingredients?.map((ing: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300"><span className="text-orange-500">•</span>{ing}</li>
                ))}</ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-orange-400">Instructions</h3>
                <ol className="space-y-3">{recipe.instructions?.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3 text-gray-300"><span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">{i+1}</span>{step}</li>
                ))}</ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
