import React from 'react'
import ReactMarkdown from 'react-markdown'

export interface TextBlockProps {
  content: string
}

export const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div data-testid="text-block" className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <code
                  className={`${className} block bg-gray-800 rounded p-3 text-sm font-mono overflow-x-auto`}
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800 rounded-lg overflow-x-auto my-2">
              {children}
            </pre>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-2 mb-1">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default TextBlock
