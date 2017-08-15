# `react-redux-data-binding`


As we know , the final miles of React & Redux is the UI part, 
two-way binding is general feature in Angular & Vue but not supplied in react.
So we have to write down much code to handle the technical problem not focus on the business,
 `react-redux-data-binding` is used to make it easier.

What we want to resolved listed as follow:

* functional programing style
* easy to access the data by path expression
* the two-way data binding 


## Get started


## install

```sh
> npm install react-redux-data-binding --save
```

# one-way & two-way binding

There are many solutions to implement one-way or two-way binding in react world ,
but we like more simple and less coding API if we use it in the render function.

Here we will show how to get the easiest to understand and simplest to use one-way and two-way data binding in react Component.

case 1: one-way binding

First, let's prepare the container Component to create a component and pass something as props to it.

```javascript
const data = {
	title:'hello world',
	body:'blablablabla...'
}

const case1 = () => (
	<ImmutableComponent data={data}/>
)

```

Then goes to the `ImmutableComponent` which we will show the one-way binding

```javascript
import {React} from 'react';
import {oneWayBind} from 'react-redux-data-binding';

class ImmutableComponent extends React.Component {

	render() {
		// $ is curried function and please feel free to rename it in your project.
		let $ = oneWayBind(this.props);
		// 'hello world' will be shown as the h1 title
		return (
			<div><h1>{$('data.title')}</h1></div>
		);
	}

}
```

Nothing special, just one more line to create a curried $ function which will do the left work in the JSX part.

As you see, it's quite simple to do one-way binding ,
the magic is $ function , it accept the path ('data.title') and evaluate based on the Component's props.

One more thing, the $ function can accept a default value or a lambda callback
which will be very useful if you want to handle the null eval result.

```javascript
const todolist = [{
	title: 'complete the readme before this weekend' ,
	tags: ['help','doc'],
	status: 'pending'
}];

```

Show 'unknown' if the author not defined in todo

```javascript
$('todolist.0.author','unknown')
```

Show comma-joined tags

```javascript
$('todolist.0.tags', v => v ? v.join(','):'unknow')
```

As you see, complex path is supported, the array index is taken as the key of object , please feel free to try it out.


case 2: two-way binding

`TODO`


## How it works

But how it works , what is working on the backend. Let's show more example to explain it.

First,  import the `react-redux-data-binding`

```javascript
import F from 'react-redux-data-binding';
```

Now let's prepare the data to show the usage

```javascript
const data = [
	{
		calories: {total: 0, fat: 0},
		vitamins: {a: {total: 0, retinol: 0}, b6: 0, c: 0},
		fats: {total: 0},
		minerals: {calcium: 0}
	},
	{
		calories: {total: 150, fat: 40},
		vitamins: {a: {total: 100}, b6: 30, c: 200},
		fats: {total: 3}
	},
	{
		calories: {total: 100, fat: 60},
		vitamins: {a: {total: 120, retinol: 10}, b6: 0, c: 200},
		minerals: {calcium: 20}
	}
];
```


case 1: iterate the data and get the value

before

```javascript

let item = data[1];
if (item != null) {
	let fats = item.fats;
	if (fats != null) {
		let total = fats.total;//3
	}
}

```

after

```javascript
import F,{Optional} from 'react-redux-data-binding';

(new Optional(data)).at('1.fats.total').value();//3

//or

F.of(data).at('1.fats.total').value();//3

```

case 2: convert the data


before

```javascript

let item = data[1];
if (item != null) {
	let fats = item.fats;
	if (fats != null) {
		let total = fats.total;
		if (total != null) {
			total = total + 1; //4
		}
	}
}

```

after

```javascript
import F,{Optional} from 'react-redux-data-binding';

(new Optional(data)).at('1.fats.total').map(v -> v+1).value();//4

//or

F.of(data).at('1.fats.total').map(v -> v+1).value();//4

```

## immutable

Yes , immutable is supported as well.
The APIs is designed exactly matched as previous, the different is import part.

```javascript
import F from 'react-redux-data-binding/immutable';
```

And make sure the args you passed to F.of is an immutable object.

```javascript
import { fromJS } from 'immutable';
import F from 'react-redux-data-binding/immutable';

let immutableData = fromJS(data);

F.of(immutableData).at('1.fats.total').map(v -> v+1).value();//4

```
