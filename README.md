
# Vibe Code Better - AI Prompt Optimizer
![Image](https://github.com/user-attachments/assets/31424e7d-2443-4508-9a47-ab27388e7a5f)
Vibe Code Better is a Next.js web application designed to help users refine and optimize their coding-related prompts for Large Language Models (LLMs). By providing detailed analysis and suggestions, it aims to improve the quality of prompts, leading to better code generation and more effective interactions with AI coding assistants.

## ✨ Features

The application offers a suite of tools and analyses to enhance your coding prompts:

1.  **Dynamic Prompt Analysis**:
    *   **Análisis de Complejidad**: Evaluates the inherent complexity of the task described in the prompt on a 3-15 point scale. It breaks down the complexity into three dimensions:
        *   Dimensión de la implementación (functional/structural size)
        *   Generalidad de la implementación (common vs. niche)
        *   Tipo de dependencias/librerías (AI familiarity)
    *   **Análisis de Dependencias**: Suggests potential external libraries or dependencies that might be needed, with a focus on necessity (max 15 suggestions). It will indicate if no external dependencies are strictly required.
    *   **Análisis de Funcionalidades**: Identifies and lists the key functionalities described or implied in the user's prompt.
    *   **Recomendaciones**: Provides actionable advice and suggestions to improve the prompt's clarity, specificity, and overall effectiveness.
    *   **Prompt Sugerido**: Offers two enhanced versions of the original prompt:
        *   **Sugerencia Concisa**: A direct improvement with relevant technical terms linked to a glossary for quick understanding.
        *   **Sugerencia Elaborada**: A professionally structured prompt following best practices in prompt engineering (Contexto/Rol, Tarea específica, Detalles y requisitos, Formato de salida, Restricciones, Ejemplos) designed for optimal results. This version uses glossary terms naturally without direct linking.
    *   **Puntuación Global**: A final score (0-100) assessing the overall quality of the original prompt based on clarity, specificity, and completeness, accompanied by an "emotional feedback" tag (e.g., "¡Excelente!", "Necesita Mejoras").

2.  **Interactive User Interface**:
    *   **Tabs**: Separate tabs for the main "Analizador" and "Historial" de análisis.
    *   **Accordion Display**: Most analysis results are presented in an expandable accordion format, keeping the interface clean and organized.
    *   **Status Indicators**: Each analysis section in the accordion displays its current status (loading, completed successfully, or error) with relevant icons, similar to GitHub Actions.
    *   **Prominent Score Display**: The "Puntuación Global" is highlighted in a dedicated card for emphasis.
    *   **Customizable Analysis**: A settings menu allows users to select which analyses they want to perform. "Prompt Sugerido" and "Puntuación Global" are mandatory.
    *   **Copy Functionality**: Buttons to easily copy the "Concise" and "Elaborated" suggested prompts.
    *   **Markdown Rendering**: Enhanced readability for sections like "Recomendaciones" and "Prompt Sugerido" through Markdown rendering.

3.  **Glossary of Technical Tags**:
    *   A dedicated `/glossary` page lists and explains various technical quality attributes (e.g., "responsive", "mantenible", "escalable").
    *   In the "Sugerencia Concisa" prompt, relevant glossary terms are linked, showing a tooltip with their definition on hover.

4.  **Local Storage History**:
    *   Automatically saves the last 10 analysis sessions (prompt, active analyses, and results) to the browser's Local Storage.
    *   Users can view their history, load a past analysis back into the tool, or delete individual entries/clear the entire history.

5.  **Educational Resources**:
    *   **Guía de Prompts**: An in-app guide providing step-by-step advice on how to create effective prompts for code generation.
    *   **Explicación del Prompting**: A section explaining *why* specificity is crucial when interacting with AI models.

## 🛠️ Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **UI**: React, ShadCN UI Components
*   **Styling**: Tailwind CSS
*   **Authentication**: Clerk
*   **AI Integration**: Genkit (for orchestrating calls to AI models)
*   **Markdown**: `react-markdown` with `@tailwindcss/typography`

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd vibe-code-better
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables**:
    This project uses Genkit for AI functionalities. You will need to configure environment variables for your chosen AI provider (e.g., Google AI Studio API Key if using Gemini models with Genkit). Create a `.env` file in the root of the project and add your necessary API keys.
    Example for Google AI:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002`.

5.  **Run the Genkit development server** (in a separate terminal):
    This is necessary for the AI flows to be available to the Next.js application.
    ```bash
    npm run genkit:dev
    # or use genkit:watch for auto-reloading on flow changes
    npm run genkit:watch
    ```

## 📄 How It Works

1.  The user enters a coding-related prompt into the main textarea.
2.  Upon submission, the frontend makes a request to a Next.js API route (`/api/analyze`).
3.  This API route streams updates back to the client. For each selected analysis type, it invokes a corresponding Genkit AI flow.
4.  Genkit flows interact with an LLM (e.g., Gemini) based on pre-defined prompts and schemas to generate the analysis content for each section.
5.  The frontend receives these updates via Server-Sent Events (SSE), dynamically displaying loading states and then the results for each analysis section in the UI.
6.  The "Puntuación Global" and "Prompt Sugerido" are always processed. Other analyses can be toggled by the user.
7.  Completed analyses (prompt, settings, and results) are saved to Local Storage.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

---

This README provides an overview of Vibe Code Better. Explore the app to see these features in action!
