import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// AI Situation Briefing Agent — generates a formal executive assessment
// of the current energy-security situation using the LLM.
// Input: { context: { scenarioName, disruptionRisk, supplyGap, reserveDays,
//                     topRisks: [...], topActions: [...] } }
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const ctx = body.context || {};
    const scenarioName = ctx.scenarioName || 'Current operational state';
    const disruptionRisk = ctx.disruptionRisk ?? 'N/A';
    const supplyGap = ctx.supplyGap ?? 'N/A';
    const reserveDays = ctx.reserveDays ?? 'N/A';
    const topRisks = (ctx.topRisks || []).join('; ') || 'None reported';
    const topActions = (ctx.topActions || []).join('; ') || 'None recommended';

    const prompt = `You are the AI Situation Briefing Agent for India's national energy security command center.
Write a concise, formal executive situation brief (3-4 paragraphs, professional government-grade English, no bullet points, no emojis, no casual language) for senior decision-makers.

Current parameters (SIMULATED demo data):
- Scenario under assessment: ${scenarioName}
- Overall Supply Disruption Risk Score (0-100): ${disruptionRisk}
- Current supply gap: ${supplyGap}
- Strategic reserve cover (days): ${reserveDays}
- Top active risks: ${topRisks}
- Top recommended actions: ${topActions}

Structure the brief:
1. Situation assessment — state the current threat posture and primary vectors.
2. Impact projection — projected supply, price, and refinery implications.
3. Recommended posture — procurement diversification and reserve preservation guidance.
4. Caveat — note that outputs are decision-support and require human validation.

Do not invent specific numbers beyond those provided; speak in measured, professional terms.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'automatic',
    });

    const brief = typeof result === 'string' ? result : (result && result.response) || (result && result.text) || JSON.stringify(result);

    return Response.json({ brief, generatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
