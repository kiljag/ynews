
import Image from 'next/image';
import NavBar from "@/components/NavBar";
import { AskItem, fetchPost } from "@/lib/post";
import usericon from '@/assets/user-icon.webp';

interface ItemDiv {
    item: AskItem,
    depth: number,
}

function dfs(itemDivs: ItemDiv[], item: AskItem, depth: number) {
    itemDivs.push({
        item: item,
        depth: depth,
    });

    for (let kid of item.Kids) {
        dfs(itemDivs, kid, depth + 1);
    }
}

function orderItems(item: AskItem): ItemDiv[] {
    let itemDivs: ItemDiv[] = [];
    dfs(itemDivs, item, 0);
    return itemDivs;
}

interface PostProps {
    params: {
        id: number,
    },
}

export default async function Post(props: PostProps) {

    let askItem = await fetchPost(props.params.id);
    if (askItem === null) {
        return (
            <>
                <NavBar />
                {'No data found'}
            </>
        );
    }

    let divItems = orderItems(askItem);
    let children = divItems.filter(divitem => divitem.item.UserId && divitem.item.Content).map((divitem) => {
        return (
            <div key={divitem.item.ItemId} className='text-left p-2' style={{
                paddingLeft: (1.5 * divitem.depth) + 'rem',
            }}>
                <div>
                    <Image src={usericon} alt={'user icon'} className='h-6 w-6 rounded-full inline' />
                    <span className='pl-2 text-sm font-medium text-gray-800'>{divitem.item.UserId}</span>
                </div>
                {divitem.item.Title !== "" ?
                    <div className='pl-8 text-left text-sm font-bold'>{divitem.item.Title}</div> : null
                }
                <div className='text-sm pl-8' dangerouslySetInnerHTML={{ __html: divitem.item.Content }}>
                </div>
            </div>
        );
    })

    return (
        <div className='border border-solid p-2'>
            {children}
        </div>
    );
} 