import { Client, Pool } from 'pg';

interface AskItem {
    ItemId: number,
    UserId: string,
    Content: string,
    Kids: any[],
}

const samplePosts: AskItem[] = [{
    ItemId: 1,
    UserId: 'metaShark',
    Content: `Sharks are peaceful, but don't let it bite you`,
    Kids: [],
}, {
    ItemId: 2,
    UserId: 'pluto',
    Content: `Why does scientists hate pluto? such a cute planet`,
    Kids: [],
}]

async function getConnection(): Promise<Client | Error> {
    // connect to database
    let client = new Client({
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
                resolve(client);
            }
        })
    });
}

export async function fetchPosts() {
    let client = await getConnection();
    if (client instanceof Client) {

        console.error("client connected");
        let res = await client.query('select id, userid, content from yitem');
        let posts: AskItem[] = res.rows.map(row => ({
            ItemId: row['id'],
            UserId: row['userid'],
            Content: row['content'],
            Kids: [],
        }))

        return Promise.resolve(posts);

    } else {
        return Promise.resolve(samplePosts);
    }
}

