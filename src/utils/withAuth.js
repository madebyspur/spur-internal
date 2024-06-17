import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const [loading, setLoading] = useState(true);
        const [authenticated, setAuthenticated] = useState(false);
        const [profile, setProfile] = useState(null);
        const router = useRouter();
        const supabase = createClientComponentClient();

        useEffect(() => {
            const checkUser = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { data: profileData, error } = await supabase
                        .from('profiles')
                        .select('first_name')
                        .eq('id', session.user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error);
                    } else {
                        setProfile(profileData);
                        setAuthenticated(true);
                    }
                } else {
                    router.push("/login");
                }
                setLoading(false);
            };

            checkUser();
        }, [router, supabase]);

        if (loading) {
            return <div>Loading...</div>;
        }

        return authenticated ? <WrappedComponent {...props} profile={profile} /> : null;
    };
};

export default withAuth;
