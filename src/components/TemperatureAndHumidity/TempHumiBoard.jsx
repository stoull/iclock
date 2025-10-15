import React from 'react';

import './TempHumiBoard.css';
import TempIndoorDisplay from './TempIndoorDisplay';
import {TempHumiTextDisplay, TempHumiDisplayType} from './TempHumiTextDisplay';

import { smartClockService } from '../../services';

import defaultCache from '../../utils/storage/PersistentStorageCache';


class TempHumiBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fontSize: props.fontSize || '8rem',
            tempInfo: null,
            historyData: null,
            loading: false,
            error: null,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        // 监听 fontSize 变化
        if (prevProps.fontSize !== this.props.fontSize) {
            // console.log('fontSize 发生变化:', prevProps.fontSize, '->', this.props.fontSize);
            // 更新 state 中的 fontSize
            this.setState({ fontSize: this.props.fontSize });
            
            // 可以在这里执行其他逻辑，比如重新计算样式等
            this.handleFontSizeChange(this.props.fontSize);
        }
    }

    // 处理字体大小变化的逻辑
    handleFontSizeChange = (newFontSize) => {
        // console.log('处理字体大小变化:', newFontSize);
        // 在这里可以添加其他需要在字体变化时执行的逻辑
    }

    // 当温湿度信息变化时，字体的颜色也进行改变
    handleTempInfoChange = (newTempInfo) => {
        this.setState({ tempInfo: newTempInfo });

    }
    
    fetchData = async () => {
        try {
            // 使用 getOrSet 方法，自动处理缓存逻辑
            const tData = await defaultCache.getOrSet(
            'tempInfo_data',
            () => smartClockService.getCurrentTempInfo(),
            50 * 60 * 1000 // 5分钟缓存
            );
        
            // const tData = await smartClockService.getCurrentTempInfo();
            this.handleTempInfoChange(tData);
            // const hData = await smartClockService.getTempInfoHistory(); 
            // this.setState({ historyData: hData, loading: false, error: null });
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    render() {
        const { fontSize } = this.props;
        const { 
            tempInfo, 
            historyData
        } = this.state;
        
        return (
            <div>
                <div className='temp-humi-board'>
                    {/*<TempIndoorDisplay 
                        tempInfo={tempInfo}
                        fontSize={fontSize}
                    />*/}
                    
                    <TempHumiTextDisplay 
                        displayType={TempHumiDisplayType.INDOOR} 
                        tempInfo={tempInfo}
                        fontSize={fontSize}
                    />
                    <TempHumiTextDisplay 
                        displayType={TempHumiDisplayType.OUTDOOR} 
                        tempInfo={tempInfo}
                        fontSize={fontSize}
                    />
                    
                    <div className='temp-humi-board cpu'>
                        <div>{tempInfo ? tempInfo.cup_temp : "--"}˚C</div>
                    </div>
                </div>
                <div>history {historyData ? historyData.cpu_used_rates[0] : "--"}</div>
            </div>
        );
    }
}

export default TempHumiBoard;