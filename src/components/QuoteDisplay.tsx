import React from 'react';
import { Quote } from '../types';
import { BookOpen, Quote as QuoteIcon, BookOpenCheck } from 'lucide-react';

interface QuoteDisplayProps {
  quote: Quote;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  if (!quote.showQuote) return null;

  const getIcon = () => {
    switch (quote.type) {
      case 'quran':
        return <BookOpen className="w-5 h-5 text-pink-600" />;
      case 'hadith':
        return <BookOpenCheck className="w-5 h-5 text-pink-600" />;
      default:
        return <QuoteIcon className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <div className="text-center space-y-2 max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <blockquote className="italic text-lg text-gray-700">
        "{quote.text}"
      </blockquote>
      <cite className="block text-sm text-gray-600 not-italic">
        — {quote.source}
      </cite>
    </div>
  );
};

export default QuoteDisplay;
