import * as vscode from 'vscode';
import { commands } from './command/commands';
import { LifeCycleService } from './service/lifecycle_service';


export function activate(context: vscode.ExtensionContext) {
	commands.forEach( command => {
		vscode.commands.registerCommand(command.key, command?.method);
	})

	LifeCycleService.startExtension();
}

export function deactivate() {
	LifeCycleService.stopExtension();
}
