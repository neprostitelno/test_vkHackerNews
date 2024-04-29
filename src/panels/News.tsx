import { FC } from 'react';
import {
    Counter,
    InfoRow,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export const News: FC<NavIdProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();


    return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Вернуться на страницу новостей
      </PanelHeader>
      <SimpleCell>
          <InfoRow header="Заголовок">Заголовок</InfoRow>
          <InfoRow header="Ссылка">Ссылка</InfoRow>
          <InfoRow header="Дата">Дата</InfoRow>
          <InfoRow header="Автор">Автор</InfoRow>
      </SimpleCell>
        <SimpleCell before={<Counter>8</Counter>}>
            Комментарии
        </SimpleCell>
    </Panel>
  );
};
