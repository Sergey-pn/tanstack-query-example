import {Playlists} from "../widgets/playlists/ui/playlists.tsx";
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";
import {AddPlaylistForm} from "../features/playlists/add-playlist/ui/add-playlist-form.tsx";

export function MyPlaylistsPage() {
    const {data, isPending} = useMeQuery()

    if (isPending) return (
        <div>Loading...</div>
    )

    if (!data) {
        return <Navigate to='/' replace/>
    }

    return (
        <div>
            <h2>My Playlists</h2>
            <hr/>
            <AddPlaylistForm/>
            <hr/>
            <Playlists userId={data.userId}/>
        </div>)
}
