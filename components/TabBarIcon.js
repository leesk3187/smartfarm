import {Image} from 'react-native'

const TabBarIcon = (focused, name) => {

  let IconImagePath;
  if(name === "Home"){
    IconImagePath = require('../assets/20220414_224402.jpg')
  }else if(name === "User"){
    IconImagePath = require('../assets/20220414_225735.jpg')
  }

  return(
    <Image style = {{
      width: focused ? 24:20,
      height: focused ? 24:20,
    }}
    source = {IconImagePath}
    />
  )
}

export default TabBarIcon