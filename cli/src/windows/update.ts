import {
copy,
remove,
pathExists,
readFile,
realpath,
writeFile,
} from '@ionic/utils-fs';
import { basename, dirname, join, relative } from 'path';

import c from '../colors';
import { checkPlatformVersions, runTask } from '../common';
import {
checkPluginDependencies,
handleCordovaPluginsJS,
logCordovaManualSteps,
} from '../cordova';
import type { Config } from '../definitions';
import { fatal } from '../errors';
import { logger } from '../log';
import {
PluginType,
getAllElements,
getFilePath,
getPlatformElement,
getPluginType,
getPlugins,
printPlugins,
} from '../plugin';
import type { Plugin } from '../plugin';
import { copy as copyTask } from '../tasks/copy';
import { convertToUnixPath } from '../util/fs';
import { resolveNode } from '../util/node';
import { runCommand } from '../util/subprocess';
import { extractTemplate } from '../util/template';

import { getWindowsPlugins } from './common';
  
const platform = 'windows'
export async function updateWindows(
    config: Config,
    deployment: boolean,
): Promise<void> {
    const plugins = await getPluginsTask(config);

    const capacitorPlugins = plugins.filter(
        p => getPluginType(p, platform) === PluginType.Core,
    );

    printPlugins(capacitorPlugins, platform);

    if (!(await pathExists(await config.windows.webDirAbs))) {
        await copyTask(config, platform);
    }
    await checkPluginDependencies(plugins, platform);
    await installNugetPackages(config, plugins, deployment);

    await checkPlatformVersions(config, platform);
}

async function getPluginsTask(config: Config) {
    return await runTask('Updating Windows plugins', async () => {
        const allPlugins = await getPlugins(config, platform);
        const iosPlugins = await getWindowsPlugins(allPlugins);
        return iosPlugins;
    });
}

async function installNugetPackages(config: Config, plugins: Plugin[], deployment: boolean) {
}
