import {FC, useEffect, useState} from 'react';
import {
    Panel,
    PanelHeader,
    Group,
    Cell,
    NavIdProps,
    Counter, SimpleCell, ScreenSpinner, SplitLayout, Title
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
    const [popout, setPopout] = useState(null);

    const clearPopout = () => setPopout(null);


    async function getNews(max: number): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
                <PanelHeader className={style.panel}>
                    <Title>Hacker News</Title>
                    <Icon48Replay className={style.update} onClick={async () => await getNews(100)}/>
                </PanelHeader>
                <Group>
                    {news.news.map((newsPost: entity, index: number) => <Cell key={index}
                                                                              onClick={() => routeNavigator.push(`news/${newsPost.id}`)}>
                        <SimpleCell before={<Counter>{newsPost.score}</Counter>}>
                            <Title level="2">{newsPost.title}</Title>
                            {(new Date(newsPost.time * 1000).toLocaleString("ru-RU"))} |
                            &nbsp;{newsPost.by}
                        </SimpleCell>


                    </Cell>)}
                </Group>
            </Panel>
        </SplitLayout>

    );
};
