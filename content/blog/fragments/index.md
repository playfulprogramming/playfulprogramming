---
{
    title: "Fragments",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 4,
    series: "The Framework Field Guide"
}
---

One of the advantages that having a virtual representation of the DOM is that you're able to have a non 1:1 layout of virtual node to real DOM node. What does this mean? Consider a scenario like this: let's say that you have various CDNs for different media types to place into a video tag. However, instead of hardcoding the CDN delivery every time, you want to end up with a single video name and a component that pre/post-pends the rest of the URL to the correct source location

<!-- tabs:start -->

### React

```jsx
<video>
  <custom-html-video-sources videoName={'best-video-ever'}/>
</video>
```

### Angular
```html
<video>
  <custom-html-video-sources [videoName]="'best-video-ever'"></custom-html-video-sources>
</video>
```

### Vue
```html
<video>
  <custom-html-video-sources :videoName="'best-video-ever'"></custom-html-video-sources>
</video>
```

<!-- tabs:end -->



In this example, we may want to have the `video` tag and seperate out the `source` tags. Something like this might apply:



<!-- tabs:start -->

### React

```jsx
<custom-html-video videoTypes={[
  {
  	type: 'mp4',
  	src: 'video.mp4'
  },
  {
  	type: 'mkv'.
  	src: 'video.mkv'
  }
]}/>
```

### Angular

```typescript
@Component({
	selector: "custom-html-video-sources",
	template: `
		<ng-container>
			<source [src]="'https://cdn.example.com/mp4/' + videoName + '.mp4'"/>
			<source [src]="'https://cdn.example.com/mp4/' + videoName + '.mp4'"/>
		</ng-container>
	`
})
class CustomHTMLVideoComponent {
	@Input() videoName: string;
}
```

### Vue

```html
<custom-html-video :videoTypes="[
  {
  	type: 'mp4',
  	src: 'video.mp4'
  },
  {
  	type: 'mkv'.
  	src: 'video.mkv'
  }
]"/>
```

<!-- tabs:end -->

