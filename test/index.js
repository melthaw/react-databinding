/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';
import Rf from '../src/rf';

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
			let totalFats = Rf.of(data).at('1.fats.total').value();
			expect(totalFats).to.equal(3);
		})
		it("mapped value", ()=> {
			let totalFats = Rf.of(data).at('1.fats.total').map(v => v + 1).value();
			expect(totalFats).to.equal(4);
		})
		it("unexisted path1", ()=> {
			let totalFats = Rf.of(data).at('3.fats.total').value();
			expect(totalFats).to.equal(undefined);
		})
		it("unexisted path2", ()=> {
			let totalFats = Rf.of(data).at('0.fats.minerals.unexisted').value();
			expect(totalFats).to.equal(undefined);
		})
	});
	describe("either", () => {
		it("without default", ()=> {
			let totalFats = Rf.either(null, null).at('1.fats.total').value();
			expect(totalFats).to.equal(undefined);
		})
		it("with default", ()=> {
			let totalFats = Rf.either(data, null).at('1.fats.total').value();
			expect(totalFats).to.equal(3);
		})
	});
});
