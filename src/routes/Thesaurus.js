import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import * as api from "../utils/api";
import {
  Button, ButtonGroup, Col, ControlLabel, FormControl, FormGroup, Glyphicon, ProgressBar, Row,
  Well
} from 'react-bootstrap';
const Words = require('../files/queue_collins_1.json')
const ThesaurusData = require('../files/thesaurus.json')
console.log('ThesaurusData', ThesaurusData);
const wellHeight = 400;
class Thesaurus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    const list1 = require('../files/list_1.json');
    console.log('list1', list1);
    let json = localStorage.getItem('shanbayStore')
    let groupsIndex = 0
    let currentGroup = _.chunk(list1,7)[groupsIndex]
    let testMode = true
    let testShowAnswer = false
    let currentTestWord = _.sample(currentGroup)
    // currentTestWord: _.sample(currentGroup)
    let testWords = _.clone(currentGroup)
    this.state = {
      currentList: list1,
      listsIndex: 0,
      currentListIndex: 0,
      currentGroup,
      groupsIndex,
      currentGroupIndex: 0,
      currentWord: list1[0],
      reviewList: [],
      thesaurusWords: [],
      reviewIndex: 0,
      reviewWord: null,
      showAnswer: false,
      shanbayStore: {},
      testMode,
      currentTestWord,
      testShowAnswer,
      testWords: testWords,
    }
    try {
      let shanbayStore = JSON.parse(json)

      this.state = {
        currentList: list1,
        listsIndex: 0,
        currentListIndex: 0,
        currentGroup,
        groupsIndex,
        currentGroupIndex: 0,
        currentWord: list1[0],
        reviewList: [],
        thesaurusWords: [],
        reviewIndex: 0,
        reviewWord: null,
        showAnswer: false,
        shanbayStore: shanbayStore || {},
        testMode,
        currentTestWord,
        testShowAnswer,
        testWords: testWords,

      }
    } catch (e){
      console.log('parse JSON of localStorage[shanbayStore] error', e);

    }


  }

  componentWillMount() {
  }
  setCurrentWord = (index)=> {
    let {testMode, currentList, currentListIndex, currentGroup,groupsIndex, currentGroupIndex, currentWord,reviewList,reviewWord,reviewIndex,showAnswer} = this.state;
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
    let {currentList,currentGroupIndex, currentListIndex, currentWord,showAnswer} = this.state;
    this.setCurrentWord(currentGroupIndex + 1)
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
  getShanbay = (searchWord)=> {
    let {reviewWord, shanbayStore} = this.state;
    searchWord = searchWord || reviewWord
    console.log('local Store', shanbayStore, searchWord)

    if (_.has(shanbayStore, searchWord)) {
      let shanbay = shanbayStore[searchWord]
      console.log('getShanbay from local Store success,', shanbayStore,shanbay)

      this.setState({
        shanbay
      })
    } else {
      // const headers = getRequestHeaders(body, token);
      const headers = {'Accept': 'application/json'}
      // ? {'Accept': 'application/json', 'Content-Type': 'application/json'}
      // : {'Accept': 'application/json'};
      const method = 'get'
      const options =  {method, headers}
      // ? {method, headers, body: JSON.stringify(body)}
      // : {method, headers};


      // api.get('https://api.shanbay.com/bdc/search/', {word: reviewWord})
      // https://api.shanbay.com/api/v1/bdc/search/
      // fetch(`https://api.shanbay.com/api/v1/bdc/search/?word=${reviewWord}`, options)


      // fetch(`/shanbay/api/v1/bdc/search/?word=${reviewWord}`, options)
      postMessage({type:'fetch_shanbay', word: searchWord},'*')
      // fetch(`https://api.shanbay.com//api/v1/bdc/search/?word=${reviewWord}`, options)
      fetch(`/shanbay/api/v1/bdc/search/?word=${searchWord}`, options)

        .then(r => r.json())
        .then((data)=>{
          let shanbay = data.data
          console.log('getShanbay from api success,', shanbay)

          let word = reviewWord || shanbay.content
          shanbayStore[word] = shanbay
          this.setState({
            shanbay,
            shanbayStore
          }, this.saveToLocalStore)
        })
        .catch((error)=>{
          console.log('getShanbay error,', error)
        })
    }


  }
  saveToLocalStore = ()=> {
    localStorage.setItem('shanbayStore', JSON.stringify(this.state.shanbayStore))
  }
  goToLastWord = ()=>{
    this.setCurrentWord(6)
  }
  goToFirstWord = ()=>{
    this.setCurrentWord(0)
  }
  renderQuestion = ()=> {
    const { shanbay, reviewWord} = this.state;

    return (
      <Well style={{height: wellHeight}} bsSize="large" height={wellHeight}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h1>{reviewWord}</h1>

        </div>
      </Well>

      )
  }
  renderShanbay = ()=> {
    const { shanbay} = this.state;
    if (!shanbay) {
      return (
        <Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

          加载中...
          </div>
        </Well>
        )
    } else {
      return (
        <Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>

          <Row>
            <Col md={2}>单词</Col>
            <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2>{shanbay.content}</h2></div></Col>
          </Row>
          <Row>
            <Col md={2}>音标</Col>
            <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2>{shanbay.pron}</h2></div></Col>
          </Row>
          <Row>
            <Col md={2}>解释</Col>
            <Col md={10}><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><h2>{shanbay.definition}</h2></div></Col>
          </Row>
          <Row>
            <Col md={2}>美音</Col>
            <Col md={10}>
              <audio src={shanbay.us_audio} autoPlay controls><Glyphicon glyph="headphones" /></audio>
              {/*glyphicon glyphicon-headphones*/}

            </Col>
          </Row>
          <Row>
            <Col md={2}>英英解释</Col>
            <Col md={10}>{shanbay.en_definition.defn}</Col>
          </Row>
          {/*<div>单词: {shanbay.content}</div>*/}
          {/*<div>发音: {shanbay.pron}</div>*/}
          {/*<div>解释: {shanbay.definition}</div>*/}
          {/*<div>us_audio: {shanbay.us_audio}</div>*/}
          {/*<div>英英解释: {shanbay.en_definition.defn}</div>*/}
        </Well>
      )
    }


  }
  renderThesaurus = (currentThesaurus)=> {
    return (
      <div>
        {
          _.map(currentThesaurus, (list_list, noun_or_verb) => {
            return (
              <div>
                <div>{noun_or_verb}</div>
                {
                  _.map(list_list, (list, i) => {
                    return (
                      <div style={{display: 'flex', flexDirection: 'row'}}>
                        {/*<div>{i}</div>*/}
                        {
                          _.map(list, (word, i) => {
                            return (
                              <div>
                                {/*<div>{i}</div>*/}
                                <div>,&nbsp;&nbsp; {word} </div>

                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }

              </div>
            )
          })
        }
      </div>
    )
  }
  onListChange = (obj)=>{
    let value = obj.target.value
    console.log('onListChange',obj, value)
    const list = require(`../files/list_${value}.json`);
    let { currentGroup, groupsIndex} = this.state

    groupsIndex = 0
    currentGroup = _.chunk(list,7)[groupsIndex]
    this.setState({
      currentList: list,
      currentListIndex: 0,
      listsIndex: value - 1,
      currentGroup,
      groupsIndex,
    }, ()=>{
      this.setCurrentWord(0)
    })

  }
  onGroupChange = (obj)=>{
    let value = obj.target.value
    console.log('onGroupChange',obj, value)
    let {currentList, currentGroup, groupsIndex} = this.state
    groupsIndex = value - 1
    currentGroup = _.chunk(currentList,7)[groupsIndex]
    this.setState({
      currentGroup,
      groupsIndex,
    }, ()=>{
      // this.setCurrentWord(0)
    })

  }
  renderStudy = ()=> {
    const {currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;

    return (
      <div>
        <div>
          {
            showAnswer ? this.renderShanbay(): this.renderQuestion()
          }

        </div>
        <ProgressBar style={{minWidth: 600}} minWidth={600} now={reviewIndex*1.0/_.size(reviewList)} label={`${reviewIndex} / ${_.size(reviewList)}`} />
        <ProgressBar style={{minWidth: 600}} minWidth={600} now={currentGroupIndex*1.0/_.size(currentGroup)} label={`${currentGroupIndex} / ${_.size(currentGroup)}`} />
        <ProgressBar style={{minWidth: 600}} minWidth={600} now={currentListIndex*1.0/_.size(currentList)} label={`${currentListIndex} / ${_.size(currentList)}`} />

        <div>
          <Row>
            <Col md={2}>
              <Button bsSize="small" onClick={this.goToFirstWord}>第一个</Button>

            </Col>
            <Col md={2}>
              <Button bsSize="small" onClick={this.nextWord}>下一个主要列表单词</Button>

            </Col>
            <Col md={6}>
              <Button bsStyle="primary" bsSize="small" block onClick={this.next}>{showAnswer ? '下一个学习单词' : '查看解释'}</Button>

            </Col>
            <Col md={2}>
              <Button bsSize="small" onClick={this.goToLastWord}>最后一个</Button>
            </Col>
          </Row>

        </div>
      </div>

    )
  }
  unknown = ()=> {
    const {testShowAnswer,testWords,currentTestWord,currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;
      // currentGroup =
      //   currentTestWord
    let remainWords = _.filter(testWords, w => w != currentTestWord)
    let nextTestWord = _.sample(remainWords)
    if (!nextTestWord) nextTestWord = _.sample(testWords)
    this.setState({
      currentTestWord: nextTestWord,
      testShowAnswer: !testShowAnswer,

    }, ()=>this.getShanbay(nextTestWord))
  }
  known = ()=> {
    const {testShowAnswer, testWords,currentTestWord,currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;
    let remainWords = _.filter(testWords, w => w != currentTestWord)
    let nextTestWord = _.sample(remainWords)
    if (!nextTestWord) nextTestWord = _.sample(testWords)

    console.log("remove word",testWords, currentTestWord, remainWords)
    this.setState({
      currentTestWord: nextTestWord,
      testShowAnswer: !testShowAnswer,
      testWords: remainWords,
    }, ()=>this.getShanbay(nextTestWord))
  }

  showTestAnswer = ()=> {
    const {testShowAnswer, testWords,currentTestWord,currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;

    this.setState({
      testShowAnswer: !testShowAnswer
    },()=>this.getShanbay(currentTestWord))
  }
    renderTest = ()=> {
    const {testShowAnswer,testWords,currentTestWord,currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;

    return (
      <div>
        {JSON.stringify(testWords)}
        {/*Test mode*/}
        {/*<Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>*/}
          {/*<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*<h2>{currentTestWord}</h2>*/}
          {/*</div>*/}
        {/*</Well>*/}
        {
          testShowAnswer ? this.renderShanbay(): <Well  style={{height: wellHeight}} bsSize="large" height={wellHeight}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <h2>{currentTestWord}</h2>
            </div>
          </Well>
        }
        <Row>
          {/*ButtonGroup*/}
          {
            !testShowAnswer ? <Col  md={12}><Button bsSize="small" bsStyle='default' block onClick={this.showTestAnswer}>查看答案</Button></Col> : <div><Col  md={4}><Button bsSize="small" bsStyle='danger' block onClick={this.unknown}>不认识</Button></Col><Col md={4}><Button bsSize="small"  bsStyle="primary" block onClick={this.known}>认识</Button></Col></div>
          }



        </Row>
      </div>
    )
  }
  render() {
    const {testMode,currentList,listsIndex,groupsIndex,reviewList,currentGroup,currentGroupIndex, currentListIndex, currentWord, reviewWord, reviewIndex, shanbay,showAnswer,thesaurusWords} = this.state;
    const currentThesaurus = _.get(ThesaurusData, currentWord);
    return (
      <div style={{padding: 20, margin:10}}>
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
        <FormGroup controlId="formControlsSelect">
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
        </FormGroup>

        <div>当前列表单词</div>
        {
          _.map(currentGroup, (w)=>{
            return (
              <span>,&nbsp;{w}</span>
            )
          })

        }
        <Button onClick={()=>{let nextTestWord = _.sample(currentGroup);this.setState({testMode: true,testWords: _.clone(currentGroup), currentTestWord: nextTestWord}, ()=>this.getShanbay(nextTestWord))}}>开始测试模式</Button>
        <Button onClick={()=>{this.setState({testMode: false})}}>开始学习模式</Button>
        {/*<div>Words:{Words.length}</div>*/}
        <Row>
          <Col md={2}>总单词个数</Col>
          <Col md={2}>{_.size(currentList)}</Col>
        </Row>
        <Row>
          <Col md={2}>总同义词个数</Col>
          <Col md={2}>{_.size(ThesaurusData)}</Col>
        </Row>

        {/*<div>ThesaurusData:{_.size(ThesaurusData)}</div>*/}
        <div>
          <Row>
            <Col md={2}>当前单词表索引</Col>
            <Col md={2}>{currentListIndex}</Col>
          </Row>
          <Row>
            <Col md={2}>当前分组单词表索引</Col>
            <Col md={2}>{currentGroupIndex}</Col>
          </Row>
          {/*<div>currentListIndex: {currentListIndex}</div>*/}
          <Row>
            <Col md={2}>当前单词</Col>
            <Col md={2}>{currentWord}</Col>
          </Row>
          {/*<div>CurrentWord: {currentWord}</div>*/}
          <Row>
            <Col md={2}>当前单词同义词</Col>
            {/*<Col md={10}>{JSON.stringify(currentThesaurus)}</Col>*/}
            <Col md={10}>{JSON.stringify(thesaurusWords)}</Col>
          </Row>
          {/*<div>CurrentThesaurus: {JSON.stringify(currentThesaurus)}</div>*/}
          {
            // this.renderThesaurus(currentThesaurus)
          }
        </div>
        <Row>
          <Col md={2}>当前记忆索引</Col>
          <Col md={2}>{reviewIndex}</Col>
        </Row>
        <Row>
          <Col md={2}>当前记忆单词</Col>
          <Col md={2}>{reviewWord}</Col>
        </Row>
        {/*<div>reviewIndex: {reviewIndex}</div>*/}
        {/*<div>CurrentReviewWord: {reviewWord}</div>*/}

        {
          testMode ? this.renderTest() : this.renderStudy()
        }


      </div>
    )
  }
}

export default connect()(Thesaurus);
