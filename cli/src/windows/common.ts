import { checkCapacitorPlatform } from '../common';
import { Config } from '../definitions';

export async function checkWindowsPackage(
  config: Config,
): Promise<string | null> {
  return checkCapacitorPlatform(config, 'windows');
}