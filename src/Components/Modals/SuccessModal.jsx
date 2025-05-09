// components/Modals/SuccessModal.jsx
export const SuccessModal = ({ title, message, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl animate-fade-in">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mt-3">{title}</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-900 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };