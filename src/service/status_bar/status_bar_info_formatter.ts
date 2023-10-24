import * as os from 'os'
import * as vscode from 'vscode'
import { ContainerResourceUseSnapshot } from '../../model/container_resource_use_snapshot'
import { Singleton } from '../../model/singleton';


const TOTAL_RAM = os.totalmem() / 1_000_000;


function getTotalRamUse(snapshots: Array<ContainerResourceUseSnapshot>): number {
    return snapshots.map(x => x.ram).reduce((a, b) => a + b);
}

function getTotalCpuUse(snapshots: Array<ContainerResourceUseSnapshot>): number {
    return snapshots.map(x => x.cpu).reduce((a, b) => a + b);
}

function getFormattedCpuUse(snapshots: Array<ContainerResourceUseSnapshot>): string {
    let cpuUseSum = getTotalCpuUse(snapshots);
    return `${cpuUseSum.toFixed(1).padStart(5, " ")}% $(cpu-icon)`
}

function getOnlyTotalRamUse(snapshots: Array<ContainerResourceUseSnapshot>): string {
    let ramUseSum = getTotalRamUse(snapshots);
    return `${ramUseSum.toFixed(1).padStart(6, " ")} MB $(ram-icon)`
}

function getOnlyRamPercentUse(snapshots: Array<ContainerResourceUseSnapshot>): string {
    let ramUseSum = getTotalRamUse(snapshots);
    let ramPercentSum = ramUseSum / TOTAL_RAM * 100;
    return `${ramPercentSum.toFixed(1).padStart(6, " ")}% $(ram-icon)`
}

function getOnlyRamTotalAndPercentUse(snapshots: Array<ContainerResourceUseSnapshot>): string {
    let ramUseSum = getTotalRamUse(snapshots);
    let ramPercentSum = ramUseSum / TOTAL_RAM * 100;
    return `${ramUseSum.toFixed(1).padStart(6, " ")} MB   | ${ramPercentSum.toFixed(1).padStart(5, " ")}% $(ram-icon)`
}

export class StatusBarInfoFormattingService extends Singleton<StatusBarInfoFormattingService>() {
    private formatters?: Array<Function>;

    private constructor() {
        super();
    }

    public format(snapshots: Array<ContainerResourceUseSnapshot>): string {
        
        return `$(docker-icon) ` + this.formatters?.map(formatter => formatter(snapshots)).join("\t");
    }

    public updateFormatters() {
        let ramTotal = vscode.workspace.getConfiguration().get("docker-stats.statusBarShowRamTotal");
        let ramPct = vscode.workspace.getConfiguration().get("docker-stats.statusBarShowRamPercentage");
        let cpu = vscode.workspace.getConfiguration().get("docker-stats.statusBarShowCpu");

        let formatters = [];

        if (cpu)
            formatters.push(getFormattedCpuUse)
        
        if (ramTotal || ramPct) {
            if (!ramTotal)
                formatters.push(getOnlyRamPercentUse)
            if (!ramPct)
                formatters.push(getOnlyTotalRamUse)
            if (ramTotal && ramPct)
                formatters.push(getOnlyRamTotalAndPercentUse)
        }

        this.formatters = formatters;
    }
}