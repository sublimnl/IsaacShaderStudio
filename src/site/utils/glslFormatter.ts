/**
 * GLSL Code Formatter
 * Formats GLSL shader code with proper indentation and whitespace normalization.
 */

interface FormatOptions {
  indentSize?: number
  indentChar?: string
}

/**
 * Formats GLSL code with proper indentation.
 * - Normalizes indentation based on braces { }
 * - Trims trailing whitespace from lines
 * - Collapses multiple consecutive blank lines to one
 * - Preserves single blank lines for readability
 */
export function formatGLSL(code: string, options: FormatOptions = {}): string {
  const { indentSize = 4, indentChar = ' ' } = options
  const indent = indentChar.repeat(indentSize)

  // Split into lines and trim trailing whitespace
  const lines = code.split('\n').map(line => line.trimEnd())

  let indentLevel = 0
  const formattedLines: string[] = []
  let prevLineWasBlank = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Handle blank lines - collapse multiple to one
    if (trimmedLine === '') {
      if (!prevLineWasBlank && formattedLines.length > 0) {
        formattedLines.push('')
        prevLineWasBlank = true
      }
      continue
    }
    prevLineWasBlank = false

    // Count leading close braces/parens
    const leadingCloses = countLeadingCloses(trimmedLine)

    // Decrease indent for leading close braces
    const lineIndent = Math.max(0, indentLevel - leadingCloses)

    // Apply current indentation
    const indentedLine = indent.repeat(lineIndent) + trimmedLine
    formattedLines.push(indentedLine)

    // Count braces to adjust indent level for next line
    // Skip the leading closes we already accounted for
    const { opens, closes } = countBraces(trimmedLine, leadingCloses)
    indentLevel = Math.max(0, lineIndent + opens - closes)
  }

  // Remove trailing blank lines
  while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
    formattedLines.pop()
  }

  return formattedLines.join('\n')
}

/**
 * Count leading close braces/parens at start of line (before any other content)
 */
function countLeadingCloses(line: string): number {
  let count = 0
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '}' || char === ')') {
      count++
    } else if (char !== ' ' && char !== '\t') {
      break
    }
  }
  return count
}

/**
 * Count opening and closing braces in a line, ignoring those in strings and comments.
 * skipLeadingCloses: number of leading close braces to skip (already counted)
 */
function countBraces(line: string, skipLeadingCloses: number = 0): { opens: number, closes: number } {
  let opens = 0
  let closes = 0
  let inString = false
  let stringChar = ''
  let inLineComment = false
  let skippedCloses = 0
  let foundNonBrace = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    // Check for line comment start
    if (!inString && char === '/' && nextChar === '/') {
      inLineComment = true
      break // Rest of line is comment
    }

    // Handle string literals
    if (!inLineComment) {
      if ((char === '"' || char === "'") && (i === 0 || line[i - 1] !== '\\')) {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
        }
      }
    }

    // Count braces only outside strings and comments
    if (!inString && !inLineComment) {
      if (char === '{' || char === '(') {
        opens++
        foundNonBrace = true
      } else if (char === '}' || char === ')') {
        // Skip leading closes that we already accounted for
        if (!foundNonBrace && skippedCloses < skipLeadingCloses) {
          skippedCloses++
        } else {
          closes++
        }
        if (char !== '}' && char !== ')') {
          foundNonBrace = true
        }
      } else if (char !== ' ' && char !== '\t') {
        foundNonBrace = true
      }
    }
  }

  return { opens, closes }
}

/**
 * Formats GLSL code for XML export with additional indentation prefix.
 */
export function formatGLSLForXML(code: string, baseIndent: string = '      '): string {
  const formatted = formatGLSL(code)
  return formatted.split('\n').map(line => baseIndent + line).join('\n')
}
