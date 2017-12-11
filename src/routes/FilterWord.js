import React from 'react';
import {connect} from 'dva';
import _ from 'lodash';
import {
    Button,
    ButtonGroup,
    Col,
    ControlLabel,
    FormControl,
    FormGroup,
    Glyphicon,
    ProgressBar,
    Row,
    Well
} from 'react-bootstrap';
import {routerRedux} from 'dva/router';
import SelectStudyWords from './SelectStudyWords';
import ShanbayView from './ShanbayView';

import {getShanbay as apiGetShanbay} from '../services/ShanbayService';

class FilterWord extends React.Component {
    constructor(props) {
        super(props);
        // let words = new Array;
        let unknownWords = new Array;
        let testWords = _.clone(props.words);     
        let currentTestWord = _.first(props.words)
        let testShowAnswer = false;
        this.state = {
            testWords,
            unknownWords,
            currentTestWord,
            testShowAnswer,
            // showSelect,
        }
    }
    // onWordsChange = (words)=> {     console.log('onWordsChange', words)
    // this.setState({         words,     }) } goToFilterWord = ()=>{
    // console.log('this.goToFilterWord', this, words)   //
    // this.props.dispatch(push('/'))   const {words} = this.state;   let showSelect
    // = false   this.setState({       showSelect,   })   //
    // this.props.dispatch(routerRedux.push('/', {words}));   //
    // this.props.navigate('/') } showSelect = ()=> {     console.log('showSelect')
    //    const {words,showSelect} = this.state;     this.setState({
    // showSelect: !showSelect,     }) }

    getShanbay = (word)=> {
        apiGetShanbay(word, (w, shanbay)=>{
            this.setState({
                shanbay
            })
        })
      
    }
    unknown = () => {
        const {
            testShowAnswer,
            testWords,
            currentTestWord,
            currentList,
            listsIndex,
            groupsIndex,
            reviewList,
            currentGroup,
            currentGroupIndex,
            currentListIndex,
            currentWord,
            reviewWord,
            reviewIndex,
            shanbay,
            showAnswer,
            thesaurusWords
        } = this.state;
        // currentGroup =   currentTestWord
        let {unknownWords} = this.state
        unknownWords.push(currentTestWord)
        unknownWords = _.compact(_.uniq(unknownWords))
        let remainWords = _.filter(testWords, w => w != currentTestWord)
        let nextTestWord = _.sample(remainWords)
        // if (!nextTestWord) 
        //     nextTestWord = _.sample(testWords)
        this.setState({
            unknownWords,
            currentTestWord: nextTestWord,
            testShowAnswer: !testShowAnswer,
            testWords: remainWords,
            
        }, () => this.getShanbay(nextTestWord))
        if (this.props.onUnknownWordsChange){
            this.props.onUnknownWordsChange(unknownWords)
            
        }
    }

    known = () => {
        const {
            testShowAnswer,
            testWords,
            currentTestWord,
            currentList,
            listsIndex,
            groupsIndex,
            reviewList,
            currentGroup,
            currentGroupIndex,
            currentListIndex,
            currentWord,
            reviewWord,
            reviewIndex,
            shanbay,
            showAnswer,
            thesaurusWords
        } = this.state;
        let remainWords = _.filter(testWords, w => w != currentTestWord)
        let nextTestWord = _.sample(remainWords)
        if (!nextTestWord) 
            nextTestWord = _.sample(testWords)

        console.log("remove word", testWords, currentTestWord, remainWords)
        this.setState({
            currentTestWord: nextTestWord,
            testShowAnswer: !testShowAnswer,
            testWords: remainWords,
        }, () => this.getShanbay(nextTestWord))
    }

    showTestAnswer = () => {
        const {
            testShowAnswer,
            testWords,
            currentTestWord,
            currentList,
            listsIndex,
            groupsIndex,
            reviewList,
            currentGroup,
            currentGroupIndex,
            currentListIndex,
            currentWord,
            reviewWord,
            reviewIndex,
            shanbay,
            showAnswer,
            thesaurusWords
        } = this.state;

        this.setState({
            testShowAnswer: !testShowAnswer
        }, () => this.getShanbay(currentTestWord))
    }

    render() {
        const {words} = this.props;
        const {unknownWords, currentTestWord,testShowAnswer} = this.state;

        return (
            <div >
                <div >
                    总单词个数：{_.size(words)}
                </div>
                <div >
                    生词个数: {_.size(unknownWords)}
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                {
                    _.map(unknownWords, (w)=>{
                        return (
                            <div>
                                &nbsp;{w},&nbsp;
                            </div>
                        )
                    })
                }
                </div>
                {
                    testShowAnswer ? <ShanbayView shanbay={this.state.shanbay}/> : <h2 style={{height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{currentTestWord}</h2>
                }
                {!testShowAnswer
                    ? <Col md={12}>
                            <Button bsSize="small" bsStyle='default' block onClick={this.showTestAnswer}>查看答案</Button>
                        </Col>
                    : <div>
                        <Col md={4}>
                            <Button bsSize="small" bsStyle='danger' block onClick={this.unknown}>不认识</Button>
                        </Col>
                        <Col md={4}>
                            <Button bsSize="small" bsStyle="primary" block onClick={this.known}>认识</Button>
                        </Col>
                    </div>
}

                <br/>
                <hr/>
                <br/>
            </div>
        )
    }
};
export default connect()(FilterWord);
