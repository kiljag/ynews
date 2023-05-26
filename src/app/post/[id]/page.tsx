import NavBar from "@/components/NavBar";
import { AskItem, fetchPost } from "@/lib/post";
import { useRouter } from "next/navigation";

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

    interface Item {
        id: number,
        depth: number,
    }

    let children: any[] = []

    let items: Item[] = [];
    items.push({
        id: askItem.ItemId,
        depth: 0,
    });

    let postmap: Record<number, AskItem> = {
        [askItem.ItemId]: askItem,
    }

    while (items.length > 0) {

        let item = items[0];
        let post = postmap[item.id];

        children.push(
            <div key={item.id} className="px-2 py-2">
                <div className="font-bold text-sm text-black">
                    {post.UserId}
                </div>
                <div className="flex flex-wrap">
                    <p className="text-gray-700 text-base">
                        {post.Content}
                    </p>
                </div>
            </div>
        );

        for (let k of post.Kids) {
            items.push({
                id: k.ItemId,
                depth: item.depth + 1,
            })
            postmap[k.ItemId] = k
        }
        items = items.slice(1);
    }

    return (
        <div>
            <NavBar />
            <div className="max-w rounded overflow-hidden shadow-lg">

            </div>
            {children}
        </div>
    );
} 