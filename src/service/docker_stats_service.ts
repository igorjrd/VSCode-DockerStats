import { window as vscodeWindow } from 'vscode'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { parseDockerStatsStdOut } from '../domain/docker_stats_parser'
import { Singleton } from '../model/singleton';


const PROCESS_CMD = 'docker stats --format "table {{.CPUPerc}}\t{{.MemUsage}}"';


export class DockerStatsService extends Singleton<DockerStatsService>(){
    private targetFunctionDelegates: Array<Function> = [];
    private childProcess?: ChildProcessWithoutNullStreams;

    private constructor(){
        super();
    }

    public startTrackingDockerStats(): void {
        this.childProcess = spawn(PROCESS_CMD, {shell: true});

        this.childProcess.stdout.on('data', (data: Buffer) => {
            let parsedData = parseDockerStatsStdOut(data.toString('utf-8'));

            if (parsedData == null)
                return;
            this.targetFunctionDelegates
                .forEach(delegate => delegate(parsedData));
        })
    }

    public stopTrackingDockerStats(): void {
        this.childProcess?.kill(2);
    }

    public assignDockerStatsConsumer(func: Function): void {
        this.targetFunctionDelegates.push(func);
    }
}
