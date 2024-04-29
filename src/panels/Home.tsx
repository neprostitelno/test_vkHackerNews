import { FC } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Cell,
  NavIdProps,
} from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = () => {

  const routeNavigator = useRouteNavigator();

  return (
    <Panel>
      <PanelHeader>Hacker News</PanelHeader>
      <Group>
        <Cell onClick={() => routeNavigator.push('news')}>Новость</Cell>
        <Cell onClick={() => routeNavigator.push('news')}>Новость</Cell>
      </Group>
    </Panel>
  );
};
