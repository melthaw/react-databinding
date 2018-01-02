# `react-databinding`

[![Travis build status](http://img.shields.io/travis/melthaw/react-databinding/master.svg?style=flat-square)](https://travis-ci.org/melthaw/react-databinding)
[![NPM version](http://img.shields.io/npm/v/react-databinding.svg?style=flat-square)](https://www.npmjs.org/package/react-databinding)


双向数据绑定是一个很常见的功能，[Angular](https://github.com/angular/angular) 和 [Vue.js](https://github.com/vuejs/vue) 都支持双向数据绑定。
但是[React](https://github.com/facebook/react) 不支持双向数据绑定，为了解决数据绑定问题，不得不写大量的代码。
我们提供`react-databinding` 就是为了让这个事情变得简单容易。

[User Guide - English](./README.md)

## 设计目标

* 很好理解
* 简单易用
* 提供两种级别的API
	* 顶层API可以直接用于组件渲染Component#render() (支持单向和双向绑定)
	* 底层API支持函数编程(支持Functor & Monad)
* 基于路径表达式的方式访问值（支持任意层嵌套）

## 快速上手

> 假设使用者已经在自己的开发机上安装好`node.js`和`npm`
> 建议使用者采用`nvm`来管理`node.js`的版本

### 安装

```sh
> npm install react-databinding --save
```

### 编程式 vs. 声明式

`react-databinding`支持两种数据绑定风格。

 风格 | 使用方式
---|---
 编程式 | import {oneWayBind, twoWayBind} from 'react-databinding/react-data-bind'
 声明式 | import {oneWayBind, twoWayBind} from 'react-databinding/react-decorator'

接下来我们用示例来说明两种数据绑定方式的区别。
由于单向绑定比双向绑定简单，为了方便大家理解，我们以单向绑定为例：

```js
import {oneWayBind, twoWayBind} from 'react-databinding/react-data-bind';

class SampleComponent extends React.Component {

	//编程式
	render() {
		let $ = oneWayBind(this.props);
		return (<div>
			<h1>{$('data.title')}</h1>
		</div>)
	}

}
```

```js
import {oneWayBind, twoWayBind} from 'react-databinding/react-decorator';

class SampleComponent extends React.Component {

	//声明式
	@oneWayBind()
	render($) {
		return (<div>
			<h1>{$('data.title')}</h1>
		</div>)
	}

}
```

> 如果你使用声明式，记得将绑定操作符(我们喜欢使用`$`)作为参数传递给render方法

### 单向绑定 vs. 双向绑定

因为React不支持数据绑定，所以催生出大量的数据绑定的代码库，但是和我们期望的方式还是有较大区别。
我们希望的是对于使用者来说尽量少的编码（最终要在`render()`方法里面添加数据绑定逻辑），越简单越好，一看代码就能理解那种。

下面，我们将展示我们的解决思路，看看`react-databinding`是怎么做到又快又省的。

###### 示例1: 单向绑定

在开始数据绑定前，我们要准备一个容器类组件，可以通过属性（假设属性名为`data`）传递要绑定的数据对象，为了简单，我们采用高阶组件（HOC）的定义方式：


```javascript
const data = {
	title:'hello world',
	body:'blablablabla...'
}

const ContainerComponent = () => (
	<ImmutableComponent data={data}/>
)

```

> 在上面这段代码里面，我们看到data对象被传递到`ImmutableComponent`组件

接下来，我们看看 `ImmutableComponent` 这个组件的内部实现（用到了单向绑定） ：

```javascript
import {React} from 'react';
import {oneWayBind} from 'react-databinding';

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

从上面的代码看，和普通的React组件相比，没有什么特别奇怪的东西，只是多了一段代码来声明`$`

```
let $ = oneWayBind(this.props);
```

`$`就是在接下来的代码里面解决单向绑定的魔法符号

正如代码所示，要实现单向绑定是非常简单的，其中的魔法就是`$`符号（其实是一个函数），它接受一个路径表达式(`'data.title'`) ，
在运行时根据组件的属性来求值。

> 注意：`$`符号还可以接受一个默认值，或者一个lambda表达式（要求返回一个值）。
> 当`$`对路径表达式求值的结果为null的时候，通常我们会考虑显示一个默认值，或者动态计算出一个默认值。

```javascript
const todolist = [{
	title: 'complete the readme before this weekend' ,
	tags: ['help','doc'],
	status: 'pending'
}];

```

例如下面的示例，如果author为空的时候，就显示默认值`'unknown'`

```javascript
$('todolist.0.author','unknown')
```

下面这个示例，如果tags不为空，就将tags的值用逗号进行分隔，否则，显示默认值`'unknown'`

```javascript
$('todolist.0.tags', v => v ? v.join(','):'unknown')
```

从上面的示例可以看出，我们支持复杂的表达式，表达式中的每一个占位字符串都会作为对象的属性进行求值。
因为数组也是一个对象，0这个索引位会被`$`操作符当做是对数组对象的0这个属性求值。

###### 示例2: 双向绑定

双向绑定和单向绑定类似，在下面的示例中我们用两个`$`符号，也就是`$$`来表示双向绑定操作符。

首先我们还是先准备一个容器组件：

```javascript
const data = {
	username:'react-databinding',
	nickname:'two-way binding'
}

const ContainerComponent = () => (
	<MutableComponent user={data}/>
)

```

> 在上面这段代码里面，`MutableComponent`组件的命名表示这个是一个可以改变的组件。

接下来，我们看看 `MutableComponent` 这个组件的内部实现（用到了双向绑定） ：

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

在`render()`方法里面，`$$`实际上会返回一个组合对象，我们要使用`...`展开操作符来展开该对象的所有属性，并动态添加为input对象的属性。


### immutable-js

现在[immutable-js](https://github.com/facebook/immutable-js) 几乎成为了React的标配，我们对[immutable-js](https://github.com/facebook/immutable-js) 的支持也是一步到位.

为了减少大家的重复学习，我们设计了完全相同的API，因此在[immutable-js](https://github.com/facebook/immutable-js) 下使用我们的数据绑定
和普通场景下的数据绑定是完全一样的，唯一的不同就是import部分。

```javascript
//general
import {oneWayBind,twoWayBind} from 'react-databinding';

//immutable
import {oneWayBind,twoWayBind} from 'react-databinding/immutable';

//decorator
import {oneWayBind,twoWayBind} from 'react-databinding/immutable/react-decorator';

```

## 工作原理

在这个章节我们将给大家介绍一下我们提供的数据绑定背后的工作原理。

First,  import the `react-databinding`

```javascript
import { F } from 'react-databinding';
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
import {F, Optional} from 'react-databinding';

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
import {F,Optional} from 'react-databinding';

F.of(data).at('1.fats.total').map(v -> v+1).value();//4
//or
(new Optional(data)).at('1.fats.total').map(v -> v+1).value();//4
```

## immutable

Yes , immutable is supported as well.
The APIs is designed exactly matched as previous, the different is import part.

```javascript
import {F} from 'react-databinding/immutable';
```

And make sure the args you passed to F.of is an immutable object.

```javascript
import { fromJS } from 'immutable';
import { F } from 'react-databinding/immutable';

let immutableData = fromJS(data);

F.of(immutableData).at('1.fats.total').map(v -> v+1).value();//4

```
