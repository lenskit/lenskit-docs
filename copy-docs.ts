import { ensureDir } from "@std/fs";

import { getVersionList } from "./lib/versions.ts";

let versions = await getVersionList();

await ensureDir("site");

for (let version of versions) {
  console.info("extracting branch %s", version.branch);
  await ensureDir(`site/en/${version.label}`);
  let archive = new Deno.Command("git", {
    args: ["archive", "--format=tar", version.branch],
    stdout: "piped",
  });
  let untar = new Deno.Command("tar", {
    args: ["xf", "-", "-C", `site/en/${version.label}`],
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
