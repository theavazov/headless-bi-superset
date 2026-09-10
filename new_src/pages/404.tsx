import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center p-4">
            <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
            <p className="mt-2 text-lg text-slate-600">Страница не найдена</p>
            <Link style={{ padding: "4px 8px", marginTop: "8px" }} to="/" className="rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700">
                Home
            </Link>
        </div>
    );
};