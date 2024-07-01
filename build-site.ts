import { ensureDir } from "@std/fs";

import * as fs from "node:fs";
import * as git from "isomorphic-git";

let branches = await git.listBranches({ fs, dir: "." });
branches = branches.filter((b) => b != "main");
console.info("found %d versions: %o", branches.length, branches);

await ensureDir("site");

for (let branch of branches) {
  console.info("extracting version %s", branch);
  await ensureDir(`site/${branch}`);
  let archive = new Deno.Command("git", {
    args: ["archive", "--format=tar", branch],
    stdout: "piped",
  });
  let untar = new Deno.Command("tar", {
    args: ["xf", "-", "-C", `site/${branch}`],
    stdin: "piped",
  });
  let ar_proc = archive.spawn();
  let tar_proc = untar.spawn();
  await ar_proc.stdout.pipeTo(tar_proc.stdin);
  let res = await ar_proc.status;
  if (res.code != 0) {
    throw new Error(`git archive failed with code ${res.code}`);
  }
  res = await tar_proc.output();
  if (res.code != 0) {
    throw new Error(`tar failed with code ${res.code}`);
  }
}
