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

```
> npm install react-redux-data-binding --save
```

Then let's prepare the data

```

```

And let import the `react-redux-data-binding`

```
import {rf} from 'react-redux-data-binding';
```

`rf` is the of `react-redux-data-binding` and designed as a functor.

case 1: general

```


```


case 1: functor


```
import {f} from 'react-redux-data-binding';


f(this.props).at('hello.world.size').map().();

//or


```

case 2: promise



case 3: monad




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
