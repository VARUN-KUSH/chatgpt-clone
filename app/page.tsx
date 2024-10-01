import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Chat from '@/components/chat-ui/Test1'


export default async function Index() {
  return (
    <>
      <Chat/>
    </>
  );
}
