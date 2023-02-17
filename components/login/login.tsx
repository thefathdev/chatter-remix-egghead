import { useOutletContext } from "@remix-run/react";

import type { SupabaseOutletContext } from "~/root";

export const Login = () => {
    const { supabase } = useOutletContext<SupabaseOutletContext>();

    const handleLogIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
        });

        if (error) {
            console.log(error);
        }
    };

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
        }
    };

    return (
        <>
            <button onClick={handleLogOut}>Log Out</button>
            <button onClick={handleLogIn}>Log In</button>
        </>
    );
};
