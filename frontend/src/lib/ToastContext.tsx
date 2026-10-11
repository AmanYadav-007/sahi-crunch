'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface DialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  isLoading?: boolean;
}

interface AlertModalOptions {
  title?: string;
  message: string;
  buttonLabel?: string;
  type?: ToastType;
}

interface AlertState extends AlertModalOptions {
  isOpen: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  confirm: (options: ConfirmDialogOptions) => void;
  alert: (message: string, title?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    message: '',
  });

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = { id, message, type, title, duration };
      setToasts((prev) => [...prev, item]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message: string, title = 'Success') => toast(message, 'success', title),
    [toast]
  );

  const showError = useCallback(
    (message: string, title = 'Notice') => toast(message, 'error', title),
    [toast]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => toast(message, 'info', title),
    [toast]
  );

  const showWarning = useCallback(
    (message: string, title = 'Attention') => toast(message, 'warning', title),
    [toast]
  );

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setDialog({
      ...options,
      isOpen: true,
      isLoading: false,
    });
  }, []);

  const alertModal = useCallback(
    (message: string, title?: string, type: ToastType = 'info') => {
      setAlertState({
        isOpen: true,
        message,
        title: title || (type === 'success' ? 'Great!' : type === 'error' ? 'Notice' : 'Information'),
        type,
      });
    },
    []
  );

  const handleConfirmAction = async () => {
    if (!dialog.onConfirm) return;
    try {
      setDialog((prev) => ({ ...prev, isLoading: true }));
      await dialog.onConfirm();
    } finally {
      setDialog((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleCancelAction = () => {
    dialog.onCancel?.();
    setDialog((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };

  return (
    <ToastContext.Provider
      value={{
        toast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        confirm,
        alert: alertModal,
      }}
    >
      {children}

      {/* Floating Modern Toast Stack */}
      <div className="fixed top-5 right-4 left-4 sm:left-auto sm:right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full mx-auto sm:mx-0">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl p-4 shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 flex items-start gap-3.5 ${
                isSuccess
                  ? 'bg-[#183920]/95 border-emerald-500/30 text-emerald-50 shadow-emerald-950/20'
                  : isError
                  ? 'bg-[#3b0d14]/95 border-rose-500/30 text-rose-50 shadow-rose-950/20'
                  : isWarning
                  ? 'bg-[#3d2407]/95 border-amber-500/30 text-amber-50 shadow-amber-950/20'
                  : 'bg-[#29171a]/95 border-[#D48924]/30 text-[#FDFBF7] shadow-stone-950/30'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 size={19} className="text-emerald-400" />}
                {isError && <AlertCircle size={19} className="text-rose-400" />}
                {isWarning && <AlertTriangle size={19} className="text-amber-400" />}
                {!isSuccess && !isError && !isWarning && (
                  <Sparkles size={19} className="text-[#E2952A]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h4 className="text-xs font-black uppercase tracking-wider opacity-90 mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs font-medium leading-relaxed opacity-95">{t.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Confirmation Modal */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#FBF7F0] border border-[#e5d8c3] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  dialog.variant === 'danger'
                    ? 'bg-rose-100 text-rose-600'
                    : dialog.variant === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-[#681121]/10 text-[#681121]'
                }`}
              >
                {dialog.variant === 'danger' ? (
                  <AlertCircle size={24} />
                ) : (
                  <HelpCircle size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black text-[#1E1E24]">
                  {dialog.title || 'Confirm Action'}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  {dialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCancelAction}
                disabled={dialog.isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors disabled:opacity-50"
              >
                {dialog.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={dialog.isLoading}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                  dialog.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-[#681121] hover:bg-[#540c19] shadow-[#681121]/20'
                }`}
              >
                {dialog.isLoading ? 'Processing...' : dialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog Modal */}
      {alertState.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#FBF7F0] border border-[#e5d8c3] shadow-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-br from-[#681121] to-[#3a0812] text-white shadow-lg shadow-[#681121]/20">
              {alertState.type === 'success' ? (
                <CheckCircle2 size={26} className="text-emerald-400" />
              ) : alertState.type === 'error' ? (
                <AlertCircle size={26} className="text-rose-400" />
              ) : (
                <Sparkles size={26} className="text-[#E2952A]" />
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-[#1E1E24]">
                {alertState.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5 max-w-xs mx-auto">
                {alertState.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
                className="w-full py-2.5 px-4 rounded-xl bg-[#681121] hover:bg-[#540c19] text-white text-xs font-black shadow-md transition-all active:scale-95"
              >
                {alertState.buttonLabel || 'Got It'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
