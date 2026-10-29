/**
 * Composant pour afficher les réponses avec support Markdown avancé
 * Supporte les tableaux, le code, LaTeX et les références médicales
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownResponse({ content }) {
  return (
    <div className="markdown-response">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Personnalisation des composants Markdown
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-white mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-white/90 mb-3 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/90 mb-3 space-y-1 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/90 mb-3 space-y-1 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-white/90">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-medical-light-blue">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-white/80">{children}</em>
          ),
          code: ({ inline, children }) => (
            inline ? (
              <code className="bg-white/10 px-2 py-1 rounded text-medical-green text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-black/30 p-4 rounded-lg text-medical-green text-sm font-mono overflow-x-auto mb-4">
                {children}
              </code>
            )
          ),
          pre: ({ children }) => (
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-medical-light-blue pl-4 italic text-white/70 mb-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-medical-blue/30">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white/5">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-white/10 hover:bg-white/10 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-white font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-white/90">{children}</td>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-medical-light-blue hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
