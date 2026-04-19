import test from 'node:test';
import assert from 'node:assert/strict';
import { getCasinoLaunchUrl, resolveSiteConfigEntry } from './site-config-utils.mjs';

const SITE_CONFIG = {
  'clubs.poker': {
    name: 'Clubs Poker',
    launch_url: 'https://play.clubspoker.com/d/?tables/all',
  },
  'dogghousecasino.com': {
    name: 'Dogghouse',
    launch_url: 'https://play.dogghousecasino.com/profile',
  },
};

test('resolveSiteConfigEntry matches exact domain first', () => {
  const result = resolveSiteConfigEntry(SITE_CONFIG, {
    domain: 'clubs.poker',
    name: 'Something Else',
  });

  assert.equal(result?.name, 'Clubs Poker');
});

test('resolveSiteConfigEntry falls back to casino name when domain differs', () => {
  const result = resolveSiteConfigEntry(SITE_CONFIG, {
    domain: 'play.clubspoker.com',
    name: 'Clubs Poker',
  });

  assert.equal(result?.launch_url, 'https://play.clubspoker.com/d/?tables/all');
});

test('getCasinoLaunchUrl returns configured launch url for name-matched casino', () => {
  const url = getCasinoLaunchUrl(SITE_CONFIG, {
    domain: 'play.dogghousecasino.com',
    name: 'Dogghouse',
  });

  assert.equal(url, 'https://play.dogghousecasino.com/profile');
});

test('getCasinoLaunchUrl falls back to https domain when no config match exists', () => {
  const url = getCasinoLaunchUrl(SITE_CONFIG, {
    domain: 'example.com',
    name: 'Example',
  });

  assert.equal(url, 'https://example.com');
});
