import type {components} from "../api/schema.ts";

export type JsonApiErrorDocument = components['schemas']['JsonApiErrorDocument']

export type ExtractError<T> = T extends { error?: infer E } ? E : unknown

export function isJsonApiErrorDocument(error: unknown): error is JsonApiErrorDocument {
    return (
        typeof error === 'object' &&
        error !== null &&
        // @ts-expect-error type no matter
        Array.isArray(error.errors)
    )
}

export function parseJsonApiErrors(errorDoc: JsonApiErrorDocument): {
    fieldErrors: Record<string, string>
    globalErrors: string[]
} {
    const fieldErrors: Record<string, string> = {}
    const globalErrors: string[] = []

    for (const err of errorDoc.errors) {
        const msg = err.detail ?? err.title ?? 'Unknown error'
        const ptr = err.source?.pointer
        if (ptr) {
            // убираем префикс JSON:API
            const field = ptr.replace(/^\/data\/attributes\//, '')
            fieldErrors[field] = msg
        } else {
            globalErrors.push(msg)
        }
    }

    return {fieldErrors, globalErrors}
}