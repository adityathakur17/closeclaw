import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";
import { runAgentMode } from "./agent/orchestrator";
import { runAskMode } from "./ask/orchestrator";

export async function runCliMode(){
    while (true){
        const mode = await select({
            message:'Choose CLI mode',
            options: [
                {value:"agent", label:"Agent Mode"},
                {value:"plan", label:"Plan Mode"},
                {value:"ask", label:"Ask Mode"},
                {value:"back", label:"Back to Main Menu"}
            ]
        })

        if (isCancel(mode) || mode === 'back') return;

        if(mode === 'agent'){
            await runAgentMode()
        }
        if(mode === 'plan'){
            console.log('Plan')
        }
        if(mode === 'ask'){
            await runAskMode
        }

        if(mode !== 'agent' && mode!== 'plan' && mode!== 'ask'){
            console.log(chalk.yellow('\nMode is not implemented yet.\n'))
        }
    }
}