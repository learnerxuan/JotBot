// components/JournalModal.tsx
import React, { useState } from 'react';

// Define props for the JournalModal component
interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  onIJournalClick: (title: string, content: string) => void; // For the IJournal button
}

const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose, onSave, onIJournalClick }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  if (!isOpen) return null; // Don't render anything if the modal is not open

  const handleSave = () => {
    onSave(title, content);
    setTitle(''); // Clear input after save
    setContent('');
  };

  const handleIJournal = () => {
    onIJournalClick(title, content);
    // Optionally clear/close or show a new state after IJournal action
  };

  return (
    // Overlay background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Modal content box */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col relative transform transition-all scale-100 opacity-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">New Journal Entry</h2>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Journal Title"
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Journal Content Area */}
        <textarea
          placeholder="Write your thoughts and feelings here..."
          className="flex-grow w-full p-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-base resize-none min-h-[200px] md:min-h-[300px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
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
        </div>
      </div>
    </div>
  );
};

export default JournalModal;