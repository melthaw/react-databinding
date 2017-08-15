const Optional = function (v) {
	this.v = v;
}

/**
 * Parse the path expr , and iterate the value struct to get the right value .
 * If null found, it returns a new functor with null value.
 *
 * @param path the property path to access the value
 * @returns {Optional}
 */
Optional.prototype.at = function (path) {
	if (this.v == null || path == null || path.trim() === '') {
		return new Optional(this.v);
	}

	//immutable getter
	let result = this.v.getIn(path.trim().split('.'));
	if (result == null) {
		return new Optional(null);
	}
	return new Optional(result);
}

/**
 * Map the value to another , and return a new functor with the result.
 * if the mapped result is instance of Optional , the value of it will be taken as the functor's input.
 *
 * @param lambda
 * @returns {Optional}
 */
Optional.prototype.map = function (lambda) {
	let v = this.v != null ? lambda(this.v) : null;
	return new Optional((v instanceof Optional) ? v.v : v);
}

Optional.prototype.peek = function (lambda) {
	lambda(this.v);
	return new Optional(this.v);
}

/**
 * get the value of functor, if the value is null and the default value is supplied, it will return the default value as result
 *
 * @param dv default value
 * @returns {any}
 */
Optional.prototype.value = function (dv) {
	if (dv != null && typeof dv === 'function') {
		return dv(this.v);
	}

	return this.v == null ? dv : this.v;
}

export default Optional;
