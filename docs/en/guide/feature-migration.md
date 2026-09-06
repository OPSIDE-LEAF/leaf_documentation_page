# Migrating Feature from LEAF 2.0.1 to 3.0.0

LEAF 3 changes Feature's public vocabulary so that transitions and successful terminal results use the same concepts. This is a source-breaking change: the LEAF 2 names have no aliases in `3.0.0`.

| Historical LEAF 2.0.1 | LEAF 3.0.0 | Meaning |
|---|---|---|
| `FeatureTransition.Stay` | `FeatureTransition.Continue` | Publishes state and keeps the session open. |
| `FeatureTransition.Finish` | `FeatureTransition.Complete` | Completes the session with an output. |
| `stay(state)` | `continueFeature(state)` | Helper that continues. |
| `finish(output)` | `completeFeature(output)` | Helper that completes. |
| `FeatureSessionResult.Finished` | `FeatureSessionResult.Completed` | Successful terminal result. |
| `FeatureSessionTerminalCause.FINISHED` | `FeatureSessionTerminalCause.COMPLETED` | Payload-free terminal cause. |

`Action`, `Feature`, `FeatureSession`, `Leaf.run`, `Leaf.open`, and `Leaf.rememberLeaf` keep their roles. The public Kotlin packages remain `com.ops.leaf_core.api` and `com.ops.leaf_core.ui.compose` in `3.0.0`.

## Historical LEAF 2.0.1 API

This block deliberately documents the previous line. Use it to identify code that has not been migrated yet; it does not compile against Contracts `3.0.0`.

```kotlin
// LEAF 2.0.1 — historical
when (event) {
    CounterEvent.Increment -> stay(state + 1)
    CounterEvent.Done -> finish(CounterResult.FinalCount(state))
}

if (result is FeatureSessionResult.Finished) {
    use(result.output)
}
```

## Equivalent code in LEAF 3.0.0

```kotlin
// LEAF 3.0.0
when (event) {
    CounterEvent.Increment -> continueFeature(state + 1)
    CounterEvent.Done -> completeFeature(CounterResult.FinalCount(state))
}

if (result is FeatureSessionResult.Completed) {
    use(result.output)
}
```

Update imports, type assertions (`assertIs`), and metrics comparisons too. A useful search, limited to active code, is:

```shell
rg "FeatureTransition\\.(Stay|Finish)|FeatureSessionResult\\.Finished|FeatureSessionTerminalCause\\.FINISHED|\\bstay\\(|\\bfinish\\(" src consumer samples
```

Exclude documentation explicitly marked as historical LEAF 2.0.1 and immutable evidence: those occurrences are intentional.

## Feature and Workflow are separate contracts

You do not need to turn a `Feature` into a `Workflow` to migrate to LEAF 3. Use `Workflow` when the runtime must own suspending effects that return as events. Renaming Feature does not change its suspending reducer or terminal overflow policy.

Workflow remains an [experimental preview](/en/guide/workflow) and requires opt-in even within the `3.0.0` train.
