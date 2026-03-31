const pdfService = require('../services/pdfService');
const imageService = require('../services/imageService');
const { getLLMResponse } = require('../services/llmService');

exports.generateDDR = async (req, res) => {
  try {
    const inspectionFile = req.files['inspectionReport'] ? req.files['inspectionReport'][0] : null;
    const thermalFile = req.files['thermalReport'] ? req.files['thermalReport'][0] : null;

    if (!inspectionFile) {
      return res.status(400).json({ error: 'Inspection report is missing' });
    }

    // Step 1: Extract Texts & Images
    const insText = await pdfService.extractTextFromPDF(inspectionFile.path);
    const thermText = thermalFile ? await pdfService.extractTextFromPDF(thermalFile.path) : "Not Available";
    
    // Step 2: Extract & Clean Data First
    const cleanPrompt = `Extract all observations from this inspection report. Do not add new information. Return structured JSON with an array of "observations".
Data: ${insText.substring(0, 5000)} /* Limiting for token size, though should chunk ideally */`;

    const cleanedInsText = await getLLMResponse(cleanPrompt, true);

    // Step 3: Generate Final Report
    const ddrPrompt = `
You are a civil inspection expert.
Generate a structured DDR report.

Rules:
- Do NOT invent data
- If missing -> write "Not Available"
- If conflict -> mention explicitly
- Use simple client-friendly language

Input Inspection Data: ${cleanedInsText}
Input Thermal Data: ${thermText.substring(0, 2000)}

Output must be ONLY valid JSON matching this structure:
{
  "Property Issue Summary": "text",
  "Area-wise Observations": [
    { "area": "text", "observation": "text" }
  ],
  "Probable Root Cause": "text",
  "Severity Assessment": "text with reasoning",
  "Recommended Actions": ["action1", "action2"],
  "Additional Notes": "text",
  "Missing or Unclear Information": "text"
}`;

    const rawResponse = await getLLMResponse(ddrPrompt, true);
    
    let reportData = {};
    try {
      reportData = JSON.parse(rawResponse);
    } catch(e) {
      return res.status(500).json({ error: "LLM did not return proper JSON", raw: rawResponse });
    }

    // Step 4: Map Images (Dummy implementation)
    // Map extracted images based on the image description to area-wise observations
    reportData["Area-wise Observations"] = reportData["Area-wise Observations"].map(obs => {
      // Very basic keyword mapping mockup:
      const matchingImg = obs.area.toLowerCase().includes("bathroom") ? "/placeholder.png" : "Image Not Available";
      return { ...obs, image: matchingImg };
    });

    res.json({ success: true, report: reportData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report', details: err.message });
  }
};
