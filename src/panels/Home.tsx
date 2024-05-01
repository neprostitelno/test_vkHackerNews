import {FC, useEffect, useState} from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    Cell,
    NavIdProps,
    Counter, SimpleCell, Button, ScreenSpinner, SplitLayout
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {useAppSelector} from "../store/store.ts";
import {getEntitiesByIds, entity} from "../store/entity.ts";
import {setNewsPage} from "../store/slices/newsSlice.ts"
import {useDispatch} from "react-redux";

export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = () => {

    const routeNavigator = useRouteNavigator();
    const news = useAppSelector(state => state.news)
    const dispatch = useDispatch();
    const [popout, setPopout] = useState(null);

    const clearPopout = () => setPopout(null);


    async function getNews(max: number): Promise<void> {
        setPopout(<ScreenSpinner state="loading"/>);
        const newsResponse = await fetch(
            "https://hacker-news.firebaseio.com/v0/newstories.json"
        );
        const newsIds = await newsResponse.json();
        const allNews: entity[] = await getEntitiesByIds(newsIds, max)
        dispatch(setNewsPage(allNews));
        clearPopout()
    }

    useEffect(() => {
        getNews(100);
    }, []);

    useEffect(() => {
        if (news) {
            setTimeout(() => {
                getNews(100);
            }, 60000);
        }
    }, [news]);

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel>
                <PanelHeader>Hacker News</PanelHeader>
                <Button onClick={async () => await getNews(100)}>Обновить</Button>
                <Group>
                    {news.news.map((newsPost: entity, index: number) => <Cell key={index}
                                                                              onClick={() => routeNavigator.push(`news/${newsPost.id}`)}>
                        <SimpleCell before={<Counter>{newsPost.score}</Counter>}>
                            <div>{newsPost.title}</div>
                            <div>{newsPost.by}</div>
                            {(new Date(newsPost.time * 1000).toLocaleDateString("ru-RU"))}</SimpleCell>

                    </Cell>)}
                </Group>
            </Panel>
        </SplitLayout>

    );
};
