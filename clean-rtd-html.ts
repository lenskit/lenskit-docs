import { glob } from '@std/path'
import { walk} from '@std/fs'

import { DOMParser } from '@b-fuze/deno-dom';

for await (let entry of walk('.'))