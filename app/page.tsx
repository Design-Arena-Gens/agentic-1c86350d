'use client'

import { useState } from 'react'

interface ModuleConfig {
  [key: string]: string
}

interface Module {
  name: string
  description: string
  config: ModuleConfig
  isAI?: boolean
}

interface Scenario {
  title: string
  description: string
  modules: Module[]
  tips: string[]
}

export default function Home() {
  const [problem, setProblem] = useState('')
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!problem.trim()) {
      setError('Veuillez décrire votre idée ou problème')
      return
    }

    setLoading(true)
    setError('')
    setScenario(null)

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du scénario')
      }

      const data = await response.json()
      setScenario(data.scenario)
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🤖 Architecte Make IA</h1>
        <p>Transformez vos idées en scénarios Make intelligents</p>
      </div>

      <div className="main-card">
        <form onSubmit={handleSubmit}>
          <div className="input-section">
            <label htmlFor="problem">
              Décrivez votre idée ou problème :
            </label>
            <textarea
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Exemple : Je veux automatiser l'envoi d'emails personnalisés à mes clients en fonction de leur comportement sur mon site web..."
            />
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Génération en cours...' : '✨ Générer le scénario Make'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>L'IA conçoit votre scénario Make...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {scenario && (
          <div className="result-section">
            <h2>🎯 Votre scénario Make</h2>

            <div className="scenario-card">
              <div className="scenario-header">
                <div className="scenario-title">{scenario.title}</div>
                <div className="ai-badge">
                  <span>🧠</span>
                  <span>IA Intégrée</span>
                </div>
              </div>

              <div className="scenario-description">
                {scenario.description}
              </div>

              <div className="modules-section">
                <h3>📦 Modules du scénario :</h3>

                {scenario.modules.map((module, index) => (
                  <div key={index} className="module">
                    <div className="module-header">
                      <div className="module-number">{index + 1}</div>
                      <div className="module-name">
                        {module.name}
                        {module.isAI && <span style={{ marginLeft: '0.5rem' }}>🧠</span>}
                      </div>
                    </div>

                    <div className="module-description">
                      {module.description}
                    </div>

                    <div className="module-config">
                      <h4>Configuration :</h4>
                      {Object.entries(module.config).map(([key, value]) => (
                        <div key={key} className="config-item">
                          <div className="config-key">{key} :</div>
                          <div className="config-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {scenario.tips && scenario.tips.length > 0 && (
                <div className="tips-section">
                  <h4>💡 Conseils de mise en œuvre :</h4>
                  <ul>
                    {scenario.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
