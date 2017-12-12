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
var ThesaurusData = require('../files/thesaurus.json')

class LearnOneWord extends React.Component {
    constructor(props) {
        super(props);
        // let learnWords = _.clone(props.words);     
        // let reviewIndex = 0;
        // let reviewWord = _.first(learnWords)
        
        // let showAnswer = false;

        // this.state = {
        //     reviewIndex,
        //     reviewWord,
        // }
        this.buildReviewList(props, false)
        // TODO: 顺序学习7个单词，然后小测试，失败则记入遗忘单词本，并加入下一个循环的学习
    }
    buildReviewList = (props, isReceive)=>{
        let reviewList = new Array
        const {word, shanbay} = props
        // let {currentWord } = this.state
        const currentThesaurus = _.get(ThesaurusData, word);
        let thesaurusWords = _.flattenDeep(_.values(currentThesaurus));
        thesaurusWords = _.map(thesaurusWords, (w) => {
            if (_.includes('(') && _.includes(')')) {
                // just like "silence (informal)"
                w = _.replace(w, /\s\(.*/,''); 
            }
            return w
        })
        reviewList = _.flatten(_.map(thesaurusWords, w => [word, w]))
        console.log('thesaurusWords',this, currentThesaurus, reviewList)
        let reviewIndex = 0
        // reviewWord = reviewList&& reviewList[reviewIndex]
        let reviewWord = reviewList&& reviewList[reviewIndex]
        if (!reviewWord){
          reviewList.push(word)
          reviewWord = word
        }
        if (isReceive){
            this.setState({
                reviewList,
                reviewIndex,
                reviewWord,
                shanbay,
            })
        } else {
            this.state = {
                showAnswer: false,
                reviewList,
                reviewIndex,
                reviewWord,
                shanbay: null
            }
        }
        
        
    }
    componentWillReceiveProps(newProps){
        if (newProps){
           
            this.buildReviewList(newProps, true)
            

            this.props = newProps
        }
    }
    getShanbay = (word)=> {
        apiGetShanbay(word, (w, shanbay)=>{
            this.setState({
                shanbay
            })
        })
      
    }

    showAnswer = ()=>{
        let {showAnswer} = this.state

        const {unknownWords, currentTestWord,learnWords,reviewList, reviewIndex, reviewWord} = this.state;
        
        if (showAnswer) {
            // TODO: next review word

            // reviewIndex += 1
            // reviewWord = reviewList&& reviewList[reviewIndex]
            let nextReviewWord = reviewList&& reviewList[reviewIndex]
            this.setState({
                reviewIndex: reviewIndex + 1,
                reviewWord: nextReviewWord,
                shanbay: null,
            }, ()=> this.getShanbay(nextReviewWord))
            console.log("go to next review word", this)
            if (!nextReviewWord) {
                // TODO: have reach last
                if (this.props.reachEnd){
                    this.props.reachEnd();

                }
            }
        }
        this.setState({
            showAnswer: !showAnswer,
        })

    }
    render() {
        const {word, shanbay} = this.props;
        const {unknownWords, currentTestWord,showAnswer,learnWords,reviewList, reviewIndex, reviewWord} = this.state;
        
        return (
            <div >
                <div >
                    当前单词的同义词需学习数: {_.size(reviewList)}
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                {
                    _.map(reviewList, (w)=>{
                        return (
                            <div>
                                &nbsp;{w},&nbsp;
                            </div>
                        )
                    })
                }
                </div>
                {
                    showAnswer ? <ShanbayView shanbay={this.state.shanbay}/> : <h2 style={{height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{reviewWord}</h2>
                }
                {
                    !reviewWord ? <div>{`当前单词同义词学习完毕, 进行下一个单词的学习`}</div> : null
                }
                <div>
                    <Row>
                      
                        <Col md={6}>
                        <Button bsStyle="primary" bsSize="small" block onClick={this.showAnswer}>{showAnswer && reviewWord ? '下一个学习单词' : (reviewWord ? '查看解释' : '当前单词同义词已结束，跳转到下一个主要的单词')}</Button>

                        </Col>
                    </Row>

                    </div>

            </div>
        )
    }
};
export default connect()(LearnOneWord);
