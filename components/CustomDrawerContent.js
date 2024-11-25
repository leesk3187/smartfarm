import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem

  }  from '@react-navigation/drawer'


import {Linking} from 'react-native'
import LogoTitle from './LogoTitle'

const CustomDrawer = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
        <DrawerItem label = "Help"
          onPress = {()=> Linking.openURL('https://www.google.com')}
        />
        <DrawerItem label = "Info"
          onPress = {()=> alert("Made by Me")}
          icon = {LogoTitle}
        />
      </DrawerContentScrollView>
    )
}

export default CustomDrawer