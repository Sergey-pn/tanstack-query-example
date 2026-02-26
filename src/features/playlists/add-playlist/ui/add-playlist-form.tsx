import {type Path, useForm} from "react-hook-form";
import type {components} from "../../../../shared/api/schema.ts";
import {useAddPlaylistMutation} from "../api/use-add-playlist-mutation.ts";
import {isJsonApiErrorDocument, parseJsonApiErrors} from "../../../../shared/util/json-api-error.ts";
import {queryErrorHandlerForRHFFactory} from "../../../../shared/ui/util/query-error-handler-for-rhf-factory.ts";
type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload']
type JsonApiErrorDocument = components['schemas']['JsonApiErrorDocument']

export const AddPlaylistForm = () => {
    const {register, handleSubmit, reset, setError, formState: {errors}} = useForm<CreatePlaylistRequestPayload>()

    const {mutateAsync} = useAddPlaylistMutation()

    const onSubmit = async (data: CreatePlaylistRequestPayload) => {
        try {
            await mutateAsync(data)
            reset()
        }
        catch(error) {
            queryErrorHandlerForRHFFactory({setError})(error as unknown as JsonApiErrorDocument)
            // if (isJsonApiErrorDocument(error)) {
            //     const {fieldErrors, globalErrors} = parseJsonApiErrors(error)
            //     for (const [field, message] of Object.entries(fieldErrors)) {
            //         setError(field as Path<CreatePlaylistRequestPayload>, {type: 'server', message})
            //     }
            //     if (globalErrors.length > 0) {
            //         setError('root.server', {
            //             type: 'server',
            //             message: globalErrors.join('\n'),
            //         })
            //     }
            // }
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Playlist</h2>
        <p>
            <input {...register('data.attributes.title')}/>
        </p>
        {errors.title && <p>{errors.title.message}</p>}
        <p>
            <textarea {...register('data.attributes.description')}></textarea>
        </p>
        {errors.description && <p>{errors.description.message}</p>}
        <button type={'submit'}>Create</button>
        {errors.root?.server && <p>{errors.root.server.message}</p>}
    </form>
}