import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useCreation, useMemoizedFn} from 'ahooks';
import Header from '@/components/header';
import Icon from '@/components/icon';
import {ThemeContext} from '@/store/theme';
import SongGroup from '@/pages/components/songGroup';
import {Tabs} from '@ant-design/react-native';
import {TabBarPropsType} from '@ant-design/react-native/lib/tabs/PropsType';
import {ReactNavicationRouteProps} from '@/types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tab_content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tab_container: {
    flex: 2,
    borderBottomWidth: 0,
  },
  tab_bar_content: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tab_bar_item: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
function Home({navigation}: ReactNavicationRouteProps) {
  const tabs = [{title: 'QQ'}, {title: '网易云'}, {title: '酷狗'}];
  const {state: theme} = useContext(ThemeContext);

  const headerIcon: React.ReactNode = useCreation(() => {
    return (
      <Icon
        name="icon-search"
        size={24}
        color={theme?.text_color}
        onPress={() => {
          navigation.navigate('search');
        }}
      />
    );
  }, []);
  const activeTab = useMemoizedFn((active: boolean) => {
    const result = StyleSheet.create({
      class: {
        borderBottomColor: active ? theme?.text_color : '',
        borderBottomWidth: active ? 2 : 0,
      },
    });
    return result;
  });
  const tabBarRender = useMemoizedFn((tabProps: TabBarPropsType) => {
    return (
      <View style={[styles.tab_bar_content]}>
        {tabProps.tabs.map((tab, i) => {
          const activeTextClass = StyleSheet.create({
            class: {
              color: tabProps.activeTab === i ? theme?.text_color : '#66666E',
            },
          });
          return (
            // change the style to fit your needs
            <TouchableOpacity
              style={[
                styles.tab_bar_item,
                activeTab(tabProps.activeTab === i).class,
              ]}
              activeOpacity={0.9}
              key={tab.key || i}
              onPress={() => {
                const {goToTab, onTabClick} = tabProps;
                // tslint:disable-next-line:no-unused-expression
                onTabClick && onTabClick(tabs[i], i);
                // tslint:disable-next-line:no-unused-expression
                goToTab && goToTab(i);
              }}>
              <Text style={[activeTextClass?.class]}>{tab.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <Header title="音乐整合" rightContent={headerIcon} />
      {/* <SongGroup /> */}
      <View style={[styles.tab_container]}>
        <Tabs
          tabs={tabs}
          initialPage={0}
          tabBarPosition="top"
          renderTabBar={tabBarRender}
          renderUnderline={() => null}
          styles={{
            topTabBarSplitLine: {
              borderBottomWidth: 0,
            },
          }}>
          <View style={[styles.tab_content]}>
            <SongGroup channel="QQ" />
          </View>
          <View style={[styles.tab_content]}>
            <SongGroup channel="netEase" />
          </View>
          <View style={[styles.tab_content]}>
            <SongGroup channel="kugou" />
          </View>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
export default Home;
