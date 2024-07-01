local latest = '2024.0dev';
local versions = [
  '0.14.4',
  '0.14.3',
  '0.14.2',
  '0.14.1',
  '0.14.0',
  '0.13.1',
  '0.13.0',
  '0.12.3',
  '0.12.2',
  '0.12.1',
  '0.11.1',
  '0.11.0',
  '0.10.1',
  '0.10.0',
  '0.9.0',
  '0.8.4',
  '0.8.1',
  '0.8.0',
  '0.7.0',
  '0.6.1',
  '0.6.0',
  '0.5.0',
  '0.3.0',
  '0.2.0',
];

[
  { name: 'Latest', version: latest, url: 'https://lkpy.lenskit.org/latest/' },
  { name: versions[0] + ' (stable)', version: versions[0], url: 'https://lkpy.lenskit.org/stable/' },
] + [
  {
    name: version,
    version: version,
    url: 'https://lkpy.lenskit.org/' + version + '/',
  }
  for version in versions[1:]
]
