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


First, install

```sh
> npm install react-redux-data-binding --save
```

And import the `react-redux-data-binding`

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

case 2: convert the data


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


# `react-redux-data-binding` helper

As the prev chapter showed, the `react-redux-data-binding` can access the complex data structure (like tree) in a simply way.
But it still more coding press if we use it in the JSX , specially the render function of Component.
So we provide multi helpers to simplify this .

Here is the example


case 1:

before

```
//before
const $ = h(this.props);
```
after

```
//after
$('hello.world.size')
$('hello.world.size', 'default value if null')
$('hello.world.size', v => v);

```

case 2:

before
```
```

after
```
```



case 3:

before
```
```

after
```
```


case 4:

before
```
```

after
```
```
