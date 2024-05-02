import {FC, useEffect, useState} from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    Cell,
    NavIdProps,
    Counter, SimpleCell, Title, Spinner
} from '@vkontakte/vkui';
import {Icon48Replay} from '@vkontakte/icons';
import {UserInfo} from '@vkontakte/vk-bridge';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {useAppSelector} from "../store/store.ts";
import {getEntitiesByIds, entity} from "../store/entity.ts";
import {setNewsPage} from "../store/slices/newsSlice.ts"
import {useDispatch} from "react-redux";
import style from "../assets/style/style.module.css"


export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = () => {

    const routeNavigator = useRouteNavigator();
    const news = useAppSelector(state => state.news)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);


    async function getNews(max: number): Promise<void> {
        setIsLoading(true);
        const newsResponse = await fetch(
            "https://hacker-news.firebaseio.com/v0/newstories.json"
        );
        const newsIds = await newsResponse.json();
        const allNews: entity[] = await getEntitiesByIds(newsIds, max)
        dispatch(setNewsPage(allNews));
        setIsLoading(false);
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
                <PanelHeader className={style.panel}>
                    <Title>Hacker News</Title>
                    <Icon48Replay className={style.update} onClick={async () => await getNews(100)}/>
                </PanelHeader>
                <Group>
                    {isLoading && <Spinner size='large' style={{ margin: '20px 0' }} />}
                    {news.news.map((newsPost: entity, index: number) => <Cell key={index}
                                                                              onClick={() => routeNavigator.push(`news/${newsPost.id}`)}>
                        <SimpleCell before={<Counter>{newsPost.score}</Counter>}>
                            <Title className={style.text} level="2">{newsPost.title}</Title>
                            {(new Date(newsPost.time * 1000).toLocaleString("ru-RU"))} |
                            &nbsp;{newsPost.by}
                        </SimpleCell>

                    </Cell>)}
                </Group>
            </Panel>
    );
};
