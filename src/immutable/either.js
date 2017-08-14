import Optional from './optional';

/**
 *
 * @param dv default value
 * @param iv input value
 */
export default (dv, iv):Optional => {
	return (iv === null) ? new Optional(dv) : new Optional(iv);
}
