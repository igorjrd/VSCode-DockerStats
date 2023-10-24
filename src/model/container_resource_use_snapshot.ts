export class ContainerResourceUseSnapshot {
    readonly cpu: number;
    readonly ram: number;

    constructor(cpuUse: number, ram: number) {
        this.cpu = cpuUse;
        this.ram = ram;
    }
}