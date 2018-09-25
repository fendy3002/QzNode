/**
 * Phrase
 */
export interface FindPhraseService {
    (source: string, compared: string): Promise<PharseResult>;
    fromArray: (source: string[], compared: string[]) => Promise<PharseResult>;
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
/**
 * BreakWord
 */
export interface BreakWordService {
    (source: string, compared: string): Promise<BreakWordResult>;
    fromArray: (sourceArray: string[], comparedArray: string[]) => Promise<BreakWordResult>;
}
export interface BreakWordResult {
    source: string[] | string;
    compared: string[] | string;
    break: {
        source: {
            match: BreakWordMatch[];
            text: string;
        };
        compared: {
            match: BreakWordMatch[];
            text: string;
        };
    };
}
export interface BreakWordMatch {
    word: string;
    to: string[];
}
