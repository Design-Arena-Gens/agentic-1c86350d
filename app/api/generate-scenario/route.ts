import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json(
        { error: 'Le problème est requis' },
        { status: 400 }
      )
    }

    const prompt = `Tu es un expert en automatisation Make.com et en Intelligence Artificielle.

L'utilisateur te présente cette idée ou ce problème :
"${problem}"

Ta mission : concevoir un scénario Make détaillé qui résout ce problème en intégrant de l'IA de manière intelligente.

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans backticks) suivant EXACTEMENT cette structure :

{
  "title": "Titre du scénario",
  "description": "Description claire du scénario et de son objectif",
  "modules": [
    {
      "name": "Nom du module Make (ex: Webhook, OpenAI, Gmail, etc.)",
      "description": "Ce que fait ce module dans le flux",
      "config": {
        "Paramètre 1": "Valeur ou explication",
        "Paramètre 2": "Valeur ou explication"
      },
      "isAI": true
    }
  ],
  "tips": [
    "Conseil pratique 1",
    "Conseil pratique 2"
  ]
}

Règles importantes :
- Intègre TOUJOURS au moins un module IA (OpenAI, Claude, ChatGPT, ou autre)
- Utilise des modules Make réels et populaires
- Sois créatif et inventif dans tes solutions
- Le champ "isAI" doit être true uniquement pour les modules d'IA
- Fournis 3-5 conseils pratiques dans "tips"
- Reste flexible et ne t'enferme pas dans des règles techniques trop strictes

JSON (sans markdown) :`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Clean response to extract JSON
    let jsonText = responseText.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const scenario = JSON.parse(jsonText)

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error('Error generating scenario:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du scénario' },
      { status: 500 }
    )
  }
}
