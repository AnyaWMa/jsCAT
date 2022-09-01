import { Cat } from '../index';
import { Stimulus } from '../type';

describe('Cat', () => {
    let cat1: Cat, cat2: Cat, cat3: Cat, cat4: Cat;
    beforeEach(() => {
        cat1 = new Cat();
        const theta = cat1.updateAbilityEstimate([
            { a: 2.225, b: -1.885, c: 0.21, d: 1 },
            { a: 1.174, b: -2.411, c: 0.212, d: 1 },
            { a: 2.104, b: -2.439, c: 0.192, d: 1 }
        ], [1, 0, 1]);
        cat2 = new Cat( {nStartItems: 1, startSelect: "miDdle"});
        cat3 = new Cat();
        cat4 = new Cat({itemSelect:'RANDOM', randomSeed: "test"});
    });

    const s1: Stimulus = { difficulty: 0.5, word: 'looking' };
    const s2: Stimulus = { difficulty: 3.5, word: 'opaque' };
    const s3: Stimulus = { difficulty: 2, word: "right" };
    const s4: Stimulus = { difficulty: -2.5, word: 'yes' };
    const s5: Stimulus = { difficulty: -1.8, word: 'mom' };
    const stimuli = [s1, s2, s3, s4, s5];

    it('constructs an adaptive test', () => {
        expect(cat1.method).toBe('mle');
        expect(cat1.itemSelect).toBe('mfi');
    })

    it('correctly updates ability estimate', () => {
        expect(cat1.theta).toBeCloseTo(-1.642307, 1)
    })

    it('correctly updates standard error of mean of ability estimate', () => {
        const theta = cat2.updateAbilityEstimate([
            { a: 1, b: -0.4473004, c: 0.5, d: 1 },
            { a: 1, b: 2.8692328, c: 0.5, d: 1 },
            { a: 1, b: -0.4693537, c: 0.5, d: 1 },
            { a: 1, b: -0.5758047, c: 0.5, d: 1 },
            { a: 1, b: -1.4301283, c: 0.5, d: 1 },
            { a: 1, b: -1.6072848, c: 0.5, d: 1 },
            { a: 1, b: 0.5293703, c: 0.5, d: 1 }
        ], [1, 1, 1, 1, 1, 0, 1]);
        expect(cat2.seMeasurement).toBeCloseTo(1.455, 1)
        expect(cat2.nItems).toEqual(7);
    })

    it('correctly suggests the next item (closest method)', () => {
        const expected = { nextStimulus: s5, remainingStimuli: [s4, s1, s3, s2] };
        const received = cat1.findNextItem(stimuli, 'closest');
        expect(received).toEqual(expected);
    })

    it('correctly suggests the next item (mfi method)', () => {
        const expected = { nextStimulus: s1, remainingStimuli: [s4, s5, s3, s2] };
        const received = cat3.findNextItem(stimuli, 'MFI');
        expect(received).toEqual(expected);
    })


    it('correctly suggests the next item (middle method)', () => {
        const expected = { nextStimulus: s1, remainingStimuli: [s4, s5, s3, s2] };
        const received = cat2.findNextItem(stimuli);
        expect(received).toEqual(expected);
    })

    it('correctly suggests the next item (random method)', () => {

        let received;
        received = cat4.findNextItem(stimuli);
        expect(received.nextStimulus).toEqual(s1);
        received = cat4.findNextItem(received.remainingStimuli);
        expect(received.nextStimulus).toEqual(s3);
        received = cat4.findNextItem(received.remainingStimuli);
        expect(received.nextStimulus).toEqual(s5);
        received = cat4.findNextItem(received.remainingStimuli);
        expect(received.nextStimulus).toEqual(s2);

    })

});