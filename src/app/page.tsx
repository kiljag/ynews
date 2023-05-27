
import Link from 'next/link';
import Image from 'next/image';

import { AskItem, fetchPosts } from '@/lib/post';
import usericon from '@/assets/user-icon.webp';

export const revalidate = 0;

export default async function Home() {

    let posts = await fetchPosts();
    let postComponents = posts.map(post => {
        return (
            <div key={post.ItemId} className='border border-solid p-2 text-left border-orange-200 hover:border-orange-500'>
                <div>
                    <Image src={usericon} alt={'user icon'} className='h-6 w-6 rounded-full inline' />
                    <span className='pl-4 text-sm font-medium text-gray-800'>{post.UserId}</span>
                </div>
                <Link href={`/post/${post.ItemId}`}>
                    <div className='pt-2 text-left text-sm font-bold'>{post.Title}</div>
                    <div className='pt-2 text-left text-sm' dangerouslySetInnerHTML={{ __html: post.Content }}>
                    </div>
                </Link>
            </div>
        );
    });

    return (
        <div>
            <div className="flex flex-col">
                {postComponents}
            </div>
        </div >
    );
}