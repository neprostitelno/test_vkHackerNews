import {useState, useEffect, ReactNode} from 'react';
import bridge, {UserInfo} from '@vkontakte/vk-bridge';
import {
  View,
  SplitLayout,
  SplitCol,
  ScreenSpinner,
  AppRoot
} from '@vkontakte/vkui';
import {useActiveVkuiLocation} from '@vkontakte/vk-mini-apps-router';

import {News, Home} from './panels';
import {DEFAULT_VIEW_PANELS} from './routes';
import '@vkontakte/vkui/dist/vkui.css';

export const App = () => {
    const {panel: activePanel = DEFAULT_VIEW_PANELS.HOME} = useActiveVkuiLocation();
    const [fetchedUser, setUser] = useState<UserInfo | undefined>();
    const [popout, setPopout] = useState<ReactNode | null>(<ScreenSpinner size="large"/>);

    useEffect(() => {
        async function fetchData() {
            const user = await bridge.send('VKWebAppGetUserInfo');
            setUser(user);
            setPopout(null);
        }

        fetchData();
    }, []);

    return (
        <AppRoot>
            <SplitLayout popout={popout}>
                <SplitCol>
                    <View activePanel={activePanel}>
                        <Home id="home" fetchedUser={fetchedUser}/>
                        <News id="news"/>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};
