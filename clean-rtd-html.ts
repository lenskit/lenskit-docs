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

const parser = new DOMParser();
for (let dir of dirs) {
  console.info("cleaning %s", dir);
  for await (let file of walk(dir, { exts: [".html"] })) {
    console.debug("cleaning file %s", file.path);

    let text = await Deno.readTextFile(file.path);
    let dom = parser.parseFromString(text, "text/html");
    let sel;
    // fix RTD embeds
    sel = dom.querySelector(
      'link[href^="https://assets.readthedocs.org/static/"]',
    );
    if (sel) {
      let attr = sel.getAttribute("href")!;
      sel.setAttribute(
        "href",
        attr.replace("https://assets.readthedocs.org/static/", "/_/static/"),
      );
      sel.remove();
    }
    sel = dom.querySelector(
      'script[src^="https://assets.readthedocs.org/static/"]',
    );
    if (sel) {
      let attr = sel.getAttribute("src")!;
      sel.setAttribute(
        "src",
        attr.replace("https://assets.readthedocs.org/static/", "/_/static/"),
      );
      sel.remove();
    }

    // update canonical
    sel = dom.querySelector('link[rel="canonical"]');
    if (sel) {
      let attr = sel.getAttribute("href");
      let url = new URL(attr!);
      if (url.hostname != "lkpy.lenskit.org") {
        url.hostname = "lkpy.lenskit.org";
      }
      url.pathname = url.pathname.replace(/^\/en\//, "");
      sel.setAttribute("href", url.toString());
    }

    // fix up menu
    sel = dom.querySelector(".rst-versions");
    if (sel) {
      let s2 = sel.querySelector("dl:last-child");
      if (s2) {
        let kid = s2.querySelector("dt");
        if (kid?.textContent.trim() == "On Read the Docs") {
          s2.remove();
        }
      }
    }

    await Deno.writeTextFile(
      file.path,
      `<!DOCTYPE html>\n${dom.documentElement?.outerHTML}`,
    );
  }
}
