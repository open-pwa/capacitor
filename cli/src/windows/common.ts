import { checkCapacitorPlatform } from '../common';
import { Config } from '../definitions';
import { Plugin, PluginType } from '../plugin';

export async function checkWindowsPackage(
  config: Config,
): Promise<string | null> {
  return checkCapacitorPlatform(config, 'windows');
}

export async function getWindowsPlugins(
  allPlugins: Plugin[],
): Promise<Plugin[]> {
  const resolved = await Promise.all(
    allPlugins.map(async plugin => await resolveWindowsPlugin(plugin)),
  );
  return resolved.filter((plugin): plugin is Plugin => !!plugin);
}

export async function resolveWindowsPlugin(
  plugin: Plugin,
): Promise<Plugin | null> {
  const platform = 'windows';
  if (plugin.manifest?.windows) {
    plugin.windows = {
      name: plugin.name,
      type: PluginType.Core,
      path: plugin.manifest.windows.src ?? platform,
    };
  } else {
    return null;
  }
  return plugin;
}
