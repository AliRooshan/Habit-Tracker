import { useState } from 'react';

interface DeleteConfirmationModalProps {
    habitName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({ habitName, onClose, onConfirm }: DeleteConfirmationModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="card max-w-sm w-full animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                    <p className="text-brown-700 font-medium mb-4 text-lg">
                        Are you sure you want to delete <span className="font-bold text-brown-900">"{habitName}"</span>?
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="btn bg-red-300 hover:bg-red-400 text-brown-900 flex-1 disabled:opacity-50 border border-red-200"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
