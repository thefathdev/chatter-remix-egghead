import { useOutletContext } from "@remix-run/react";
import type { Database } from "db_types";
import { useEffect, useState } from "react";
import type { SupabaseOutletContext } from "~/root";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export const RealtimeMessages = ({
    serverMessages,
}: {
    serverMessages: Message[];
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const { supabase } = useOutletContext<SupabaseOutletContext>();

    useEffect(() => {
        setMessages(serverMessages);
    }, [serverMessages]);

    useEffect(() => {
        const channel = supabase
            .channel("*")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const newMessage = payload.new as Message;

                    if (
                        !messages.find(
                            (message) => message.id === newMessage.id
                        )
                    ) {
                        setMessages([...messages, newMessage]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [messages, supabase]);
    return <pre>{JSON.stringify(messages, null, 2)}</pre>;
};
