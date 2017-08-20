import {oneWayBind as _oneWayBind, twoWayBind as _twoWayBind } from './bind';

export const oneWayBind = (props = 'props') => (target, name, descriptor) => {
	let oldValue = descriptor.value;

	descriptor.value = function () {
		let oneWayBind = _oneWayBind(this[props]);
		return oldValue.call(this, oneWayBind);
	};

	return descriptor;

}

export const twoWayBind = (value = 'value', event = 'onChange') => (target, name, descriptor) => {
	let oldValue = descriptor.value;

	descriptor.value = function () {
		let twoWayBind = _twoWayBind(value, event)(this);
		return oldValue.call(this, twoWayBind);
	};

	return descriptor;
}
