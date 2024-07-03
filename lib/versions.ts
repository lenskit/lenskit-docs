import { parse, SemVer } from "@std/semver";

import * as fs from "node:fs";
import * as git from "isomorphic-git";

export type Version = {
    label: string;
    branch: string;
    semver?: SemVer;
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
                semver: parsePyVer(m[1]),
            });
        }
    }

    console.info("found %d versions: %o", versions.length, versions);
    return versions;
}

function parsePyVer(ver: string): SemVer | undefined {
    if (ver.match(/^\w+$/)) {
        return;
    }

    let m = ver.match(/^(\d+\.\d+(\.\d+)?)(?:\.((?:a|b|dev)\d+))?(\+.*)?/);
    if (!m) {
        console.error("unparsable version: %s", ver);
        return;
    }

    let svp = m[1];
    if (!m[2]) {
        svp += ".0";
    }
    if (m[3]) {
        svp += `-${m[3]}`;
    }
    svp += m[4] ?? "";
    return parse(svp);
}
