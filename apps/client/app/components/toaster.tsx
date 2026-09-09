"use client";

import { Toast } from "@base-ui/react/toast";
import { CircleAlert, CircleCheck, LoaderCircle, X } from "lucide-react";

/**
 * Wraps the app in a toast provider and renders the single shared viewport.
 * Any client component below this can call `Toast.useToastManager()`.
 */
export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] sm:w-90">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastIcon({ type }: { type?: string }) {
  if (type === "loading") {
    return (
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
    );
  }

  if (type === "error") {
    return <CircleAlert className="h-4 w-4 shrink-0 text-destructive" />;
  }

  if (type === "success") {
    return (
      <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
    );
  }

  return null;
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className="toast-root">
      <Toast.Content className="toast-content">
        <div className="flex pt-0.5">
          <ToastIcon type={toast.type} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="text-sm font-semibold" />
          <Toast.Description className="text-sm break-words text-muted-foreground" />
        </div>

        <Toast.Close
          aria-label="Dismiss"
          className="-mt-1 -mr-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          <X className="h-3.5 w-3.5" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
