import { CommandKeys } from "../constants/command_keys"
import { selectStatusBarInfo } from "./select_status_bar_info"


abstract class ExtensionCommand {
    public key!: string;
    public method!: () => void;
}


export const commands: Array<ExtensionCommand> = [
    {
        key: CommandKeys.SELECT_STATUSBAR_INFO,
        method: selectStatusBarInfo
    }
]