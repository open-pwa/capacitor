import { pathExists } from 'fs-extra';
import { check, checkWebDir } from '../common';
import type { Config } from '../definitions';
import { fatal } from '../errors';
import { logSuccess } from '../log';
import { isInstalled } from '../util/subprocess';

export async function doctorWindows(config: Config): Promise<void> {
  try {
    await check([() => checkWebDir(config), checkVisualStudio, checkDotnet]);
    logSuccess('Windows looking great! ✅');
  } catch (e) {
    fatal(e.stack ?? e);
  }
}

async function checkVisualStudio() {
  if (
    !(await pathExists(
      'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe',
    ))
  ) {
    return `Unable to find Visual Studio installation`;
  }
  return null;
}

async function checkDotnet() {
  if (!(await isInstalled('dotnet.exe'))) {
    return `The dotnet CLI tool was not found. Make sure the .NET SDK is installed`;
  }
  return null;
}
