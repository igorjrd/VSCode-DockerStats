import * as os from 'os'
import { ContainerResourceUseSnapshot } from "../model/container_resource_use_snapshot";


const OUTPUT_PATTERN = /(?<CPU>\d+(?:\.\d+)?)\%\s+(?<RAM>\d+(?:\.\d+)?)(?<RAMUNIT>B|MiB|GiB)/;
const OUTPUT_REGEX = RegExp(OUTPUT_PATTERN);

const OUTPUT_HEADER_PATTERN = /CPU \%\s*MEM USAGE \/ LIMIT/;
const OUTPUT_HEADER_REGEX = RegExp(OUTPUT_HEADER_PATTERN);


function parseDockerStatsLine(outputLine: string): ContainerResourceUseSnapshot
{
    let matchedGroups = OUTPUT_REGEX.exec(outputLine)?.groups;
    let cpu = parseFloat(matchedGroups?.CPU? matchedGroups?.CPU : "");
    let ram = parseFloat(matchedGroups?.RAM? matchedGroups?.RAM : "");

    if (matchedGroups?.RAMUNIT == "GiB")
        ram = ram * 1000;
    else if (matchedGroups?.RAMUNIT == "B")
        ram = ram * 0.000_000

    return new ContainerResourceUseSnapshot(cpu, ram);
}

export function parseDockerStatsStdOut(stdout: string)
{
    if (!OUTPUT_HEADER_REGEX.test(stdout))
        return null;
    if (stdout.split(os.EOL).length) {
        let lines = stdout.split(os.EOL).slice(1,-1);
        return lines.map(parseDockerStatsLine);
    }
    else
        return [];
}