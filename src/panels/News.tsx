import {FC, useEffect, useState} from 'react';
import {
    Button, Caption,
    Cell,
    Div,
    Group,
    Header,
    Text,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell, Title, Spacing, Spinner
} from '@vkontakte/vkui';
import {useParams, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import {entity, getEntitiesByIds} from "../store/entity.ts";
import {useAppSelector} from "../store/store.ts";
import {setComments} from "../store/slices/commentsSlice.ts";
import {useDispatch} from "react-redux";
import {setNewsPage} from "../store/slices/newsPageSlice.ts"
import {Icon48Replay} from "@vkontakte/icons";
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
    const [isLoading, setIsLoading] = useState(false);

    async function getPageData(max: number) {
        setIsLoading(true);
        const newsResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${urlId}.json`
        );
        const newsEntity: entity = await newsResponse.json();
        if (newsEntity.type !== "story") {
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
        setIsLoading(false);
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
                    <Cell key ={index} className={style.comment}>


                        <Text>{comment.text}</Text>
                        <Spacing size={16} />
                        <Caption level={"1"} className={style.caption}>{comment.by}&nbsp;|&nbsp;{(new Date(comment.time * 1000).toLocaleString("ru-RU"))}</Caption >

                        {comment.kids ? <Button onClick={async () => {
                            comment.kids ? await getKidsComments(comment, 100) : undefined
                        }
                        }>Загрузить комментарии</Button> : null}
                        <Tree id={`${comment.id}`} parent={comment}
                              comments={comments.comments}></Tree>
                    </Cell>
                )}
            </Div>
        );
    }

    return (
            <Panel id={id}>
                <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push('/')}/>}>
                    <Title level={"2"}>Вернуться на страницу новостей</Title>
                </PanelHeader>
                <Group className={style.pageComment}
                    header={<Header mode="secondary"><Title level={"3"}>{newsPage.title}</Title></Header>}>
                    <SimpleCell>
                        <div>{(new Date(newsPage.time * 1000).toLocaleString("ru-RU"))}&nbsp;|
                            &nbsp;{newsPage.by}
                        </div>
                        <a href={newsPage.url}>{newsPage.url}</a>
                    </SimpleCell>
                    <hr></hr>
                    <div className={style.commentHeader}><Header>Комментарии {newsPage.descendants}</Header>
                        <Icon48Replay className={style.update}
                                      onClick={async () => await getPageData(100)}>Обновить</Icon48Replay></div>
                    {isLoading && <Spinner size='large' style={{ margin: '20px 0' }} />}
                    <Tree id={`${newsPage.id}`} parent={newsPage} comments={comments.comments}></Tree>
                </Group>
            </Panel>

    );
};
