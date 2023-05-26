import Link from 'next/link';

export default function NavBar() {

    return (
        <nav className="flex items-center justify-between flex-wrap bg-orange-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">YNews</span>
            </div>
        </nav>
    )
}