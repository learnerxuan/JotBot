// components/ConfirmationModal.tsx
import React from 'react';

// Props interface for the ConfirmationModal
interface ConfirmationModalProps {
  isOpen: boolean; // Controls modal visibility
  onCancel: () => void; // Function to call when user cancels
  onConfirm: () => void; // Function to call when user confirms
  title: string; // Title for the modal, e.g., "Confirm Deletion"
  message: string; // Message explaining the action, e.g., "Are you sure you want to delete this?"
  confirmText?: string; // Optional text for the confirm button, defaults to "Confirm"
  cancelText?: string; // Optional text for the cancel button, defaults to "Cancel"
  isLoading?: boolean; // Optional loading state for the confirm button
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    // Modal content container - NO FIXED POSITION OVERLAY NOW
    // It is now the responsibility of the parent component (JournalPage) to position this modal.
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col relative transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
      {/* Modal Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>

      {/* Modal Message */}
      <p className="text-gray-600 text-base mb-6 text-center">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading} // Disable if loading
        >
          {cancelText}
        </button>
        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading} // Disable if loading
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;