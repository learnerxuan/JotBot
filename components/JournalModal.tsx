// components/JournalModal.tsx
import React, { useState, useEffect } from 'react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  // For new entry mode:
  onSave?: (title: string, content: string) => void;
  onIJournalClick?: (title: string, content: string) => void;
  // For view mode:
  initialTitle?: string;
  initialContent?: string;
  isViewMode?: boolean; // New prop to indicate if it's in view mode
}

const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onIJournalClick,
  initialTitle = '',
  initialContent = '',
  isViewMode = false,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(title, content);
    }
  };

  const handleIJournal = () => {
    if (onIJournalClick) {
      onIJournalClick(title, content);
    }
  };

  return (
    // Overlay background - changed from black to a light gray/white with higher opacity
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      {/* Modal content box */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col relative transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          {isViewMode ? 'View Journal Entry' : 'New Journal Entry'}
        </h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Journal Title"
          className={`w-full p-4 mb-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold
                      ${isViewMode ? 'bg-gray-100 text-gray-700 cursor-default' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={isViewMode}
        />

        {/* Journal Content Area */}
        <textarea
          placeholder="Write your thoughts and feelings here..."
          className={`flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none min-h-[200px] md:min-h-[300px]
                      ${isViewMode ? 'bg-gray-100 text-gray-700 cursor-default' : ''}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={isViewMode}
        ></textarea>

        {/* Action Buttons - Conditional rendering based on isViewMode */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          {isViewMode ? (
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={handleIJournal}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                💡 IJournal
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                💾 Save Journal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalModal;