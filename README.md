# Synthetic User Study

Welcome to the Synthetic User study repository. This README provides guidance for developing and running the Synthetic User system using Svelte. This system was built as part of an academic investigation into the use of persona-based chatbots, also referred to as **Synthetic Users**, and their impact on design thinking processes.

## Project Overview

This project explores the effectiveness of Synthetic Users—AI-driven, persona-based chatbots that simulate human behavior—in aiding designers to gather insights, foster empathy, and enhance ideation outcomes.

### Key Components:
1. **Persona-based Chatbot**: Utilizes GPT-3 language models to simulate conversations with a "Synthetic User."
2. **Design Task Framework**: Facilitates experiments where designers interact with either a traditional persona summary or the Synthetic User for product ideation.
---

## Getting Started

This project is powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte). Follow the steps below to set up and run the project.

### Prerequisites
You’ll need to have [Node.js](https://nodejs.org) installed on your machine. This project uses **npm** as its package manager.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gukuma/Synthetic-User-Study.git
   ```

2. Navigate to the project directory:
   ```bash
   cd synthetic-user-study
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

---

## Development

To start the development server, run the following command:

```bash
npm run dev
```

This will start a local development server where you can interact with the Synthetic User interface.

> Tip: You can open the app in a new browser tab with:
> ```bash
> npm run dev -- --open
> ```

### Chatbot Configuration

The Synthetic User uses GPT-3 models for simulating persona-driven conversations. You may configure the language model settings in the `config` directory. Ensure that your OpenAI API key is added to the `.env` file.

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

---

## Study Framework

The Synthetic User study aims to explore three research questions:
- **RQ1**: What is the effect of a Synthetic User on a designer's empathy toward the persona?
- **RQ2**: How does interaction with a Synthetic User affect the understanding of the user group's needs?
- **RQ3**: What impact does the Synthetic User have on the ideation process and outcomes?

### Data Collection
- **Pre-Study Survey**: A background survey to assess participants' familiarity with chatbots and personas.
- **Task 1 (Insight Gathering)**: Interaction with the Synthetic User to gather insights about a user group.
- **Task 2 (Ideation)**: A 20-minute ideation exercise based on the gathered insights.
- **Post-Study Survey**: Includes a NASA TLX usability survey and a Persona Perception Scale (PPS) evaluation.

### Analysis Tools
- **Linguistic Inquiry and Word Count (LIWC)**: Used to analyze the verbalized thought processes during the study.
- **Persona Perception Scale (PPS)**: Evaluates empathy and understanding toward the Synthetic User.

---
