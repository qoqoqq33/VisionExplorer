// Mock AI responses for demo purposes
const mockResponses = [
  "I can see distinct geological formations with varied terrain patterns. The imagery suggests possible sedimentary layers with erosional features.",
  "This region shows interesting spectral signatures that could indicate different vegetation types or soil compositions. The patterns suggest natural water flow paths.",
  "The satellite imagery reveals urban development patterns with clear infrastructure networks. Road systems and building clusters are visible.",
  "These geological features appear to be formed by long-term erosional processes. The terrain elevation changes suggest mountainous or hilly topography.",
  "The imagery shows clear boundaries between different land use types - possibly agricultural fields, forest areas, and developed zones.",
  "I detect what appears to be river systems or drainage networks. The meandering patterns are characteristic of natural water flow over time.",
  "This area displays interesting texture variations that could indicate different rock types or surface materials. The spectral analysis suggests mineral diversity.",
];

export async function askAI(prompt, context = {}) {
  // Simulate real API thinking time (800-1500ms)
  const thinkingTime = 800 + Math.random() * 700;
  await new Promise((r) => setTimeout(r, thinkingTime));

  // Generate contextual response based on prompt keywords
  let response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];

  // Add prompt-specific insights
  const lowerPrompt = prompt.toLowerCase();
  if (
    lowerPrompt.includes("water") ||
    lowerPrompt.includes("river") ||
    lowerPrompt.includes("lake")
  ) {
    response =
      "I can identify what appears to be water features in this region. The darker areas likely represent water bodies, with surrounding riparian vegetation patterns.";
  } else if (
    lowerPrompt.includes("building") ||
    lowerPrompt.includes("urban") ||
    lowerPrompt.includes("city")
  ) {
    response =
      "The imagery shows clear signs of human development. I can detect building structures, road networks, and planned urban layouts in this area.";
  } else if (
    lowerPrompt.includes("forest") ||
    lowerPrompt.includes("tree") ||
    lowerPrompt.includes("vegetation")
  ) {
    response =
      "This region displays vegetation patterns consistent with forested areas. The textural variations suggest different tree densities and possibly mixed forest types.";
  } else if (
    lowerPrompt.includes("mountain") ||
    lowerPrompt.includes("elevation") ||
    lowerPrompt.includes("terrain")
  ) {
    response =
      "The topographical features indicate varied elevation changes. These terrain patterns suggest mountainous or hilly geography with visible ridgelines.";
  }

  // Add region context if available
  if (context?.region) {
    const { x, y, width, height } = context.region;
    response += ` The analyzed region (x:${x.toFixed(2)}, y:${y.toFixed(2)}, ${(
      width * 100
    ).toFixed(1)}% × ${(height * 100).toFixed(
      1
    )}% of view) shows these characteristics at the current zoom level.`;
  }

  return response;
}
