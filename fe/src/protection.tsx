import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "./apis/authorization";

function ProtectedLayout() {
    const { isPending, isError, data } = useQuery({
        queryKey: ['session'],
        queryFn: () => {
            return getSession();
        },
        retry: false
    })

    if (isPending) {
        return <div>Loading...</div>
    }
    if (isError) {
        return <div>Unknown Error from Server</div>
    }
    if (data.statusCode === 401) {
        return <Navigate to="/login"/>
    }

    return <Outlet/>
}

export default ProtectedLayout;