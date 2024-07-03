import { ensureDir } from "@std/fs";

import * as ai from "@hongminhee/aitertools";

import { getVersionList } from "./lib/versions.ts";

let versions = await getVersionList();

await ensureDir("versions");

let dirs = await ai.toArray(
  ai.map(
    (e: Deno.DirEntry) => e.name,
    ai.filter((e: Deno.DirEntry) => e.isDirectory, Deno.readDir("versions")),
  ),
);
console.info("found %d version dirs: %o", dirs.length, dirs);

let seen: Set<string> = new Set();
for (let v of versions) {
  seen.add(v.label);
  if (dirs.includes(v.label)) {
    console.info("version %s already checked out", v.label);
    continue;
  }
  let cmd = new Deno.Command("git", {
    args: ["worktree", "add", `versions/${v.label}`, v.branch],
  });
  let proc = cmd.spawn();
  let res = await proc.output();
  if (res.code != 0) {
    console.error("git worktree failed with status %d", res.code);
    Deno.exit(3);
  }
}

for (let dir of dirs) {
  if (seen.has(dir)) {
    continue;
  }
  console.info("removing unused tree %s", dir);
  let cmd = new Deno.Command("git", {
    args: ["worktree", "remove", `versions/${dir}`],
  });
  let proc = cmd.spawn();
  let res = await proc.output();
  if (res.code != 0) {
    console.error("git worktree failed with status %d", res.code);
    Deno.exit(3);
  }
}
