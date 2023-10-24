import { ContainerResourceUseSnapshot } from '../model/container_resource_use_snapshot'
import { ConfigurationService } from './configuration_service'
import { DockerStatsService } from './docker_stats_service'
import { StatusBarStatsItemService } from './status_bar/statusbar_stats_item_service'


export class LifeCycleService {
    private static statusBarService = StatusBarStatsItemService.getInstance();
    private static configurationService = ConfigurationService.getInstance();
    private static dockerStatsService = DockerStatsService.getInstance();

    public static startExtension(): void {
            if (this.configurationService.checkIsThereAnyDockerStatsConsumer()) {
                if (this.configurationService.checkIsThereAnyStatusBarInfoToDisplay())
                    this.initStatusBarInfoUpdates();
            }
    }

    private static initStatusBarInfoUpdates(): void {
        this.dockerStatsService.assignDockerStatsConsumer((arg: ContainerResourceUseSnapshot[]) => StatusBarStatsItemService.getInstance().updateStats(arg));
        this.dockerStatsService.startTrackingDockerStats();
    }

    public static stopExtension(): void {
        this.statusBarService.updateVisibility(false);
        this.dockerStatsService.stopTrackingDockerStats();
    }
}