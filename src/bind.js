import F from './f';

/**
 * Build the arg of this.setState() for current component
 *
 * @param path
 */
const buildUpdater = (path) => (value) => {
	if (path == null || path.trim() === '') {
		return {};
	}

	let result = {};
	let temp = result;
	let stack = path.split('.');

	while (stack.length > 1) {
		temp[stack.shift()] = {};
	}

	temp[stack.shift()] = value;

	return result;
}

/**
 *
 * @param ctx this ref of current component
 */
const doChange = (ctx) => (path) => (value)=> {
	ctx.setState(buildUpdater(path, value));
}

/**
 * Usage :
 * <code>
 * import {twoWayBind} from 'react-redux-data-binding';
 * let bindTo = twoWayBind(this);
 * <MyComponent ...bindTo("username") />
 * </code>
 *
 * @param context
 */
export default (context) => (path, defaultValue) => {
	return {
		value: F.of(context.state).at(path).value(defaultValue),
		onChangeText: (v) => doChange(context, path, v),
		onValueChange: (v) => doChange(context, path, v)
	}
}
