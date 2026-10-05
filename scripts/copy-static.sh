#!/bin/sh
#MISE description="Copy static assets."

exec rsync -rv static/ site/
