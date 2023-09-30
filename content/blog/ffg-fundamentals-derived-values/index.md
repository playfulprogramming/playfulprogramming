---
{
    title: "Derived Values",
    description: "Often in application development, you'll want to base one variable's value off of another. There are a few ways of doing this - some easier than others.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 5,
    collection: "The Framework Field Guide - Fundamentals"
}
---

We've touched on before how to pass values to a component as properties earlier in the book:

<!-- tabs:start -->

# React

```jsx
const FileDate = ({ inputDate }) => {
  const [dateStr, setDateStr] = useState(formatDate(inputDate));
  const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};
```

# Angular

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  standalone: true,
  template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnInit {
  @Input() inputDate: Date;

  dateStr = this.formatDate(this.inputDate);
  labelText = this.formatReadableDate(this.inputDate);

  // ...
}
```

# Vue

```vue
<!-- FileDate.vue -->
<template>
  <span :aria-label="labelText">{{dateStr}}</span>
</template>

<script setup>
// ...

const props = defineProps(['inputDate'])

const dateStr = ref(formatDate(props.inputDate))
const labelText = ref(formatReadableDate(props.inputDate))

// ...
</script>
```

<!-- tabs:end -->

You may notice that we're deriving two values from the same property. This works fine at first but an issue arises with how we're doing things when we realize that our `formatDate` and `formatReadableDate` methods are only running once during the initial render.

Because of this, if we pass in an updated `inputDate` to the `FileDate` component, the values of `formatDate` and `formatReadableDate` will become out of sync from the parent's passed `inputDate`.

<!-- tabs:start -->

# React

```jsx
const File = () => {
    const [inputDate, setInputDate] = useState(new Date());

    useEffect(() => {
        // Check if it's a new day every 10 minutes
        const timeout = setTimeout(() => {
            const newDate = new Date();
            if (inputDate.getDate() === newDate.getDate()) return;
            setInputDate(newDate);
        }, 10 * 60 * 1000);
        
        return () => clearTimeout(timeout);
    }, [inputDate]);

    // This may not show the most up-to-date `formatDate` or `formatReadableDate`
    return <FileDate inputDate={inputDate}/>
}
```

# Angular

```typescript
@Component({
  selector: "file-item",
  standalone: true,
  imports: [FileDateComponent],
  // This may not show the most up-to-date `formatDate` or `formatReadableDate`
  template: `<file-date [inputDate]="inputDate"></file-date>`,
})
export class FileComponent implements OnInit, OnDestroy {
    inputDate = new Date();
	interval: number = null;

    ngOnInit() {
        // Check if it's a new day every 10 minutes
        this.interval = setInterval(() => {
            const newDate = new Date();
            if (this.inputDate.getDate() === newDate.getDate()) return;
            this.inputDate = newDate;
        }, 10 * 60 * 1000) as any;
    }
    
    ngOnDestroy() {
		  clearInterval(this.interval as any);        
    }
}
```

# Vue

```vue
<!-- File.vue -->
<template>
  <!-- ... -->
  <!-- This may not show the most up-to-date `formatDate` or `formatReadableDate` -->
  <file-date v-if="isFolder" [inputDate]="inputDate"></file-date>
  <!-- ... -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const inputDate = ref(new Date())
const interval = ref(null)

onMounted(() => {
  interval.value = setInterval(() => {
    const newDate = new Date()
    if (inputDate.value.getDate() === newDate.getDate()) return
    inputDate.value = newDate
  }, 10 * 60 * 1000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>
```

<!-- tabs:end -->

While the above `File` component updates `inputDate` correctly, our `FileDate` component is never listening for the changed input value and, as such, never recomputed the `formatDate` or `formatReadableDate` value to display to the user.

How can we fix this?

# Method 1: Prop listening

The first - and arguably easiest to mentally model - method to solve this disparity between prop value and display value is to simply listen for when a property's value has been updated and re-calculate the display value.

Luckily, we can use [our existing knowledge of side effects](/posts/ffg-fundamentals-side-effects) to do so:

<!-- tabs:start -->

## React

```jsx {4-8}
const FileDate = ({ inputDate }) => {
  const [dateStr, setDateStr] = useState(formatDate(inputDate));
  const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

  useEffect(() => {
      setDateStr(formatDate(inputDate));
      setLabelText(formatReadableDate(inputDate));
  // Every time `inputDate` changes, it'll trigger a render and therefore call the `useEffect`
  }, [inputDate])
    
  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};
```

## Angular

While we didn't touch on this lifecycle method in our previous chapter, Angular has a lifecycle method specifically for when a component's props change: `ngOnChanges`.

We can use this new lifecycle method to update the value of a component's state based off of the parent's props:

```typescript
import { Component, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnChanges {
  @Input() inputDate: Date;

  dateStr = this.formatDate(this.inputDate);
  labelText = this.formatReadableDate(this.inputDate);

  ngOnChanges(changes: SimpleChanges) {
    /**
     * ngOnChanges runs for EVERY prop change. As such, we can
     * restrict the recalculation to only when `inputDate` changes
     */
    if (changes.inputDate) {
      this.dateStr = this.formatDate(this.inputDate);
      this.labelText = this.formatReadableDate(this.inputDate);      
    }
  }
    
  // ...
}
```

## Vue

```vue
<!-- FileDate.vue -->
<template>
  <span :aria-label="labelText">{{ dateStr }}</span>
</template>

<script setup>
import {ref, watch} from 'vue';

// ...

const props = defineProps(['inputDate'])

const dateStr = ref(formatDate(props.inputDate))
const labelText = ref(formatReadableDate(props.inputDate))

watch(() => props.inputDate, (newDate, oldDate) => {
      dateStr.value = formatDate(newDate),
      labelText.value = formatReadableDate(newDate)     
})

// ...
</script>
```

Vue's `watch` logic allows you to track a given property or state value changes based on its key.

Here, we're watching the `inputDate` props key and, when changed, updating `dateStr` and `labelText` based off of the new property value.

<!-- tabs:end -->

While this method works, it tends to introduce duplicate developmental logic. For example, notice how we have to repeat the declaration of the `dateStr` and `labelText` values twice: Once when they're initially defined, and again inside of the property listener.

Luckily for us, there's an easy solution for this problem called "computed values".

# Method 2: Computed values

Our previous method of deriving a value from a property follows two steps:

1) Set an initial value
2) Update and recompute the value when its base changes

However, what if we could instead simplify this idea to a single step:

1) Run a function over a value, and live update as it changes.

This may remind you of a similar pattern we've used already for [live updated text](/posts/ffg-fundamentals-intro-to-components#Live-Updating) and [attribute binding](/posts/intro-to-components#Attribute-Binding).

Luckily for us, all three frameworks have a way of doing just this!

<!-- tabs:start -->

## React

```jsx {4-8}
import {useMemo} from "react";

const FileDate = ({ inputDate }) => {
  const dateStr = useMemo(() => formatDate(inputDate), [inputDate]);
  const labelText = useMemo(() => formatReadableDate(inputDate), [inputDate]);

  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};
```

`useMemo` is a method for computing values based on an input or series of inputs. This works because it does the computation and regenerates the calculation whenever the second argument array's values have changed in a render.

Like `useEffect`, this array's values' changes are only tracked when the component is rendering. Unlike `useEffect`, however, there's no option to remove the second array argument entirely.

Instead, if you want to recalculate the logic in every render, you'd simply remove the `useMemo` entirely. So, for simple computations, you can take this code:

```jsx
const AddComp = ({baseNum, addNum}) => {
	const val = useMemo(() => baseNum + addNum, [baseNum, addNum]);
	return <p>{val}</p>;
}
```

And refactor it to look like this:

```jsx
const AddComp = ({baseNum, addNum}) => {
	const val = baseNum + addNum;
	return <p>{val}</p>;
}
```

> While it's technically possible to use this trick to never use `useMemo`, your application's performance will suffer drastically. That said, it's a bit of a science to know when and where to use `useMemo`. [We'll touch on this more in our third book titled "Internals".](https://framework.guide)

## Angular

To solve the derived value problem without recomputing the values manually, Angular introduces the concept of a "pipe" into the mix of things. The idea is that a pipe runs over an input (or series of inputs) just like React's `useMemo`.

```typescript
import { NgModule, Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  transform(value: Date): string {
    return formatDate(value);
  }
}

@Pipe({ name: 'formatReadableDate', standalone: true })
export class FormatReadableDatePipe implements PipeTransform {
  transform(value: Date): string {
    return formatReadableDate(value);
  }
}
```

You may then use these pipes in your components directly inside of the template.

```typescript
@Component({
  selector: 'file-date',
  standlone: true,
  imports: [FormatReadableDatePipe, FormatDatePipe],
  template: `<span [attr.aria-label]="inputDate | formatReadableDate">{{ inputDate | formatDate }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```


### Multiple Input Pipes

You may notice the similarities between pipes and functions. After all, pipes are effectively functions you're able to call in your template. Much like functions, they're not limited to a single input property, either.

Let's add a second input to see if the `formatDate` pipe should return a readable date or not.

```typescript
import { NgModule, Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate', standalone: true })
export class FormatDatePipe implements PipeTransform {
  // `dateFormat` is an optional argument. If left empty, will simply `formatDate`
  transform(value: Date, dateFormat?: string): string {
    // Stands for "Long format month, day of month, year"
  	if (dateFormat === 'MMMM d, Y') return formatReadableDate(value);
    return formatDate(value);
  }
}
```

Then, we can use it in our template while passing a second argument:

```typescript
@Component({
  selector: 'file-date',
  standalone: true,
  imports: [FormatDatePipe],
  template: `<span [attr.aria-label]="inputDate | formatReadableDate:'MMMM d, Y'">{{ inputDate | formatDate }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```

### Built-in Pipes

Luckily, Angular's all-in-one methodology means that there's a slew of pipes that the Angular team has written for us. One such pipe is actually a date formatting pipe. We can remove our own implementation in favor of one built right into Angular!

To use the built-in pipes, we need to import them from `CommonModule` into the component. In this case, the pipe we're looking to use is called [`DatePipe`](https://angular.io/api/common/DatePipe). This provided date pipe is, expectedly, called `date` when used in the template and can be used like so:

```typescript
import { DatePipe } from '@angular/common';

@Component({
  selector: 'file-date',
  standalone: true,
  imports: [DatePipe],
  template: `<span [attr.aria-label]="inputDate | date:'MMMM d, Y'">{{ inputDate | date }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```

## Vue

```vue
<!-- FileDate.vue -->
<template>
  <span :aria-label="labelText">{{ dateStr }}</span>
</template>

<script setup>
import { computed } from 'vue'

// ...

const props = defineProps(['inputDate'])

const dateStr = computed(() => formatDate(props.inputDate));
const labelText = computed(() => formatReadableDate(props.inputDate));

// ...
</script>
```

Instead of using `ref` to construct a set of variables, then re-initializing the values once we `watch` a `prop`, we can simply tell Vue to do that same process for us using `computed` props.

Vue is able to ✨ magically ✨ detect what data inside of the `computed` function is dynamic, just like `watchEffect`. When this dynamic data is changed, it will automatically re-initialize the variable it's assigned to with a new value returned from the inner function.

These `computed` props are then accessible in the same way a `data` property is, both from the template and from Vue's `<script>` alike.

<!-- tabs:end -->

# Non-Prop Derived Values

While we've primarily used component inputs to demonstrate derived values today, both of the methods we've utilized thus far work for the internal component state as well as inputs.

Let's say that we have a piece of state called `number` in our component and want to display the doubled value of this property without passing this state to a new component:

<!-- tabs:start -->

## React

```jsx
const CountAndDoubleComp = () => {
  const [number, setNumber] = useState(0);
  const doubleNum = useMemo(() => number * 2, [number]);

  return <div>
    <p>{number}</p>
    <p>{doubleNum}</p>
    <button onClick={() => setNumber(number + 2)}>Add one</button>
  </div>;
};
```

## Angular

```typescript
@Pipe({ name: 'doubleNum', standalone: true })
export class DoubleNumPipe implements PipeTransform {
  transform(value: number): number {
    return value * 2;
  }
}
```

```typescript
@Component({
  selector: 'file-date',
  standalone: true,
  imports: [DoubleNumPipe],
  template: `
  <div>
    <p>{{number}}</p>
    <p>{{number | doubleNum}}</p>
    <button (click)="addOne()">Add one</button>
  </div>
  `,
})
export class CountAndDoubleComponent {
  number = 0;
  
  addOne() {
    this.number++;
  }
}
```

## Vue

```vue
<!-- CountAndDouble.vue -->
<template>
  <div>
    <p>{{ number }}</p>
    <p>{{ doubleNum }}</p>
    <button @click="addOne()">Add one</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const number = ref(0)

function addOne() {
  number.value++
}

const doubleNum = computed(() => number.value * 2)
</script>
```

<!-- tabs:end -->

In this component, we can see two numbers - one doubling the value of the other. We then have a button that allows us to increment the first number, and therefore, using a derived value, the second number also updates.

# Challenges

While building through our continued file hosting application, let's think through how our `Size` can be calculated to be displayed in the UI like so:

![// TODO: Write](../ffg-fundamentals-passing-children/file_list.png)

File sizes are usually measured in how many bytes it takes to store the file. However, this isn't exactly useful information past a certain size. Let's instead use the following JavaScript to figure out how large a file size is, given the number of bytes:

```javascript
const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

function formatBytes(bytes) {
  if (bytes < kilobyte) {
    return `${bytes} B`;
  } else if (bytes < megabyte) {
    return `${Math.floor(bytes / kilobyte)} KB`;
  } else if (bytes < gigabyte) {
    return `${Math.floor(bytes / megabyte)} MB`;
  } else {
    return `${Math.floor(bytes / gigabyte)} GB`;
  }
}
```

> Fun code challenge for you at home - can you write the above in fewer lines of code? 🤔

With this JavaScript, we can use a derived value to display the relevant display size. Let's build this out using a dedicated `DisplaySize` component:

<!-- tabs:start -->

## React

```jsx
function DisplaySize({ bytes }) {
  const humanReadibleSize = React.useMemo(() => formatBytes(bytes), [bytes]);
  return <p>{humanReadibleSize}</p>;
}

const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;

function formatBytes(bytes) {
  if (bytes < kilobyte) {
    return `${bytes} B`;
  } else if (bytes < megabyte) {
    return `${Math.floor(bytes / kilobyte)} KB`;
  } else if (bytes < gigabyte) {
    return `${Math.floor(bytes / megabyte)} MB`;
  } else {
    return `${Math.floor(bytes / gigabyte)} GB`;
  }
}
```

## Angular

```typescript
@Pipe({ name: 'formatBytes', standalone: true })
export class FormatBytesPipe implements PipeTransform {
  kilobyte = 1024;
  megabyte = this.kilobyte * 1024;
  gigabyte = this.megabyte * 1024;

  transform(bytes: number): string {
    if (bytes < this.kilobyte) {
      return `${bytes} B`;
    } else if (bytes < this.megabyte) {
      return `${Math.floor(bytes / this.kilobyte)} KB`;
    } else if (bytes < this.gigabyte) {
      return `${Math.floor(bytes / this.megabyte)} MB`;
    } else {
      return `${Math.floor(bytes / this.gigabyte)} GB`;
    }
  }
}

@Component({
  selector: 'display-size',
  standalone: true,
  imports: [FormatBytesPipe],
  template: `
	  <p>{{bytes | formatBytes}}</p>
	`,
})
class DisplaySizeComponent {
  @Input() bytes: number;
}
```

## Vue

```vue
<!-- DisplaySize.vue -->
<template>
  <p>{{ humanReadibleSize }}</p>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['bytes'])
const humanReadibleSize = computed(() => formatBytes(props.bytes))

const kilobyte = 1024
const megabyte = kilobyte * 1024
const gigabyte = megabyte * 1024

function formatBytes(bytes) {
  if (bytes < kilobyte) {
    return `${bytes} B`
  } else if (bytes < megabyte) {
    return `${Math.floor(bytes / kilobyte)} KB`
  } else if (bytes < gigabyte) {
    return `${Math.floor(bytes / megabyte)} MB`
  } else {
    return `${Math.floor(bytes / gigabyte)} GB`
  }
}
</script>
```

<!-- tabs:end -->
