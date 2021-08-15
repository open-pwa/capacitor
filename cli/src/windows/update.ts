import {
pathExists, realpath, writeFile,
} from '@ionic/utils-fs';
import { dirname, join, relative, resolve } from 'path';

import c from '../colors';
import { checkPlatformVersions, runTask } from '../common';
import {
checkPluginDependencies,
} from '../cordova';
import type { Config } from '../definitions';
import {
PluginType,
getPluginType,
getPlugins,
printPlugins,
} from '../plugin';
import type { Plugin } from '../plugin';
import { copy as copyTask } from '../tasks/copy';

import { getWindowsPlugins } from './common';
import { readXML, writeXML } from '../util/xml';
import { convertToUnixPath } from '../util/fs';
import { resolveNode } from '../util/node';
import { fatal } from '../errors';
  
const platform = 'windows'
export async function updateWindows(
    config: Config
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
    await installNugetPackages(config, plugins);

    await checkPlatformVersions(config, platform);
}

async function getPluginsTask(config: Config) {
    return await runTask('Updating Windows plugins', async () => {
        const allPlugins = await getPlugins(config, platform);
        const iosPlugins = await getWindowsPlugins(allPlugins);
        return iosPlugins;
    });
}

async function installNugetPackages(config: Config, plugins: Plugin[]) {
    await runTask(
      `Updating Windows native dependencies`,
      () => {
        return updateNugetConfig(config, plugins);
      },
    );
}

async function updateNugetConfig(config: Config, plugins: Plugin[]) {
    const capacitorWindowsPath = resolveNode(
        config.app.rootDir,
        '@ionic-enterprise/capacitor-windows',
        'package.json',
    );
    if (!capacitorWindowsPath) {
        fatal(
            `Unable to find ${c.strong('node_modules/@ionic-enterprise/capacitor-windows')}.\n` +
            `Are you sure ${c.strong('@ionic-enterprise/capacitor-windows')} is installed?`,
        );
    }

    const nugetConfigPath = resolve(config.windows.nativeProjectDirAbs, 'nuget.config');
    const nugetConfigXml = await readXML(nugetConfigPath);
    const packageSources = nugetConfigXml.configuration.packageSources;

    await Promise.all(plugins.map(async plugin => {
        console.log(plugin.rootPath, await realpath(plugin.rootPath));

        const key = `capacitor-${plugin.name}`;
        const value = relative(config.windows.nativeProjectDirAbs, join(await realpath(plugin.rootPath), 'windows/Plugin'));

        if (!alreadyRegistered(packageSources, key, value)) {
            packageSources[0].add.push({
                $: { key, value }
            });
        }
    }));


    const newXml = await writeXML(nugetConfigXml);

    await writeFile(nugetConfigPath, newXml);
}

const alreadyRegistered = (packageSources: any, key: string, value: string) => {
    return !!packageSources[0].add.find((a: any) => a.$.key === key && a.$.value === value);
}