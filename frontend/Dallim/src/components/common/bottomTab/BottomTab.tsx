import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
// navigation
import {NavigationContainer} from '@react-navigation/native';
import * as varStyles from '../styles';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import Svg, {Defs, Mask, Rect, Path, G} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  useSharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

import {useSafeAreaInsets} from 'react-native-safe-area-context';

// components
import Main from '../../../screens/main/Main';
import Chart from '../../../screens/chart/Chart';
import Social from '../../../screens/social/Social';
import Edit from '../../../screens/edit/Edit';
import Profile from '../../../screens/profile/Profile';

// icon
import BottomTabIcon from './BottomTabIcon';

const Tab = createBottomTabNavigator();
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const AnimatedTabBar = ({
  state: {index: activeIndex, routes},
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const {bottom} = useSafeAreaInsets();
  const animatedValue = useSharedValue(0);
  const translateX = useSharedValue(-width); // 시작점을 화면 밖으로 설정
  // SVG의 각 Rect에 대한 애니메이션 속성을 만듭니다.
  const animatedPropsRed = useAnimatedProps(() => {
    return {
      x: translateX.value - width, // 초기 위치에서 시작
    };
  });

  const animatedPropsBlue = useAnimatedProps(() => {
    return {
      x: translateX.value, // 두 번째 박스는 첫 번째 다음에 있습니다.
    };
  });

  const animatedPropsGreen = useAnimatedProps(() => {
    return {
      x: translateX.value + width, // 세 번째 박스는 두 번째 다음에 있습니다.
    };
  });
  useEffect(() => {
    // 여기서 애니메이션 목표 값을 설정합니다. 예를 들어, 1까지.
    animatedValue.value = withTiming(1, {duration: 3000}); // 3초 동안
  }, []);

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const animatedPathOffset = useSharedValue(0);

  const reducer = (state: any, action: {x: number; index: number}) => {
    return [...state, {x: action.x, index: action.index}];
  };

  const [layout, dispatch] = useReducer(reducer, []);

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    dispatch({x: event.nativeEvent.layout.x, index});
  };

  const xOffset = useDerivedValue(() => {
    if (layout.length !== routes.length) return 0;
    return [...layout].find(({index}) => index === activeIndex)!.x - 25;
  }, [activeIndex, layout]);

  const animatedPathProps = useAnimatedProps(() => {
    // xOffset 값에 기반하여 "d" 속성을 동적으로 변경합니다.
    const d =
      'M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z';

    return {d}; // d 속성을 업데이트하여 경로 변경
  });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
    };
  });

  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
        },
      ]}>
      <AnimatedSvg
        width={width * 3}
        height={60}
        y="10"
        viewBox={`${-width} 0 ${width * 3} 60`}
        style={[styles.activeBackground, animatedStyles]}>
        <Defs>
          <Mask id="myMask" x="0" y="0" height="100%" width="100%">
            {/* 주목: 여기서 width를 200%로 설정하여 마스크 영역을 넓혔습니다. */}
            {/* 마스크 내부의 Rect 또는 Path 위치를 조정하려면 다음과 같이 x 속성을 변경합니다. */}
            <Rect x="0" y="0" height="100%" width="100%" fill="white" />
            {/* 이 Rect는 마스크의 범위를 정의합니다. */}
            <AnimatedPath
              x="-1"
              animatedProps={animatedPathProps}
              fill="#000"
            />
            {/* 여기서 'd'는 실제 경로 데이터입니다. 필요한 형태와 위치에 따라 이 값을 조정해야 합니다. */}
          </Mask>
        </Defs>
        <Rect x={-width} y="0" width={width} height="100%" fill="white" />
        <Rect
          x="0"
          y="0"
          width={width}
          height="100%"
          fill="white"
          mask="url(#myMask)" // 이 Rect (파란색)에 마스크가 적용됩니다.
        />
        <Rect x={width} y="0" width={width} height="100%" fill="white" />
      </AnimatedSvg>

      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex;
          const {options} = descriptors[route.key];

          return (
            <TabBarComponent
              key={route.key}
              active={active}
              options={options}
              onLayout={e => handleLayout(e, index)}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

type TabBarComponentProps = {
  active?: boolean;
  options: BottomTabNavigationOptions;
  onLayout: (e: LayoutChangeEvent) => void;
  onPress: () => void;
};

const TabBarComponent = ({
  active,
  options,
  onLayout,
  onPress,
}: TabBarComponentProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      // @ts-ignore
      ref.current.play();
    }
  }, [active]);

  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1 : 0, {duration: 250}),
        },
        {
          translateY: withTiming(active ? -10 : 0, {duration: 200}),
        },
      ],
    };
  });

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(active ? -10 : 0, {duration: 200}),
        },
      ],
      opacity: withTiming(active ? 1 : 0.5, {duration: 250}),
    };
  });

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View
        style={[styles.componentCircle, animatedComponentCircleStyles]}
      />
      <Animated.View
        style={[styles.iconContainer, animatedIconContainerStyles]}>
        {/* @ts-ignore */}
        {options.tabBarIcon ? options.tabBarIcon({ref}) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    flex: 1,
    width: '100%',
    zIndex: 1 - 1,
  },
  component: {
    height: 60,
    width: 60,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: varStyles.colors.darkBlue,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{headerShown: false}}
      initialRouteName="Main">
      <Tab.Screen
        name="Chart"
        component={Chart}
        options={{
          tabBarIcon: ({focused}) => (
            <BottomTabIcon darkMode={darkMode} focused={focused} type="chart" />
          ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={Social}
        options={{
          tabBarIcon: ({focused}) => (
            <BottomTabIcon
              darkMode={darkMode}
              focused={focused}
              type="social"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarIcon: ({focused}) => (
            <BottomTabIcon darkMode={darkMode} focused={focused} type="main" />
          ),
        }}
      />
      <Tab.Screen
        name="Edit"
        component={Edit}
        options={{
          tabBarIcon: ({focused}) => (
            <BottomTabIcon darkMode={darkMode} focused={focused} type="edit" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <BottomTabIcon
              darkMode={darkMode}
              focused={focused}
              type="profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
