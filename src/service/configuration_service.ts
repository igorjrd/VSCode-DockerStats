import * as vscode from 'vscode'
import { Configurations } from '../constants/configurations'
import { DockerStatsService } from './docker_stats_service';
import { StatusBarStatsItemService } from './status_bar/statusbar_stats_item_service'
import { StatusBarInfoFormattingService } from './status_bar/status_bar_info_formatter'
import { Singleton } from '../model/singleton'


const STATUSBAR_CONFIGS = [
    Configurations.STATUS_BAR_SHOW_CPU_CONFIG,
    Configurations.STATUS_BAR_SHOW_ALLOCATED_MEMORY,
    Configurations.STATUS_BAR_SHOW_MEMORY_ALLOC_PCT
]


export class ConfigurationService extends Singleton<ConfigurationService>() {
    private isAnyStatBeingShowed = false;
    private dockerStatsService: DockerStatsService = DockerStatsService.getInstance();
    
    private constructor() {
        super();
    }

    public checkIsThereAnyStatusBarInfoToDisplay(): boolean {
        return STATUSBAR_CONFIGS.map(config => vscode.workspace.getConfiguration().get(config)).some(x => x);
    }

    public checkIsThereAnyDockerStatsConsumer(): boolean {
        let methodsToEvaluate = [
            this.checkIsThereAnyStatusBarInfoToDisplay
        ]

        return methodsToEvaluate.some(method => method())
    }

    public switchDockerStatsMonitoringOnOff(): void {
        if (!this.isAnyStatBeingShowed) {
            if (this.checkIsThereAnyStatusBarInfoToDisplay()) {
                this.isAnyStatBeingShowed = true;
                this.dockerStatsService.startTrackingDockerStats();
            }
        } else {
            if (this.checkIsThereAnyStatusBarInfoToDisplay())
            this.dockerStatsService.stopTrackingDockerStats()
        }
    }
}

vscode.workspace.onDidChangeConfiguration((event) => {
    let configurationService = ConfigurationService.getInstance();
    let formattingService = StatusBarInfoFormattingService.getInstance();
    let statusbarService = StatusBarStatsItemService.getInstance();
    
    let didChangeStatusBarInfo = STATUSBAR_CONFIGS.map(config => event.affectsConfiguration(config)).some(x => x);
    
    if (didChangeStatusBarInfo) {
        formattingService.updateFormatters();
        let isAnyInfoToShow = configurationService.checkIsThereAnyStatusBarInfoToDisplay();
        statusbarService.updateVisibility(isAnyInfoToShow);
    }

    configurationService.switchDockerStatsMonitoringOnOff();
})