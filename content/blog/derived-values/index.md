---
{
    title: "Derived Values",
    description: "Often in application development, you'll want to base one variable's value off of another. There are a few ways of doing this - some easier than others.",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 5,
    series: "The Framework Field Guide"
}
---

We've touched on before how to pass values to a component as properties:

<!-- tabs:start -->

### React

```jsx
const FileDate = ({ inputDate }) => {
  const [dateStr, setDateStr] = useState(formatDate(inputDate));
  const [labelText, setLabelText] = useState(formatReadableDate(inputDate));

  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};
```

### Angular

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file-date",
  template: `<span [attr.aria-label]="labelText">{{ dateStr }}</span>`,
})
export class FileDateComponent implements OnInit {
  @Input() inputDate: Date;

  dateStr = this.formatDate(this.inputDate);
  labelText = this.formatReadableDate(this.inputDate);

  // ...
}
```

### Vue

```javascript
const FileDate = {
  template: `<span :aria-label="labelText">{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(this.inputDate),
      labelText: this.formatReadableDate(this.inputDate)
    };
  },
  props: ['inputDate']
  // ...
};
```

<!-- tabs:end -->

However, you may notice that we're deriving two values from the same property. The issue with how we're doing things currently, however, is that our `formatDate` and `formatReadableDate` methods are only running once during the intial render.

Because of this, we lose reactivity if we were to pass in an updated `inputDate` to the `FileDate` component.

<!-- tabs:start -->

### React

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

    return <FileDate inputDate={inputDate}/>
}
```

### Angular

```typescript
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "file",
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

### Vue

```javascript
const File = {
  template: `<file-date :inputDate="inputDate"></file-date>`,
  data() {
    return {
      inputDate: new Date(),
      interval: null
    };
  },
  mounted() {
    // Check if it's a new day every 10 minutes
    this.interval = setInterval(() => {
      const newDate = new Date();
      if (this.inputDate.getDate() === newDate.getDate()) return;
      this.inputDate = newDate;
    }, 10 * 60 * 1000);
  },
  unmounted() {
    clearInterval(this.interval);
  }
};
```

<!-- tabs:end -->

While the `File` component is working as-expected, our `FileDate` component is never listening for the changed input value, and as such never displays the updated value to users.

How can we fix this?

## Method 1: Prop listening

The first, and arguably easiest to mentally model, method to solve this disparity between prop value and display value is to simply listen for when a property's value has been updated and re-calculate the display value.

Luckily, we can use [our existing knolwedge of lifecycle methods](/posts/lifecycle-methods) to do so:

<!-- tabs:start -->

### React

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

### Angular

```typescript
import { Component, OnInit, SimpleChanges } from "@angular/core";

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

Here, we're using a new lifecycle method — specific to Angular — called `ngOnChanges` to detect when a property value is updated.

### Vue

```javascript
const FileDate = {
  template: `<span :aria-label="labelText">{{dateStr}}</span>`,
  data() {
    return {
      dateStr: this.formatDate(this.inputDate),
      labelText: this.formatReadableDate(this.inputDate)
    };
  },
  props: ['inputDate'],
  watch: {
    // The key here must match the property name you want to watch changes of
    inputDate(newDate, oldDate) {
      this.dateStr = this.formatDate(newDate),
      this.labelText = this.formatReadableDate(newDate)        
    }
  }
};
```

Vue's `watch` logic allows you to track the changes from a given property or state value based on its key.

Here, we're watching the `inputDate` input key and, when changed, updating `dateStr` and `labelText` based off of the new property value.

<!-- tabs:end -->


While this method works, it tends to introduce duplicate developmental logic. Notice how we have to repeat the declaration of the `dateStr` and `labelText` values. Luckily for us, there's an easy solution for this called "computed values".

## Method 2: Computed values

Our previous method of deriving a value from a property follows two steps:

1) Set an initial value
2) Update and recompute the value when its base changes

However, what if we could instead simplify this idea to a single step:

1) Run a function over a value, live update as it changes.

This may remind you of a similar pattern we've used already for [live updated text](/posts/intro-to-components#Live-Updating) and [attribute binding](/posts/intro-to-components#Attribute-Binding).

Luckily for us, all three frameworks have a way of doing just this!

<!-- tabs:start -->

### React

```jsx {4-8}
const FileDate = ({ inputDate }) => {
  const dateStr = useMemo(() => formatDate(inputDate), [inputDate]);
  const labelText = useMemo(() => formatReadableDate(inputDate), [inputDate]);

  // ...

  return <span ariaLabel={labelText}>{dateStr}</span>;
};
```

`useMemo` is a method for computing values based off of an input or series of inputs. The way that this works is that it does the computation and regenerates the calculation whenever the second argument array's values have changed in a render.

Similar to `useEffect`, this array's values' changes are only tracked when the component is rendering. Unlike `useEffect`, however, there's no option to remove the second array argument entirely.

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

> While it's technically possible to use this trick to never use `useMemo`, your application's performance will greatly suffer. There's a bit of a science to knowing when and where to use `useMemo`. [We'll touch more on this in our "Performance" chapter.](// TODO: Add link)

### Angular

Angular introduces the concept of a "pipe" into the mix of things. The idea being that a pipe runs over an input (or series of inputs) just like React's `useMemo`.

```typescript
import { NgModule, Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(value: Date): string {
    return formatDate(value);
  }
}

@Pipe({ name: 'formatReadableDate' })
export class FormatReadableDatePipe implements PipeTransform {
  transform(value: Date): string {
    return formatReadableDate(value);
  }
}
```

These `Pipe` clases then need to be registered in a `Module`.

```typescript
@NgModule({
  imports: [BrowserModule],
  declarations: [
    AppComponent,
    FileDateComponent,
    FormatDatePipe,
    FormatReadableDatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Once registered, you may then use these pipes in your components directly inside of the template.

```tsx
@Component({
  selector: 'file-date',
  template: `<span [attr.aria-label]="inputDate | formatReadableDate">{{ inputDate | formatDate }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```


#### Multiple Input Pipes

You may notice the similarities between pipes and functions. After all, pipes are effectively functions you're able to call in your template. Much like functions, they're not limited to a single input property, either.

Let's add a second input to see if the `formatDate` pipe should return a readable date or not.

```typescript
import { NgModule, Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate' })
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
  template: `<span [attr.aria-label]="inputDate | formatReadableDate:'MMMM d, Y'">{{ inputDate | formatDate }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```

#### Built-in Pipes

Luckily, Angular's all-in-one methodology means that there's a slew of pipes that the Angular team has written for us. One such pipe is actually a date formatting pipe. We can remove our own implementation in favor of one built right into Angular!

To use the built-in pipes, we need to import the `CommonModule`:

```typescript {0,2}
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [BrowserModule, CommonModule],
  declarations: [
    AppComponent,
    FileDateComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Once this is done, we can use the provided pipe. This provided date pipe is, expectedly, called `date` and can be used like so:

```typescript
@Component({
  selector: 'file-date',
  template: `<span [attr.aria-label]="inputDate | date:'MMMM d, Y'">{{ inputDate | date }}</span>`,
})
export class FileDateComponent {
  @Input() inputDate: Date;
}
```

### Vue

```javascript
const FileDate = {
  template: `<span :aria-label="labelText">{{dateStr}}</span>`,
  props: ['inputDate'],
  computed: {
    dateStr() {
      return this.formatDate(this.inputDate)
    },
    labelText() {
      return this.formatReadableDate(this.inputDate)
    }
  }
};
```

Instead of using `data` to construct a set of variables, then re-intializating the values once we `watch` a `prop`, we can simply tell Vue to do that same process for us using `computed` props.

These props are then accessible in the same way a `data` property is, both from the template and from Vue's logic layer alike.

<!-- tabs:end -->

# Non-Prop Derived Values

While we've primarily used component inputs to demonstrate derived values today, both of the methods we've utilized today work for internal component state as well as they do inputs.

