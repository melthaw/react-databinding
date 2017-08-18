# `react-data-binding`


As we know , the final mile of [React](https://github.com/facebook/react) is the UI part,
two-way binding is general feature in [Angular](https://github.com/angular/angular) & [Vue.js](https://github.com/vuejs/vue) but not supported in  [React](https://github.com/facebook/react).
So we have to write down much code to handle the technical problem not focus on the business,
 `react-data-binding` is used to make it easier.

## Goal

* Easy to understand and simple to use
* Two level designed APIs
	* Top level for Component#render() (one-way & two-way binding)
	* Lower level for functional programming ( Functor & Monad )
* The data can be evaluated by path expression

## Get started

### install

```sh
> npm install react-data-binding --save
```

### one-way & two-way binding

There are many solutions to implement one-way or two-way binding in React world ,
but we like more simple and less coding API if we use it in the `render()` function.

Here we will show how to get the easiest to understand and simplest to use one-way and two-way data binding in React Component.

###### case 1: one-way binding

First, let's prepare the container Component to create a component and pass something as props to it.

```javascript
const data = {
	title:'hello world',
	body:'blablablabla...'
}

const ContainerComponent = () => (
	<ImmutableComponent data={data}/>
)

```

Then goes to the `ImmutableComponent` which we will show the one-way binding

```javascript
import {React} from 'react';
import {oneWayBind} from 'react-data-binding';

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

Nothing special, just one more line to create a curried `$` function which will do the left work in the JSX part.

As you see, it's quite simple to do one-way binding ,
the magic is `$` function , it accept the path (`'data.title'`) and evaluate based on the Component's props.

One more thing, the `$` function can accept a default value or a lambda callback
which will be very useful if you want to handle the null eval result.

```javascript
const todolist = [{
	title: 'complete the readme before this weekend' ,
	tags: ['help','doc'],
	status: 'pending'
}];

```

Show `'unknown'` if the author not defined in todo

```javascript
$('todolist.0.author','unknown')
```

Show comma-joined tags

```javascript
$('todolist.0.tags', v => v ? v.join(','):'unknown')
```

As you see, complex path is supported, the array index is taken as the key of object , please feel free to try it out.


###### case 2: two-way binding

The two-way binding is a bit different but similar. Here we use `$$` to indicate it's a two-way binding.

First, let's prepare the container Component to create a component and pass something as props to it.

```javascript
const data = {
	username:'react-data-binding',
	nickname:'two-way binding'
}

const ContainerComponent = () => (
	<MutableComponent user={data}/>
)

```

Then goes to the `MutableComponent` which we will show the two-way binding.


```javascript

class MutableComponent extends React.Component {

	constructor(props, context) {
		super(props, context);
		let { user } = props;
		this.state = {user};
	}

	render() {
		let $$ = twoWayBind(this);
		return (
			<div>
				<input id="username" type="text" {...$$('user.username')}/>
				<input id="nickname" type="text" {...$$('user.password')}/>
			</div>
		);
	}

}

```

In the `render()` function , the `$$` returns a composed object, so we use the `...` to expand as the input's props.


### immutable-js

Of course, the important [immutable-js](https://github.com/facebook/immutable-js) is supported.

We try to keep the general API and immutable supported API in the same , the only different is the import part.

```javascript
//general
import {oneWayBind,twoWayBind} from 'react-data-binding';

//immutable
import {oneWayBind,twoWayBind} from 'react-data-binding/immutable';
```


## How it works

But how it works , what is working on the backend. Let's show more example to explain it.

First,  import the `react-data-binding`

```javascript
import F from 'react-data-binding';
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
import {F, Optional} from 'react-data-binding';

F.of(data).at('1.fats.total').value();//3
//or
(new Optional(data)).at('1.fats.total').value();//3

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
import {F,Optional} from 'react-data-binding';

F.of(data).at('1.fats.total').map(v -> v+1).value();//4
//or
(new Optional(data)).at('1.fats.total').map(v -> v+1).value();//4
```

## immutable

Yes , immutable is supported as well.
The APIs is designed exactly matched as previous, the different is import part.

```javascript
import {F} from 'react-data-binding/immutable';
```

And make sure the args you passed to F.of is an immutable object.

```javascript
import { fromJS } from 'immutable';
import { F } from 'react-data-binding/immutable';

let immutableData = fromJS(data);

F.of(immutableData).at('1.fats.total').map(v -> v+1).value();//4

```
