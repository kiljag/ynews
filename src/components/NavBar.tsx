import Link from 'next/link';

export default function NavBar() {

    return (
        <nav className="flex items-center justify-between flex-wrap bg-orange-600 p-2">
            <div className="text-white">
                <span className="font-semibold text-sm tracking-tight">Y News</span>
            </div>
        </nav>
    )
}