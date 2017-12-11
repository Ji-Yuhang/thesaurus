import React from 'react';
import {connect} from 'dva';
import _ from 'lodash';
import {
    Button, ButtonGroup, Col, ControlLabel, FormControl, FormGroup, Glyphicon, ProgressBar, Row,
    Well
  } from 'react-bootstrap';
  import { routerRedux } from 'dva/router';
  
class SelectStudyWords extends React.Component {
    constructor(props) {
        super(props);
        let value = '';
        if (props.words){
            value = props.words.join("\n")
        }
        this.state = {
            value,
        }
    }
    componentWillReceiveProps(props){
        if (props){
            // if (props.words)
            if (props.words){
                let value = props.words.join("\n");
                this.setState({
                    value,
                })
            }
            
            this.props = props;

        }
    }
    onWordsChange = (e)=> {
        let value = e.target.value
        let words = value.split("\n")
        words = _.map(words, (w)=> _.replace(_.trim(w), ',', ''))
        console.log('onWordsChange',value, words)
        
        this.setState({
            value,
        })
        if (this.props.onWordsChange) {
            this.props.onWordsChange(words);
            
        }
    }
    onListChange = (obj)=>{
        let value = obj.target.value
        console.log('onListChange',obj, value)
        const list = require(`../files/list_${value}.json`);
        let { currentGroup, groupsIndex} = this.state
    
        this.setState({
            value: list.join("\n")
        })
        if (this.props.onWordsChange) {
            this.props.onWordsChange(list);
        }
        // groupsIndex = 0
        // currentGroup = _.chunk(list,7)[groupsIndex]
        // this.setState({
        //   currentList: list,
        //   currentListIndex: 0,
        //   listsIndex: value - 1,
        //   currentGroup,
        //   groupsIndex,
        // }, ()=>{
        //   this.setCurrentWord(0)
        // })
    
      }
     
    render() {
        return (
            <div >
                <div>选择要输入的单词， 以回车换行</div>
                <div>导入第三方单词列表</div>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>选择单词列表</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.onListChange}>
                        {
                        _.map(_.range(53), i => {
                            let index = i + 1
                            return (
                            <option value={index}>{`列表_${index}`}</option>

                            )
                        })
                        }

                    </FormControl>
                </FormGroup>
                    {/* <FormGroup controlId="formControlsSelect">
                    <ControlLabel>选择单词分组(每组7个)</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" onChange={this.onGroupChange}>
                        {
                        // 150/7.0 = 21.428571428571427
                        _.map(_.range(21), i => {
                            let index = i + 1
                            return (
                            <option value={index}>{`列表_${listsIndex+1} 分组_${index}`}</option>

                            )
                        })
                        }

                    </FormControl>
                    </FormGroup> */}

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70%'}}>
                    {/* <ControlLabel>选择要输入的单词</ControlLabel> */}
                    {/* <FormControl
                        type="textarea"
                        value={this.state.value}
                        placeholder="area Enter text"
                        onChange={this.onWordsChange}
                    />
                     <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Textarea</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="textarea" />
                    </FormGroup> */}
                    <textarea style={{width: '90%', height: '100%'}} rows="10" cols="30" onChange={this.onWordsChange} placeholder="回车换行" value={this.state.value}>
                    </textarea>
                </div>
               
            </div>
        )
    }
};
export default connect()(SelectStudyWords);
