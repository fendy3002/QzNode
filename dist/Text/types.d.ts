/**
 * Phrase
 */
export interface FindPhraseService {
    (source: string, compared: string): any;
    fromArray: (source: string[], compared: string[]) => any;
}
export interface PharseResult {
    phrase: PhraseDict;
    nonPhrase: {
        source: {
            pos: number[];
            word: string[];
        };
        compared: {
            pos: number[];
            word: string[];
        };
    };
    source: string | string[];
    compared: string | string[];
}
export interface Phrase {
    sourcePos: Array<number[]>;
    comparedPos: Array<number[]>;
    phrase: {
        text: string;
        array: string[];
    };
}
export interface PhraseDict {
    [key: string]: Phrase;
}
export interface PhrasePosInfo {
    num: 1;
    source: {
        arrFrom: number[];
        arrWith: number[];
        objWith: {
            [key: number]: boolean;
        };
        to: number;
    };
    sourceNeighbor: {
        [key: number]: {
            to: number;
        };
    };
}
export interface SourcePosInfo {
    [key: number]: {
        compared: {
            [key: number]: boolean;
        };
        to: number;
    };
}
