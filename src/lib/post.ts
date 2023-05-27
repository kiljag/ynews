import { Client, Pool } from 'pg';
import he from 'he';

export interface AskItem {
    ItemId: number,
    UserId: string,
    Title: string,
    Content: string,
    Kids: any[],
}

const samplePosts: AskItem[] = [{
    ItemId: 1,
    UserId: 'metaShark',
    Title: 'Ask HN: Shark advice',
    Content: `Sharks are peaceful, but don't let it bite you`,
    Kids: [],
}, {
    ItemId: 2,
    UserId: 'pluto',
    Title: 'Ask HN: Tiny Planet pluto',
    Content: `Why does scientists hate pluto? such a cute planet`,
    Kids: [],
}]

let pool: Pool

async function getConnection(): Promise<Pool | Error> {
    if (pool != null) {
        return pool
    }
    // connect to database
    let client = new Pool({
        user: process.env.PGSQL_USER,
        password: process.env.PGSQL_PASSWORD,
        host: process.env.PGSQL_HOST,
        database: process.env.PGSQL_DATABASE,
    });

    return new Promise((resolve, reject) => {
        client.connect(err => {
            if (err) {
                console.log("failed to connect to database");
                reject(err);
            } else {
                pool = client;
                resolve(client);
            }
        })
    });
}

let postList: AskItem[] = []
let postCache: Record<number, AskItem> = {}

export async function fetchPosts(): Promise<AskItem[]> {
    if (postList.length > 0) {
        console.log('using cache');
        return postList;
    }
    let client = await getConnection();
    let posts: AskItem[] = samplePosts;

    if (client instanceof Pool) {
        console.error("client connected");
        let res = await client.query('select distinct rootid from yitem order by rootid desc limit 50');
        let rootIds: number[] = res.rows.map(row => row['rootid']);

        if (rootIds.length > 0) {
            let ids = rootIds.map(id => id.toString()).join(",");
            let stmt = `select id, userid, title, content from yitem where id in (${ids})`;
            console.log(`executing ${stmt}`);
            let res = await client.query(stmt);
            posts = res.rows.map(row => ({
                ItemId: row['id'],
                UserId: row['userid'],
                Title: row['title'],
                Content: he.decode(row['content']),
                Kids: [],
            }));
            postList = posts;
        }
    }

    return Promise.resolve(posts);
}


export async function fetchPost(rootId: number): Promise<AskItem | null> {
    if (postCache[rootId]) {
        return postCache[rootId];
    }
    let client = await getConnection();

    if (client instanceof Pool) {
        console.error("client connected");
        let itemMap: Record<number, AskItem> = {}
        let kidmap: Record<number, number[]> = {}

        // fetch items
        let res = await client.query(`select id, userid, title, content from yitem where rootid=${rootId}`);
        let items: AskItem[] = res.rows.map(row => ({
            ItemId: row['id'],
            UserId: row['userid'],
            Title: row['title'],
            Content: he.decode((row['content'])),
            Kids: [],
        }));
        for (let item of items) {
            itemMap[item.ItemId] = item;
        }

        // fetch kids
        res = await client.query(`select id, kid from ykid where rootid=${rootId}`);
        for (let row of res.rows) {
            let id = row['id'] as number;
            let kid = row['kid'] as number;
            if (!kidmap[id]) {
                kidmap[id] = [];
            }
            kidmap[id].push(kid);
        }

        for (const id in kidmap) {
            let kids = kidmap[id];
            for (const kid of kids) {
                if (itemMap[id] && itemMap[kid]) {
                    itemMap[id].Kids.push(itemMap[kid]);
                }
            }
        }

        postCache[rootId] = itemMap[rootId];

        return itemMap[rootId] || null;
    }

    return Promise.resolve(null);
}

