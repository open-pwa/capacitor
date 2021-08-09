import { pathExists } from '@ionic/utils-fs';
import Debug from 'debug';
import open from 'open';

import c from '../colors';
import type { Config } from '../definitions';
import { logger } from '../log';

const debug = Debug('capacitor:android:open');

export async function openWindows(config: Config): Promise<void> {
  const vsPath = await config.windows.vsPath;

  const solution = config.windows.nativeVSSolutionAbs

  try {
    if (!(await pathExists(vsPath))) {
      throw new Error(`Visual Studio does not exist at: ${vsPath}`);
    }

    await open(solution, { app: vsPath, wait: false });
    logger.info(
      `Opening Visual Studio project at: ${c.strong(config.windows.platformDir)}.`,
    );
  } catch (e) {
    debug('Error opening Android Studio: %O', e);

    logger.error(
      'Unable to launch Visual Studio. Is it installed?\n' +
        `Attempted to open Visual Studio at: ${c.strong(
          vsPath,
        )}\n` +
        `You can configure this with the ${c.input(
          'CAPACITOR_VISUAL_STUDIO_PATH',
        )} environment variable.`,
    );
  }
}
