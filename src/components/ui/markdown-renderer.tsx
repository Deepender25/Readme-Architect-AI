"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-invert prose-green max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 border-b border-green-400/30 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mb-4 mt-8 flex items-center">
              <span className="text-green-400 mr-2">##</span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-white mb-3 mt-6 flex items-center">
              <span className="text-green-400 mr-2">###</span>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold text-white mb-2 mt-4 flex items-center">
              <span className="text-green-400 mr-2">####</span>
              {children}
            </h4>
          ),
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="text-gray-300 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          // Custom list styles
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 flex items-start">
              <span className="text-green-400 mr-2 mt-1">•</span>
              <span>{children}</span>
            </li>
          ),
          // Custom code styles
          code: ({ inline, children }) => (
            inline ? (
              <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {children}
              </code>
            )
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-green-400 pl-4 py-2 bg-green-400/5 rounded-r-lg mb-4 italic text-gray-300">
              {children}
            </blockquote>
          ),
          // Custom link styles
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 underline transition-colors"
            >
              {children}
            </a>
          ),
          // Custom image styles
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg border border-gray-700 mb-4"
            />
          ),
          // Custom table styles
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-700 px-4 py-2 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-700 px-4 py-2 text-gray-300">
              {children}
            </td>
          ),
          // Custom horizontal rule
          hr: () => (
            <hr className="border-gray-700 my-8" />
          ),
          // Custom strong/bold text
          strong: ({ children }) => (
            <strong className="text-white font-bold">
              {children}
            </strong>
          ),
          // Custom emphasis/italic text
          em: ({ children }) => (
            <em className="text-gray-200 italic">
              {children}
            </em>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}