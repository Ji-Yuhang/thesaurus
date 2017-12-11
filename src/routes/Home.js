import React from 'react';
import {connect} from 'dva';
import _ from 'lodash';
import {
    Button, ButtonGroup, Col, ControlLabel, FormControl, FormGroup, Glyphicon, ProgressBar, Row,
    Well
  } from 'react-bootstrap';
  import { routerRedux } from 'dva/router';
import SelectStudyWords from './SelectStudyWords';
import FilterWord from './FilterWord';
import ShanbayView from './ShanbayView';
import LearnWordList from './LearnWordList';


class Home extends React.Component {
    constructor(props) {
        super(props);
        let words = new Array;
        let unknownWords = new Array;
        
        let showSelect = false;
        let showFilter = false;
        let showLearn = false;
        
        this.state = {
            words,
            unknownWords,
            showSelect,
            showFilter,
            showLearn,
        }
    }
    onWordsChange = (words)=> {
        console.log('onWordsChange', words)
        
        this.setState({
            words,
        })
      
    }
    onUnknownWordsChange = (unknownWords)=> {
        console.log('onUnknownWordsChange', unknownWords)
        
        this.setState({
            unknownWords,
        })
      
    }
    
    goToLearn = ()=>{
        console.log('this.goToLearn', this, words)
      let showSelect = false
      const {words,showLearn} = this.state;
      
      this.setState({
        showLearn: !showLearn,
        showSelect,
        
      })
    }
    goToFilterWord = ()=>{
        console.log('this.goToFilterWord', this, words)
      //   this.props.dispatch(push('/'))
    //   const {words} = this.state;
      let showSelect = false
      const {words,showFilter} = this.state;
      
      this.setState({
        showFilter: !showFilter,
        showSelect,
        
      })
    
    //   this.setState({
    //       showSelect,
    //       showFilter,
    //   })
      //   this.props.dispatch(routerRedux.push('/', {words}));
        
      //             this.props.navigate('/')

    }
    
    showSelect = ()=> {
        console.log('showSelect')
        const {words,showSelect} = this.state;
        
        this.setState({
            showSelect: !showSelect,
        })
      
    }
    render() {
        const {words,showSelect,showFilter,showLearn} = this.state;
        return (
            <div >
                <div >
                    总单词个数：{_.size(words)}
                </div>
                <div>       
                     <Button bsStyle="primary" block onClick={this.showSelect}>选择要记忆的单词</Button>
                </div>
                {
                    showSelect ? <SelectStudyWords 
                        onWordsChange={this.onWordsChange}
                        words={this.state.words}
                    /> : null
                }
                <div>       
                     <Button bsStyle="primary" block onClick={this.goToFilterWord}>筛选出不认识的单词</Button>
                </div>
                {
                    showFilter ? <FilterWord 
                        onUnknownWordsChange={this.onUnknownWordsChange}
                        words={this.state.words}
                    /> : null
                }

                <div>       
                     <Button bsStyle="primary" block onClick={this.goToLearn}>学习生词</Button>
                </div>
                {
                    showLearn ? <LearnWordList 
                        onUnknownWordsChange={this.onUnknownWordsChange}
                        words={this.state.words}
                    /> : null
                }
                
                    
            </div>
        )
    }
};
export default connect()(Home);
