---
{
	title: "React Internals: Understanding the Reconciler",
	description: "",
	published: '2023-05-05T13:45:00.284Z',
	authors: ['crutchcorn'],
	tags: ['react'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

React 18.2.0 source code: https://github.com/facebook/react/tree/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e

**Only focusing on React DOM code**



````jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
````



- `createRoot`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L166
  - `createContainer`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L224-L233
    - https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberReconciler.new.js#L247-L271
    - `createFiberRoot`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberRoot.new.js#L134
    - `new FiberRootNode`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberRoot.new.js#L52-L132
  - `new ReactDOMRoot`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L242
    - https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L88-L90

- `render`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L92
  - `updateContainer`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-dom/src/client/ReactDOMRoot.js#L134
- `updateContainer`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberReconciler.new.js#L321
  - `createUpdate`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberReconciler.new.js#L362-L365
    - Assigns `element` to be rendered in update context
  - `enqueUpdate`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberReconciler.new.js#L381
    - `enqueueConcurrentClassUpdate`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberClassUpdateQueue.new.js#L264
    - https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberConcurrentUpdates.old.js#L120-L124 (why `.old`?)
  - ` scheduleUpdateOnFiber`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L533
  - ` ensureRootIsScheduled`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L640
  - `newCallbackNode`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L817-L820
  - `scheduleCallback`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L47
  - `Schedule.`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/react-reconciler/src/Scheduler.js#L16
  - `scheduler` package: https://github.com/facebook/react/tree/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler
- `unstable_scheduleCallback`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L308
  - `requestHostTimeout`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L370
  - `callback` (which is `handleTimeout`): https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L592
  - `handleTimeout`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L130
  - `flushWork`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L137
  - `workLoop`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L176
  - `while (currentTask !== null)`: https://github.com/facebook/react/blob/9e3b772b8cabbd8cadc7522ebe3dde3279e79d9e/packages/scheduler/src/forks/Scheduler.js#L193-L196

