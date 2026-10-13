export function SaveErrorBanner({ message }: { message: string | null }) {
    if (!message) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 top-4 z-[60] mx-auto w-fit max-w-md rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium text-danger shadow-lg">
            {message}
        </div>
    );
}
