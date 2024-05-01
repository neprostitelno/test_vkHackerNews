import {FC, useEffect, useState} from 'react';
import {
    Button,
    Cell,
    Counter,
    Group,
    Header,
    InfoRow,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack, ScreenSpinner,
    SimpleCell, SplitLayout
} from '@vkontakte/vkui';
import {useParams, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {entity, getEntitiesByIds} from "../store/entity.ts";
import {useAppSelector} from "../store/store.ts";
import {setComments} from "../store/slices/commentsSlice.ts";
import {useDispatch} from "react-redux";
import {setNewsPage} from "../store/slices/newsPageSlice.ts"

export interface TreeProps extends NavIdProps {
    parent: entity
    comments: entity[]
}

export const News: FC<NavIdProps> = ({id}) => {

    const routeNavigator = useRouteNavigator();
    const urlId = useParams<'id'>()?.id;
    const newsPage = useAppSelector(state => state.newsPage)
    const comments = useAppSelector(state => state.comments)
    const dispatch = useDispatch();
    const [popout, setPopout] = useState(null);
    const clearPopout = () => setPopout(null);


    async function getPageData(max: number) {
        setPopout(<ScreenSpinner state="loading"/>);
        const newsResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${urlId}.json`
        );
        const newsEntity: entity = await newsResponse.json();
        dispatch(setNewsPage(newsEntity))
        if (newsEntity.kids) {
            const comments: entity[] = (await getEntitiesByIds(newsEntity.kids, max)).filter(
                (value) => (!value.deleted && value.type === "comment")
            )
            dispatch(setComments(comments));
        }
        clearPopout()
    }

    async function getKidsComments(comment: entity, max: number) {
        const loadingKids = comment.kids.filter(value => !comments.kidsAdded.includes(value))

        const kidsComment = (await getEntitiesByIds(loadingKids, max)).filter(
            (value) => (!value.deleted && value.type === "comment")
        )

        dispatch(setComments([...comments.comments, ...kidsComment]));
    }


    useEffect(() => {
        getPageData(100);
    }, []);

    const Tree: FC<TreeProps> = (props: TreeProps) => {
        return (
            <Group>
                {props.comments.filter((value) => value.parent === props.parent.id).map((comment: entity, index: number) =>
                    <Cell before={<Counter mode="prominent">{comment.kids ? `${comment.kids.length}` : "0"}</Counter>}
                          key={index}>

                        <SimpleCell id={`${comment.id}`} onClick={async () => {
                            comment.kids ? await getKidsComments(comment, 100) : undefined
                        }}>
                            <div>{comment.text}</div>
                            <div>{comment.by}</div>
                            {(new Date(comment.time * 1000).toLocaleDateString("ru-RU"))}
                            <Tree id={`${comment.id}`} parent={comment}
                                  comments={comments.comments}></Tree></SimpleCell>
                    </Cell>)}
            </Group>
        );
    }

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel id={id}>
                <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')}/>}>
                    Вернуться на страницу новостей
                </PanelHeader>
                <Group
                    header={<Header mode="secondary"><InfoRow header="Заголовок">{newsPage.title}</InfoRow></Header>}>
                    <SimpleCell>
                        <InfoRow header="Ссылка">{newsPage.url}</InfoRow>
                        <InfoRow header="Дата">{newsPage.time}</InfoRow>
                        <InfoRow header="Автор">{newsPage.by}</InfoRow>
                    </SimpleCell>
                </Group>
                <Header>Комментарии<Counter mode="prominent">{newsPage.descendants}</Counter></Header>
                <Button onClick={async () => await getPageData(100)}>Обновить</Button>
                <Tree id={`${newsPage.id}`} parent={newsPage} comments={comments.comments}></Tree>
            </Panel>
        </SplitLayout>
    );
};
