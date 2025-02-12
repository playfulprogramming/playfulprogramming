export interface CounterCompProps { count: number }

export default (props: CounterCompProps) => {
    return <button>The count is {props.count}</button>;
}