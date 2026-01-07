import AuthGuard from "../components/auth/AuthGuard";

export default function ProfilePage() {
    return (
        <AuthGuard>
            <div className="p-8 text-white">
                <h1 className="text-xl font-bold">My Orders</h1>
            </div>
        </AuthGuard>
    );
}
