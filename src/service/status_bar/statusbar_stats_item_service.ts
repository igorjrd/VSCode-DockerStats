import * as vscode from 'vscode'
import { ContainerResourceUseSnapshot } from '../../model/container_resource_use_snapshot'
import { StatusBarInfoFormattingService } from './status_bar_info_formatter'
import { ConfigurationService } from "../configuration_service"
import { Singleton } from '../../model/singleton';


export class StatusBarStatsItemService extends Singleton<StatusBarStatsItemService>() {

    private readonly statsItem: vscode.StatusBarItem;
    private isBeingShowed: boolean = false;
    readonly formattingService = StatusBarInfoFormattingService.getInstance();

    private constructor() {
        super();
        this.statsItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
        this.statsItem.tooltip = 'Current Docker resource usage';
        this.statsItem.command = "docker-stats.selectStatusBarInfo";

        this.formattingService.updateFormatters();

        if (ConfigurationService.getInstance().checkIsThereAnyStatusBarInfoToDisplay()) {
            this.statsItem.show();
            this.isBeingShowed = true;
        }
    }

    public updateStats(snapshots: Array<ContainerResourceUseSnapshot>): void {
        let statsInfoText;
        if (snapshots.length == 0)
            statsInfoText = this.formattingService.format([new ContainerResourceUseSnapshot(0, 0)]);
        else
            statsInfoText = this.formattingService.format(snapshots);

        this.statsItem.text = statsInfoText;
    }

    public updateVisibility(thereIsAnyInfoToShow: boolean): void {
        if (thereIsAnyInfoToShow && !this.isBeingShowed) {
            this.statsItem.show();
            this.isBeingShowed = true;
        } else if (!thereIsAnyInfoToShow && this.isBeingShowed) {
            this.statsItem.hide();
            this.isBeingShowed = false;
        }
    }
}