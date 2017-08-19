import {oneWayBind as _oneWayBind, twoWayBind as _twoWayBind} from './bind';

export const oneWayBind = _oneWayBind;
export const twoWayBind = _twoWayBind('value', 'onChangeText');
