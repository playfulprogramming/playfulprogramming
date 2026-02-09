---
{
title: "A quick overview of the Deno CLI",
published: "2020-11-19T20:40:58Z",
edited: "2020-11-20T21:31:05Z",
tags: ["deno", "typescript", "javascript"],
description: "A quick introduction to the Deno CLI. It's a batteries included executable with everything you need to develop, lint, test, and run Deno code.",
originalLink: "https://https://dev.to/playfulprogramming/a-quick-overview-of-the-deno-cli-1pm5",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

*Original cover photo by [falconp4](https://pixabay.com/photos/tool-tester-screwdriver-2766836/) on Pixabay.*

*Original publication date: 2020-05-21.*

The Deno CLI is a batteries included executable with everything you need to develop, lint, test, and run Deno code.

CLI commands in Deno version 1.4:

- [`deno bundle`](#bundle-javascript-module)
- [`deno cache`](#cache-remote-deno-modules)
- [`deno completions`](#deno-shell-completions)
- [`deno doc`](#inline-online-deno-module-documentation)
- [`deno eval`](#evaluate-javascript-typescript-code)
- [`deno fmt`](#format-deno-modules)
- [`deno help`](#display-command-usage-and-examples)
- [`deno info`](#display-metadata-and-dependency-tree-for-deno-module)
- [`deno install`](#install-deno-module-as-executable)
- [`deno lint`](#linting-deno-code)
- [`deno repl`](#deno-repl-read-eval-print-loop-)
- [`deno run`](#run-deno-module)
- [`deno test`](#deno-test-runner)
- [`deno types`](#deno-type-declarations)
- [`deno upgrade`](#upgrade-deno-executable)

In this article, we'll briefly discuss each command.

> Tip: You can use the `--help` option to get information about each command, for example `deno run --help`.

Common CLI options in Deno version 1.4 supported by all commands:

- `--help`: Display usage and example information about one or all commands.
- `--log-level <debug|info>`: Filter output based on log level.
- `--quiet`: Disable most intermediary output.
- `--unstable`: Enable experimental Deno APIs, commands, and options.
- `--version`: Display the versions of Deno, V8, and TypeScript included in the `deno` executable.

Other than these, some commands support permission options such as `--allow-net`. We will not discuss these in this article.

# Bundle JavaScript module {#bundle-javascript-module}

The `deno bundle` command is used to bundle a module and its dependency tree into a single JavaScript module.

## Usage

`deno bundle [options] <source-module> [output-file]` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--config <file>`: Use specified TypeScript configuration (`tsconfig.json` ) to compile the module and its dependencies.
- `--importmap <file>`: Use specified import map for module resolution. See [Deno manual 4.4. Import maps](https://deno.land/manual/linking_to_external_code/import_maps). Experimental feature.
- `--reload[=<module-refresh-allowlist>]`: Download and recompile all or the specified remote modules when bundling.

## Example

Let's compile and bundle a Hello World HTTP server using an import map that references the standard `http` library.

We have the following workspace structure, files, and folders:

```powershell
deno_hello_world
├── dist
├── src
│   └── hello_world.ts
├── import_map.json
└── tsconfig.json
```

*Workspace structure.*

```json
{
  "//": "import_map.json",
  "imports": {
    "http/": "https://deno.land/std/http/"
  }
}
```

*Import map.*

```json
{
  "//": "tsconfig.json",
  "compilerOptions": {
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true
  }
}
```

*TypeScript configuration.*

```ts
// hello_world.ts
import { serve } from 'http/server.ts';

const server = serve(':8000');
const body = new TextEncoder().encode('Hello, World!\n');

async function main() {
  for await (const request of server) {
    request.respond({ body });
  }
}

main();
```

*Hello World HTTP server.*

With the files above, use this command to bundle the Hello World HTTP server into a single module:

```powershell
deno bundle --unstable --importmap import_map.json --config tsconfig.json src/hello_world.ts dist/hello_world.js
Bundle file:///C:/projects/sandbox/deno-cli-app/src/hello_world.ts
Emit "dist/hello_world.js" (68.99KB)
```

*Bundle the Hello World HTTP server.*

We're now left with a single JavaScript bundle that uses a `Map` to keep track of sub-modules and dependencies.

> When using this command, be careful when using features that are not supported by V8, such as top-level await. However, top-level await works with the V8 flag `--harmony-top-level-await`.

# Cache remote Deno modules {#cache-remote-deno-modules}

For any module, we can cache (download) the module and every dependency if they're remote modules.

## Usage

`deno cache [options] <source-module>` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--config <file>`: Use specified TypeScript configuration (`tsconfig.json` ) to compile the module and its dependencies.
- `--importmap <file>`: Use specified import map for module resolution. See [Deno manual 4.4. Import maps](https://deno.land/manual/linking_to_external_code/import_maps). Experimental feature.
- `--lock <file>`: Consult module hashes in the specified lockfile for caching purposes.
- `--lock-write`: Create/update the specified lockfile. Specify the lockfile with the `--lock` option.
- `--no-remote`: Disallow remote modules.
- `--no-check`: Skip type checking.
- `--reload=[module-whitelist-patterns]`: (Re-)download remote modules. Option to specify one or more patterns for which remote modules to allow.

## Example[](https://indepth.dev/a-quick-overview-of-the-deno-cli#example-1)

We have a Hello World HTTP server. We want to cache its remote dependency and lock their hashes to prevent unintentional updates.

```powershell
# Initial run to produce lockfile
deno cache src/hello_world.ts --lock deno-lock.json --lock-write --reload

# Later run by you or your colleagues
deno cache src/hello_world.ts --lock deno-lock.json
```

*Cache and lock remote dependencies of a local module.*

Example output of `deno cache`:

```powershell
PS C:\projects\sandbox\deno-cli-app> deno cache .\src\hello_world.ts --lock deno-lock.json --lock-write --reload
Compile file:///C:/projects/sandbox/deno-cli-app/src/hello_world.ts
Download https://deno.land/std/http/server.ts
Warning Implicitly using master branch https://deno.land/std/http/server.ts
Download https://deno.land/std/encoding/utf8.ts
Download https://deno.land/std/io/bufio.ts
Download https://deno.land/std/testing/asserts.ts
Download https://deno.land/std/async/mod.ts
Download https://deno.land/std/http/_io.ts
Warning Implicitly using master branch https://deno.land/std/encoding/utf8.ts
Warning Implicitly using master branch https://deno.land/std/testing/asserts.ts
Warning Implicitly using master branch https://deno.land/std/http/_io.ts
Warning Implicitly using master branch https://deno.land/std/io/bufio.ts
Warning Implicitly using master branch https://deno.land/std/async/mod.ts
Download https://deno.land/std/io/util.ts
Warning Implicitly using master branch https://deno.land/std/io/util.ts
Download https://deno.land/std/path/mod.ts
Warning Implicitly using master branch https://deno.land/std/path/mod.ts
Download https://deno.land/std/path/win32.ts
Download https://deno.land/std/path/posix.ts
Download https://deno.land/std/path/common.ts
Download https://deno.land/std/path/separator.ts
Download https://deno.land/std/path/interface.ts
Download https://deno.land/std/path/glob.ts
Warning Implicitly using master branch https://deno.land/std/path/win32.ts
Warning Implicitly using master branch https://deno.land/std/path/separator.ts
Warning Implicitly using master branch https://deno.land/std/path/glob.ts
Warning Implicitly using master branch https://deno.land/std/path/posix.ts
Warning Implicitly using master branch https://deno.land/std/path/common.ts
Warning Implicitly using master branch https://deno.land/std/path/interface.ts
Download https://deno.land/std/path/_constants.ts
Download https://deno.land/std/path/_util.ts
Warning Implicitly using master branch https://deno.land/std/path/_util.ts
Warning Implicitly using master branch https://deno.land/std/path/_constants.ts
Download https://deno.land/std/fmt/colors.ts
Download https://deno.land/std/testing/diff.ts
Warning Implicitly using master branch https://deno.land/std/testing/diff.ts
Warning Implicitly using master branch https://deno.land/std/fmt/colors.ts
Download https://deno.land/std/path/_globrex.ts
Warning Implicitly using master branch https://deno.land/std/path/_globrex.ts
Download https://deno.land/std/async/deferred.ts
Download https://deno.land/std/async/delay.ts
Download https://deno.land/std/async/mux_async_iterator.ts
Warning Implicitly using master branch https://deno.land/std/async/delay.ts
Warning Implicitly using master branch https://deno.land/std/async/mux_async_iterator.ts
Warning Implicitly using master branch https://deno.land/std/async/deferred.ts
Download https://deno.land/std/textproto/mod.ts
Download https://deno.land/std/http/http_status.ts
Warning Implicitly using master branch https://deno.land/std/http/http_status.ts
Warning Implicitly using master branch https://deno.land/std/textproto/mod.ts
Download https://deno.land/std/bytes/mod.ts
Warning Implicitly using master branch https://deno.land/std/bytes/mod.ts
```

Here's the generated lockfile:

```json
{
  "https://deno.land/std/async/mod.ts": "bf46766747775d0fc4070940d20d45fb311c814989485861cdc8a8ef0e3bbbab",
  "https://deno.land/std/async/delay.ts": "35957d585a6e3dd87706858fb1d6b551cb278271b03f52c5a2cb70e65e00c26a",
  "https://deno.land/std/fmt/colors.ts": "fb95dda634050be373eb0b154b75967e90ccc4063b0928f9e3c692f401be3908",
  "https://deno.land/std/path/posix.ts": "b742fe902d5d6821c39c02319eb32fc5a92b4d4424b533c47f1a50610afbf381",
  "https://deno.land/std/testing/asserts.ts": "1dc683a61218e2d8c5e9e87e3602a347000288fb207b4d7301414935620e24b3",
  "https://deno.land/std/path/separator.ts": "7bdb45c19c5c934c49c69faae861b592ef17e6699a923449d3eaaf83ec4e7919",
  "https://deno.land/std/textproto/mod.ts": "aa585cd8dceb14437cf4499d6620c1fe861140ccfe56125eb931db4cfb90c3b2",
  "https://deno.land/std/path/win32.ts": "61248a2b252bb8534f54dafb4546863545e150d2016c74a32e2a4cfb8e061b3f",
  "https://deno.land/std/path/glob.ts": "ab85e98e4590eae10e561ce8266ad93ebe5af2b68c34dc68b85d9e25bccb4eb7",
  "https://deno.land/std/path/_globrex.ts": "a88b9da6a150b8d8e87a7b9eef794f97b10e709910071bb57f8619dd2d0291dc",
  "https://deno.land/std/http/server.ts": "d2b977c100d830262d8525915c3f676ce33f1e986926a3cdbc81323cf724b599",
  "https://deno.land/std/async/deferred.ts": "ac95025f46580cf5197928ba90995d87f26e202c19ad961bc4e3177310894cdc",
  "https://deno.land/std/async/mux_async_iterator.ts": "e2a4c2c53aee22374b493b88dfa08ad893bc352c8aeea34f1e543e938ec6ccc6",
  "https://deno.land/std/http/http_status.ts": "84ae4289053c4f045cd655fd3b05f33ce62c685bdc0eac2210b12d827ffa7157",
  "https://deno.land/std/io/bufio.ts": "3dd55426bc8b1e27c7f006847ac0bfefb4c0d5144ba2df2d93944dc37114a6e0",
  "https://deno.land/std/path/mod.ts": "a789541f8df9170311daa98313c5a76c06b5988f2948647957b3ec6e017d963e",
  "https://deno.land/std/path/interface.ts": "89f6e68b0e3bba1401a740c8d688290957de028ed86f95eafe76fe93790ae450",
  "https://deno.land/std/io/util.ts": "ae133d310a0fdcf298cea7bc09a599c49acb616d34e148e263bcb02976f80dee",
  "https://deno.land/std/http/_io.ts": "025d3735c6b9140fc4bf748bc41dd4e80272de1bc398773ea3e9a8a727cd6032",
  "https://deno.land/std/path/_constants.ts": "f6c332625f21d49d5a69414ba0956ac784dbf4b26a278041308e4914ba1c7e2e",
  "https://deno.land/std/encoding/utf8.ts": "8654fa820aa69a37ec5eb11908e20b39d056c9bf1c23ab294303ff467f3d50a1",
  "https://deno.land/std/testing/diff.ts": "8f591074fad5d35c0cafa63b1c5334dc3a17d5b934f3b9e07172eed9d5b55553",
  "https://deno.land/std/path/_util.ts": "b678a7ecbac6b04c1166832ae54e1024c0431dd2b340b013c46eb2956ab24d4c",
  "https://deno.land/std/bytes/mod.ts": "784b292a65f6879bd39d81cb24590be1140fb4cce74bd4a149f67f2b647ad728",
  "https://deno.land/std/path/common.ts": "95115757c9dc9e433a641f80ee213553b6752aa6fbb87eb9f16f6045898b6b14"
}
```

*Example lockfile.*

The lockfile is a map over each dependent module and the hash of its source code.

# Deno shell completions {#deno-shell-completions}

We can get shell completions for the Deno CLI commands by outputting a profile script for the shell of our choice.

## Usage

`deno completions <shell>` where `<shell>` is one of:

- `bash`
- `elvish`
- `fish`
- `powershell`
- `zsh`

The `deno completions` command only supports the common options.

## Examples

Use this command to put the completions in your PowerShell profile:

```powershell
deno completions powershell >> $profile
```

*Add Deno completions to PowerShell.*

or if you use Bash:

```bash
deno completions bash >> /usr/local/etc/bash_completion.d/deno.bash
# or
deno completions bash >> ~/.bash_profile
```

*Add Deno completions to Bash.*

![](./7znc0xd4fm2o3e07i126.gif) *Deno CLI completions in PowerShell.*

Now we can write `deno` then `Tab` through CLI commands.

![](./qk41wf6rppwxjxrvxbzr.png) *Deno CLI completions in Bash.*

# Inline/online Deno module documentation {#inline-online-deno-module-documentation}

[Deno Doc](https://doc.deno.land/) is an official website that generates documentation for public Deno modules on-the-fly and caches them for 24 hours.

Deno Doc uses the `deno doc` command under the hood to generate its content.

The `deno doc` command can also be used locally to display documentation of a module's exports.

## Usage

`deno doc [options] [source-module] [symbol-path]` where `symbol-path` is a dot-separated path to the exported symbol we want to output, for example `MyServer.port`.

The additional options support by the `deno doc` command are:

- `--builtin <symbol-path>`: Display documentation for global symbols.
- `--json`: Output the documentation in a JSON format that's probably supported by Deno Doc.
- `--reload=[module-whitelist-patterns]`: (Re-)download remote modules. Option to specify one or more patterns for which remote modules to allow.

## Example

```powershell
# Local module
deno doc src/my_server.ts

# Remote module
deno doc https://deno.land/std/http/server.ts
```

Output of `deno doc https://deno.land/std/http/server.ts`:

![](./culuvjkntipklvz7uvog.png) *Inline docs for `std/http/server.ts`.*

Running `deno doc` without any arguments lists global variables and types as seen in the following excerpt.

![](./3nu1lb4yo8kdkuhmnd4p.png) *Excerpt of global variables and types shown when running `deno doc` without any arguments.*

Let's try to display the documentation for a couple of global symbols:

```powershell
PS C:\projects\sandbox\deno-cli-app> deno doc --builtin Deno.Listener
Defined in lib.deno.d.ts:1508:2

interface Listener extends AsyncIterable
    A generic network listener for stream-oriented protocols.

PS C:\projects\sandbox\deno-cli-app> deno doc --builtin atob
Defined in lib.deno.d.ts:2849:8

function atob(s: string): string
```

*Documentation of global symbols displayed by using the `deno doc --builtin <symbol-path>` command.*

# Evaluate JavaScript/TypeScript code {#evaluate-javascript-typescript-code}

The `deno eval` command is used to evaluate a string containing JavaScript or TypeScript code.

## Usage

`deno eval [options] "<code>"` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--inspect <host:port>`: Start a remote debugging server on the specified host and port.
- `--inspect-brk <host:port>`: Start a remote debugging server on the specified host and port. Break at the beginning of the specified code.
- `--no-check`: Skip type checking.
- `--print`: Output expression value.
- `--ts`: Enable TypeScript rather than JavaScript.
- `--v8-flags <v8-flags>`: Enable experimental and optional V8 features. Use `deno eval --v8-flags=--help "'';"` to list the feature flags available in the version of V8 bundled with your Deno exectuable.

> Careful! The specified code has **all permissions enabled**.

## Example

Let's add two numbers and display the result. First we use JavaScript.

```powershell
deno eval "const a = 2, b = '2'; const result = a + b; console.log(result);"
// Output:
// 22
```

*JavaScript evaluation with `deno eval`.*

2 + 2 is 22? Let's try that in TypeScript with the `--ts` option.

```powershell
deno eval --ts "const a = 2, b = '2'; const result: number = a + b; console.log(result);"
// Output:
// Check file:///C:/projects/sandbox/deno-cli-app/$deno$eval.ts
// error: TS2322 [ERROR]: Type 'string' is not assignable to type 'number'.
// const a = 2, b = '2'; const result: number = a + b; console.log(result);
//                             ~~~~~~
//     at file:///C:/projects/sandbox/deno-cli-app/$deno$eval.ts:1:29
```

*TypeScript evaluation with `deno eval --ts`.*

This time we get a static analysis error which prevents our code from being evaluated.

## Example using --print

The `--print` option will output the result of evaluating a single expression. The previous example ended with the `console.log(result);` statement, so we might as well just use the `--print` option.

However, we have to figure out how to turn the calculation into a single expression. We could inline it like this:

```powershell
deno eval --print "2 + '2'"
// Output:
// 22
```

*JavaScript evaluation with `deno eval --print`.*

This is not enough for more complex calculations though. Instead, let's rewrite the previous example by wrapping it in an IIFE (Immediately Invoked Function Expression) like so:

```powershell
deno eval --print "(() => { const a = 2, b = '2'; const result = a + b; return result; })();"
// Output:
// 22
```

*JavaScript evaluation with `deno eval --print` and an IIFE.*

# Format Deno modules {#format-deno-modules}

The `deno fmt` command formats modules in an opinionated style. The underlying tool is [the Rust-based `dprint`](https://dprint.dev/), but with no configuration options or plugins allowed.

## Usage

`deno fmt [options] [files-or-folders]` to format source modules.

- `--check`: Do a dry run to identify source modules with formatting errors, but do not automatically fix them.
- `--ignore=<denylist>`: Ignore source modules from formatting. Experimental feature.

## Example

When running the `deno fmt` command to automatically fix formatting errors, the affected files are displayed as seen in the following example.

```powershell
# Format all files in the `src` folder
deno fmt ./src
\\?\C:\projects\sandbox\deno-cli-app\src\hello_world.ts
Checked 4 files

# Format files
deno fmt ./src/hello_world.ts ./src/hello_deno.ts
\\?\C:\projects\sandbox\deno-cli-app\src\hello_world.ts
Checked 2 files
```

*Format files and folders with `deno fmt`.*

## Example with --check

The `--check` option performs a dry run that lists the number of files with formatting errors as well as all of the formatting errors, for example:

```powershell
PS C:\projects\sandbox\deno-cli-app> deno fmt --check ./src

from \\?\C:\projects\sandbox\deno-cli-app\src\hello_world.ts:
  7 | -
  8 | -             for await (const request of server) {
  7 | +  for await (const request of server) {

error: Found 1 not formatted file in 4 files
```

*Check source module formatting with `deno fmt --check`.*

# Display command usage and examples {#display-command-usage-and-examples}

Deno's built-in `deno help` command displays usage and examples for all commands or a single command.

## Usage

`deno help [command]`

## Example

```powershell
# Display all deno commands and environment variables.
deno help

# Display usage and examples for the run command
deno help run

# Display usage and examples for the help command
deno help help
```

*Example uses of the `deno help` command.*

The related `--help` option allows us to add help instructions to modules. To see an example, look at [the standard library's HTTP file server](https://deno.land/std/http/file_server.ts).

# Display metadata and dependency tree for Deno module {#display-metadata-and-dependency-tree-for-deno-module}

We can use the `deno info` command to get the path, type, path of compiled code, path of source map, and the dependency tree of a module.

## Usage

`deno info [options] [source-module]` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--importmap <file>`: Use specified import map for module resolution. See [Deno manual 4.4. Import maps](https://deno.land/manual/linking_to_external_code/import_maps). Experimental feature.
- `--json`: Output dependency report as JSON. Experimental feature.
- `--reload[=<module-refresh-allowlist>]`: Download and recompile all or the specified remote modules when bundling.

## Example

Let's see the metadata and the dependency tree of a Hello World HTTP server, by using this command:

```powershell
deno info ./src/hello_world.ts
```

First, the metadata is displayed.

```powershell
local: C:\projects\sandbox\deno-cli-app\src\hello_world.ts
type: TypeScript
```

*Metadata for the `hello_world.ts` module.*

Then the dependency tree is displayed. Every dependency, its dependency, and so on are listed, including remote dependencies.

```powershell
deps: 13 unique (total 74.09KB)
file:///C:/projects/sandbox/deno-cli-app/src/hello_world.ts (263B)
└─┬ https://deno.land/std/http/server.ts (10.23KB)
  ├── https://deno.land/std@0.73.0/encoding/utf8.ts (509B)
  ├─┬ https://deno.land/std@0.73.0/io/bufio.ts (21.23KB)
  │ ├── https://deno.land/std@0.73.0/bytes/mod.ts (4.34KB)
  │ └── https://deno.land/std@0.73.0/_util/assert.ts (405B)
  ├── https://deno.land/std@0.73.0/_util/assert.ts *
  ├─┬ https://deno.land/std@0.73.0/async/mod.ts (202B)
  │ ├── https://deno.land/std@0.73.0/async/deferred.ts (1.03KB)
  │ ├── https://deno.land/std@0.73.0/async/delay.ts (279B)
  │ ├─┬ https://deno.land/std@0.73.0/async/mux_async_iterator.ts (1.98KB)
  │ │ └── https://deno.land/std@0.73.0/async/deferred.ts *
  │ └── https://deno.land/std@0.73.0/async/pool.ts (1.58KB)
  └─┬ https://deno.land/std@0.73.0/http/_io.ts (11.33KB)
    ├── https://deno.land/std@0.73.0/io/bufio.ts *
    ├─┬ https://deno.land/std@0.73.0/textproto/mod.ts (4.59KB)
    │ ├── https://deno.land/std@0.73.0/io/bufio.ts *
    │ ├── https://deno.land/std@0.73.0/bytes/mod.ts *
    │ └── https://deno.land/std@0.73.0/encoding/utf8.ts *
    ├── https://deno.land/std@0.73.0/_util/assert.ts *
    ├── https://deno.land/std@0.73.0/encoding/utf8.ts *
    ├─┬ https://deno.land/std@0.73.0/http/server.ts (10.23KB)
    │ ├── https://deno.land/std@0.73.0/encoding/utf8.ts *
    │ ├── https://deno.land/std@0.73.0/io/bufio.ts *
    │ ├── https://deno.land/std@0.73.0/_util/assert.ts *
    │ ├── https://deno.land/std@0.73.0/async/mod.ts *
    │ └── https://deno.land/std@0.73.0/http/_io.ts *
    └── https://deno.land/std@0.73.0/http/http_status.ts (5.93KB)
```

*Dependency tree for the `hello_world.ts` module.*

## Example without source module

If we use `deno info` without specifying a module, we get Deno's metadata:

```powershell
# Display Deno's metadata
deno info

# Output on Windows
DENO_DIR location: "C:\\Users\\Lars\\AppData\\Local\\deno"
Remote modules cache: "C:\\Users\\Lars\\AppData\\Local\\deno\\deps"
TypeScript compiler cache: "C:\\Users\\Lars\\AppData\\Local\\deno\\gen"

# Output on Linux
DENO_DIR location: "/home/lars/.cache/deno"
Remote modules cache: "/home/lars/.cache/deno/deps"
TypeScript compiler cache: "/home/lars/.cache/deno/gen"
```

*Display metadata for Deno with the `deno info` command.*

## Example with --json option

```powershell
PS C:\projects\sandbox\deno-cli-app> deno info --unstable --json ./src/hello_world.ts
{
  "module": "file:///C:/projects/sandbox/deno-cli-app/src/hello_world.ts",
  "local": "C:\\projects\\sandbox\\deno-cli-app\\src\\hello_world.ts",
  "fileType": "TypeScript",
  "compiled": null,
  "map": null,
  "depCount": 13,
  "totalSize": 75865,
  "files": {
    "file:///C:/projects/sandbox/deno-cli-app/src/hello_world.ts": {
      "size": 263,
      "deps": [
        "https://deno.land/std/http/server.ts"
      ]
    },
    "https://deno.land/std/http/server.ts": {
      "size": 0,
      "deps": []
    },
    "https://deno.land/std@0.73.0/_util/assert.ts": {
      "size": 405,
      "deps": []
    },
    "https://deno.land/std@0.73.0/async/deferred.ts": {
      "size": 1058,
      "deps": []
    },
    "https://deno.land/std@0.73.0/async/delay.ts": {
      "size": 279,
      "deps": []
    },
    "https://deno.land/std@0.73.0/async/mod.ts": {
      "size": 202,
      "deps": [
        "https://deno.land/std@0.73.0/async/deferred.ts",
        "https://deno.land/std@0.73.0/async/delay.ts",
        "https://deno.land/std@0.73.0/async/mux_async_iterator.ts",
        "https://deno.land/std@0.73.0/async/pool.ts"
      ]
    },
    "https://deno.land/std@0.73.0/async/mux_async_iterator.ts": {
      "size": 2032,
      "deps": [
        "https://deno.land/std@0.73.0/async/deferred.ts"
      ]
    },
    "https://deno.land/std@0.73.0/async/pool.ts": {
      "size": 1614,
      "deps": []
    },
    "https://deno.land/std@0.73.0/bytes/mod.ts": {
      "size": 4448,
      "deps": []
    },
    "https://deno.land/std@0.73.0/encoding/utf8.ts": {
      "size": 509,
      "deps": []
    },
    "https://deno.land/std@0.73.0/http/_io.ts": {
      "size": 11597,
      "deps": [
        "https://deno.land/std@0.73.0/io/bufio.ts",
        "https://deno.land/std@0.73.0/textproto/mod.ts",
        "https://deno.land/std@0.73.0/_util/assert.ts",
        "https://deno.land/std@0.73.0/encoding/utf8.ts",
        "https://deno.land/std@0.73.0/http/server.ts",
        "https://deno.land/std@0.73.0/http/http_status.ts"
      ]
    },
    "https://deno.land/std@0.73.0/http/http_status.ts": {
      "size": 6072,
      "deps": []
    },
    "https://deno.land/std@0.73.0/http/server.ts": {
      "size": 10475,
      "deps": [
        "https://deno.land/std@0.73.0/encoding/utf8.ts",
        "https://deno.land/std@0.73.0/io/bufio.ts",
        "https://deno.land/std@0.73.0/_util/assert.ts",
        "https://deno.land/std@0.73.0/async/mod.ts",
        "https://deno.land/std@0.73.0/http/_io.ts"
      ]
    },
    "https://deno.land/std@0.73.0/io/bufio.ts": {
      "size": 21735,
      "deps": [
        "https://deno.land/std@0.73.0/bytes/mod.ts",
        "https://deno.land/std@0.73.0/_util/assert.ts"
      ]
    },
    "https://deno.land/std@0.73.0/textproto/mod.ts": {
      "size": 4701,
      "deps": [
        "https://deno.land/std@0.73.0/io/bufio.ts",
        "https://deno.land/std@0.73.0/bytes/mod.ts",
        "https://deno.land/std@0.73.0/encoding/utf8.ts"
      ]
    }
  }
}
```

*JSON dependency report for the `hello_world.ts` module.*

# Install Deno module as executable {#install-deno-module-as-executable}

Using the `deno install` command, we can install a Deno module as an executable.

## Usage

`deno install [options] <source-module>` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--config <tsconfig-file>`: Use the specified TypeScript configuration file (`tsconfig.json`) to compile the source module.
- `--force`: Overwrite existing installed executable without prompting.
- `--name`: The file name of the installed executable.
- `--no-check`: Skip type checking.
- `--root <folder-path>`: Installation folder of the executable. If unspecified, the path specified in the `DENO_INSTALL_ROOT` environment variable is used.

The `deno install` command also supports permission options such as `--allow-net`. The generated executable will include all the specified permission options.

## Example

We can install the Deno `xeval` line parsing utility, using this command:

```powershell
deno install --name xeval https://deno.land/std/examples/xeval.ts
```

*Install the Deno `xeval` utility.*

If the `<user-home-directory>/.deno/bin` directory is in your PATH variable, you will now be able to use it as the `xeval` command, for example:

```powershell
# Display name of current Git branch
git branch | xeval "if ($.startsWith('*')) console.log($.slice(2))"
```

*Example command using the Deno `xeval` utility.*

The generated executable is just a shell script with a `deno run` command, for example on Windows:

```powershell
% generated by deno install %
@deno.exe "run" "https://deno.land/std/examples/xeval.ts" %*
```

\_ `xeval` executable on Windows. \_

or on Linux:

```powershell
#!/bin/sh
# generated by deno install
deno "run" "https://deno.land/std/examples/xeval.ts" "$@"
```

\_ `xeval` executable on Linux. \_

As Deno caches remote modules, it will be available without internet access. Alternatively, we can produce a standalone executable by using the `deno bundle` command and creating a shell script ourselves.

# Linting Deno code {#linting-deno-code}

Deno version 1.1 introduced a built-in, experimental linter which we can use with the `deno lint` command.

> Note that as of Deno version 1.4, the linter must be run with the `--unstable` option.

## Usage

`deno lint --unstable [options] [source-modules]` where additional options are:

- `--ignore <source-modules>`: Exclude files from linting.
- `--json`: Output lint report as JSON.
- `--rules`: Lists the active lint rules.
- `-`: Lint input from `stdin`, for example `cat ./src/hello_world.ts | deno lint --unstable -`. Experimental feature.

Additionally, we're able to use the comment annotation to disable lint checking for all or certain rules:

- `// deno-lint-ignore [rules]`: Disable all or specific lint rules for the following line.
- `// deno-lint-ignore-file`: If located at the top of a file, disables all lint rules for the entire file.
- `// eslint-disable-next-line @typescript-eslint/no-explicit-any no-empty`: Deno CLI also supports ESLint ignore annotations.

## Example

Navigate to a folder with Deno source file and run the `deno lint --unstable` command.

```powershell
PS C:\projects\sandbox\deno-cli-app\src> deno lint --unstable
Checked 2 files
```

*Lint your code for potential errors with the `deno lint` command.*

Let's introduce a questionable change to our code:

```ts
import { serve } from 'https://deno.land/std/http/server.ts';

const server = serve(':8000');
const body = new TextEncoder().encode('Hello, World!\n');

async function main() {
  for await (var request of server) {
    // Replace const with var 👈
    request.respond({ body });
  }
}

main();
```

*Introducing a potential error in our code.*

Now we run the linter again.

```powershell
PS C:\projects\sandbox\deno-cli-app\src> deno lint --unstable
(no-inner-declarations) Move variable declaration to function root
  for await (var request of server) {
              ^^^^^^^^^^^
    at \\?\C:\projects\sandbox\deno-cli-app\src\hello_world.ts:7:13

Found 1 problem
Checked 2 files
```

*Human-readable lint report with 1 issue detected.*

## Example with --json

The `--json` option outputs the lint report in a JSON format which can potentially be passed to tooling.

```powershell
PS C:\projects\sandbox\deno-cli-app\src> deno lint --unstable --json
{
  "diagnostics": [
    {
      "range": {
        "start": {
          "line": 7,
          "col": 13
        },
        "end": {
          "line": 7,
          "col": 24
        }
      },
      "filename": "\\\\?\\C:\\projects\\sandbox\\deno-cli-app\\src\\hello_world.ts",
      "message": "Move variable declaration to function root",
      "code": "no-inner-declarations",
      "hint": null
    }
  ],
  "errors": []
}
```

*JSON lint report listing 1 issue.*

## Example with --rules

To list the active lint rules, we use the `--rules` option.

```powershell
PS C:\projects\sandbox\deno-cli-app\src> deno lint --unstable --rules
Available rules:
  - adjacent-overload-signatures
  - ban-ts-comment
  - ban-types
  - ban-untagged-ignore
  - constructor-super
  - for-direction
(...)
```

*A list of active lint rules.*

# Deno REPL (Read-eval-print loop) {#deno-repl-read-eval-print-loop-}

If you want to take Deno for a spin or do some ad hoc scripting, the REPL is what you're looking for.

## Usage

We can simply use the `deno` command or use the `deno repl` command with options to enable experimental Deno or V8 features.

`deno [options] [repl]` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--inspect <host:port>`: Start a remote debugging server on the specified host and port.
- `--inspect-brk <host:port>`: Start a remote debugging server on the specified host and port. Break at the beginning of the specified code.
- `--no-check`: Skip type checking.
- `--v8-flags <v8-flags>`: Enable experimental and optional V8 features. Use `deno repl --v8-flags=--help` to list the feature flags available in the version of V8 bundled with your Deno exectuable.

> Careful! The REPL has **all permissions enabled**.

## Example

After starting the REPL with the `deno repl` command, we can use `close()` to exit it.

```ts
# Start REPL
deno repl

# Output and prompt
Deno 1.4.4
exit using ctrl+d or close()
>

# Example output
> console.log('Hello, Deno!');
Hello, Deno!
undefined

# Exit REPL
> close();
```

*Start a Deno REPL with the `deno repl` command.*

# Run Deno module {#run-deno-module}

We can use the `deno run` command to compile and evaluate a local or remote module. After running it the first time, the module and all its dependencies will be cached by Deno so that we can run it offline.

All Deno permissions are off by default. We have to enable them with the permissions options such as `--allow-net` or enable them all by setting the `--allow-all` option (insecure, not recommended).

## Usage

`deno run [options] <source-module> [<arguments>]` where options are:

- `--cached-only`: Fail if remote modules are not cached.
- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--config <file>`: Use specified TypeScript configuration (`tsconfig.json` ) to compile the module and its dependencies.
- `--importmap <file>`: Use specified import map for module resolution. See [Deno manual 4.4. Import maps](https://deno.land/manual/linking_to_external_code/import_maps). Experimental feature.
- `--inspect <host:port>`: Start a remote debugging server on the specified host and port. Can't be used with the `--watch` option.
- `--inspect-brk <host:port>`: Start a remote debugging server on the specified host and port. Break at the beginning of the specified code. Can't be used with the `--watch` option.
- `--lock <file>`: Consult module hashes in the specified lockfile for caching purposes.
- `--lock-write`: Create/update the specified lockfile. Specify the lockfile with the `--lock` option.
- `--no-check`: Skip type checking.
- `--no-remote`: Disallow remote modules.
- `--reload=[module-whitelist-patterns]`: (Re-)download remote modules. Option to specify one or more patterns for which remote modules to allow.
- `--seed <number>`: Seed for `Math.random`.
- `--v8-flags <v8-flags>`: Enable experimental and optional V8 features. Use `deno run --v8-flags=--help <source_module>` to list the feature flags available in the version of V8 bundled with your Deno exectuable.
- `--watch`: Recompiles source modules and restarts the Deno process when source module changes are detected. Experimental feature. Can't be used with the `--inspect` or `--inspect-brk` options.

in addition to the permissions options such as `--allow-net`.

## Example

Run a local chat server from the standard library's example module. Enable network traffic to allow it to host the local server.

```ts
# Run local chat server
deno run --allow-net=:8080 https://deno.land/std/examples/chat/server.ts

# Output
chat server starting on :8080....

# Chat messages
msg:1 Hello, World!
msg:2 Hello, Deno!

# Chat users leaving
msg:1 { code: 1001, reason: "" }
msg:2 { code: 1001, reason: "" }
```

![](./vqa79v70h26i705v4hyp.png) *Local Deno chat server.*

# Deno test runner {#deno-test-runner}

Deno's built-in test runner drives the `Deno.test` framework.

## Usage

`deno test [options] [files]` where options are:

- `--cached-only`: Fail if remote modules are not cached.
- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--config <file>`: Use specified TypeScript configuration (`tsconfig.json` ) to compile the module and its dependencies.
- `--coverage`: Enable code coverage output. Experimental feature.
- `--importmap <file>`: Use specified import map for module resolution. See [Deno manual 4.4. Import maps](https://deno.land/manual/linking_to_external_code/import_maps). Experimental feature.
- `--inspect <host:port>`: Start a remote debugging server on the specified host and port.
- `--inspect-brk <host:port>`: Start a remote debugging server on the specified host and port. Break at the beginning of the specified code.
- `--failfast`: Stop test runner on first test failure.
- `--filter <filter>`: The specified filter selects which test cases to run based on their test name, for example `--filter serve`.
- `--lock <file>`: Consult module hashes in the specified lockfile for caching purposes.
- `--lock-write`: Create/update the specified lockfile. Specify the lockfile with the `--lock` option.
- `--no-check`: Skip type checking.
- `--no-remote`: Disallow remote modules.
- `--reload=[module-whitelist-patterns]`: (Re-)download remote modules. Option to specify one or more patterns for which remote modules to allow.
- `--seed <number>`: Seed for `Math.random`.
- `--v8-flags <v8-flags>`: Enable experimental and optional V8 features. Use `deno test --v8-flags=--help` to list the feature flags available in the version of V8 bundled with your Deno exectuable.

in addition to the permissions options such as `--allow-read`.

## Example

We have this test suite:

```ts
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Deno.test('hello assert', () => {
  const x = 1 + 2;

  assertEquals(x, 3);
});

Deno.test('hello throws', () => {
  const x = 1 + 2;

  if (x !== 3) {
    throw Error('x should be equal to 3');
  }
});
```

*Example test suite.*

When we run `deno test`, we get the following output:

```ts
PS C:\projects\sandbox\deno-cli-app> deno test
Compile file:///C:/projects/sandbox/deno-cli-app/src/hello_test.ts
running 2 tests
test hello assert ... ok (2ms)
test hello throws ... ok (1ms)

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (27ms)
```

*Example test run.*

Let's target the `hello assert` test case with the `--filter assert` option:

```powershell
PS C:\projects\sandbox\deno-cli-app> deno test --filter assert
Compile file:///C:/projects/sandbox/deno-cli-app/.deno.test.ts
running 1 tests
test hello assert ... ok (3ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 1 filtered out (3ms)
```

## Example with --coverage

We have a `math.ts` module:

```ts
export function add(left: number, right: number): number {
  return left + right;
}

export function divide(left: number, right: number): number {
  if (right === 0) {
    throw new Error('You should not divide by zero.');
  }

  return left / right;
}

export function multiply(left: number, right: number): number {
  return left * right;
}

export function subtract(left: number, right: number): number {
  return left - right;
}
```

*Deno module with math operators.*

When we have the following `math_test.ts` test suite:

```ts
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import { add, divide, subtract } from './math.ts';

Deno.test('add', () => {
  const expected = 1 + 2;

  const actual = add(1, 2);

  assertEquals(actual, expected);
});

Deno.test('divide', () => {
  const expected = 5 / 2;

  const actual = divide(5, 2);

  assertEquals(actual, expected);
});

Deno.test('subtract', () => {
  const expected = 6 - 3;

  const actual = subtract(6, 3);

  assertEquals(actual, expected);
});
```

*Deno test suite for the module with math operators.*

We get this output:

```powershell
PS C:\projects\sandbox\deno-cli-app> deno test --unstable --coverage ./src/math_test.ts
Check file:///C:/projects/sandbox/deno-cli-app/$deno$test.ts
running 3 tests
test add ... ok (4ms)
test divide ... ok (1ms)
test subtract ... ok (0ms)

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (6ms)

cover file:///C:/projects/sandbox/deno-cli-app/src/math.ts ... 68.750% (11/16)
    6 |         throw new Error("You should not divide by zero.");
    7 |     }
  10 | export function multiply(left, right) {
  11 |     return left * right;
  12 | }
```

*Test report for the math module with code coverage.*

Deno type declarations

The `deno types` command give us the type declarations of the active Deno executable.

## Usage

`deno types [options]` only supports the common options.

## Example

`deno types > lib.deno.d.ts` writes the current Deno type declarations to the `lib.deno.d.ts` file.

# Upgrade Deno executable {#upgrade-deno-executable}

The `deno upgrade` commands is used to upgrade the Deno executable to the latest version or a specific version.

## Usage

`deno upgrade [options]` where additional options are:

- `--cert <file>`: Use specified HTTPS certificate for resolving remote modules.
- `--dry-run`: Check for the specified version, download files, unzip them and verify them, but don't replace the current Deno executable.
- `--output <file>`: Install the specified or latest Deno version to a local file.
- `--version <version-number>`: Specify the version of Deno to upgrade or downgrade to, for example `--version 1.4.3`.

## Example

Use `deno upgrade` to upgrade to the latest version.

```powershell
PS C:\projects\sandbox\deno-cli-app> deno --version
deno 1.2.0
v8 8.5.216
typescript 3.9.2

PS C:\projects\sandbox\deno-cli-app> deno upgrade
Checking for latest version
downloading https://github.com/denoland/deno/releases/download/v1.4.4/deno-x86_64-pc-windows-msvc.zip
Version has been found
Deno is upgrading to version 1.4.4
downloading https://github-production-release-asset-2e65be.s3.amazonaws.com/133442384/8840da80-057b-11eb-8ffb-0f7c030a844f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20201003%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201003T214219Z&X-Amz-Expires=300&X-Amz-Signature=8af910cb8fc97491e833159b4ac5a7c1c4dc974c49e5082421df688be8015001&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=133442384&response-content-disposition=attachment%3B%20filename%3Ddeno-x86_64-pc-windows-msvc.zip&response-content-type=application%2Foctet-stream
Version has been found
Deno is upgrading to version 1.4.4
Upgrade done successfully

PS C:\projects\sandbox\deno-cli-app> deno --version
deno 1.4.4
v8 8.7.75
typescript 4.0.3
```

*Example upgrade process from Deno version 1.2.0 to 1.4.4 using `deno upgrade`.*

Use `deno upgrade --dry-run --version 1.5.0` to check whether version 1.5.0 is available.

```powershell
PS C:\projects\sandbox\deno-cli-app> deno upgrade --dry-run --version 1.5.0
downloading https://github.com/denoland/deno/releases/download/v1.5.0/deno-x86_64-pc-windows-msvc.zip
Version has not been found, aborting
```

*Check for a specific Deno version by using the `--dry-run` and `--version` options for the `deno upgrade` command.*

# Deno environment variables

The Deno CLI looks up specific environment variables when running its commands.

- `DENO_DIR`: The root directory for Deno artifacts. Defaults to `<user-profile-directory>/.deno`.
- `DENO_INSTALL_ROOT`: Install directory for the Deno executable and installed Deno modules. Defaults to `<user-profile-directory>/.deno/bin`.
- `NO_COLOR`: Set this flag to disable console colors.
- `HTTP_PROXY`: Address of proxy server for HTTP requests, both for downloading remote modules and executing `fetch` commands in modules.
- `HTTPS_PROXY`: Address of proxy server for HTTPS requests, both for downloading remote modules and executing `fetch` commands in modules.
