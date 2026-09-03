export function getApiErrorMessage(error: any): string[] {
    if (!error) {
        return [];
    }

    if (Array.isArray(error.detail)) {
        return error.detail.map((item: any) => {
            if (typeof item === "string") {
                return item;
            }

            return item?.msg || "Validation error";
        });
    }

    if (typeof error.detail === "string") {
        return [error.detail];
    }

    if (typeof error.message === "string") {
        return [error.message];
    }

    return ["Something went wrong. Please try again."];
}