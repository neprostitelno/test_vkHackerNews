import {FC, useEffect, useState} from 'react';
import {
    Button,
    Cell,
    Div,
    Group,
    Header,
    InfoRow,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack, ScreenSpinner,
    SimpleCell, SplitLayout, Title
} from '@vkontakte/vkui';
import {useParams, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {entity, getEntitiesByIds} from "../store/entity.ts";
import {useAppSelector} from "../store/store.ts";
import {setComments} from "../store/slices/commentsSlice.ts";
import {useDispatch} from "react-redux";
import {setNewsPage} from "../store/slices/newsPageSlice.ts"
import {Icon48ChevronDownOutline, Icon48Replay} from "@vkontakte/icons";
import style from "../assets/style/style.module.css"


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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setPopout(<ScreenSpinner state="loading"/>);
        const newsResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${urlId}.json`
        );
        const newsEntity: entity = await newsResponse.json();
        if (newsEntity.type !== "story") {
            clearPopout()
            await routeNavigator.push('/')

            return
        }
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
            <Div className={style.commentBlock}>
                {props.comments.filter((value) => value.parent === props.parent.id).map((comment: entity, index: number) =>
                    <Cell className={style.comment}>


                        <div>{comment.text}</div>
                        <div>{comment.by}</div>
                        <div>{(new Date(comment.time * 1000).toLocaleString("ru-RU"))}</div>

                        {comment.kids ?<Button onClick={async () => {
                            comment.kids ? await getKidsComments(comment, 100) : undefined
                        }
                                       }>Загрузить комментарии</Button>: null}
                        <Tree id={`${comment.id}`} parent={comment}
                              comments={comments.comments}></Tree>
                    </Cell>
                )}
            </Div>
        );
    }

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel id={id}>
                <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')}/>}>
                    <Title level={"2"}>Вернуться на страницу новостей</Title>
                </PanelHeader>
                <Group
                    header={<Header mode="secondary"><Title level={"3"}>{newsPage.title}</Title></Header>}>
                    <SimpleCell>
                        <a href={newsPage.url}>{newsPage.url}</a>
                        <InfoRow header="Дата">{(new Date(newsPage.time * 1000).toLocaleString("ru-RU"))}</InfoRow>
                        <InfoRow header="Автор">{newsPage.by}</InfoRow>
                    </SimpleCell>
                    <Header>Комментарии {newsPage.descendants}</Header>
                    <Icon48Replay className={style.update}
                                  onClick={async () => await getPageData(100)}>Обновить</Icon48Replay>
                    <Tree id={`${newsPage.id}`} parent={newsPage} comments={comments.comments}></Tree>
                </Group>
            </Panel>
        </SplitLayout>
    );
};
