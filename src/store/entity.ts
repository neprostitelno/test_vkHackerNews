export interface entity {
    by: string,
    descendants: number,
    id: number,
    kids: number[],
    score: number,
    time: number,
    title: string,
    type: string,
    url: string,
    parent: number,
    text: string,
    deleted: boolean,
}

export async function getEntitiesByIds(ids: number[], max: number): Promise<entity[]> {
    const entityPromises: Promise<entity>[] = ids
        .slice(0, max)
        .map((id: number) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
                (response) => response.json()
            ).then()
        )
    return await Promise.all(entityPromises)
}
