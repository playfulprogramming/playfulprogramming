---
{
    title: 'Python None',
    description: "Interpreted languages have various footguns. Let's explore one such footgun I ran into recently with Python and how I fixed it.",
    published: '2022-07-27T20:00:00.945Z',
    tags: ['python', 'go'],
    license: 'cc-by-nc-nd-4',
    originalLink: "https://williamgeorgecook.com/posts/python_none/"
}
---

Today at work we had a silly bug that exposes how reliant I am on Go's type system and compiler. I personally am too comfortable building a Docker image and assuming that the most egregious bugs were caught simply because the build was successful.

## The Bug
Python doesn't require you to specify a return value. In fact, you can have a function that may not explicitly return at all. Since Python is a scripting language, it will automatically return when it hits the bottom of the function being called. When this happens without returning a specific value, any variable assigned to the function call will be `None`. A silly but illustrating example:

```python
def change_string(do_it: bool) -> str: 
    if do_it:
        return "changed!"
```
This function accepts a boolean that determines whether to do anything at all. According to the type hints and the function name, a string is the expected return type. You can assign the output of this function to a variable like normal:

```python
my_string = change_string(False)
```

However, since the argument to `change_string` is `False`, the assignment will suffer from this bug. There is no return statement for a fasly `do_it` condition, so when Python reaches the end of the function it will have no choice but to return `None`. You can confirm the assignment by printing the value and type of `my_string`:

```python
print(my_string)
print(type(my_string))

> None
> <class 'NoneType'>
```

## Lesson Learned
We switched to Go for the concurrency benefits but also the type system and compiler helps save us from these runtime errors. The same function in Go would result in a compile time error:

```go
func changeString(doIt bool) string {
        if doIt {
                return "Changed!"
        }
}


func main() {
        s := changeString(false)
        fmt.Println(s)

}

> go run main.go
> ./main.go:10:1: missing return
```

This Python service isn't a candidate for rewriting in Go any time soon. Remembering to be more thorough in my code review and testing would have saved me from an embarrassing run time error that had some client impact today. 
