import React, {PureComponent} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    ImageBackground,
    Image,
    AsyncStorage,
} from 'react-native'
import { StackNavigator } from 'react-navigation';
import Login from './Login'
import Toast, {DURATION} from 'react-native-easy-toast'
import {createAnimatableComponent, View,} from 'react-native-animatable'

var avatars=[require('../resource/1.png'),require('../resource/2.png'),
require('../resource/3.png'),require('../resource/4.png'),
require('../resource/5.png'),require('../resource/6.png'),
require('../resource/7.png'),require('../resource/8.png'),
require('../resource/9.png'),require('../resource/10.png'),
require('../resource/11.png'),]
//个人资料页面
export default class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            logined:false,
            avatar:null,
            points:0,
        };
    }
    
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        AsyncStorage.getItem("user")
        .then((result) => {
            this.setState({name:result})
            fetch('http://118.25.56.186/users/'+this.state.name+"/userinfo", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
                }).then((response) => response.json())
                .then((jsonData) => {
                this.setState({points:parseInt(jsonData.credit+jsonData.like)})
                this.setState({avatar:avatars[parseInt(jsonData.avatar)]})
            })
        })
        AsyncStorage.getItem("logined")
        .then((result) => {
            if(result=="true")
                this.setState({logined:true})
            else
                this.setState({logined:false})
        })
    }

    refresh=()=>{
        AsyncStorage.clear();
        fetch('http://118.25.56.186/signout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        }).then((response) => response.json())
        .then((jsonData) => {
        let loginreturn = jsonData.status;
        if (loginreturn="success"){
            this.refs.logininfo.show("已经注销用户")
            AsyncStorage.setItem('logined',"false")
            AsyncStorage.setItem('user',"");
            this.setState({name:"",logined:false})
        } 
        })
    }

    loginOut=()=>{
        fetch('http://118.25.56.186/signout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        }).then((response) => response.json())
        .then((jsonData) => {
        let loginreturn = jsonData.status;
        if (loginreturn="success"){
            this.refs.logininfo.show("已经注销用户")
            AsyncStorage.setItem('logined',"false");
            AsyncStorage.setItem('user',"");
            this.setState({name:"",logined:false})
        } 
    })
    }

    _onLogin = () => {
        this.props.navigation.replace({
            scene: Login,
          });
        /*this.props.navigator.push({
            component: Login,
        })*/
    }

    _onChart = () => {
        this.props.navigator.replace({
            scene: MyChart,
        })
    }


    render() {
        AsyncStorage.getItem("user")
        .then((result) => {
            this.setState({name:result})
        })
        if(this.state.logined)
            return (
           this._render_logined()
            )
        else
            return(
            this._render_unlogined()
            )
    }

    _render_logined(){//登陆后显示的页面
        const { navigate } = this.props.navigation;
        this.refs.logininfo.show("正在刷新数据",500)
        return(
             <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <ImageBackground
                style={{height: 230, alignItems: 'center', backgroundColor: 'transparent'}}
                source={require('../resource/img_my_head.png')}
                >
                <View style={{
                alignItems: 'center',
                justifyContent: 'center'
                }}>
                    <View style={styles.avatarContainer}>
                        <Image
                        style={{width: 80, height: 80}}
                        source={this.state.avatar}
                        />
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color: 'white', marginTop:3,fontSize: 18}}>{this.state.name}</Text>
                        <Text style={{color: 'white', marginTop:3,fontSize: 16}}>积分：{this.state.points}</Text>
                    </View>
                    <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.loginContainer}
                    onPress={this.loginOut}
                    >
                        <Text style={{color: 'white'}}>注销</Text>
                    </TouchableOpacity>
            </View>
        </ImageBackground>
                <View style={[styles.cellContainer]}>
                    <ProfileStaticCell
                        title="专注统计"
                        imageName={require('../resource/statistic.png')}
                        onPress={()=>navigate('Statistic')}
                        anima='fadeInLeft'
                    />
                    <ProfileStaticCell
                        title="专注排名"
                        imageName={require('../resource/ranking.png')}
                        onPress={()=>navigate("Ranking")}
                        anima='fadeInLeft'
                        delay={50}
                    />
                    <ProfileStaticCell
                        title="我的分享"
                        imageName={require('../resource/upload.png')}
                        onPress={()=>navigate("Sharing")}
                        anima='fadeInLeft'
                        delay={100}
                    />
                    <ProfileStaticCell
                        title="重置应用"
                        imageName={require('../resource/refresh.png')}
                        onPress={this.refresh}
                        anima='fadeInLeft'
                        delay={150}
                    />
                </View>
                <Toast ref="logininfo" position='top' opacity={0.6}/>
            </View>
        )
    }

    _render_unlogined(){
        const { navigate } = this.props.navigation;
        return(
             <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <ImageBackground
                style={{height: 230, alignItems: 'center', backgroundColor: 'transparent'}}
                source={require('../resource/img_my_head.png')}
                >
                    <View style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                    }}>
                    <View style={styles.avatarContainer}>
                        <Image
                        style={{width: 80, height: 80}}
                        source={require('../resource/my_avatar.png')}
                        />
                    </View>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color: 'white', marginTop:3, fontSize: 18}}> </Text>
                        <Text style={{color: 'white', marginTop:3, fontSize: 16}}> </Text>
                    </View>
                    <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.loginContainer}
                    onPress={()=>navigate('Login')}
                    >
                        <Text style={{color: 'white'}}>点击登录</Text>
                    </TouchableOpacity>
            </View>
        </ImageBackground>
                <View style={styles.cellContainer}>
                    <ProfileStaticCell
                        title="专注统计"
                        imageName={require('../resource/statistic.png')}
                        onPress={()=>navigate('Statistic')}
                        anima='fadeInLeft'
                    />
                    <ProfileStaticCell
                        title="专注排名"
                        imageName={require('../resource/ranking.png')}
                        onPress={()=>navigate("Ranking")}
                        anima='fadeInLeft'
                        delay={50}
                    />
                    <ProfileStaticCell
                        title="我的分享"
                        imageName={require('../resource/upload.png')}
                        onPress={()=>navigate("Sharing")}
                        anima='fadeInLeft'
                        delay={100}
                    />
                    <ProfileStaticCell
                        title="重置应用"
                        imageName={require('../resource/refresh.png')}
                        onPress={this.refresh}
                        anima='fadeInLeft'
                        delay={150}
                    />
                </View>
                <Toast ref="logininfo" position='top' opacity={0.6}/>
            </View>
        )
    }
}


const ProfileStaticCell = ({
    title,
    imageName,
    style,
    onPress,
    anima,
    delay
}) => {
    return (
        <View animation={anima} delay={delay} useNativeDriver>
        <TouchableOpacity
            activeOpacity={0.75}
            style={styles.staticCell}
            onPress={()=>onPress(title)}
        >
            <Image style={{width: 20, height: 20, marginHorizontal: 15}} source={imageName}/>
            <View style={[styles.cellStyle, style || style]}>
                <Text style={{color: 'gray'}}>{title}</Text>
                <Image style={{width: 20, height: 20}} source={require('../resource/ic_my_right.png')}/>
            </View>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 50,
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginContainer: {
        marginTop:10,
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 2
    },
    cellContainer: {
        borderColor: '#d9d9d9',
        marginTop: 15,
        backgroundColor: '#f5f5f5'
    },
    staticCell: {
        flexDirection: 'row',
        height: 46,
        marginTop:1,
        borderBottomWidth:1,
        borderColor:'rgb(230,230,230)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
    },
    cellStyle: {
        flex: 1,
        height: 46,
        borderColor: '#d9d9d9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15
    }
});