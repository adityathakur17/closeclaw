# Ask Mode

## Question

what is inside /modes/agent explain to me what is going on using proper examples and code

## Answer

Based on my analysis of the `/modes/agent` directory, this is a sophisticated **AI Agent Mode** implementation that allows an AI to perform coding tasks with user approval. Let me break down how it works with examples:

## Overview

The agent mode creates a secure, staged workflow where an AI can analyze code and propose changes, but all modifications must be approved by the user before being applied.

## Key Components

### 1. **Core Types** (`types.ts`)
```typescript
export type ActionType = 
  | 'file_create' | 'file_modify' | 'file_delete' | 
  | 'folder_create' | 'code_analysis' | 'tool_execute';

export interface ActionLog {
  id: string;
  timestamp: Date;
  type: ActionType;
  path: string;
  details: { before?: string; after?: string; toolName?: string; };
  status: 'pending' | 'executed' | 'approved' | 'rejected';
}
```

### 2. **Main Orchestrator** (`orchestrator.ts`)
This is the entry point that coordinates everything:

```typescript
export async function runAgentMode() {
  // 1. Get user goal
  const goal = await text({
    message: "What would you like the agent to do?",
    placeholder: "Concrete task for this codebase...",
  });

  // 2. Initialize components
  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);

  // 3. Create AI agent with tools
  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(10), // Max 10 steps
    tools,
    onStepFinish() { /* Track progress */ }
  });

  // 4. Run AI and get results
  const result = await agent.generate({ prompt: goal });
  
  // 5. Get user approval
  const ok = await runApprovalFlow(tracker);
  
  // 6. Apply approved changes
  if (ok) executor.applyApprovedFromTracker();
}
```

### 3. **Action Tracking** (`action-tracker.ts`)
Tracks every action the agent performs:

```typescript
class ActionTracker {
  private actions: ActionLog[] = []
  
  log(entry: Omit<ActionLog, "id" | "timestamp">): ActionLog {
    const action = { id: `action_${this.actions.length}`, ...entry };
    this.actions.push(action);
    return action;
  }
  
  getPendingMutations(): ActionLog[] {
    return this.actions.filter(a => 
      isMutationType(a.type) && a.status === 'pending'
    );
  }
}
```

### 4. **Tool System** (`agent-tools.ts`)
Provides AI with various tools to work with the codebase:

```typescript
export function createAgentTools(executor: ToolExecutor) {
  return {
    read_file: tool({ /* ... */ execute: ({ path }) => executor.readFile(path) }),
    create_file: tool({ /* ... */ execute: ({ path, content }) => executor.createFile(path, content) }),
    modify_file: tool({ /* ... */ execute: ({ path, content }) => executor.modifyFile(path, content) }),
    delete_file: tool({ /* ... */ execute: ({ path }) => executor.deleteFile(path) }),
    list_files: tool({ /* ... */ execute: ({ path, recursive }) => executor.listFiles(path, recursive) }),
    search_files: tool({ /* ... */ execute: ({ root, pattern }) => executor.searchFiles(root, pattern) }),
    analyze_codebase: tool({ /* ... */ execute: ({ path }) => executor.analyzeCodebase(path) }),
    execute_shell: tool({ /* ... */ execute: ({ command }) => executor.queueShell(command) }),
    // ... more tools
  };
}
```

### 5. **Staged Execution** (`tool-executor.ts`)
Implements a staging system where changes are queued but not immediately applied:

```typescript
class ToolExecutor {
  private overlay = new Map<string, string>(); // staged file contents
  private deleted = new Set<string>(); // staged deletions
  
  createFile(rel: string, content: string): string {
    // Don't write to disk yet - just stage it
    this.overlay.set(this.norm(rel), content);
    this.tracker.log({
      type: 'file_create',
      path: this.norm(rel),
      details: { after: content },
      status: 'pending' // marked as pending approval
    });
    return `Staged new file: ${rel}`;
  }
  
  applyApprovedFromTracker(): { errors: string[] } {
    // Only apply changes that were approved
    const approvedActions = this.tracker.getActions()
      .filter(a => a.status === 'approved');
    
    // Apply file operations
    for (const action of approvedActions) {
      if (action.type === 'file_create') {
        fs.writeFileSync(action.path, action.details.after!, 'utf8');
      }
      // ... other operations
    }
  }
}
```

### 6. **Approval Workflow** (`approval.ts`)
Handles user review and approval of changes:

```typescript
export async function runApprovalFlow(tracker: ActionTracker): Promise<boolean> {
  const pending = tracker.getPendingMutations();
  
  // Option 1: Approve all at once
  const choice = await select({
    message: "Apply Staged Changes?",
    options: [
      { value: "all", label: "Approve and apply all" },
      { value: "select", label: "Review one by one" },
      { value: "cancel", label: "Cancel" },
    ],
  });
  
  if (choice === "select") {
    // Show diff for each change and get individual approval
    for (const group of groupPending(pending)) {
      const diff = formatPatch(group.label, before, after);
      console.log(renderTerminalMarkdown("```diff\n" + diff + "\n```"));
      
      const decision = await select({
        message: chalk.bold(group.label),
        options: [
          { value: "accept", label: "Accept" },
          { value: "reject", label: "Reject" },
        ],
      });
    }
  }
}
```

## Example Workflow

Let's say you ask the agent to: "Add a TypeScript interface for user authentication"

1. **AI Analysis Phase**:
   - Agent uses `search_files` to find existing user-related code
   - Uses `read_file` to examine current structure
   - Uses `analyze_codebase` to understand the project layout

2. **Proposed Changes**:
   ```typescript
   // Agent proposes creating:
   // src/types/auth.ts
   export interface User {
     id: string;
     email: string;
     hashedPassword: string;
     createdAt: Date;
   }
   ```

3. **Staging**:
   - The change is staged but not written to disk
   - ActionTracker logs: `{ type: 'file_create', path: 'src/types/auth.ts', status: 'pending' }`

4. **User Review**:
   - You see a diff showing the new file content
   - You can approve, reject, or modify the proposal

5. **Application**:
   - If approved, the file is created
   - If rejected, nothing happens

## Key Features

- **Safety**: All mutations are staged and require approval
- **Transparency**: You see exactly what changes will be made
- **Undo Support**: Easy to reject all changes with one click
- **Batch Operations**: Multiple changes can be reviewed together
- **Diff Visualization**: Clear diffs show exactly what will change
- **Shell Commands**: Even shell commands are queued for approval

This system gives you the power of AI assistance while maintaining full control over your codebase.
