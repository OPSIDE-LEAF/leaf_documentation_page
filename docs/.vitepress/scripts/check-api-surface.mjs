import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const docsRoot = resolve(scriptDirectory, '..', '..')
const docsRepository = resolve(docsRoot, '..')
const configuredSourceRoot = process.env.LEAF_SOURCE_ROOT
if (!configuredSourceRoot) {
  console.error('LEAF_SOURCE_ROOT must point to the directory that contains the LEAF source repositories.')
  process.exit(1)
}
const workspace = resolve(configuredSourceRoot)
const failures = []

function read(path) {
  if (!existsSync(path)) {
    failures.push(`Missing source used by the documentation matrix: ${path}`)
    return ''
  }
  return readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
}

function verify(label, path, fragments) {
  const content = read(path)
  for (const fragment of fragments) {
    if (!content.includes(fragment)) {
      failures.push(`${label} is missing ${JSON.stringify(fragment)} in ${path}`)
    }
  }
}

function bothLocales(relativePath, fragments) {
  for (const locale of ['es', 'en']) {
    verify(`${locale}/${relativePath}`, resolve(docsRoot, locale, relativePath), fragments)
  }
}

const source = (...parts) => resolve(workspace, ...parts)

verify('Action source', source('leaf-contracts', 'src/commonMain/kotlin/com/ops/leaf_core/api/Action.kt'), [
  'interface Action<Input, Output>',
  'suspend fun execute(input: Input): Output',
])
bothLocales('api/contracts.md', [
  'interface Action<Input, Output>',
  'suspend fun execute(input: Input): Output',
  'interface Workflow<in Input, State, Event, Effect, out Output>',
  'suspend fun handle(effect: Effect): Event',
])

verify('Workflow source', source('leaf-contracts', 'src/commonMain/kotlin/com/ops/leaf_core/api/Workflow.kt'), [
  'val eventBufferCapacity: Int',
  'fun initialize(input: Input): WorkflowStep<State, Effect, Output>',
  'fun reduce(state: State, event: Event): WorkflowStep<State, Effect, Output>',
])
verify('Effect handler source', source('leaf-contracts', 'src/commonMain/kotlin/com/ops/leaf_core/api/EffectHandler.kt'), [
  'fun interface EffectHandler<Effect, Event>',
  'suspend fun handle(effect: Effect): Event',
])

verify('Core Action entry point', source('leaf-core', 'leaf-core/src/commonMain/kotlin/com/ops/leaf_core/api/Leaf.kt'), [
  'suspend fun <Input, Output> run(',
  'telemetry: LeafTelemetry = LeafTelemetry.None',
])
verify('Core Workflow entry point', source('leaf-core', 'leaf-core/src/commonMain/kotlin/com/ops/leaf_core/api/LeafWorkflow.kt'), [
  'suspend fun <Input, State, Event, Effect, Output> Leaf.Companion.open(',
  'checkNotNull(ownerContext[Job])',
])
verify('Core Workflow session', source('leaf-core', 'leaf-core/src/commonMain/kotlin/com/ops/leaf_core/api/WorkflowSession.kt'), [
  'val states: Flow<State>',
  'fun send(event: Event): WorkflowSendResult',
  'suspend fun awaitOutcome(): WorkflowOutcome<Output>',
  'fun cancel()',
])
bothLocales('api/core.md', [
  'suspend fun <Input, Output> run(',
  'suspend fun <Input, State, Event, Effect, Output> Leaf.Companion.open(',
  'fun send(event: Event): WorkflowSendResult',
  'suspend fun awaitOutcome(): WorkflowOutcome<Output>',
])

verify('Compose Workflow entry point', source('leaf-compose', 'src/commonMain/kotlin/com/ops/leaf_core/ui/compose/WorkflowRemember.kt'), [
  'fun <Input, State, Event, Effect, Output> Leaf.Companion.rememberLeafWorkflowHolder(',
  'sessionKey: Any? = input',
])
verify('Compose Workflow holder', source('leaf-compose', 'src/commonMain/kotlin/com/ops/leaf_core/ui/compose/WorkflowHolder.kt'), [
  'val snapshot: ComposeState<WorkflowSnapshot<State>>',
  'val outcome: ComposeState<WorkflowOutcome<Output>?>',
  'fun send(event: Event): WorkflowSendResult',
])
bothLocales('api/compose.md', [
  'import androidx.compose.runtime.State as ComposeState',
  'import com.ops.leaf_core.ui.compose.WorkflowSnapshot',
  'val snapshot: ComposeState<WorkflowSnapshot<WorkflowState>>',
])

verify('Visuals source', source('leaf-visuals', 'src/commonMain/kotlin/com/opside/leaf/visuals/ThingsLeafVisuals.kt'), [
  'public fun thingsLeafVisuals(): LeafVisuals',
  'public fun ThingsLeafTheme(',
])
bothLocales('api/visuals.md', [
  'import com.opside.leaf.visuals.ThingsLeafTheme',
  'import com.opside.leaf.visuals.thingsLeafVisuals',
])
bothLocales('guide/visuals-reference.md', [
  'ThingsLeafTheme {',
  'thingsLeafVisuals()',
])

verify('Authentication source', source('leaf-modules', 'leaf_authentication/src/commonMain/kotlin/com/ops/leaf_authentication/AuthenticationModule.kt'), [
  'class AuthenticationModule(',
  'refreshCoordinator: SessionRefreshCoordinator = SessionRefreshCoordinator()',
  'val signIn: Action<SignInRequest, SignInOutcome>',
  'val continueChallenge: Action<ContinueAuthChallengeRequest, SignInOutcome>',
  'val restoreSession: Action<RestoreSessionRequest, RestoreSessionOutcome>',
  'val signOut: Action<SignOutRequest, SignOutOutcome>',
])
bothLocales('api/authentication.md', [
  'refreshCoordinator: SessionRefreshCoordinator = SessionRefreshCoordinator(),',
  'val signIn: Action<SignInRequest, SignInOutcome>',
  'val continueChallenge: Action<ContinueAuthChallengeRequest, SignInOutcome>',
  'val restoreSession: Action<RestoreSessionRequest, RestoreSessionOutcome>',
  'val signOut: Action<SignOutRequest, SignOutOutcome>',
])

verify('Login module source', source('leaf-modules', 'leaf-login', 'src/commonMain/kotlin/com/opside/leaf/login/LoginModule.kt'), [
  'class LoginModule(',
  'val login = feature<LoginInput, LoginState, LoginEvent, LoginResult>(',
  'const val VERSION = "3.0.1"',
])
verify('Login route source', source('leaf-modules', 'leaf-login', 'src/commonMain/kotlin/com/opside/leaf/login/ui/LoginRoute.kt'), [
  'fun LoginRoute(',
  'onAuthenticated: (LoginResult.Authenticated) -> Unit,',
])
verify('Login Workflow source', source('leaf-modules', 'leaf-login', 'src/commonMain/kotlin/com/opside/leaf/login/LoginWorkflow.kt'), [
  'sealed interface LoginWorkflowOutput',
  'fun LoginModule.createLoginWorkflow(',
])
verify('Login Workflow UI source', source('leaf-modules', 'leaf-login', 'src/commonMain/kotlin/com/opside/leaf/login/ui/workflow/LoginWorkflowScreen.kt'), [
  'fun LoginWorkflowScreen(',
])
bothLocales('api/login.md', [
  'com.opside-leaf:leaf-login:3.0.1',
  'LoginModule',
  'AuthGateway',
  'LoginRoute',
  'createLoginWorkflow',
  'LoginWorkflowScreen',
  'LEAF Contracts/Core/Compose 3.0.0',
  'leaf-visuals 1.3.0',
])

verify('Payment contracts source', source('leaf-modules', 'leaf-payment-contracts', 'src/commonMain/kotlin/com/ops/leaf_payment_contracts/PaymentContracts.kt'), [
  'class Money private constructor(',
  'fun of(minorUnits: Long, currency: String): Money',
  'value class OrderId private constructor',
  'value class PaymentOperationId private constructor',
])
bothLocales('api/payment-contracts.md', [
  'import com.ops.leaf_payment_contracts.Money',
  'import com.ops.leaf_payment_contracts.OrderId',
  'import com.ops.leaf_payment_contracts.PaymentOperationId',
  'Money.of(minorUnits = 1_250, currency = "MXN")',
])
bothLocales('api/payments.md', [
  '0.3.0',
  'CheckoutEvent',
  'CheckoutOutput',
  'CheckoutPaymentResult',
])

bothLocales('guide/maven-local.md', [
  'publishToMavenLocal',
  'mavenLocal()',
])

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('API surface matrix OK: public documentation matches the checked LEAF sources.')
