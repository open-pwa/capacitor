import c from '../colors';
import { runTask } from '../common';
import type { Config } from '../definitions';
import { resolveNode } from '../util/node';
import { extractTemplate } from '../util/template';

import { fatal } from '../errors';

export async function addWindows(config: Config): Promise<void> {
  const capacitorWindowsTemplatePath = resolveNode(
    config.app.rootDir,
    '@ionic-enterprise/capacitor-windows',
    'template.tar.gz',
  );

  if (!capacitorWindowsTemplatePath) {
    fatal(
      `Unable to load windows platform template. Ensure @ionic-enterprise/capacitor-windows is installed`,
    );
  }

  await runTask(
    `Adding native Windows project in ${c.strong(
      config.windows.platformDir,
    )} - ${capacitorWindowsTemplatePath}`,
    () => {
      return extractTemplate(
        capacitorWindowsTemplatePath,
        config.windows.platformDirAbs,
      );
    },
  );
}
