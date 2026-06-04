# close-claw

close-claw is a TypeScript-powered AI assistant framework for local CLI usage and Telegram bot interaction. It lets you ask questions, generate structured plans, and run agent-driven workflows with AI tooling powered through OpenRouter and optional web tools.

## What this project does

- Provides a terminal interface for interactive AI-driven workflows.
- Includes a Telegram bot mode so the owner can control the agent remotely.
- Supports `ask` mode for natural language questions and saving answers.
- Supports `plan` mode for generating and executing multi-step plans.
- Uses OpenRouter as the AI backend and can optionally enable web tools when a Firecrawl API key is provided.

## Key features

- `CLI` mode: run directly from your terminal with a friendly menu.
- `Telegram` mode: start a Telegram bot that responds to authorized owner commands.
- `Ask` mode: ask the model questions about the codebase or general topics.
- `Plan` mode: generate goal-driven plans and select steps to execute.
- `Agent` mode: perform automated tasks using AI and a tool execution sandbox.

## Install prerequisites

1. Install Bun: https://bun.sh
2. Clone this repository:

```bash
git clone https://github.com/yourname/close-claw.git
cd close-claw
```

3. Install dependencies:

```bash
bun install
```

## Configure environment variables

Create a `.env` file or export these values in your shell.

Required:

- `OPENROUTER_API_KEY` — your OpenRouter API key.
- `OPENROUTER_DEFAULT_MODE` — the model ID to use (for example `gpt-4o-mini` or another OpenRouter model).

For Telegram mode:

- `TELEGRAM_BOT_TOKEN` — your Telegram bot token.
- `TELEGRAM_OWNER_ID` — your Telegram user ID (only this user can control the bot).

Optional:

- `FIRECRAWL_API_KEY` — enables optional web browsing/search tools if provided.
- `SKILLS_DIRS` — semicolon-separated directories containing additional `SKILL.md` files for agent tooling.

## Run the app

### Terminal mode

```bash
bun run index.ts wakeup
```

Or install the package locally and run the published binary directly:

```bash
bun link
closeclaw-build wakeup
```

This starts the app and shows a banner where you can choose between CLI and Telegram mode.

### CLI mode

After selecting `CLI`, you can choose:

- `Ask` mode to ask a question and optionally save the answer as Markdown.
- `Plan` mode to create a plan for a goal and execute selected steps.
- `Agent` mode to perform automated tasks through the AI agent.

### Telegram mode

After selecting `Telegram`, the bot will launch and send a welcome message to your owner chat.

Use these commands in Telegram:

- `/ask <question>` — ask the AI a question.
- `/agent <task description>` — run an agent task.
- `/plan <goal>` — generate a plan and choose steps to execute.

## Project structure

- `index.ts` — CLI entrypoint for the app.
- `modes/` — contains CLI, Telegram, ask, plan, and agent mode implementations.
- `ai/` — AI provider configuration and model selection.
- `tui/` — terminal user interface utilities.
- `ask-mode-example.md` — example usage pattern for ask mode.

## Notes

- The project is configured for Bun and TypeScript.
- The Telegram integration restricts access to the configured `TELEGRAM_OWNER_ID`.
- Web tool support is only enabled when `FIRECRAWL_API_KEY` is present.

## Example environment setup

```bash
export OPENROUTER_API_KEY="your_openrouter_key"
export OPENROUTER_DEFAULT_MODE="gpt-4o-mini"
export TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
export TELEGRAM_OWNER_ID="123456789"
export FIRECRAWL_API_KEY="optional_firecrawl_key"
```

On Windows PowerShell, use:

```powershell
$env:OPENROUTER_API_KEY = "your_openrouter_key"
$env:OPENROUTER_DEFAULT_MODE = "gpt-4o-mini"
$env:TELEGRAM_BOT_TOKEN = "your_telegram_bot_token"
$env:TELEGRAM_OWNER_ID = "123456789"
$env:FIRECRAWL_API_KEY = "optional_firecrawl_key"
```

## License

This repository does not include a license file by default. Add one if you want to publish this project publicly.
