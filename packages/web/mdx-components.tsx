import type { MDXComponents } from 'mdx/types';
import type { ImageProps } from 'next/image';
import BaseImage from '@/components/ui/base-img';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    img: (props: ImageProps) => {
      return (
        <BaseImage
          {...props}
          style={{
            width: '100%',
            height: 'auto'
          }}
          placeholder="blur"
        />
      );
    },
    h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
    h2: (props) => (
      <h2
        className="text-xl font-semibold mt-6 mb-4 border-b-2 border-gray-200 pb-2"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="text-lg font-semibold mt-6 mb-4" {...props} />
    ),
    h4: (props) => (
      <h4 className="text-base font-semibold mt-6 mb-4" {...props} />
    ),
    h5: (props) => (
      <h5 className="text-base font-semibold mt-6 mb-4" {...props} />
    ),
    h6: (props) => (
      <h6 className="text-sm font-semibold mt-6 mb-4" {...props} />
    ),
    p: (props) => <p className="mt-0 mb-4" {...props} />,
    a: (props) => <a className="link-underline" {...props} />,
    ul: (props) => <ul className="list-disc pl-5 mt-0 mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-5 mt-0 mb-4" {...props} />,
    li: (props) => <li className="mb-2" {...props} />,
    code: (props) => <code className="bg-gray-500 rounded p-1" {...props} />,
    pre: (props) => (
      <pre className="bg-gray-600 rounded p-4 overflow-x-auto" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="pl-4 border-l-4 border-gray-200 my-4 italic text-gray-300"
        {...props}
      />
    )
  };
}
