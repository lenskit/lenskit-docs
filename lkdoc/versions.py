from dataclasses import dataclass
import re
from dulwich.repo import Repo
from packaging.version import Version

VERSION_REF = re.compile(
    r"^refs/heads/(?P<branch>version/(?P<version>(?P<primary>\d+.\d+(?P<patch>\.\d+)?)(?:\.(?P<pre>(?:a|b|dev)\d+))?(?P<tag>\+.*)?))"
)


@dataclass
class DocVersion:
    label: str
    branch: str
    version: Version


def list_versions():
    repo = Repo.discover()

    refs = repo.get_refs()
    versions = []
    for name in refs:
        name = name.decode("utf-8")
        m = VERSION_REF.match(name)
        if not m:
            continue

        ver = Version(m.group("version"))
        label = str(ver)
        versions.append(DocVersion(label, m.group("branch"), label))

    versions.sort(key=lambda dv: dv.version)
    return versions


if __name__ == "__main__":
    for ver in list_versions():
        print(ver.label)
