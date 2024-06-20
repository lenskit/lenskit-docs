import { assert } from "@std/assert";
import { walk } from "@std/fs";

import { DOMParser } from "@b-fuze/deno-dom";
import * as ai from "@hongminhee/aitertools";
import docopt from "docopt";

let opts = docopt(`
Clean RTD tags from documentation.

Usage:
    clean-rtd-html.ts [options] [DIR...]
`);

let dirs: string[];
let diropt = opts["DIR"];
assert(Array.isArray(diropt));
if (diropt.length) {
  dirs = diropt as string[];
} else {
  dirs = await ai.toArray(
    ai.map(
      (e: Deno.DirEntry) => `versions/${e.name}`,
      ai.filter((e: Deno.DirEntry) => e.isDirectory, Deno.readDir("versions")),
    ),
  );
}
console.info("will work on %d version dirs: %o", dirs.length, dirs);

for (let dir of dirs) {
  console.info("cleaning %s", dir);
  for await (let file of walk(dir, { exts: [".html"] })) {
    console.debug("cleaning file %s", file.path);
  }
}
