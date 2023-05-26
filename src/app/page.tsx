import NavBar from "@/components/NavBar";
import { useRouter } from 'next/navigation';
import { fetchPosts } from '@/lib/post';

export default async function Home() {

    let posts = await fetchPosts();
    let postComponents = posts.map(post => {
        return (
            <div key={post.ItemId} className="px-6 py-4 border-solid border-2">
                <div className="font-bold text-sm">{`u/${post.UserId}`}</div>
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