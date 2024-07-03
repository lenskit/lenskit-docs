import * as fs from "node:fs";
import * as git from "isomorphic-git";

export type Version = {
    label: string;
    branch: string;
};

export async function getVersionList(): Promise<Version[]> {
    let branches = await git.listBranches({ fs, dir: "." });
    let versions: Version[] = [];
    for (let b of branches) {
        let m = b.match(/^version\/(.*)/);
        if (m) {
            versions.push({
                label: m[1],
                branch: b,
            });
        }
    }

    console.info("found %d versions: %o", versions.length, versions);
    return versions;
}
