import c from '../colors';
import { runTask } from '../common';
import type { Config } from '../definitions';
import { extractTemplate } from '../util/template';

export async function addWindows(config: Config): Promise<void> {
  await runTask(
    `Adding native Windows project in ${c.strong(config.windows.platformDir)}`,
    () => {
      return extractTemplate(
        config.cli.assets.windows.platformTemplateArchiveAbs,
        config.windows.platformDirAbs,
      );
    },
  );
}
