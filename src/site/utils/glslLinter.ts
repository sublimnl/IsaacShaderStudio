import { parser, GlslSyntaxError } from '@shaderfrog/glsl-parser'

export interface LintError {
  type: 'vertex' | 'fragment' | 'linker'
  line: number
  column?: number
  endLine?: number
  endColumn?: number
  message: string
  source: 'parser' | 'webgl'
  severity?: 'error' | 'warning'
}

// AST nodes from external parser have dynamic shapes based on node type
interface ASTNode {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}


/**
 * Find the location of an unexpected character in the source code.
 * Used when the parser reports an error at line 1 but the actual error is elsewhere.
 * Specifically looks for common patterns like float suffixes (1.0f).
 */
function findUnexpectedCharLocation(
  code: string,
  char: string
): { line: number; column: number } | null {
  const lines = code.split('\n')

  // For 'f' character, likely a float suffix error (1.0f instead of 1.0)
  if (char === 'f') {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Look for patterns like "1.0f" or "0.5f" - number followed by 'f'
      const floatSuffixMatch = line.match(/(\d+\.?\d*)[fF](?![a-zA-Z_])/)
      if (floatSuffixMatch && floatSuffixMatch.index !== undefined) {
        // Point to the 'f' character
        const column = floatSuffixMatch.index + floatSuffixMatch[1].length
        return { line: i + 1, column }
      }
    }
  }

  // For other characters, try a simple search
  for (let i = 0; i < lines.length; i++) {
    const col = lines[i].indexOf(char)
    if (col !== -1) {
      // Skip if it's inside a string or comment
      const beforeChar = lines[i].substring(0, col)
      const inString = (beforeChar.match(/"/g) || []).length % 2 === 1
      const inComment = beforeChar.includes('//')
      if (!inString && !inComment) {
        return { line: i + 1, column: col }
      }
    }
  }

  return null
}

/**
 * Walk the AST and collect all nodes of interest
 * Passes parent and key to callback for context
 */
function walkAST(
  node: ASTNode | null | undefined,
  callback: (node: ASTNode, parent: ASTNode | null, key: string | null) => void,
  parent: ASTNode | null = null,
  key: string | null = null
): void {
  if (!node || typeof node !== 'object') return

  callback(node, parent, key)

  // Recursively walk all properties
  for (const k of Object.keys(node)) {
    const value = node[k]
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === 'object') {
          walkAST(item, callback, node, k)
        }
      }
    } else if (value && typeof value === 'object') {
      walkAST(value, callback, node, k)
    }
  }
}

/**
 * Find the line and column of a symbol declaration in source code
 */
function findDeclarationLocation(
  code: string,
  name: string,
  kind: 'variable' | 'function'
): { line: number; column: number; endColumn: number } | null {
  const lines = code.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (kind === 'function') {
      // Look for function definition: "returnType functionName("
      const funcPattern = new RegExp(`\\b(\\w+)\\s+${name}\\s*\\(`)
      const match = line.match(funcPattern)
      if (match && match.index !== undefined) {
        // Find where the actual function name starts
        const nameStart = line.indexOf(name, match.index)
        if (nameStart !== -1) {
          return {
            line: i + 1,
            column: nameStart,
            endColumn: nameStart + name.length
          }
        }
      }
    } else {
      // Look for variable declaration - identifier followed by ; or , or = or [
      // Match patterns like "float name;", "vec2 name,", "int name =", "float name[10]"
      const varPattern = new RegExp(`\\b${name}\\s*[;,=\\[]`)
      const match = line.match(varPattern)
      if (match && match.index !== undefined) {
        return {
          line: i + 1,
          column: match.index,
          endColumn: match.index + name.length
        }
      }
    }
  }

  return null
}

/**
 * Analyze GLSL AST for unused symbols
 */
function analyzeUnusedSymbols(
  ast: ASTNode,
  shaderType: 'vertex' | 'fragment',
  sourceCode: string
): LintError[] {
  const warnings: LintError[] = []
  const declared: Map<string, { name: string; kind: 'variable' | 'function' }> = new Map()
  const used: Set<string> = new Set()
  const declarationIdentifierNodes: Set<ASTNode> = new Set() // Track identifier nodes that are declarations

  // Built-in variables and functions that should be ignored
  const builtIns = new Set([
    // Built-in variables
    'gl_Position', 'gl_FragColor', 'gl_FragCoord', 'gl_PointSize', 'gl_PointCoord',
    'gl_FrontFacing', 'gl_VertexID', 'gl_InstanceID', 'gl_FragDepth',
    // Common varyings (conventionally used between vertex/fragment)
    'Color0', 'TexCoord0', 'RenderDataOut', 'ScaleOut',
    // Built-in functions - common ones
    'main', 'texture2D', 'texture', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3', 'mat4',
    'float', 'int', 'bool', 'sampler2D', 'samplerCube',
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'pow', 'exp', 'log', 'exp2', 'log2',
    'sqrt', 'inversesqrt', 'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max',
    'clamp', 'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross', 'normalize',
    'reflect', 'refract', 'matrixCompMult', 'lessThan', 'lessThanEqual', 'greaterThan',
    'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not', 'radians', 'degrees',
    // Texture functions
    'textureLod', 'textureGrad', 'textureProj', 'textureSize',
    // Fragment shader built-ins
    'dFdx', 'dFdy', 'fwidth',
  ])

  // First pass: collect declarations and mark their identifier nodes
  walkAST(ast, (node) => {
    // Variable declarations
    if (node.type === 'declaration' || node.type === 'declarator') {
      const identifierNode = node.identifier
      if (identifierNode && identifierNode.identifier) {
        const name = identifierNode.identifier
        if (name && !builtIns.has(name)) {
          declared.set(name, { name, kind: 'variable' })
          declarationIdentifierNodes.add(identifierNode)
        }
      }
    }

    // Function definitions
    if (node.type === 'function' || node.type === 'function_definition') {
      // Get function name from prototype
      const prototype = node.prototype || node
      const header = prototype?.header || prototype
      const nameNode = header?.name
      if (nameNode && nameNode.identifier) {
        const name = nameNode.identifier
        if (name && !builtIns.has(name)) {
          declared.set(name, { name, kind: 'function' })
          declarationIdentifierNodes.add(nameNode)
        }
      }

      // Mark function parameter identifiers as declaration nodes (so they don't count as "used")
      if (prototype?.parameters) {
        for (const param of prototype.parameters) {
          const paramIdentifier = param.identifier
          if (paramIdentifier) {
            declarationIdentifierNodes.add(paramIdentifier)
          }
        }
      }
    }

    // Parameter declarations (in function signatures) - mark their identifiers
    if (node.type === 'parameter_declaration') {
      const identifierNode = node.identifier
      if (identifierNode) {
        declarationIdentifierNodes.add(identifierNode)
      }
    }
  })

  // Second pass: collect usages (excluding declaration identifier nodes)
  walkAST(ast, (node) => {
    // Identifier references - but skip if this is a declaration identifier
    if (node.type === 'identifier' && node.identifier) {
      if (!declarationIdentifierNodes.has(node)) {
        used.add(node.identifier)
      }
    }

    // User-defined function calls have the function name in a type_name node
    // e.g., function_call.identifier.specifier = {type: "type_name", identifier: "myFunc"}
    if (node.type === 'type_name' && node.identifier) {
      used.add(node.identifier)
    }
  })

  // Find unused declarations and compute their locations from source
  for (const [name, info] of declared) {
    if (!used.has(name)) {
      const location = findDeclarationLocation(sourceCode, name, info.kind)
      warnings.push({
        type: shaderType,
        line: location?.line ?? 1,
        column: location?.column,
        endColumn: location?.endColumn,
        message: `'${name}' is declared but never used`,
        source: 'parser',
        severity: 'warning'
      })
    }
  }

  return warnings
}

/**
 * Lint GLSL code using @shaderfrog/glsl-parser
 * This catches syntax errors with precise line/column information
 * and warns about unused variables/functions
 */
export function lintGLSL(
  code: string,
  shaderType: 'vertex' | 'fragment'
): LintError[] {
  const errors: LintError[] = []

  try {
    // Try parsing the code
    const ast = parser.parse(code, { grammarSource: shaderType })

    // If parsing succeeded, check for unused symbols
    const unusedWarnings = analyzeUnusedSymbols(ast, shaderType, code)
    errors.push(...unusedWarnings)

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    const rawMessage = errorMessage.split('\n')[0]

    // Try to get location from GlslSyntaxError
    let line: number | undefined
    let column: number | undefined
    let endLine: number | undefined
    let endColumn: number | undefined

    if (e instanceof GlslSyntaxError) {
      const syntaxError = e as GlslSyntaxError
      const location = syntaxError.location
      line = location?.start?.line
      column = location?.start?.column
      endLine = location?.end?.line
      endColumn = location?.end?.column
    }

    // Try to extract location from error message if not found
    if (line === undefined) {
      const lineMatch = rawMessage.match(/[Ll]ine\s+(\d+)/)
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10)
      }
    }
    if (column === undefined) {
      const colMatch = rawMessage.match(/[Cc]ol(?:umn)?\s+(\d+)/)
      if (colMatch) {
        column = parseInt(colMatch[1], 10)
      }
    }

    // Special handling for common parser errors with bad location
    // If line is 1 or undefined and error mentions unexpected character,
    // try to find the actual location in the source code
    if ((line === undefined || line === 1) && rawMessage.includes('but "')) {
      const charMatch = rawMessage.match(/but "(.)" found/)
      if (charMatch) {
        const unexpectedChar = charMatch[1]
        const foundLocation = findUnexpectedCharLocation(code, unexpectedChar)
        if (foundLocation) {
          line = foundLocation.line
          column = foundLocation.column
        }
      }
    }

    errors.push({
      type: shaderType,
      line: line ?? 1,
      column: column,
      endLine: endLine,
      endColumn: endColumn,
      message: rawMessage,
      source: 'parser',
      severity: 'error'
    })
  }

  return errors
}

/**
 * Result of finding an error location with optional range
 */
export interface ErrorLocation {
  column: number
  endColumn?: number
}

/**
 * Find the extent of an expression around an operator
 * Returns start and end column of the full binary expression
 */
function findBinaryExpressionRange(line: string, operatorIndex: number, operator: string): ErrorLocation {
  // Find left operand - scan backwards for start of expression
  let leftStart = operatorIndex - 1

  // Skip whitespace
  while (leftStart >= 0 && /\s/.test(line[leftStart])) leftStart--

  // Handle closing parens - find matching open
  if (line[leftStart] === ')') {
    let parenDepth = 1
    leftStart--
    while (leftStart >= 0 && parenDepth > 0) {
      if (line[leftStart] === ')') parenDepth++
      else if (line[leftStart] === '(') parenDepth--
      leftStart--
    }
    // Include function name if present
    while (leftStart >= 0 && /[a-zA-Z0-9_]/.test(line[leftStart])) leftStart--
  } else {
    // Scan back through identifier/number
    while (leftStart >= 0 && /[a-zA-Z0-9_.]/.test(line[leftStart])) leftStart--
  }
  leftStart++ // Move to first char of left operand

  // Find right operand - scan forwards for end of expression
  let rightEnd = operatorIndex + operator.length

  // Skip whitespace
  while (rightEnd < line.length && /\s/.test(line[rightEnd])) rightEnd++

  // Handle opening parens or function calls
  if (line[rightEnd] === '(') {
    let parenDepth = 1
    rightEnd++
    while (rightEnd < line.length && parenDepth > 0) {
      if (line[rightEnd] === '(') parenDepth++
      else if (line[rightEnd] === ')') parenDepth--
      rightEnd++
    }
  } else {
    // Scan forward through identifier/number
    while (rightEnd < line.length && /[a-zA-Z0-9_.]/.test(line[rightEnd])) rightEnd++
    // Check for function call
    if (line[rightEnd] === '(') {
      let parenDepth = 1
      rightEnd++
      while (rightEnd < line.length && parenDepth > 0) {
        if (line[rightEnd] === '(') parenDepth++
        else if (line[rightEnd] === ')') parenDepth--
        rightEnd++
      }
    }
  }

  return { column: leftStart, endColumn: rightEnd }
}

/**
 * Find the extent of a function call including all arguments
 */
function findFunctionCallRange(line: string, funcName: string): ErrorLocation | undefined {
  const funcMatch = line.match(new RegExp(`\\b(${funcName})\\s*\\(`))
  if (!funcMatch || funcMatch.index === undefined) return undefined

  const startCol = funcMatch.index
  let endCol = funcMatch.index + funcMatch[0].length

  // Find the closing paren
  let parenDepth = 1
  while (endCol < line.length && parenDepth > 0) {
    if (line[endCol] === '(') parenDepth++
    else if (line[endCol] === ')') parenDepth--
    endCol++
  }

  return { column: startCol, endColumn: endCol }
}

/**
 * Pattern matchers for common WebGL semantic errors
 * These help find the column position for errors that WebGL only reports by line
 */
interface ErrorPattern {
  // Regex to match the error message
  messagePattern: RegExp
  // Function to find the column range in the source line
  findLocation: (line: string, match: RegExpMatchArray) => ErrorLocation | undefined
}

const errorPatterns: ErrorPattern[] = [
  // Division type mismatch: '/' : wrong operand types
  {
    messagePattern: /'\/'\s*:\s*wrong operand types/i,
    findLocation: (line: string) => {
      const commentStart = line.indexOf('//')
      const searchLine = commentStart >= 0 ? line.slice(0, commentStart) : line
      const match = searchLine.match(/[^/]\/[^/]/)
      if (match && match.index !== undefined) {
        const opIndex = match.index + 1
        return findBinaryExpressionRange(line, opIndex, '/')
      }
      return undefined
    }
  },
  // Multiplication type mismatch
  {
    messagePattern: /'\*'\s*:\s*wrong operand types/i,
    findLocation: (line: string) => {
      const match = line.match(/\*/)
      if (match?.index !== undefined) {
        return findBinaryExpressionRange(line, match.index, '*')
      }
      return undefined
    }
  },
  // Addition type mismatch
  {
    messagePattern: /'\+'\s*:\s*wrong operand types/i,
    findLocation: (line: string) => {
      const match = line.match(/\+/)
      if (match?.index !== undefined) {
        return findBinaryExpressionRange(line, match.index, '+')
      }
      return undefined
    }
  },
  // Subtraction type mismatch
  {
    messagePattern: /'-'\s*:\s*wrong operand types/i,
    findLocation: (line: string) => {
      const match = line.match(/[^\s(,=]\s*-/)
      if (match && match.index !== undefined) {
        const opIndex = match.index + match[0].length - 1
        return findBinaryExpressionRange(line, opIndex, '-')
      }
      return undefined
    }
  },
  // Function overload not found (e.g., smoothstep with wrong types)
  {
    messagePattern: /'(\w+)'\s*:\s*no matching overloaded function/i,
    findLocation: (line: string, match: RegExpMatchArray) => {
      const funcName = match[1]
      return findFunctionCallRange(line, funcName)
    }
  },
  // Undeclared identifier
  {
    messagePattern: /'(\w+)'\s*:\s*undeclared identifier/i,
    findLocation: (line: string, match: RegExpMatchArray) => {
      const identifier = match[1]
      const idMatch = line.match(new RegExp(`\\b${identifier}\\b`))
      if (idMatch?.index !== undefined) {
        return { column: idMatch.index, endColumn: idMatch.index + identifier.length }
      }
      return undefined
    }
  },
  // Type mismatch in assignment
  {
    messagePattern: /'='\s*:\s*cannot convert/i,
    findLocation: (line: string) => {
      const match = line.match(/=/)
      if (match?.index !== undefined) {
        // Highlight from = to end of line (or semicolon)
        const semicolon = line.indexOf(';', match.index)
        return { column: match.index, endColumn: semicolon > 0 ? semicolon : line.length }
      }
      return undefined
    }
  },
  // Constructor argument count/type errors
  {
    messagePattern: /'(\w+)'\s*:\s*constructor/i,
    findLocation: (line: string, match: RegExpMatchArray) => {
      const typeName = match[1]
      return findFunctionCallRange(line, typeName)
    }
  },
]

/**
 * Try to find a more precise column position and range for a WebGL error
 * based on the error message and source line
 */
export function findErrorColumn(
  errorMessage: string,
  sourceLine: string
): number | undefined {
  const location = findErrorLocation(errorMessage, sourceLine)
  return location?.column
}

/**
 * Find error location with full range information
 */
export function findErrorLocation(
  errorMessage: string,
  sourceLine: string
): ErrorLocation | undefined {
  for (const pattern of errorPatterns) {
    const match = errorMessage.match(pattern.messagePattern)
    if (match) {
      return pattern.findLocation(sourceLine, match)
    }
  }
  return undefined
}

/**
 * Find all occurrences of a pattern on a line for errors that occur multiple times
 * Returns full location info with ranges
 */
export function findAllErrorLocations(
  errorMessage: string,
  sourceLine: string
): ErrorLocation[] {
  const locations: ErrorLocation[] = []

  // For division errors, find all division operators
  if (/'\/'\s*:\s*wrong operand types/i.test(errorMessage)) {
    const commentStart = sourceLine.indexOf('//')
    const searchLine = commentStart >= 0 ? sourceLine.slice(0, commentStart) : sourceLine
    let pos = 0
    while (pos < searchLine.length) {
      const idx = searchLine.indexOf('/', pos)
      if (idx === -1) break
      // Check it's not // or part of /* */
      if (searchLine[idx + 1] !== '/' && searchLine[idx - 1] !== '*' && searchLine[idx + 1] !== '*') {
        if (idx > 0 && idx < searchLine.length - 1) {
          locations.push(findBinaryExpressionRange(sourceLine, idx, '/'))
        }
      }
      pos = idx + 1
    }
  }

  // For multiplication errors
  else if (/'\*'\s*:\s*wrong operand types/i.test(errorMessage)) {
    let pos = 0
    while (pos < sourceLine.length) {
      const idx = sourceLine.indexOf('*', pos)
      if (idx === -1) break
      locations.push(findBinaryExpressionRange(sourceLine, idx, '*'))
      pos = idx + 1
    }
  }

  // For function overload errors, there's typically only one
  else if (/'(\w+)'\s*:\s*no matching overloaded function/i.test(errorMessage)) {
    const location = findErrorLocation(errorMessage, sourceLine)
    if (location) locations.push(location)
  }

  return locations
}

/**
 * Legacy function for backwards compatibility
 */
export function findAllErrorColumns(
  errorMessage: string,
  sourceLine: string
): number[] {
  return findAllErrorLocations(errorMessage, sourceLine).map(loc => loc.column)
}
