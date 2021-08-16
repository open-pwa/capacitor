import { check, checkWebDir } from '../common';
import type { Config } from '../definitions';
import { fatal } from '../errors';
import { logSuccess } from '../log';
import { isInstalled } from '../util/subprocess';

export async function doctorWindows(config: Config): Promise<void> {
  try {
    await check([
      () => checkWebDir(config),
      checkVisualStudio,
      checkDotnet,
    ]);
    logSuccess('Windows looking great! ✅');
  } catch (e) {
    fatal(e.stack ?? e);
  }
}

async function checkVisualStudio() {
  return null;
}

async function checkDotnet() {
  if (!(await isInstalled('dotnet.exe'))) {
    return `The dotnet CLI tool was not found. Make sure the .NET SDK is installed`;
  }
  return null;
}
