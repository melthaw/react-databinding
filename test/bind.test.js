/* eslint-disable max-nested-callbacks */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { oneWayBind, twoWayBind} from '../src';


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


class ReadonlyComponent extends React.Component {

	render() {
		let $ = oneWayBind(this.props);
		return (<div><h1>{$('title')}</h1><span>{$('data.1.fats.total')}</span></div>);
	}

}


describe("bind", () => {
	describe("one way", () => {
		const testComp = shallow(<ReadonlyComponent data={data} title="hello world"/>);
		expect(testComp.find('h1').text()).to.be.equal('hello world');
		expect(testComp.find('span').text()).to.be.equal('3');
	})
	describe("two way", () => {

	})
})
