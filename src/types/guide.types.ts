export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface OutputLine {
  type: 'pass' | 'fail' | 'info' | 'summary' | 'title'
  text: string
}

export interface CodeExample {
  code: string
  language: 'tsx' | 'ts' | 'javascript' | 'json' | 'bash' | 'text'
  filename?: string
  showLineNumbers?: boolean
}

export interface AAAExample {
  arrangeCode: string
  actCode: string
  assertCode: string
  language?: 'tsx' | 'ts'
  description?: string
}

export interface ComponentTestExample {
  componentCode: string
  testCode: string
  componentFilename?: string
  testFilename?: string
}

export interface SectionMeta {
  id: string
  title: string
  shortTitle: string
  icon: string
  description: string
  path: string
}
