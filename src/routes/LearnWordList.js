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
import LearnOneWord from './LearnOneWord';

import {getShanbay as apiGetShanbay} from '../services/ShanbayService';

class LearnWordList extends React.Component {
    constructor(props) {
        super(props);
        let learnWords = _.clone(props.words);     
        let currentIndex = 0;
        let currentWord = _.first(learnWords)
        
        let showAnswer = false;

        this.state = {
            learnWords,
            currentIndex,
            currentWord,
        }
        // TODO: 顺序学习7个单词，然后小测试，失败则记入遗忘单词本，并加入下一个循环的学习
    }

    getShanbay = (word)=> {
        apiGetShanbay(word, (w, shanbay)=>{
            this.setState({
                shanbay
            })
        })
      
    }
    
    setCurrentWord = (index)=> {
        let {
            learnWords,
            currentIndex,
            currentWord,
        } = this.state
        currentIndex = index
        currentWord = learnWords[currentIndex]
        this.setState({
            currentIndex,
            currentWord,
        }, ()=>{this.getShanbay(currentWord)})
        return 
        // let {testMode, currentList, currentListIndex, currentGroup,groupsIndex, currentGroupIndex, currentWord,reviewList,reviewWord,reviewIndex,showAnswer} = this.state;
        currentListIndex = index
        currentGroupIndex = index
        // currentWord = currentList[index]
        currentWord = currentGroup[currentGroupIndex]
        if (currentGroupIndex > 6){
          // 分组完毕
    
          this.setState({
            testMode: true,
            testWords: _.clone(currentGroup),
          })
          return
          groupsIndex = groupsIndex + 1
          currentGroup = _.chunk(currentList,7)[groupsIndex]
          currentGroupIndex = 0
          currentWord = currentGroup[currentGroupIndex]
    
          this.setState({
            currentGroup,
            groupsIndex,
            currentGroupIndex
          }, ()=>{
            // this.setCurrentWord(0)
          })
        }
        reviewList = new Array
        const currentThesaurus = _.get(ThesaurusData, currentWord);
        const thesaurusWords = _.flattenDeep(_.values(currentThesaurus));
        reviewList = _.flatten(_.map(thesaurusWords, w => [currentWord, w]))
        console.log('thesaurusWords',this, currentThesaurus, reviewList)
        reviewIndex = 0
        // reviewWord = reviewList&& reviewList[reviewIndex]
        reviewWord = reviewList&& reviewList[reviewIndex]
        if (!reviewWord){
          reviewList.push(currentWord)
          reviewWord = currentWord
        }
    
        // reviewList.pus
    
        showAnswer = false
        if (currentWord) {
          this.setState({
            shanbay: null,
            currentListIndex,
            currentGroupIndex,
            currentWord,
            reviewList,
            reviewWord,
            reviewIndex,
            showAnswer,
            thesaurusWords
          }, this.getShanbay)
        }
      }
      nextWord = ()=>{
        let {
            learnWords,
            currentIndex,
            currentWord,
        } = this.state
        this.setCurrentWord(currentIndex + 1)
      }
      goToLastWord = ()=>{
        let {
            learnWords,
            currentIndex,
            currentWord,
        } = this.state
        this.setCurrentWord(_.size(learnWords) - 1)
      }
      goToFirstWord = ()=>{
        this.setCurrentWord(0)
      }
      next = ()=>{
        let {currentList, currentListIndex,currentGroupIndex, currentWord, reviewList,reviewIndex, reviewWord,showAnswer} = this.state;
        if (reviewList){
          reviewWord = reviewList&& reviewList[reviewIndex]
    
          if (showAnswer) {
            reviewIndex += 1
            reviewWord = reviewList&& reviewList[reviewIndex]
    
            console.log('next', reviewList, reviewWord)
    
            showAnswer = false
    
            if (reviewWord){
              this.setState({
                reviewIndex,
                reviewWord,
                shanbay: null,
                showAnswer,
              }, this.getShanbay)
            } else {
              this.nextWord();
            }
          } else {
            showAnswer = true
            this.setState({
              showAnswer,
              reviewIndex,
              reviewWord,
            }, this.getShanbay)
          }
    
    
    
        }
        // reviewList
        // this.setCurrentWord(currentListIndex + 1)
      }
    render() {
        const {words} = this.props;
        const {unknownWords, currentTestWord,showAnswer,learnWords,currentIndex,currentWord} = this.state;

        return (
            <div >
                <div >
                    总单词个数：{_.size(words)}
                </div>
                <div >
                    当前生词需学习数: {_.size(learnWords)}
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                {
                    _.map(learnWords, (w)=>{
                        return (
                            <div>
                                &nbsp;{w},&nbsp;
                            </div>
                        )
                    })
                }
                </div>
                {/* {
                    showAnswer ? <ShanbayView shanbay={this.state.shanbay}/> : <h2>{currentTestWord}</h2>
                } */}
                <LearnOneWord word={this.state.currentWord} shanbay={this.state.shanbay} />
                <div>
                    <Row>
                        <Col md={2}>
                        <Button bsSize="small" onClick={this.goToFirstWord}>第一个</Button>

                        </Col>
                        <Col md={2}>
                        <Button bsSize="small" onClick={this.nextWord}>下一个主要列表单词</Button>

                        </Col>
                        
                        <Col md={2}>
                        <Button bsSize="small" onClick={this.goToLastWord}>最后一个</Button>
                        </Col>
                    </Row>

                    </div>

            </div>
        )
    }
};
export default connect()(LearnWordList);
