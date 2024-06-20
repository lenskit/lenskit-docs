import * as fs from "node:fs";
import * as git from "isomorphic-git";

import * as ai from "@hongminhee/aitertools";
import { ensureDir } from "@std/fs";

let branches = await git.listBranches({ fs, dir: "." });
branches = branches.filter((b) => b != "main");
console.info("found %d versions: %o", branches.length, branches);

await ensureDir("versions");

let dirs = await ai.toArray(
  ai.map(
    (e: Deno.DirEntry) => e.name,
    ai.filter((e: Deno.DirEntry) => e.isDirectory, Deno.readDir("versions")),
  ),
);
console.info("found %d version dirs: %o", dirs.length, dirs);

for (let branch of branches) {
  if (dirs.includes(branch)) {
    console.info("version %s already checked out", branch);
    continue;
  }
  let cmd = new Deno.Command("git", {
    args: ["worktree", "add", `versions/${branch}`, branch],
  });
  let proc = cmd.spawn();
  let res = await proc.output();
  if (res.code != 0) {
    console.error("git worktree failed with status %d", res.code);
    Deno.exit(3);
  }
}

for (let dir of dirs) {
  if (branches.includes(dir)) {
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
