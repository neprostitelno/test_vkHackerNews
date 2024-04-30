import {FC, useEffect} from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    Cell,
    NavIdProps,
} from '@vkontakte/vkui';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {useAppSelector} from "../store/store.ts";
import {news, setNewsPage} from "../store/slices/newsSlice.ts";
import {useDispatch} from "react-redux";

export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = () => {

    const routeNavigator = useRouteNavigator();
    const news = useAppSelector(state => state.news)
    const dispatch = useDispatch();

    async function getNews(max:number) {
        const newsResponse = await fetch(
            "https://hacker-news.firebaseio.com/v0/newstories.json"
        );
        const newsIds = await newsResponse.json();
        const newsPromises = newsIds
            .slice(0, max)
            .map((id:number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
                    (response) => response.json()
                )
            );
        const allNews = await Promise.all(newsPromises);
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
                {news.news.map((newsPost: news, index: number) => <Cell key={index}
                                                                        onClick={() => routeNavigator.push('news')}>{newsPost.title}
                    {newsPost.score} {newsPost.by} {(new Date(newsPost.time * 1000).toLocaleDateString("ru-RU"))}
                </Cell>)}
            </Group>
        </Panel>
    );
};
