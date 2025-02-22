import { compare } from "@std/semver";
import { parseArgs } from "@std/cli";

import { getVersionList } from "./lib/versions.ts";

const URL_BASE = "https://lkpy.lenskit.org";

const args = parseArgs(Deno.args, {
  string: ["output"],
  alias: {
    "o": "output",
  },
});

let versions = await getVersionList();

let named = versions.filter((v) => v.semver && !v.semver.prerelease?.length);
named.sort((v1, v2) => compare(v2.semver!, v1.semver!));
let stable = named[0];
console.info("latest version: %o", stable);

let manifest = [
  {
    name: "Latest",
    version: "main",
    url: `${URL_BASE}/latest/`,
  },
  {
    name: named[0].label + " (stable)",
    version: named[0].label,
    url: `${URL_BASE}/stable/`,
    preferred: true,
  },
];

for (let v of named.slice(1)) {
  manifest.push({
    name: v.label,
    version: v.label,
    url: `${URL_BASE}/${v.label}/`,
  });
}

if (args.output) {
  console.info("saving versions to %s", args.output);
  await Deno.writeTextFile(args.output, JSON.stringify(manifest, null, 2));
}
