import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";

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
            console.log("Agent")
        }
        if(mode === 'plan'){
            console.log('Plan')
        }
        if(mode === 'ask'){
            console.log('ask')
        }

        if(mode !== 'agent' && mode!== 'plan' && mode!== 'ask'){
            console.log(chalk.yellow('\nMode is not implemented yet.\n'))
        }
    }
}