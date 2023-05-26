import Link from 'next/link';

import NavBar from "@/components/NavBar";
import { fetchPosts } from '@/lib/post';

export default async function Home() {

    let posts = await fetchPosts();
    let postComponents = posts.map(post => {
        return (
            <div key={post.ItemId} className="px-6 py-4 border-solid border-2">
                <div className="font-bold text-sm">
                    <span className="text-black pr-4">
                        <Link href={`/post/${post.ItemId}`}>{post.ItemId}</Link>
                    </span>
                    <span>{`u/${post.UserId}`}</span>
                </div>
                <p className="text-gray-700 text-base">
                    {post.Content}
                </p>
            </div>
        )
    });

    return (
        <div>
            <NavBar />
            <div className="max-w rounded overflow-hidden shadow-lg">
                {postComponents}
            </div>
        </div >
    );
}