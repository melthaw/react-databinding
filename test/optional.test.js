/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';
import { F } from '../src';

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

describe("optional", () => {
	describe("of", () => {
		it("origin value", ()=> {
			let totalFats = F.of(data).at('1.fats.total').value();
			expect(totalFats).to.be.equal(3);
		})
		it("mapped value", ()=> {
			let totalFats = F.of(data).at('1.fats.total').map(v => v + 1).value();
			expect(totalFats).to.be.equal(4);
		})
		it("deep value",()=> {
			let fats = F.of(data).at('1.fats').value();
			expect(fats).to.be.deep.equal({total: 3});
		})
		it("unexisted path1", ()=> {
			let totalFats = F.of(data).at('3.fats.total').value();
			expect(totalFats).to.be.equal(undefined);
		})
		it("unexisted path2", ()=> {
			let totalFats = F.of(data).at('0.fats.minerals.unexisted').value();
			expect(totalFats).to.be.equal(undefined);
		})
	});
	describe("either", () => {
		it("without default", ()=> {
			let totalFats = F.either(null, null).at('1.fats.total').value();
			expect(totalFats).to.be.equal(undefined);
		})
		it("with default", ()=> {
			let totalFats = F.either(data, null).at('1.fats.total').value();
			expect(totalFats).to.be.equal(3);
		})
	});
	describe("default", () => {
		it("default value", ()=> {
			let totalFats = F.of(data).at('1.fats.notexisted').value('zero');
			expect(totalFats).to.be.equal('zero');
		})
		it("default func", ()=> {
			let totalFats = F.of(data).at('1.fats.notexisted').value(v => 'two');
			expect(totalFats).to.be.equal('two');
		})
	});
});
