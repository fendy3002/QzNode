export interface thousandSeparator{
    (value: number, option?: {
        thousandSymbol?: string,
        decimalSymbol?: string,
    })
}