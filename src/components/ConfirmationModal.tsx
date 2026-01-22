import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ConfirmationModalProps {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'danger' | 'primary' | 'neutral';
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmationModal({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'primary',
    onClose,
    onConfirm
}: ConfirmationModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { isBatman } = useTheme();

    const handleConfirm = async () => {
        setIsProcessing(true);
        await onConfirm();
        setIsProcessing(false);
    };

    const getButtonStyles = () => {
        if (isBatman) {
            switch (confirmVariant) {
                case 'danger':
                    return 'bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white border-red-700 shadow-lg';
                case 'primary':
                    return 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gold-400 border-gray-700 shadow-lg';
                default:
                    return 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 shadow-lg';
            }
        } else {
            switch (confirmVariant) {
                case 'danger':
                    return 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white border-red-300 shadow-md';
                case 'primary':
                    return 'bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white shadow-md';
                default:
                    return 'bg-gradient-to-r from-sand-400 to-sand-500 hover:from-sand-500 hover:to-sand-600 text-brown-900 shadow-md';
            }
        }
    };

    const getCancelButtonStyles = () => {
        if (isBatman) {
            return 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 border-gray-700 shadow-lg';
        } else {
            return 'bg-gradient-to-r from-sand-200 to-sand-300 hover:from-sand-300 hover:to-sand-400 text-brown-800 border-sand-300 shadow-md';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div
                className={`max-w-sm w-full animate-scale-in p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl border-2 ${isBatman
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700'
                    : 'bg-white/80 backdrop-blur-xl border-sand-200'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    {title && (
                        <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isBatman ? 'text-gold-400' : 'text-brown-900'}`}>
                            {title}
                        </h3>
                    )}
                    <div className={`font-medium mb-6 text-lg ${isBatman ? 'text-gray-300' : 'text-brown-700'}`}>
                        {message}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${getCancelButtonStyles()}`}
                            disabled={isProcessing}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 disabled:opacity-50 ${getButtonStyles()}`}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
