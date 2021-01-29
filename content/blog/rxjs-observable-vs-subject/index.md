---
{
    title: "Observable vs. Subject vs. BehaviorSubject vs. ReplaySubject",
    description: "",
    published: '2021-10-13T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['rxjs', 'javascript'],
    attached: [],
    license: 'cc-by-4'
}
---





# Observables



Take the following example:

```javascript
import { fromEvent } from "rxjs";
import { take } from "rxjs/operators";

// Create button and inject it into the `#app` div
const appDiv = document.getElementById("app");
const button = document.createElement("button");
button.innerText = "Click me!";
appDiv.appendChild(button);

// Create an observable stream from `button`'s `click` events
const click$ = fromEvent(button, "click");

click$
  // Add cleanup pipe after 3 events emitted
  .pipe(take(3))
	// Subscribe to these changes
  .subscribe(e => {
  	console.log("Button was clicked");
	});
```



https://stackblitz.com/edit/rxjs-observable-only-demo?file=package.json



In this example, you have an event stream that is listening for 3 different click listeners



However, if you wanted to add other events to this event stream (`click$`), you would be unable to. This is because `click$` is an Observable, which emits events, but does not allow you to pass events into the stream yourself.



# Subjects


Subjects are the next logical conclusion to the Observable pattern. They allow you to emit events into an event stream and subscribe to those changes as well