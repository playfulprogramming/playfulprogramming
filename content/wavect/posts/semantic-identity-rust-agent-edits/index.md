---
{
  title: "Why Agent Edits Need Semantic Identity: Building SEMAPRAX in Rust",
  description: "How SEMAPRAX uses Rust types, stable declaration IDs, checked HIR, deterministic graphs, and replayable evidence to constrain coding-agent edits.",
  published: "2026-08-23",
  tags: ["rust", "ai", "tools"],
  license: "cc-by-nc-nd-4",
  originalLink: "https://wavect.io/blog/semantic-identity-rust-agent-edits/",
  coverImg: "./cover.png",
  socialImg: "./cover.png"
}
---

This article was originally written by Kevin Riedl for Wavect GmbH and first
published on the [Wavect engineering blog](https://wavect.io/blog/semantic-identity-rust-agent-edits/).

**A coding agent should edit a declaration by identity and expected meaning,
not by a line number that may already be stale.** In
[SEMAPRAX](https://wavect.io/semaprax/), persistent declaration IDs survive
ordinary source movement, checked HIR centralizes resolved meaning, and
revision-bound patches fail closed when their source snapshot changes. Rust
makes these distinctions explicit in the compiler's types.

This article explains that design as implemented in the pre-alpha research
compiler. It is useful even if you never adopt the language: the same
boundaries apply to refactoring engines, compiler services, and agent tools
that must turn an intention into a reviewable change.

## Why are line and byte offsets poor agent edit targets?

A text edit usually says "replace bytes 418 to 463." That address describes
one file snapshot, not the program entity the agent meant. A formatter,
comment, or concurrent edit can move it. A name is better, but overloads,
scopes, and renames make names contextual too.

The SEMAPRAX language contract therefore makes human-readable `.spx` source
the canonical Git projection while exposing a versioned semantic graph as the
preferred agent interface. Public declarations carry persistent `@id`
identities. Expression identities remain revision-scoped because preserving
every transient syntax node across arbitrary rewrites would imply a stronger
identity guarantee than the compiler can honestly provide. The distinction is
part of the
[SEMAPRAX language and compiler contract](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/docs/RFC-0001.md).

## How does Rust encode the identity boundary?

The HIR does not pass raw strings everywhere. It defines separate newtypes for
declarations and expressions:

```rust
pub struct DeclarationId(String);
pub struct ExpressionId(String);

pub struct ResolvedFunction {
    pub id: DeclarationId,
    // checked signature, body, and effects
}
```

This shortened example reflects the types in
[`src/hir.rs` at the audited revision](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/src/hir.rs).
The benefit is mundane and important: a function that expects a persistent
declaration target cannot accidentally receive an expression address. The
compiler must perform an explicit conversion or reject the operation.

The same module stores declaration indexes in `BTreeMap` and relation sets in
`BTreeSet`. Ordered collections are not sufficient for determinism, but they
remove one common source of output drift: randomized hash iteration. Semantic
order still has to be preserved where order affects execution.

## Why resolve once into checked HIR?

If a graph exporter, native backend, and Wasm backend each reconstruct meaning
from syntax, they can disagree about types, ownership, or call targets.
SEMAPRAX resolves and verifies first, then downstream projections consume the
checked representation. The published
[architecture and trust-boundary document](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/docs/ARCHITECTURE.md)
describes this pipeline and separates implemented lanes from future authority.

That gives an agent a useful chain of custody:

1. Parse human-readable source.
2. Resolve names and persistent identities into HIR.
3. Verify types, effects, ownership rules, and contracts admitted by the
   current language subset.
4. Project deterministic graph JSON or target artifacts from checked
   semantics.
5. Bind proposed changes to the source revision and expected semantic target.

The graph is therefore a compiler projection, not a second source of truth.
Git still reviews source. The agent gains structured context without asking
humans to review an opaque database.

## What makes a semantic graph deterministic?

Determinism is a whole-pipeline property. Stable node identifiers do not help
if edge order changes between runs or diagnostics depend on hash iteration.
SEMAPRAX uses ordered indexes, explicit serialization, bounded traversal, and
canonical output rules in its
[Rust graph projection](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/src/graph.rs).

There is also a subtle prohibition: never "fix" execution vectors by sorting
them for prettier JSON. Evaluation and cleanup order are semantic. Canonical
sorting belongs only on mathematically unordered sets. Sequence-bearing data
must retain the compiler-defined order.

## How can evidence constrain an agent patch?

A serialized evidence capsule should describe why a patch is admissible, but
possession of that capsule must not grant write authority. SEMAPRAX separates
proof data from the component that owns the commit. Its patch route acquires
the normal lock, independently replays the exact bounded evidence, checks the
current source snapshot, and only then stages and commits the candidate. The
[patch-evidence implementation](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/src/patch_evidence.rs)
keeps replay and application visibly separate.

This design addresses three distinct failures:

- **Stale intent:** the patch was valid for an older source revision.
- **Wrong target:** the text still matches, but it now refers to a different
  declaration.
- **Forged confidence:** a caller presents a plausible report without
  reproducing the checks.

Independent replay does not prove that a requested feature is wise. It proves
a narrower and testable statement: this bounded proposal still satisfies the
compiler checks to which its evidence is bound.

## What should Rust compiler and agent-tool authors copy?

1. **Use domain newtypes.** Separate persistent entity IDs, revision-local
   node IDs, digests, and capabilities at the type level.
2. **Keep one checked semantic core.** Make graph views and backends consume
   resolved meaning instead of reparsing names independently.
3. **Design determinism deliberately.** Specify ordering, serialization,
   diagnostics, and failure behavior, then test repeat runs byte for byte.
4. **Bind edits to snapshots.** A semantic target without a source digest is
   still vulnerable to drift.
5. **Keep evidence powerless.** Replay evidence inside the authority boundary
   before staging any change.
6. **Publish the limits.** A completion matrix is more useful than a broad
   "implemented" label when different compiler lanes have different evidence.

SEMAPRAX follows the last rule with an evidence-gated
[completion matrix](https://github.com/wavect/semaprax/blob/ca339feffcadf77a679abe2f159376287cf2e22c/docs/COMPLETION-MATRIX.md).
It prevents a passing unit test for one projection from becoming a claim about
every target or runtime.

## What does SEMAPRAX not prove yet?

SEMAPRAX v0.2 is experimental pre-alpha research. Its current repository
documents bounded native C11/Clang and WebAssembly Core lanes, deterministic
semantic tooling, and a growing verified subset. It does not claim production
readiness, complete memory safety, all operating systems, a complete ownership
system, full ecosystem interoperability, a public Component Model runtime, or
live economic authority.

The practical way to evaluate it is to inspect the source and dated evidence,
not extrapolate from the project goal. Start with the
[SEMAPRAX architecture overview](https://wavect.io/semaprax/architecture/),
then compare the public claims with the pinned compiler revision below.

## How can you reproduce this walkthrough?

```text
git clone https://github.com/wavect/semaprax.git
cd semaprax
git checkout ca339feffcadf77a679abe2f159376287cf2e22c
cargo run -- graph examples/hello.spx
```

The command inspects the graph projection at the exact revision used for this
article. Run the repository's documented quality gates before treating any
local modification as evidence.

Reliable agent editing starts by naming the thing that should change, the
revision in which it exists, and the checks that must still hold. Rust can
encode those distinctions directly: persistent declaration identity is not an
expression address, checked HIR is not raw syntax, and evidence is not
authority.

SEMAPRAX is an experimental implementation of that boundary. Its useful lesson
today is smaller than its long-term language goal: give agents semantic
handles, make every projection deterministic, and fail closed when meaning or
source state has moved.

_Editorial disclosure: OpenAI Codex assisted with drafting and translation.
The technical claims and code references were checked against SEMAPRAX commit
`ca339fe` by Wavect. The article contains no performance or safety claim
inferred from model output._
