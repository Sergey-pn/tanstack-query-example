import {Playlists} from "../widgets/playlists/ui/playlists.tsx";
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";
import {AddPlaylistForm} from "../features/playlists/add-playlist/ui/add-playlist-form.tsx";
import {EditPlaylistForm} from "../features/playlists/edit-playlist/ui/edit-playlist-form.tsx";
import {useState} from "react";

export function MyPlaylistsPage() {
    const {data, isPending} = useMeQuery()
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

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
            <Playlists userId={data.userId} onPlaylistSelected={setEditingPlaylistId}/>
            {editingPlaylistId && <EditPlaylistForm key={editingPlaylistId} playlistId={editingPlaylistId}/>}
        </div>)
}
