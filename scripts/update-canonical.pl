#!/usr/bin/env -S perl -i

my $base = shift;

while (<>) {
    if (m/<link rel="canonical"/) {
        s@https://lenskit.org/(\w+|[0-9.]+)/@$base@;
    }
    print;
}
