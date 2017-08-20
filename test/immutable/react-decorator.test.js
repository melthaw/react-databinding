/* eslint-disable max-nested-callbacks */
import React from 'react';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import { shallow,mount } from 'enzyme';
import sinon from 'sinon';
import { oneWayBind, twoWayBind} from '../../src/immutable/react-decorator';

const data = fromJS([
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
]);

class ReadonlyComponent extends React.Component {

	@oneWayBind()
	render($) {
		return (<div><h1>{$('title')}</h1><span>{$('data.1.fats.total')}</span></div>);
	}

}

class MutableComponent extends React.Component {

	constructor(props, context) {
		super(props, context);
		let { user } = props;
		this.state = {user: fromJS(user)};
	}

	@twoWayBind()
	render($$) {
		return (
			<div>
				<input id="username" type="text" {...$$('user.username')}/>
				<input id="password" type="password" {...$$('user.password')}/>
			</div>
		);
	}

}

describe("immutable bind by decorator", () => {
	it("one way bind", () => {
		const wrapper = shallow(<ReadonlyComponent data={data} title="hello world"/>);
		expect(wrapper.find('h1').text()).to.be.equal('hello world');
		expect(wrapper.find('span').text()).to.be.equal('3');
	})
	it("two way bind", () => {
		let user = fromJS({username: 'react-data-bind', password: 'awesome'});
		const wrapper = shallow(<MutableComponent user={user}/>);

		wrapper.find('#username').simulate('change', 'react-data-binding');
		expect(wrapper.state().user.get('username')).to.be.equal('react-data-binding');
		expect(wrapper.find('#username').node.props.value).to.be.equal('react-data-binding');
		expect(wrapper.state().user.get('password')).to.be.equal('awesome');
		expect(wrapper.find('#password').node.props.value).to.be.equal('awesome');

		wrapper.find('#password').simulate('change', 'amazing');
		expect(wrapper.state().user.get('username')).to.be.equal('react-data-binding');
		expect(wrapper.find('#username').node.props.value).to.be.equal('react-data-binding');
		expect(wrapper.state().user.get('password')).to.be.equal('amazing');
		expect(wrapper.find('#password').node.props.value).to.be.equal('amazing');
	})
})

