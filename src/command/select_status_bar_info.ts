import * as vscode from 'vscode'
import { Configurations } from '../constants/configurations'


const STATUS_BAR_INFO_OPTIONS = [
    {
        displayName: "CPU cores percent usage (100% per core)",
        configTitle: Configurations.STATUS_BAR_SHOW_CPU_CONFIG
    },
    {
        displayName: "RAM absolute usage",
        configTitle: Configurations.STATUS_BAR_SHOW_ALLOCATED_MEMORY
    },
    {
        displayName: "RAM percent usage",
        configTitle: Configurations.STATUS_BAR_SHOW_MEMORY_ALLOC_PCT
    }
]

const QUICK_PICK_OPTIONS: vscode.QuickPickOptions = {
    placeHolder: "Select the info to be displayed on the statusbar",
    canPickMany: true
}

export function selectStatusBarInfo() {
    vscode.window.showQuickPick(STATUS_BAR_INFO_OPTIONS.map(x => x.displayName), QUICK_PICK_OPTIONS)
        .then((userSelections) => {
            let checkState;
            STATUS_BAR_INFO_OPTIONS.map(option => {
                checkState = userSelections?.includes(option.displayName);
                vscode.workspace.getConfiguration().update(option.configTitle, checkState, true);
            })
        })
}