function normalizeDomain(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function resolveSiteConfigEntry(siteConfig, casino) {
  if (!siteConfig || !casino) return null;

  const rawDomain = normalizeDomain(casino.domain);
  const rawName = normalizeName(casino.name);

  if (rawDomain && siteConfig[rawDomain]) {
    return siteConfig[rawDomain];
  }

  for (const [domain, config] of Object.entries(siteConfig)) {
    if (rawDomain && normalizeDomain(domain) === rawDomain) {
      return config;
    }
  }

  for (const [, config] of Object.entries(siteConfig)) {
    if (rawName && normalizeName(config.name) === rawName) {
      return config;
    }
    const aliases = Array.isArray(config.aliases) ? config.aliases : [];
    if (aliases.some((alias) => normalizeName(alias) === rawName)) {
      return config;
    }
  }

  return null;
}

export function getCasinoLaunchUrl(siteConfig, casino) {
  const config = resolveSiteConfigEntry(siteConfig, casino);
  if (config?.launch_url) return config.launch_url;

  const domain = normalizeDomain(casino?.domain);
  return domain ? `https://${domain}` : '#';
}

const api = { resolveSiteConfigEntry, getCasinoLaunchUrl };

if (typeof window !== 'undefined') {
  window.SweepVaultSiteConfigUtils = api;
}
