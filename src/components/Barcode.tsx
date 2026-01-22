import React from 'react'

interface BarcodeProps {
  value: string
  width?: number
  height?: number
  className?: string
}

/**
 * A simple Code 39 Barcode Generator
 * This implementation uses SVG for clean rendering without external dependencies.
 * Code 39 is easy to implement and widely supported.
 */
export const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 1.5,
  height = 40,
  className = '',
}) => {
  // Code 39 encoding table
  // 1 = wide, 0 = narrow
  // Each pattern is 9 bits: 5 bars, 4 spaces
  const code39Table: { [key: string]: string } = {
    '0': '000110100',
    '1': '100100001',
    '2': '001100001',
    '3': '101100000',
    '4': '000110001',
    '5': '100110000',
    '6': '001110000',
    '7': '000100101',
    '8': '100100100',
    '9': '001100100',
    A: '100001001',
    B: '001001001',
    C: '101001000',
    D: '000011001',
    E: '100011000',
    F: '001011000',
    G: '000001101',
    H: '100001100',
    I: '001001100',
    J: '000011100',
    K: '100000011',
    L: '001000011',
    M: '101000010',
    N: '000010011',
    O: '100010010',
    P: '001010010',
    Q: '000000111',
    R: '100000110',
    S: '001000110',
    T: '000010110',
    U: '110000001',
    V: '011000001',
    W: '111000000',
    X: '010010001',
    Y: '110010000',
    Z: '011010000',
    '-': '010000101',
    '.': '110000100',
    ' ': '011000100',
    '/': '010100010',
    '*': '010010100',
  }

  const encode = (val: string) => {
    const upperVal = `*${val.toUpperCase()}*`
    let pattern = ''

    for (let i = 0; i < upperVal.length; i++) {
      const char = upperVal[i]
      const charPattern = code39Table[char] || code39Table[' ']

      // Each char pattern consists of 9 elements (5 bars, 4 spaces)
      // We'll convert this to a sequence of wide/narrow bars and spaces
      for (let j = 0; j < 9; j++) {
        const isWide = charPattern[j] === '1'
        const isBar = j % 2 === 0

        // Bar (1) or Space (0)
        const bit = isBar ? '1' : '0'
        const count = isWide ? 3 : 1

        for (let k = 0; k < count; k++) {
          pattern += bit
        }
      }

      // Inter-character gap (narrow space)
      if (i < upperVal.length - 1) {
        pattern += '0'
      }
    }
    return pattern
  }

  const pattern = encode(value)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={pattern.length * width}
        height={height}
        viewBox={`0 0 ${pattern.length * width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="shape-rendering-crispEdges"
      >
        {pattern
          .split('')
          .map((bit, i) =>
            bit === '1' ? (
              <rect
                key={i}
                x={i * width}
                y={0}
                width={width}
                height={height}
                fill="black"
              />
            ) : null,
          )}
      </svg>
      <span className="text-[10px] font-mono mt-1 tracking-[0.2em]">
        {value}
      </span>
    </div>
  )
}
