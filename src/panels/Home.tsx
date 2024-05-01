import {FC, useEffect} from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    Cell,
    NavIdProps,
    Counter, SimpleCell,
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

    async function getNews(max: number) : Promise<void> {
        const newsResponse = await fetch(
            "https://hacker-news.firebaseio.com/v0/newstories.json"
        );
        const newsIds = await newsResponse.json();
        const allNews: entity[] = await getEntitiesByIds(newsIds, max)
        dispatch(setNewsPage(allNews));

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
        <Panel>
            <PanelHeader>Hacker News</PanelHeader>
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
    );
};
